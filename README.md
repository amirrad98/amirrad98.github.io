# Proto Projects

This repo publishes a GitHub Pages project index at the root domain and sub-projects under their own routes.

## Current structure

- `docs/index.html` is the root project index
- `docs/projects/terminal-project/index.html` is the published Terminal Project page
- `docs/terminal-project/index.html` is retained for repository history; GitHub Pages reserves that top-level route for the separate `terminal-project` repository
- `docs/styles.css` is the shared stylesheet
- `.github/workflows/deploy-pages.yml` deploys the `docs/` directory

## Published project routes

- `/gym/`
- `/Maps/`
- `/Terminal/`
- `/terminal-project/` (redirects to `www.amrad.ca`)
- `/text-to-protein-classroom/`
- `/Xray-skill/`

## Add another sub-project

1. Create a new folder under `docs/`, for example `docs/my-app/`.
2. Add an `index.html` file inside that folder.
3. Add the slug to the `projects` array in `docs/index.html`.
4. Push to `main` and GitHub Pages will publish it at `/my-app/`.
