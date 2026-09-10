# Boulder Bright Lights

Static site rebuild of the Boulder Bright Lights Wix site, ready to deploy on Vercel.

## Structure

- `index.html` — Home
- `about.html` — Who Are We?
- `contact.html` — Contact
- `css/style.css` — shared styles
- `js/main.js` — nav toggle, scroll reveal, snowfall effect, contact form
- `images/` — logo, hero photo, headshot

No build step or dependencies — plain HTML/CSS/JS.

## Deploy to Vercel

**Option A — Vercel CLI**

```bash
npm i -g vercel
cd boulder-bright-lights
vercel
```

Follow the prompts (link or create a project), then `vercel --prod` to publish.

**Option B — GitHub + Vercel dashboard**

1. Push this folder to a GitHub repo.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Framework preset: **Other** (static site) — no build command needed.
4. Deploy.

## Local preview

```bash
cd boulder-bright-lights
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Editing content

- Phone number / email: search-and-replace `7207173555` and `HirschLimited@gmail.com` across the HTML files.
- Colors and fonts: CSS custom properties at the top of `css/style.css`.
- Contact form currently opens the visitor's email client (no backend). To wire it to a real form service (e.g. Formspree, Web3Forms), swap the `fetch`/`mailto` logic in `js/main.js`.
