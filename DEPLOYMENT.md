# Deployment Guide

## Overview

WriteSpace is a fully client-side React application with no backend or server-side logic. All data is persisted in the browser's `localStorage`. This means the app can be deployed to any static hosting provider that supports Single Page Application (SPA) fallback routing.

---

## Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- A [Vercel](https://vercel.com) account (for Vercel deployment)
- A GitHub account (for CI/CD via Vercel GitHub integration)

---

## Build

### Install Dependencies

```bash
npm install
```

### Production Build

```bash
npm run build
```

The compiled output is placed in the `dist/` directory. This directory contains all static assets (HTML, JS, CSS) ready to be served by any static host.

### Preview Production Build Locally

```bash
npm run preview
```

This starts a local server serving the contents of `dist/` at `http://localhost:4173` by default.

---

## Environment Variables

**None required.**

WriteSpace does not use any environment variables. There is no backend API, no database connection string, and no third-party service keys. All application data is stored in the user's browser `localStorage` at runtime.

---

## Vercel Deployment

### Why Vercel

Vercel is the recommended hosting platform for WriteSpace. It provides:

- Zero-configuration static site hosting
- Automatic HTTPS
- Global CDN
- Instant deployments from Git
- Built-in SPA rewrite support via `vercel.json`

### SPA Rewrite Configuration

Because WriteSpace uses client-side routing (React Router DOM v6), the server must serve `index.html` for every route — including deep links like `/blogs`, `/blog/:id`, `/admin`, and `/admin/users`. Without this, a direct browser navigation or page refresh to any route other than `/` would return a 404 from the server.

The `vercel.json` file at the project root handles this:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This rule tells Vercel to rewrite all incoming requests — regardless of path — to `index.html`, allowing React Router to take over and render the correct page on the client side.

### Manual Deployment via Vercel CLI

1. Install the Vercel CLI globally:

```bash
npm install -g vercel
```

2. Authenticate with your Vercel account:

```bash
vercel login
```

3. Deploy from the project root:

```bash
vercel
```

Follow the interactive prompts. Vercel will automatically detect the Vite framework, run `npm run build`, and deploy the `dist/` directory.

4. For subsequent production deployments:

```bash
vercel --prod
```

### CI/CD via Vercel GitHub Integration

The recommended workflow is to connect your GitHub repository to Vercel for automatic deployments on every push.

#### Setup Steps

1. Push your project to a GitHub repository.
2. Log in to [vercel.com](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. Vercel will auto-detect the framework as **Vite**.
5. Confirm the following build settings (these are detected automatically):

| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

6. Click **Deploy**.

#### Automatic Deployments

Once connected:

- Every push to the `main` branch triggers a **production deployment**.
- Every push to any other branch or pull request triggers a **preview deployment** with a unique URL.
- Deployment status is reported directly in the GitHub pull request interface.

---

## Other Static Hosts

WriteSpace can be deployed to any static hosting provider. The only requirement is configuring the host to serve `index.html` for all routes (SPA fallback).

### Netlify

Create a `_redirects` file in the `public/` directory (Vite copies `public/` contents to `dist/` at build time):

```
/*    /index.html   200
```

Or add a `netlify.toml` at the project root:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### GitHub Pages

GitHub Pages does not natively support SPA fallback. A common workaround is to copy `index.html` to `404.html` in the `dist/` directory before deploying, and add a redirect script. Alternatively, use a GitHub Actions workflow with the `peaceiris/actions-gh-pages` action.

Note: GitHub Pages serves sites from a subdirectory (e.g., `https://username.github.io/repo-name/`). You may need to set the `base` option in `vite.config.js`:

```js
export default defineConfig({
  base: '/repo-name/',
  plugins: [react()],
})
```

### AWS S3 + CloudFront

1. Build the project: `npm run build`
2. Upload the `dist/` directory to an S3 bucket with static website hosting enabled.
3. Configure a CloudFront distribution pointing to the S3 bucket.
4. Add a CloudFront error page rule: HTTP 403/404 → `/index.html` with HTTP 200 response code.

---

## Local Development

### Start the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default. Vite provides Hot Module Replacement (HMR) — changes to source files are reflected in the browser instantly without a full page reload.

### Development Notes

- All data (users, posts, session) is stored in your browser's `localStorage` under the keys `writespace_session`, `writespace_users`, and `writespace_posts`.
- To reset all application data during development, open the browser DevTools → Application → Local Storage → clear the relevant keys.
- The hard-coded admin account (`admin` / `admin`) is always available regardless of `localStorage` state.
- There is no `.env` file required. The project works out of the box after `npm install`.

---

## Build Output

After running `npm run build`, the `dist/` directory contains:

```
dist/
├── index.html          # Entry point served for all routes
├── assets/
│   ├── index-[hash].js  # Bundled JavaScript (React app)
│   └── index-[hash].css # Bundled CSS (Tailwind utilities)
└── vite.svg            # Default Vite favicon (can be replaced)
```

The build is fully self-contained. No server-side rendering, no API calls, no external dependencies at runtime.

---

## Troubleshooting

### Blank page after deployment

**Cause:** The hosting provider is returning a 404 for routes other than `/`.

**Fix:** Ensure the SPA rewrite / redirect rule is correctly configured for your host (see `vercel.json` for Vercel, `_redirects` for Netlify, etc.).

### Styles not loading after deployment

**Cause:** The `base` path in `vite.config.js` may not match the deployment subdirectory.

**Fix:** If deploying to a subdirectory (e.g., GitHub Pages), set `base: '/repo-name/'` in `vite.config.js` and rebuild.

### Data lost between sessions

**Cause:** `localStorage` is cleared when the user clears browser data, uses private/incognito mode, or switches browsers.

**Note:** This is expected behaviour. WriteSpace uses `localStorage` for demonstration purposes only. For production use, a persistent backend database would be required.

### Build fails with Node version error

**Cause:** Node.js version is below the minimum requirement.

**Fix:** Upgrade to Node.js ≥ 18. Use [nvm](https://github.com/nvm-sh/nvm) to manage Node versions:

```bash
nvm install 18
nvm use 18
```