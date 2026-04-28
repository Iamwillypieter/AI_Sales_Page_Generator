from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import json
import uuid
import logging
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Dict, Any

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from fastapi.responses import HTMLResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr

from emergentintegrations.llm.chat import LlmChat, UserMessage


# ---------- Setup ----------
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="SalesCraft AI")
api = APIRouter(prefix="/api")

JWT_ALGORITHM = "HS256"


def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


# ---------- Auth helpers ----------
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "access",
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


def set_auth_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=7 * 24 * 3600,
        path="/",
    )


# ---------- Models ----------
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    name: str = Field(min_length=1, max_length=80)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    email: str
    name: str
    role: str = "user"


class AuthResponse(BaseModel):
    user: UserOut
    access_token: str


class ProductInput(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    description: str = Field(min_length=1, max_length=4000)
    features: List[str] = Field(default_factory=list)
    target_audience: str = Field(default="", max_length=500)
    price: str = Field(default="", max_length=80)
    usp: str = Field(default="", max_length=1000)
    template: str = Field(default="modern")  # modern | bold | minimal


class GenerateRequest(ProductInput):
    pass


class RegenerateSectionRequest(BaseModel):
    section: str  # headline | subheadline | description | benefits | features | socialProof | pricing | cta


class UpdatePageRequest(BaseModel):
    product: Optional[ProductInput] = None
    template: Optional[str] = None
    content: Optional[Dict[str, Any]] = None


class SalesPage(BaseModel):
    id: str
    user_id: str
    product: ProductInput
    template: str
    content: Dict[str, Any]
    created_at: str
    updated_at: str


# ---------- LLM ----------
SYSTEM_PROMPT = """You are an elite direct-response copywriter and conversion strategist.
You write punchy, benefit-driven sales copy for landing pages.
You ALWAYS reply with STRICT JSON only — no markdown, no commentary, no code fences.
Tone: confident, specific, energetic. Avoid clichés ("revolutionize", "game-changer", "unlock potential")."""


SECTION_GUIDE = """The output JSON MUST match this schema exactly:
{
  "headline": "string (8-14 words, hooks the reader, promises a clear outcome)",
  "subheadline": "string (1-2 sentences, expands the headline, names the audience)",
  "description": "string (2-3 short paragraphs, explains what the product is and why it matters)",
  "benefits": [ { "title": "string", "description": "string" }, ... 4 to 6 items ],
  "features": [ { "title": "string", "description": "string" }, ... 4 to 6 items ],
  "socialProof": {
    "stats": [ { "value": "string", "label": "string" }, ... 3 items ],
    "testimonials": [ { "quote": "string", "name": "string", "role": "string" }, ... 2 to 3 items ]
  },
  "pricing": {
    "headline": "string",
    "price": "string",
    "billing": "string (e.g., one-time, per month)",
    "includes": [ "string", ... 3 to 5 items ],
    "guarantee": "string"
  },
  "cta": {
    "primary": "string (action button label, max 4 words)",
    "secondary": "string (small reassurance line)",
    "urgency": "string (scarcity/urgency micro-copy)"
  }
}
Return ONLY the JSON object."""


def build_product_brief(p: ProductInput) -> str:
    feats = "\n".join(f"- {f}" for f in p.features) if p.features else "(none provided)"
    return f"""PRODUCT NAME: {p.name}

DESCRIPTION:
{p.description}

KEY FEATURES:
{feats}

TARGET AUDIENCE: {p.target_audience or "(not specified)"}

PRICE: {p.price or "(not specified)"}

UNIQUE SELLING POINTS:
{p.usp or "(not specified)"}
"""


def parse_json_strict(text: str) -> dict:
    text = text.strip()
    if text.startswith("```"):
        # strip code fences
        text = text.strip("`")
        if text.lower().startswith("json"):
            text = text[4:].strip()
    # find outermost braces
    first = text.find("{")
    last = text.rfind("}")
    if first != -1 and last != -1:
        text = text[first : last + 1]
    return json.loads(text)


async def llm_generate_full(product: ProductInput) -> dict:
    chat = LlmChat(
        api_key=os.environ["EMERGENT_LLM_KEY"],
        session_id=f"sp-{uuid.uuid4()}",
        system_message=SYSTEM_PROMPT,
    ).with_model("openai", "gpt-5.2")

    msg = UserMessage(
        text=f"""Generate a complete sales page for the product below.

{build_product_brief(product)}

{SECTION_GUIDE}"""
    )
    response = await chat.send_message(msg)
    try:
        return parse_json_strict(response)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"LLM returned invalid JSON: {e}")


