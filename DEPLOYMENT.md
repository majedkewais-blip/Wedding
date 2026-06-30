# Deployment Guide

Recommended: **Vercel** (made by the Next.js team). Firebase Hosting / Netlify / Render also work.

---

## 1. Create the Supabase project (database + auth)

1. Go to https://supabase.com → **New project**. Pick a region near Egypt (e.g. Frankfurt). Save the DB password.
2. **SQL Editor → New query** → paste the contents of `supabase/schema.sql` → **Run**.
   This creates the `rsvps` table, the auto `guest_count`, and Row-Level Security.
3. **Authentication → Users → Add user** → create one user with your email + a strong password.
   (Optional: Authentication → Providers → Email → turn **off** “Confirm email” so your login works immediately.)
4. **Project Settings → API** → copy:
   - `Project URL`  → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public`  → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`  *(secret!)*

## 2. Push the code to GitHub

```bash
git init && git add . && git commit -m "Wedding site"
git branch -M main
git remote add origin https://github.com/<you>/mazen-nourhan-wedding.git
git push -u origin main
```

## 3. Deploy on Vercel

1. https://vercel.com → **Add New → Project** → import the GitHub repo.
2. Framework preset auto-detects **Next.js**. Leave build command `next build`.
3. **Environment Variables** — add all of these (Production + Preview):
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   NEXT_PUBLIC_SITE_URL          = https://www.MazenAndNourhan.com
   NEXT_PUBLIC_ADMIN_EMAIL       = you@example.com
   ```
4. **Deploy.** You’ll get a `*.vercel.app` URL. Test it, then connect your domain (DOMAIN.md).

## SSL
Vercel/Netlify/Firebase all issue & renew HTTPS certificates automatically once the domain is verified. Nothing to configure.

---

## Alternative hosts

### Netlify
- Add the `@netlify/plugin-nextjs` (auto-detected). Set the same env vars under **Site settings → Environment variables**. Deploy.

### Render
- New **Web Service** from the repo. Build: `npm install && npm run build`. Start: `npm run start`. Add env vars. Render provisions SSL automatically.

### Firebase Hosting
- Easiest path is Firebase’s **Web Frameworks** support: `npm i -g firebase-tools`, `firebase init hosting` (choose “Use a web framework”, detect Next.js), set env vars in your hosting config, `firebase deploy`.
- (If you prefer Firebase over Supabase entirely, swap `supabaseClient`/`supabaseAdmin` for the Firebase SDK and store RSVPs in Firestore — the component contracts stay the same.)

## Background music (optional)
Drop an `.mp3` at `public/audio/music.mp3`. The toggle (bottom-right) starts muted per browser autoplay rules and plays on tap.

## After deploy — smoke test
1. Open the site → submit a test RSVP with 1–2 added guests.
2. Open `/admin` → log in → confirm the RSVP, stats, and charts update; export CSV/Excel.
3. Delete the test RSVP.
