# JobTrack — Job Application Dashboard

A lightweight, responsive job application tracker built with plain HTML, CSS and JavaScript. No login, backend, database, framework, or build step required.

## Features

- Dashboard cards for total applications, in-progress applications, offers, and response rate
- Create, edit, and delete applications
- Track company, role, date applied, status, job posting URL, and notes
- Search by company/role/notes; filter by status; sort by date or company
- Export applications to CSV
- Responsive layout for desktop and mobile
- Data persists in the current browser using `localStorage`

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
- Clearing site data/browser storage can delete your records. Use **Export CSV** for a backup.
- GitHub Pages serves a public website when the repository/site is public. Do not put private credentials or secrets in this repository. The job application records themselves remain in your browser storage, not in the repository.
- The page imports DM Sans and Manrope fonts from Google Fonts; system fallback fonts are used if they are unavailable.

## Tech

HTML5 · CSS · Vanilla JavaScript · Browser `localStorage`
