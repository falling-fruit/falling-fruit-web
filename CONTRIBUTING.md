# Contributing to Falling Fruit (web)

Thanks for your interest in improving the [Falling Fruit](https://fallingfruit.org)
frontend! This is a community project — a collaborative map of forageable food
around the world — and contributions of all sizes are welcome.

This document covers how to get set up, the conventions we follow, and how
changes get reviewed and shipped. For deeper technical docs, see [`/docs`](./docs).

## Table of contents

- [Getting set up](#getting-set-up)
- [Project layout](#project-layout)
- [Running, building, and testing](#running-building-and-testing)
- [Code style](#code-style)
- [Continuous integration](#continuous-integration)
- [Branches and pull requests](#branches-and-pull-requests)
- [Governance and how changes get shipped](#governance-and-how-changes-get-shipped)
- [Proposing larger features or new content](#proposing-larger-features-or-new-content)

## Getting set up

Full setup instructions live in [`docs/setup.md`](./docs/setup.md). In short:

```sh
git clone https://github.com/falling-fruit/falling-fruit-web
cd falling-fruit-web
nvm install        # installs the Node version pinned in .nvmrc (22.16.0)
nvm use
yarn               # Yarn 1.x is vendored; just run it to install deps
cp example.env .env
```

Then fill in `.env` (see [`docs/setup.md`](./docs/setup.md) for what each variable
does). To make frontend-only changes you can point `REACT_APP_API_URL` at the
production API (`https://fallingfruit.org/api/0.3`) instead of running the
[backend](https://github.com/falling-fruit/falling-fruit) and
[API](https://github.com/falling-fruit/falling-fruit-api) locally.

## Project layout

See [`docs/file-structure.md`](./docs/file-structure.md) for the full tour. The
codebase is a [Create React App](https://create.react-app.dev/) (via
[CRACO](https://craco.js.org/)) project; source lives under `src/`, with
[`src/components/ui`](./src/components/ui) holding reusable UI primitives. The web
app is also packaged for Android and iOS with [Capacitor](https://capacitorjs.com).

## Running, building, and testing

```sh
yarn start          # run the dev server at http://localhost:3000
yarn build          # production build into ./build
yarn test           # run tests (react-scripts / Jest)
```

Mobile (Capacitor) build and release steps are documented in
[`docs/setup.md`](./docs/setup.md#mobile-apps).

## Code style

Formatting and linting are enforced automatically — please don't fight the
tools, just run them.

- **Prettier** handles formatting. Config lives in `package.json`: no semicolons,
  single quotes, trailing commas everywhere.
  - `yarn format` — format `src/` and `public/` in place
  - `yarn format:check` — check formatting without writing (what CI runs)
- **ESLint** handles linting (`eslint src --ext js,jsx,ts,tsx`).
  - `yarn lint` — lint and auto-fix
  - `yarn lint:check` — lint without fixing (what CI runs)
- **Knip** flags unused files, dependencies, and exports.
  - `yarn knip` — run dead-code detection (config in `knip.jsonc`)

A [Husky](https://typicode.github.io/husky) pre-commit hook runs
[lint-staged](https://github.com/okonet/lint-staged), which formats and lints
staged files for you. If the hook is not running, make sure you installed
dependencies with `yarn` (which sets it up).

### Styling

Read [`docs/styling.md`](./docs/styling.md) before adding UI. The short version:

- Style with [styled-components](https://styled-components.com); avoid imported
  CSS stylesheets and use inline styles sparingly.
- Build on [Reach UI](https://reach.tech) primitives where one fits, so
  components stay accessible.
- Pull colors and breakpoints from the theme rather than hardcoding them; use
  `rem` for font sizes and the `useIsDesktop()` hook for platform-specific
  behavior.

### Internationalization

The UI is translated with [`react-i18next`](https://react.i18next.com). User-facing
strings should go through the i18n layer rather than being hardcoded, and new
content should be designed so it can be translated as languages are added.

## Continuous integration

The [`main`](./.github/workflows/main.yml) GitHub Actions workflow runs on every
push and on pull requests to `main`. It must pass before a change can merge. It
runs, in order:

1. `yarn format:check`
2. `yarn lint:check`
3. `yarn knip`
4. `yarn build`

Run these locally before opening a PR to avoid round-trips.

## Branches and pull requests

- Fork the repo and create a topic branch off `main`. Use a short, descriptive
  prefix, e.g. `feature/…`, `fix/…`, or `docs/…`.
- Keep PRs focused and reasonably small; a reviewer should be able to understand
  the change in one sitting.
- Write a clear PR description: what changed, why, and how to test it. Link any
  related issue (e.g. `Closes #1128`).
- Make sure CI is green and the app builds locally.
- Open the PR against `falling-fruit/falling-fruit-web` `main`. For work in
  progress or to invite early feedback, open it as a **draft PR**. Maintainers
  may also pull a contributor branch and open the draft PR themselves.
- Deploy previews: the `main` branch deploys to
  [falling-fruit-web.pages.dev](https://falling-fruit-web.pages.dev/), and
  per-branch Cloudflare Pages previews
  (e.g. `issue-1128.falling-fruit-web.pages.dev`) make it easy to test a change
  on a phone in the field before it merges.

## Governance and how changes get shipped

Falling Fruit is a community-run project. A few things worth knowing:

- **Maintainers** review and merge contributions. Ethan Welty and Wojtek Bażant
  currently hold maintainer permissions, and **Ethan decides when to deploy to
  [fallingfruit.org](https://fallingfruit.org)**.
- **Monthly community calls** are the main venue to discuss ideas and gather
  input; the newsletter is another way to ask the community for opinions.
- **Day-to-day chat happens on Slack.** It's the best place to float a feature
  idea, ask questions, and get quick feedback before opening an issue or PR.
  Join the workspace at [fallingfruit.org/join-slack](https://fallingfruit.org/join-slack).
- **Board meetings** handle large or governance-type decisions.

For anything beyond a small, self-contained fix, it's worth surfacing the idea
on a community call or with a maintainer before investing heavily in the
implementation — both to get buy-in and to make sure the approach fits the
roadmap.

## Proposing larger features or new content

Larger features (especially ones that add new kinds of content to locations or
types) tend to need more than code. Lessons from past proposals worth keeping in
mind:

- **Design the UI/UX first.** A feature won't merge just because the data is
  good — the relevant UI/UX has to be worked out, and it has to fit existing
  structures (for example, content about a location's `type`, and how the type
  accordion handles a location with _multiple_ types; search for "Fruta
  Campground" in Utah for an extreme multi-type case).
- **Plan for the backend, not hardcoding.** Content that varies by type or
  language should be fetched from the backend, with a workflow for writing new
  entries as types or languages are added — not baked into the frontend.
- **Mind translation.** New content needs to be translatable; account for that
  in the design rather than bolting it on later.
- **Scope content appropriately.** Technical content (e.g. ripeness or other
  type-level guidance) is most useful when limited to (sub)specific taxa. It
  tends to read poorly when applied to generic taxa — compare the genus-level
  _Pyrus_ with the species-level _Pyrus calleryana_.
- **Connect it to the bigger picture.** Many of these ideas are part of the
  larger goal of fleshing out
  [location types](https://docs.google.com/document/d/1ah6jKO9uizBqeBtTVoIXi51gpYEQEyYzzastcMKOp5Y/edit),
  which don't yet have their own pages. Framing a proposal in that context helps.

When in doubt, open an issue or raise it on the next community call. Thanks for
contributing!