SECTION_SCHEMAS: Dict[str, str] = {
    "headline": '{ "headline": "string" }',
    "subheadline": '{ "subheadline": "string" }',
    "description": '{ "description": "string" }',
    "benefits": '{ "benefits": [ { "title": "string", "description": "string" }, ... 4-6 items ] }',
    "features": '{ "features": [ { "title": "string", "description": "string" }, ... 4-6 items ] }',
    "socialProof": '{ "socialProof": { "stats": [{"value":"string","label":"string"}], "testimonials": [{"quote":"string","name":"string","role":"string"}] } }',
    "pricing": '{ "pricing": { "headline":"string","price":"string","billing":"string","includes":["string"],"guarantee":"string" } }',
    "cta": '{ "cta": { "primary":"string","secondary":"string","urgency":"string" } }',
}


async def llm_regenerate_section(product: ProductInput, current: dict, section: str) -> dict:
    if section not in SECTION_SCHEMAS:
        raise HTTPException(status_code=400, detail=f"Unknown section: {section}")
    chat = LlmChat(
        api_key=os.environ["EMERGENT_LLM_KEY"],
        session_id=f"sp-sec-{uuid.uuid4()}",
        system_message=SYSTEM_PROMPT,
    ).with_model("openai", "gpt-5.2")

    msg = UserMessage(
        text=f"""Regenerate ONLY the '{section}' section for this sales page. Make it noticeably different from the previous version.

PRODUCT BRIEF:
{build_product_brief(product)}

PREVIOUS '{section}' VALUE:
{json.dumps(current.get(section), indent=2)}

Reply with STRICT JSON in this shape (and nothing else):
{SECTION_SCHEMAS[section]}"""
    )
    response = await chat.send_message(msg)
    try:
        data = parse_json_strict(response)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"LLM returned invalid JSON: {e}")
    if section not in data:
        raise HTTPException(status_code=502, detail=f"LLM did not return key '{section}'")
    return data[section]


# ---------- Auth Routes ----------
@api.post("/auth/register", response_model=AuthResponse)
async def register(payload: RegisterRequest, response: Response):
    email = payload.email.lower()
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user_id = str(uuid.uuid4())
    doc = {
        "id": user_id,
        "email": email,
        "name": payload.name,
        "password_hash": hash_password(payload.password),
        "role": "user",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.users.insert_one(doc)
    token = create_access_token(user_id, email)
    set_auth_cookie(response, token)
    return AuthResponse(
        user=UserOut(id=user_id, email=email, name=payload.name, role="user"),
        access_token=token,
    )


@api.post("/auth/login", response_model=AuthResponse)
async def login(payload: LoginRequest, response: Response):
    email = payload.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user["id"], email)
    set_auth_cookie(response, token)
    return AuthResponse(
        user=UserOut(id=user["id"], email=email, name=user["name"], role=user.get("role", "user")),
        access_token=token,
    )


@api.post("/auth/logout")
async def logout(response: Response, _user: dict = Depends(get_current_user)):
    response.delete_cookie("access_token", path="/")
    return {"ok": True}


@api.get("/auth/me", response_model=UserOut)
async def me(user: dict = Depends(get_current_user)):
    return UserOut(id=user["id"], email=user["email"], name=user["name"], role=user.get("role", "user"))


# ---------- Sales Pages Routes ----------
def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


@api.post("/pages/generate", response_model=SalesPage)
async def generate_page(payload: GenerateRequest, user: dict = Depends(get_current_user)):
    content = await llm_generate_full(payload)
    page_id = str(uuid.uuid4())
    now = _now_iso()
    doc = {
        "id": page_id,
        "user_id": user["id"],
        "product": payload.model_dump(),
        "template": payload.template,
        "content": content,
        "created_at": now,
        "updated_at": now,
    }
    await db.sales_pages.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api.get("/pages", response_model=List[SalesPage])
