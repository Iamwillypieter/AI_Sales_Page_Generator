# SalesCraft AI — Sales Page Generator

Transform raw product info into a complete, structured sales page in seconds.

## Live App

- App URL: see `REACT_APP_BACKEND_URL` in `frontend/.env` (frontend lives at `/`, backend at `/api`).
- Default admin login: `admin@salescraft.io` / `admin12345`.

## Approach

Users describe a product (name, description, comma-separated features, audience, price, USP) and pick one of three landing-page templates. The form is sent to OpenAI **gpt-5.2** (via `emergentintegrations` using the **Emergent Universal LLM Key**) with a strict JSON schema prompt. The model returns a structured object (`headline, subheadline, description, benefits[], features[], socialProof, pricing, cta`) which is persisted to MongoDB and rendered in three distinct React templates: **Modern Glass**, **Brutalist Bold**, **Editorial Minimal**.

Saved pages can be edited (re-generated full-page or **section-by-section**), previewed in a real-landing-page layout, and exported as a self-contained HTML file (CSS inlined, no JS dependency).

## Tools

- **Backend**: FastAPI · Motor (MongoDB) · PyJWT · bcrypt · `emergentintegrations.llm.chat`
- **Frontend**: React 19 · React Router · Tailwind CSS · shadcn/ui · sonner · lucide-react
- **AI**: OpenAI GPT-5.2 (via Emergent Universal Key)
- **DB**: MongoDB (`users`, `sales_pages`)
- **Auth**: JWT (httpOnly cookie + Bearer header fallback), bcrypt password hashing

## Logic

```
Product brief (form)
   │
   ▼
POST /api/pages/generate
   │── gpt-5.2 (system prompt: strict JSON schema)
   │── parse_json_strict() (tolerant JSON parser)
   ▼
SalesPage doc { product, template, content } → MongoDB
   │
   ▼
React TemplateRenderer (modern | bold | minimal)
   │
   ├─► Live preview pane (browser-chrome wrapper)
   ├─► Section regeneration → POST /api/pages/{id}/regenerate-section
   ├─► Full regeneration   → POST /api/pages/{id}/regenerate
   └─► Export HTML (client-side blob, fully standalone)
```

## API

| Method | Path | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Email + password registration |
| POST | `/api/auth/login` | Login (returns access_token + sets cookie) |
| POST | `/api/auth/logout` | Logout |
| GET  | `/api/auth/me` | Current user |
| POST | `/api/pages/generate` | Generate a new sales page |
| GET  | `/api/pages` | List user's pages |
| GET  | `/api/pages/{id}` | Get page |
| PUT  | `/api/pages/{id}` | Update brief / template / content |
| POST | `/api/pages/{id}/regenerate` | Regenerate full page |
| POST | `/api/pages/{id}/regenerate-section` | Regenerate one section |
| DELETE | `/api/pages/{id}` | Delete page |
| GET  | `/api/public/pages/{id}` | Public read-only |

## Local dev

Backend and frontend are managed by supervisor; hot reload is on for both.

```
sudo supervisorctl restart backend
sudo supervisorctl restart frontend
```
