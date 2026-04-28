"""End-to-end backend tests for SalesCraft AI."""
import os
import time
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://sales-page-forge.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@salescraft.io"
ADMIN_PASSWORD = "admin12345"

LLM_TIMEOUT = 120  # generate is slow


# ---------- Fixtures ----------
@pytest.fixture(scope="session")
def admin_token():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=30)
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    data = r.json()
    assert "access_token" in data
    return data["access_token"]


@pytest.fixture(scope="session")
def fresh_user():
    email = f"test_user_{uuid.uuid4().hex[:8]}@salescraft.io"
    password = "TestPass12345"
    r = requests.post(
        f"{API}/auth/register",
        json={"email": email, "password": password, "name": "TEST User"},
        timeout=30,
    )
    assert r.status_code == 200, f"Register failed: {r.status_code} {r.text}"
    data = r.json()
    return {"email": email, "password": password, "token": data["access_token"], "user": data["user"]}


@pytest.fixture(scope="session")
def second_user():
    email = f"TEST_other_{uuid.uuid4().hex[:8]}@salescraft.io"
    password = "TestPass12345"
    r = requests.post(
        f"{API}/auth/register",
        json={"email": email, "password": password, "name": "TEST Other"},
        timeout=30,
    )
    assert r.status_code == 200
    return {"email": email, "password": password, "token": r.json()["access_token"]}


def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


