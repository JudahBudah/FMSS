# FMSS: Fertility and Moisture Soil Sensor

Web dashboard for the FMSS soil sensor: live readings, past readings, and PDF soil reports.

**Stack:** React 19, Vite, TypeScript, Tailwind CSS v4 (frontend). Node.js, Express, Prisma 5, PostgreSQL (backend).

## Pages

| Route | File |
|---|---|
| `/` | `frontend/src/pages/WelcomePage.tsx` | 
| `/dashboard` | `frontend/src/pages/DashboardPage.tsx` | 
| `/past-readings` | `frontend/src/pages/PastReadingsPage.tsx` | 
| `/about` | `frontend/src/pages/AboutPage.tsx` | 

## Running the project

You need Node.js 20+ and PostgreSQL. Welcome-page work only needs the frontend, no database.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend 

1. Create the database. In `psql`, as the `postgres` user:

```sql
CREATE USER fmss_user WITH PASSWORD 'fmss_pass';
CREATE DATABASE fmss OWNER fmss_user;
ALTER USER fmss_user CREATEDB;
\c fmss
GRANT ALL ON SCHEMA public TO fmss_user;
ALTER SCHEMA public OWNER TO fmss_user;
```

`CREATEDB` is needed because Prisma makes a temporary shadow database when migrating.

2. Set up the environment and tables:

```bash
cd backend
cp .env.example .env    # edit DATABASE_URL if you used a different password
npm install
npx prisma migrate dev
```

3. Run it, in two terminals inside `backend/`:

```bash
npm run dev     # API server on port 3001
npm run mock    # adds fake sensor readings every 3 seconds
```

Ignore `npm run sensor`. That one is for the real hardware.

### Troubleshooting

- **Fedora/Linux, "denied access" or password errors:** in `/var/lib/pgsql/data/pg_hba.conf`,
  change `ident` to `md5` on the two `host` lines, then `sudo systemctl restart postgresql`.
- **PDF download fails on Fedora:** Chromium needs system libraries. Run
  `sudo dnf install -y alsa-lib atk cups-libs gtk3 libXcomposite libXdamage libXrandr mesa-libgbm pango at-spi2-atk at-spi2-core nss nspr`
  and restart your terminal.
- **Red underline on `@theme` in `index.css`:** harmless. Install the "Tailwind CSS IntelliSense" extension.

## Rules for pages

- The root element of a page inside the layout gets `flex-1`, so it fills the space next to the
  sidebar. Don't use `min-h-screen` there. (The Welcome page is standalone and can.)
- Don't build your own sidebar or navigation. `MainLayout` provides it.
- Don't call `fetch` yourself. Use the hooks (`useLiveData`, `useHistory`, `useReport`). They already
  handle loading, errors, and number conversion.
- Write the phone layout with plain classes first, then add `sm:` (640px) and `lg:` (1024px) for
  bigger screens. The sidebar becomes a hamburger menu below `lg`, so test at phone width too.
- Put images and fonts in `frontend/src/assets/` and import them:
  `import logo from '../assets/logo.png'`.

## Tailwind v4 notes

- Colors and fonts live in `frontend/src/index.css` inside `@theme { ... }`. For example,
  `--color-sidebar` gives you `bg-sidebar` and `text-sidebar`. 
- v4 shifted the small sizes: `shadow-xs` is the old `shadow-sm`, and `rounded-xs` is the old
  `rounded-sm`. Tutorials written for v3 may look slightly different.
- Gradients are `bg-linear-to-b` (not `bg-gradient-to-b`). Opacity is `bg-black/50` (not `bg-opacity-50`).

Open a pull request into `main` on GitHub. Owner reviews and merges. Never commit `.env` or `node_modules`.
