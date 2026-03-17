# Proto Projects

This repo publishes a GitHub Pages project index at the root domain and sub-projects under their own routes.

## Current structure

- `docs/index.html` is the root project index
- `docs/terminal-project/index.html` is an example sub-project page
- `docs/styles.css` is the shared stylesheet
- `.github/workflows/deploy-pages.yml` deploys the `docs/` directory

## Add another sub-project

1. Create a new folder under `docs/`, for example `docs/my-app/`.
2. Add an `index.html` file inside that folder.
3. Add the slug to the `projects` array in `docs/index.html`.
4. Push to `main` and GitHub Pages will publish it at `/my-app/`.
