# SalesCraft AI — PRD

## Original problem statement
Build a web application that transforms raw product/service information into a
complete, structured sales page with persuasive marketing copy. Must include:
auth (register/login/logout), structured product input form, AI sales page
generation (LLM API), saved pages library (view/edit/regenerate/delete), and
live landing-page preview. Bonuses: export as standalone HTML, multiple design
templates, and section-by-section regeneration.

## Architecture
- React 19 SPA · FastAPI · MongoDB
- Auth: JWT (httpOnly cookie + Bearer fallback), bcrypt
- LLM: OpenAI GPT-5.2 via `emergentintegrations` + Emergent Universal Key
- Strict JSON output schema — backend persists `{ product, template, content }`
- Three React templates render the same `content` model: Modern Glass,
  Brutalist Bold, Editorial Minimal
- Standalone HTML export (CSS inlined) is built client-side from the same
  template data

## Personas
- **Indie hacker / solo founder** drafting a launch page in 60s
- **Marketer** A/B-iterating headlines and CTAs without rewriting full copy
- **Agency operator** spinning up first-draft pages for client briefs

## Core requirements (static)
- Email/password auth
- Multi-field brief: name, description, features (multi-input + comma paste),
  audience, price, USP
- AI page generation with all 8 sections rendered, not raw text
- Persisted library; edit / regenerate / delete
- Real-landing-page-style preview
- Export to standalone HTML
- Multiple templates
- Section-by-section regeneration

## Implemented (2026-02-28)
- ✅ JWT auth (`/api/auth/register|login|logout|me`), admin seeding
- ✅ Sales-page CRUD, full + section regen
- ✅ GPT-5.2 strict-JSON sales-page generation
- ✅ Three live templates (Modern, Bold, Minimal)
- ✅ Live preview pane in generator (browser-chrome mockup)
- ✅ Standalone HTML export (per-template inlined styles)
- ✅ Brutalist Swiss app shell, sonner toasts, fontshare typography
- ✅ Public read-only page endpoint

## Backlog
### P1
- Public shareable preview URL (front-end route + meta-tags)
- Inline edit of any generated section (manual override before save)
- Stripe checkout snippet auto-injected into pricing CTA

### P2
- Image generation for hero (Gemini Nano Banana)
- Custom domain / subdomain hosting of generated pages
- A/B test mode (two CTAs, click tracking)
- Team workspaces

## Test credentials
See `/app/memory/test_credentials.md`.
