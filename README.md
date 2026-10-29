# GitLarping

[![Lint, Test and Deploy to GitHub Pages](https://github.com/yeruka-ui/GitLarping/actions/workflows/deploy.yml/badge.svg)](https://github.com/yeruka-ui/GitLarping/actions/workflows/deploy.yml)

GitLarping is Lauren Kailey A. Francisco's (Laur) one-page portfolio for a Software Configuration Management class activity. It explains version control, CI/CD and DevOps, and it is deployed by the same lint-gated pipeline it describes.

- **Static site:** `index.html`, `css/style.css` and `js/main.js`. No frameworks, no bundler.
- **Animations:** GSAP 3 and ScrollTrigger, loaded from cdnjs. Animations are skipped when the visitor has `prefers-reduced-motion: reduce` set.
- **Quality gates:** ESLint (flat config in `eslint.config.js`) and Jest (tests in `tests/`, jsdom environment).
- **On-load function:** `showCommitGreeting()` in `js/main.js` runs when the page loads and writes a time-of-day greeting from `getCommitGreeting(hour)` into `#greeting`.
- **CI/CD:** GitHub Actions publishes the site to GitHub Pages.

## How the pipeline works

The workflow is in `.github/workflows/deploy.yml`. Lint and test run on every push to any branch; only pushes to `main` deploy, and you can also start it by hand from the Actions tab (`workflow_dispatch`).

| Stage | Job | What happens |
|---|---|---|
| Push | (trigger) | A commit lands on `main`, or someone clicks **Run workflow**. |
| Lint | `lint` | Checkout, set up Node LTS with the npm cache, `npm ci`, `npm run lint`. |
| Test | `test` | Runs after lint passes. Checkout, Node LTS, `npm ci`, `npm test` (Jest). |
| Package | `deploy` | Copies only `index.html`, `css/` and `js/` into `_site/`, then uploads it as a Pages artifact. |
| Deploy | `deploy` | `actions/deploy-pages` publishes the artifact. The live URL appears on the run summary. |

`test` has `needs: lint` and `deploy` has `needs: [lint, test]`, so **if lint or any test fails, deploy does not run** and the live site stays on its last good version. The `pages` concurrency group makes deployments queue one at a time instead of cancelling each other.

## Run locally

```bash
npm install
npm run lint
npm test
```

Open `index.html` in a browser, or serve the folder with any static server (for example `npx serve .`).

## Setup (first deploy)

1. On GitHub, create a new **public** repository named `GitLarping`. Leave it empty: no README, no .gitignore.
2. In this folder, run `npm install`. This creates `package-lock.json`, which `npm ci` in the pipeline needs. Commit it.
3. Initialise Git and push:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: GitLarping with CI/CD"
   git branch -M main
   git remote add origin https://github.com/yeruka-ui/GitLarping.git
   git push -u origin main
   ```
4. On GitHub go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
5. Go to the **Actions** tab. If the first run failed because Pages wasn't enabled yet, open it and click **Re-run all jobs**, or use **Run workflow**.
6. When it finishes, the live URL (`https://yeruka-ui.github.io/GitLarping/`) appears under the `deploy` job on the run summary, and under **Settings → Pages**.
