# Mazen & Nourhan — Luxury Wedding Invitation & RSVP

A premium digital wedding ecosystem:

- **Print-ready invitation** (`/public/invitation.png`) with an integrated, scannable **QR code**
- **Luxury RSVP website** — animated hero, countdown, RSVP with unlimited additional guests, venue map, gallery, music & dark-mode toggles, PWA-installable
- **Private admin dashboard** — secure login, live analytics & charts, search/sort/filter, edit/delete, CSV & Excel export
- **Production database** — Supabase (PostgreSQL) with Row-Level Security

Built with **Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Supabase · Recharts**.

---

## Quick start (local)

```bash
npm install
cp .env.example .env.local      # then fill in your Supabase values
npm run dev                     # http://localhost:3000
```

The admin dashboard lives at **/admin** (also linked discreetly as “Host login” in the footer).

---

## What you need to provide

| Thing | Where | Notes |
|------|-------|-------|
| Supabase project | https://supabase.com | Free tier is plenty |
| `NEXT_PUBLIC_SUPABASE_URL` / `ANON_KEY` | Supabase → Settings → API | public, safe in browser |
| `SUPABASE_SERVICE_ROLE_KEY` | same page | **secret** — server only, never prefix with `NEXT_PUBLIC_` |
| Admin user | Supabase → Authentication → Users | create one email/password user = you |
| `NEXT_PUBLIC_ADMIN_EMAIL` | `.env` | only this email can open the dashboard |
| Domain | any registrar | e.g. MazenAndNourhan.com |
| (optional) `/public/audio/music.mp3` | your file | enables the background-music toggle |

See **DEPLOYMENT.md** for full setup and **DOMAIN.md** for connecting your custom domain.

---

## Project structure

```
.
├─ public/
│  ├─ invitation.png         # luxury invitation with embedded QR
│  ├─ qr-code.png            # standalone QR (-> NEXT_PUBLIC_SITE_URL)
│  ├─ gallery/               # venue photos
│  ├─ manifest.webmanifest   # PWA
│  └─ sw.js                  # offline shell
├─ supabase/
│  └─ schema.sql             # run once in Supabase SQL editor
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx          # fonts, metadata, PWA
│  │  ├─ page.tsx            # landing (hero, countdown, rsvp, venue, gallery)
│  │  ├─ api/rsvp/route.ts   # POST: validate + dedupe + insert (service role)
│  │  └─ admin/page.tsx      # auth gate -> Login | Dashboard
│  ├─ components/
│  │  ├─ Hero, Countdown, RSVPForm, Venue, Gallery, FloralBackground,
│  │  │  LoadingScreen, MusicToggle, ThemeToggle, Section
│  │  └─ admin/ Login, Dashboard
│  ├─ lib/  event.ts, types.ts, supabaseClient.ts, supabaseAdmin.ts
│  └─ fonts/ (Parisienne, Cormorant Garamond — bundled, no network at build)
└─ .env.example
```

## How the QR works

The QR encodes `NEXT_PUBLIC_SITE_URL` (default `https://www.MazenAndNourhan.com`).
Connect that domain (DOMAIN.md) and every scan opens your live site — no reprint needed.
To regenerate the QR for a different URL, edit `build` assets or use any QR tool with error-correction level **H**.

## Security model

- The public RSVP form posts to `/api/rsvp`, which inserts using the **service-role** key on the server.
- RLS exposes **no** anon read policy, so the guest list is unreadable to the public.
- Only an **authenticated** Supabase user (your admin email) can read, edit, delete, or export.

## Notes
- Pinned to Next.js 14.2.35 (latest 14.x). You can upgrade to Next 15 later if desired.
- The Google Maps embed is keyless; for the official Maps JS API add a key and swap the iframe.