async def list_pages(user: dict = Depends(get_current_user)):
    cursor = db.sales_pages.find({"user_id": user["id"]}, {"_id": 0}).sort("updated_at", -1)
    return await cursor.to_list(500)


@api.get("/pages/{page_id}", response_model=SalesPage)
async def get_page(page_id: str, user: dict = Depends(get_current_user)):
    doc = await db.sales_pages.find_one({"id": page_id, "user_id": user["id"]}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Page not found")
    return doc


@api.put("/pages/{page_id}", response_model=SalesPage)
async def update_page(page_id: str, payload: UpdatePageRequest, user: dict = Depends(get_current_user)):
    doc = await db.sales_pages.find_one({"id": page_id, "user_id": user["id"]}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Page not found")
    update: Dict[str, Any] = {"updated_at": _now_iso()}
    if payload.product is not None:
        update["product"] = payload.product.model_dump()
        update["template"] = payload.product.template
    if payload.template is not None:
        update["template"] = payload.template
    if payload.content is not None:
        update["content"] = payload.content
    await db.sales_pages.update_one({"id": page_id}, {"$set": update})
    return await db.sales_pages.find_one({"id": page_id}, {"_id": 0})


@api.post("/pages/{page_id}/regenerate", response_model=SalesPage)
async def regenerate_full(page_id: str, user: dict = Depends(get_current_user)):
    doc = await db.sales_pages.find_one({"id": page_id, "user_id": user["id"]}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Page not found")
    product = ProductInput(**doc["product"])
    content = await llm_generate_full(product)
    await db.sales_pages.update_one(
        {"id": page_id},
        {"$set": {"content": content, "updated_at": _now_iso()}},
    )
    return await db.sales_pages.find_one({"id": page_id}, {"_id": 0})


@api.post("/pages/{page_id}/regenerate-section", response_model=SalesPage)
async def regenerate_section(
    page_id: str, payload: RegenerateSectionRequest, user: dict = Depends(get_current_user)
):
    doc = await db.sales_pages.find_one({"id": page_id, "user_id": user["id"]}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Page not found")
    product = ProductInput(**doc["product"])
    new_value = await llm_regenerate_section(product, doc["content"], payload.section)
    new_content = dict(doc["content"])
    new_content[payload.section] = new_value
    await db.sales_pages.update_one(
        {"id": page_id},
        {"$set": {"content": new_content, "updated_at": _now_iso()}},
    )
    return await db.sales_pages.find_one({"id": page_id}, {"_id": 0})


@api.delete("/pages/{page_id}")
async def delete_page(page_id: str, user: dict = Depends(get_current_user)):
    res = await db.sales_pages.delete_one({"id": page_id, "user_id": user["id"]})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Page not found")
    return {"ok": True}


# ---------- Public preview & export (read-only, by id) ----------
@api.get("/public/pages/{page_id}", response_model=SalesPage)
async def public_get_page(page_id: str):
    doc = await db.sales_pages.find_one({"id": page_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Page not found")
    return doc


# ---------- Startup ----------
@app.on_event("startup")
async def on_startup():
    await db.users.create_index("email", unique=True)
    await db.users.create_index("id", unique=True)
    await db.sales_pages.create_index("id", unique=True)
    await db.sales_pages.create_index("user_id")

    # Seed admin
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@salescraft.io").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin12345")
    existing = await db.users.find_one({"email": admin_email})
    if not existing:
        await db.users.insert_one(
            {
                "id": str(uuid.uuid4()),
                "email": admin_email,
                "name": "Admin",
                "password_hash": hash_password(admin_password),
                "role": "admin",
                "created_at": _now_iso(),
            }
        )
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}},
        )


@app.on_event("shutdown")
async def on_shutdown():
    client.close()


@api.get("/")
async def root():
    return {"ok": True, "service": "SalesCraft AI"}


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("salescraft")
