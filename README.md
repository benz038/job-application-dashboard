# JobTrack — Job Application Dashboard

A lightweight, responsive job application tracker built with plain HTML, CSS and JavaScript. No login, backend, database, framework, or build step required..

## Features

- Dashboard cards for total applications, in-progress applications, offers, and response rate
- Create, edit, and delete applications
- Track company, role, date applied, status, job posting URL, and notes
- Search by company/role/notes; filter by status; sort by date or company
- Export applications to CSV
- Responsive, viewport-fitted layout with an independently scrolling application list on desktop and mobile
- Light, Dark, and Dracula themes, saved in the current browser
- Data persists in the current browser using `localStorage`
- Save the current application list to `jobs.json` through GitHub Actions

## Run locally

Open `index.html` in a browser. For a local web server, run:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000` from this folder.

## Publish free with GitHub Pages

1. Create a new GitHub repository, for example `job-application-dashboard`.
2. Upload `index.html`, `styles.css`, `app.js`, and `README.md` to the repository root (or push this folder with Git).
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`, then click **Save**.
6. Wait for GitHub Pages to publish the site. The Pages URL will appear in Settings → Pages.

## Important data/privacy notes

- No account or login is required.
- Application records are saved in `localStorage` in the browser where you use the site. They are not uploaded to GitHub or synced between browsers/devices.
- **Save to GitHub** sends the current list to the repository's `save-jobs.yml` workflow. Create a fine-grained personal access token for this repository with **Actions: read and write** access. The token is saved in browser `localStorage` by default so later saves do not ask for it again; uncheck **Remember token on this device** to remove it. Anyone with access to that browser profile or page scripts can read/use the saved token. Never put a token in `app.js`, HTML, or a committed file.
- In **Settings → Actions → General → Workflow permissions**, allow read and write permissions so the workflow's `GITHUB_TOKEN` can commit `jobs.json`. The workflow validates the submitted JSON and writes it to the repository's `main` branch. Enable GitHub Pages from that branch if using the hosted page.
- Clearing site data/browser storage can delete your records. Use **Export CSV** for a backup.
- `jobs.json` is committed to the repository and may be publicly visible. Do not sync private notes or sensitive information to a public repository. On a fresh browser, the page loads its initial list from `jobs.json`; once browser-local data exists, it remains the active working copy until cleared.
- The page imports DM Sans and Manrope fonts from Google Fonts; system fallback fonts are used if they are unavailable.

## Tech

HTML5 · CSS · Vanilla JavaScript · Browser `localStorage`