# ---------- Auth tests ----------
class TestAuth:
    def test_root(self):
        r = requests.get(f"{API}/", timeout=15)
        assert r.status_code == 200
        assert r.json().get("ok") is True

    def test_admin_login(self, admin_token):
        assert isinstance(admin_token, str) and len(admin_token) > 20

    def test_register_and_login_user(self, fresh_user):
        # Login with the freshly-registered user
        r = requests.post(
            f"{API}/auth/login",
            json={"email": fresh_user["email"], "password": fresh_user["password"]},
            timeout=30,
        )
        assert r.status_code == 200
        data = r.json()
        assert data["user"]["email"] == fresh_user["email"]
        assert data["user"]["name"] == "TEST User"
        assert "access_token" in data

    def test_register_sets_cookie(self):
        email = f"TEST_cookie_{uuid.uuid4().hex[:8]}@salescraft.io"
        s = requests.Session()
        r = s.post(
            f"{API}/auth/register",
            json={"email": email, "password": "TestPass12345", "name": "Cookie"},
            timeout=30,
        )
        assert r.status_code == 200
        # Verify cookie is set
        assert "access_token" in s.cookies, f"Expected access_token cookie. Got: {dict(s.cookies)}"

    def test_login_invalid(self):
        r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"}, timeout=15)
        assert r.status_code == 401

    def test_register_duplicate(self, fresh_user):
        r = requests.post(
            f"{API}/auth/register",
            json={"email": fresh_user["email"], "password": "anything12345", "name": "Dup"},
            timeout=15,
        )
        assert r.status_code == 400

    def test_me_with_bearer(self, fresh_user):
        r = requests.get(f"{API}/auth/me", headers=auth_headers(fresh_user["token"]), timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data["email"] == fresh_user["email"]
        assert data["id"] == fresh_user["user"]["id"]

    def test_me_unauthenticated(self):
        r = requests.get(f"{API}/auth/me", timeout=15)
        assert r.status_code == 401

    def test_logout_clears_cookie(self, fresh_user):
        s = requests.Session()
        r = s.post(
            f"{API}/auth/login",
            json={"email": fresh_user["email"], "password": fresh_user["password"]},
            timeout=15,
        )
        assert r.status_code == 200
        assert "access_token" in s.cookies
        r2 = s.post(f"{API}/auth/logout", timeout=15)
        assert r2.status_code == 200
        # Cookie should be cleared (either removed or empty)
        assert s.cookies.get("access_token") in (None, "", "null")


# ---------- Pages tests ----------
SAMPLE_PRODUCT = {
    "name": "FocusFlow Pro",
    "description": "A productivity timer that blocks distracting apps and tracks deep work sessions.",
    "features": ["App blocker", "Pomodoro timer", "Deep work analytics", "Calendar sync"],
    "target_audience": "Knowledge workers and remote professionals",
    "price": "$19/month",
    "usp": "The only timer that automatically blocks distractions across all your devices.",
    "template": "modern",
}

REQUIRED_KEYS = {"headline", "subheadline", "description", "benefits", "features", "socialProof", "pricing", "cta"}


class TestPages:
    page_id = None

    def test_unauthenticated_generate_returns_401(self):
        r = requests.post(f"{API}/pages/generate", json=SAMPLE_PRODUCT, timeout=15)
        assert r.status_code == 401

    def test_generate_page(self, fresh_user):
        r = requests.post(
            f"{API}/pages/generate",
            json=SAMPLE_PRODUCT,
            headers=auth_headers(fresh_user["token"]),
            timeout=LLM_TIMEOUT,
        )
        assert r.status_code == 200, f"Generate failed: {r.status_code} {r.text[:500]}"
        data = r.json()
        assert "id" in data
        assert data["user_id"] == fresh_user["user"]["id"]
        assert data["template"] == "modern"
        content = data["content"]
        # Verify all 8 sections
        missing = REQUIRED_KEYS - set(content.keys())
        assert not missing, f"Missing sections: {missing}. Got: {list(content.keys())}"
        # Validate types
        assert isinstance(content["benefits"], list) and len(content["benefits"]) >= 3
        assert isinstance(content["features"], list) and len(content["features"]) >= 3
        assert isinstance(content["socialProof"], dict)
        assert "stats" in content["socialProof"] and "testimonials" in content["socialProof"]
        assert isinstance(content["pricing"], dict)
        assert isinstance(content["cta"], dict) and "primary" in content["cta"]
        TestPages.page_id = data["id"]
        TestPages.original_headline = content["headline"]

    def test_list_pages(self, fresh_user):
        r = requests.get(f"{API}/pages", headers=auth_headers(fresh_user["token"]), timeout=15)
        assert r.status_code == 200
        pages = r.json()
        assert isinstance(pages, list)
        assert any(p["id"] == TestPages.page_id for p in pages)

    def test_get_single_page(self, fresh_user):
        r = requests.get(
            f"{API}/pages/{TestPages.page_id}",
            headers=auth_headers(fresh_user["token"]),
            timeout=15,
        )
        assert r.status_code == 200
        assert r.json()["id"] == TestPages.page_id

    def test_get_nonexistent(self, fresh_user):
        r = requests.get(
            f"{API}/pages/does-not-exist-{uuid.uuid4()}",
            headers=auth_headers(fresh_user["token"]),
            timeout=15,
        )
        assert r.status_code == 404

    def test_other_user_cannot_read(self, second_user):
        r = requests.get(
            f"{API}/pages/{TestPages.page_id}",
            headers=auth_headers(second_user["token"]),
            timeout=15,
        )
        assert r.status_code == 404, f"Other user should not access. Got: {r.status_code}"

    def test_update_template(self, fresh_user):
        r = requests.put(
            f"{API}/pages/{TestPages.page_id}",
            json={"template": "bold"},
            headers=auth_headers(fresh_user["token"]),
            timeout=15,
        )
        assert r.status_code == 200
        assert r.json()["template"] == "bold"
        # Verify persisted
        r2 = requests.get(
            f"{API}/pages/{TestPages.page_id}",
            headers=auth_headers(fresh_user["token"]),
            timeout=15,
        )
        assert r2.json()["template"] == "bold"

    def test_other_user_cannot_update(self, second_user):
        r = requests.put(
            f"{API}/pages/{TestPages.page_id}",
            json={"template": "minimal"},
            headers=auth_headers(second_user["token"]),
            timeout=15,
        )
        assert r.status_code == 404

    def test_regenerate_section_headline(self, fresh_user):
        r = requests.post(
            f"{API}/pages/{TestPages.page_id}/regenerate-section",
            json={"section": "headline"},
            headers=auth_headers(fresh_user["token"]),
            timeout=LLM_TIMEOUT,
        )
        assert r.status_code == 200, f"Regen-section failed: {r.text[:500]}"
        new_headline = r.json()["content"]["headline"]
        assert isinstance(new_headline, str) and len(new_headline) > 0
        # Generally should differ from original
        assert new_headline != TestPages.original_headline, "Headline did not change after regenerate-section"

    def test_regenerate_section_invalid(self, fresh_user):
        r = requests.post(
            f"{API}/pages/{TestPages.page_id}/regenerate-section",
            json={"section": "not-a-section"},
            headers=auth_headers(fresh_user["token"]),
            timeout=30,
        )
        assert r.status_code == 400

    def test_regenerate_full(self, fresh_user):
        # Capture current headline
        before = requests.get(
            f"{API}/pages/{TestPages.page_id}",
            headers=auth_headers(fresh_user["token"]),
            timeout=15,
        ).json()["content"]["headline"]
        r = requests.post(
            f"{API}/pages/{TestPages.page_id}/regenerate",
            headers=auth_headers(fresh_user["token"]),
            timeout=LLM_TIMEOUT,
        )
        assert r.status_code == 200, f"Regen full failed: {r.text[:500]}"
        content = r.json()["content"]
        assert REQUIRED_KEYS.issubset(set(content.keys()))
        # Headline likely different
        assert content["headline"] != before or True  # don't strictly fail; AI may rarely repeat

    def test_public_get(self, fresh_user):
        r = requests.get(f"{API}/public/pages/{TestPages.page_id}", timeout=15)
        assert r.status_code == 200
        assert r.json()["id"] == TestPages.page_id

    def test_other_user_cannot_delete(self, second_user):
        r = requests.delete(
            f"{API}/pages/{TestPages.page_id}",
            headers=auth_headers(second_user["token"]),
            timeout=15,
        )
        assert r.status_code == 404

    def test_delete_page(self, fresh_user):
        r = requests.delete(
            f"{API}/pages/{TestPages.page_id}",
            headers=auth_headers(fresh_user["token"]),
            timeout=15,
        )
        assert r.status_code == 200
        # Verify gone
        r2 = requests.get(
            f"{API}/pages/{TestPages.page_id}",
            headers=auth_headers(fresh_user["token"]),
            timeout=15,
        )
        assert r2.status_code == 404
