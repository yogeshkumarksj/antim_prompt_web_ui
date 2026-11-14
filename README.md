# Antim Prompt (Web)

Vite 8 + React 19 + Tailwind 4 + React Router 7 SPA for [antimprompt.com](https://antimprompt.com).

The production build is a static site deployed to Hostinger shared hosting (`public_html`). The API backend is a FastAPI app on Render (`prompt-karo-backend`).

## Prerequisites

- Node.js 20+ (or current LTS)
- npm 10+

## Setup

```bash
npm ci
cp .env.example .env   # optional — defaults work for production API
npm run dev
```

Dev server: [http://localhost:5173](http://localhost:5173)

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint |

## Environment variables

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `VITE_API_URL` | No | `https://prompt-karo-backend.onrender.com` | Backend API base URL (no trailing slash) |

Copy `.env.example` to `.env` for local overrides. Only `VITE_*` vars are exposed to the client bundle.

Admin authentication uses a key you type at `/admin`. The key is verified with `POST /admin/verify` (or sent as the `x-admin-key` header on admin requests if verify is not yet deployed) and stored only in `sessionStorage` — never hardcode it in source.

## Deploy to Hostinger (`public_html`)

1. Build locally (or in CI):

   ```bash
   npm ci
   npm run build
   ```

2. Upload the **contents** of `dist/` into Hostinger `public_html` (File Manager or FTP/SFTP).

3. **Do not wipe the whole `public_html` folder.** Preserve existing server-side assets that are not part of this SPA, including:

   - `upload_handler.php`
   - `uploads/` (and anything inside it)

   Safe approach:

   - Overwrite SPA files: `index.html`, `assets/`, `favicon.png`, `robots.txt`, `sitemap.xml`, `.htaccess`
   - Leave `upload_handler.php` and `uploads/` untouched
   - Avoid “delete everything then upload” deploys

4. The included `public/.htaccess` (copied into `dist/.htaccess` on build):

   - Forces HTTPS (301)
   - Redirects `www` → apex (`antimprompt.com`)
   - SPA-falls back to `index.html` for client routes
   - Does **not** SPA-fallback missing `/assets/*`, `robots.txt`, or `sitemap.xml` (those 404)
   - Leaves `upload_handler.php` and `/uploads/` alone
   - Long-cache hashed `/assets/*`; no-cache for `index.html`
   - Enables compression
   - Does **not** set `Access-Control-Allow-Origin: *`

5. After upload, hard-refresh the site and confirm `/`, a deep link like `/privacy`, `/robots.txt`, and `/upload_handler.php` still behave as expected.

## Project layout

```
src/
  App.jsx              # Routes (lazy-loaded pages) + home feed
  constants.js         # BASE_URL from VITE_API_URL
  components/          # PromptCard, etc.
  pages/               # Admin, AI Magic, Insta Audit, Privacy, Saved, Prompt detail
public/
  .htaccess            # Hostinger SPA + caching rules
  robots.txt
  sitemap.xml
  favicon.png
```

## License

Private — Antim Prompt.
