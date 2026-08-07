# getplayiptv

This repository contains the public frontend files for the getplayiptv website and admin interface.

## What to keep in GitHub

- `index.html`
- `admin.html`
- `admin-login.html`
- `robots.txt`
- `sitemap.xml`
- `vercel.json`
- `functions/` (if you want to include server-side/helper code)
- `supabase/` (if you want to include Supabase function code and docs)
- image assets and icons needed by the website

## What should not be committed

- `supabase-config.js`
- local environment files such as `.env`, `.env.local`, or other secret config files
- editor configs and logs stored in `.vscode/`

## Setup

1. Copy `supabase-config.example.js` to `supabase-config.js`.
2. Replace the placeholder values with your actual Supabase project URL, anonymous key, and WhatsApp number.
3. Keep `supabase-config.js` out of the repository; it is already excluded by `.gitignore`.

## Notes

- The repository now ignores `supabase-config.js` and common local secret files.
- Use the example file as the template for local setup.
