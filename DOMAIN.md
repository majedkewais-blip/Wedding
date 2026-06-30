# Connecting your custom domain

Example domain used throughout: **www.MazenAndNourhan.com** (swap for whatever you buy).

## 1. Buy the domain
Any registrar: Namecheap, GoDaddy, Cloudflare, Google Domains/Squarespace, etc.

## 2. Point it at Vercel
1. Vercel → your project → **Settings → Domains → Add**.
2. Enter both `MazenAndNourhan.com` and `www.MazenAndNourhan.com`.
3. Vercel shows the DNS records to create. Typically:
   - **A record** `@` → `76.76.21.21`
   - **CNAME** `www` → `cname.vercel-dns.com`
   *(Use exactly the values Vercel displays — they can change.)*
4. Add those records in your registrar’s DNS panel. Propagation: minutes to a few hours.
5. Set your preferred domain as **primary** (e.g. redirect apex → `www`).

## 3. Make the QR + site agree
Ensure the env var matches the domain you connected:
```
NEXT_PUBLIC_SITE_URL = https://www.MazenAndNourhan.com
```
Redeploy if you change it. The bundled QR already encodes this URL, so once DNS resolves, every scan opens your live site.

## 4. SSL / HTTPS
Automatic. Vercel issues and renews the certificate once DNS verifies. Force-HTTPS is on by default.

## Netlify / Render / Firebase
Same idea: add the domain in the host’s dashboard, create the A/CNAME records they specify, wait for verification; certificates are automatic.

## Sanity checklist
- [ ] `https://www.MazenAndNourhan.com` loads the site
- [ ] apex `MazenAndNourhan.com` redirects to `www`
- [ ] padlock (HTTPS) shows
- [ ] scanning the printed invitation QR opens the live site
- [ ] `/admin` login works from the live domain
