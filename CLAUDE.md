# CLAUDE.md

## Deployment: Vercel static site

This repo is deployed to Vercel as a static site
(`register-tinyclean-web.vercel.app`). Vercel serves whatever is at the
**repo root** as `/` and looks for `index.html` there — it does not know
about any nested project folder.

Rules to keep deploys working:

- The site's entry page must be `index.html` at the repo root, not nested
  in a subfolder (e.g. `site/register.html` 404'd until moved to
  `/index.html`).
- CSS/JS/assets referenced from it should stay at the root too
  (`register.css`, `register.js`, `assets/`), using relative paths
  (`href="register.css"`, `src="assets/foo.svg"`), so they keep resolving
  correctly however Vercel serves the directory.
- If you add another page (e.g. a second flow/screen), give it its own
  root-level `.html` file rather than nesting it in a subfolder, unless
  you also add a `vercel.json` rewrite/redirect for it.
