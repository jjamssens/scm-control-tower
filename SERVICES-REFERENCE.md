# Services Reference — Justin Jamssens Portfolio

All services used across active projects. Credentials are in each project's `.env` file — not stored here.

---

## OSHA LOTO Pro (`oshalotopro.com`)

| Service | What It Does | Dashboard |
|---|---|---|
| **Render** | Hosts the backend (FastAPI server) | render.com/dashboard |
| **Cloudflare** | Domain DNS for oshalotopro.com | dash.cloudflare.com |
| **Stripe** | Payments — $39 one-time PDF purchase | dashboard.stripe.com |
| **Anthropic** | Claude API — generates the LOTO program content | console.anthropic.com |
| **Supabase** | PostgreSQL database — logs program generations | supabase.com/dashboard |
| **Resend** | Transactional email (configured, not yet wired up) | resend.com |
| **Sentry** | Error tracking (configured, DSN not yet set) | sentry.io |

### Stripe Products
- **OTO Written Program** — `price_1TCqeoPh8BWwLYcnk2z2qKhI` — $39 one-time
- **Loto Program Unlimited** — `price_1TG3MVPh8BWwLYcnVh1TQiKz` — $28.99/month (hidden from UI until return flow is built)

### Pending
- Subscription return flow: subscribers need a way to come back and generate more programs (email-based access verification against Stripe)
- Wire up Resend to send PDF delivery confirmation emails after purchase

---

## Lead Scraper (OSHA LOTO Pro outreach)

| Service | What It Does | Dashboard |
|---|---|---|
| **Apollo.io** | B2B lead database — exports CSV with verified emails + phones | app.apollo.io |
| **Google Cloud Console** | Hosts the API key for Google Custom Search | console.cloud.google.com (project: osha-loto-490820) |
| **Google CSE** | Custom Search Engine for website scraping (ID: d5835898b4b404a12) | cse.google.com |
| **Bland.ai** | AI phone calls — cold outreach to contractors | app.bland.ai (API key not yet added to .env) |
| **Twilio** | SMS outreach (not yet set up — needs account + A2P registration) | twilio.com |

### Notes
- Apollo free tier: 25 contacts/month with verified emails
- Google CSE "Search the entire web" is greyed out on free accounts — limited usefulness
- Bland.ai: test with 1 call before running batch. Calls cost per minute.
- Twilio A2P 10DLC registration takes a few days — set up before attempting SMS campaigns

---

## 15-LB Guard Pro

| Service | What It Does | Dashboard |
|---|---|---|
| **Render** | Backend hosting | render.com/dashboard |
| **Stripe** | Payments | dashboard.stripe.com |
| **Anthropic** | Claude API — generates EPA compliance reports | console.anthropic.com |
| **Supabase** | Database | supabase.com/dashboard |
| **Resend** | Email delivery | resend.com |

### Notes
- EPA 40 CFR Part 82 compliance tool
- Enforcement has been weak — deprioritized vs. OSHA LOTO Pro

---

## Piano Tutor

| Service | What It Does | Dashboard |
|---|---|---|
| **Gumroad** | Distribution / payments for desktop app | app.gumroad.com |
| **GitHub** | Code + CI/CD for Electron builds | github.com |

---

## Shared / General

| Service | What It Does |
|---|---|
| **GitHub** | All code repos |
| **Cloudflare** | DNS for oshalotopro.com (and potentially other domains) |
| **Anthropic Console** | API billing + usage across all Claude-powered products — add credits here when depleted |

---

## Key Things to Remember

- **Anthropic credits run out** — check console.anthropic.com/settings/billing if generation starts failing with a 402/credit error
- **Stripe webhook secret** — must match between Render env vars and Stripe dashboard. If payments stop working, check this first.
- **Supabase RLS** — Row Level Security policies need to be set up on both compliance apps (currently pending — see security followup notes)
- **Render cold starts** — free tier spins down after inactivity. First request takes ~30 seconds. Consider upgrading if this hurts conversion.
- **.env files** — never commit these. Each project has a `.env.example` showing what keys are needed.
