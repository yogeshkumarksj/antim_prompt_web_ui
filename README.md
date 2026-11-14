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

## Deploy (CI → dist repo → Hostinger Git)

On every push to `main` (and via **Actions → Build and publish dist → Run workflow**), GitHub Actions:

1. Runs `npm ci` and `npm run build` (Node 20)
2. Ensures `dist/` includes Vite-copied `public/` files (`.htaccess`, `robots.txt`, `sitemap.xml`, `favicon.png`) plus `.nojekyll`
3. Pushes the **contents** of `dist/` to the root of [`yogeshkumarksj/antim_prompt_web_ui_dict`](https://github.com/yogeshkumarksj/antim_prompt_web_ui_dict) on branch `main` (via `DEPLOY_TOKEN`)

Hostinger Git auto-deploy then pulls that repo into `public_html`.

### Secret required on this repo

| Secret | Purpose |
| --- | --- |
| `DEPLOY_TOKEN` | Fine-grained GitHub PAT with **Contents: Read and write** on `antim_prompt_web_ui_dict` only |

Optional: Variable/secret `VITE_API_URL` if the API base URL should differ from the Render default at build time.

### Hostinger Git + existing PHP / `uploads/`

Hostinger’s Git deploy into `public_html` can conflict with files that are **not** in the dist repo (`upload_handler.php`, `weather_media_sync.php`, `uploads/`). Do **not** commit those (or any secrets) into `antim_prompt_web_ui_dict`.

Safe setup:

1. In File Manager, **download a backup** of `upload_handler.php`, `weather_media_sync.php`, and the entire `uploads/` folder.
2. hPanel → **Websites** → **Advanced** → **GIT**: connect `https://github.com/yogeshkumarksj/antim_prompt_web_ui_dict.git`, branch `main`, install path `public_html` (Hostinger often needs an empty/nearly empty path for the first clone).
3. After the first pull, **re-upload** the PHP files and `uploads/` into `public_html` as untracked server-only files.
4. Trigger a second deploy and confirm those files are still present. If Hostinger cleans untracked files on pull, keep PHP/`uploads/` outside the Git-managed tree (or restore them after each deploy) — do not put secrets into the dist repo.

### SPA `.htaccess` (from `public/`)

- Forces HTTPS (301), redirects `www` → apex
- SPA fallback to `index.html` (not for missing `/assets/*`, `robots.txt`, `sitemap.xml`)
- Leaves `/upload_handler.php` and `/uploads/` alone in rewrite rules
- Long-cache hashed `/assets/*`; no-cache for `index.html`; compression on; no global `Access-Control-Allow-Origin: *`

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
