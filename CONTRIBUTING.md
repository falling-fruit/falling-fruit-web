# Contributing to Falling Fruit (web)

The mobile-friendly frontend for [Falling Fruit](https://fallingfruit.org), a
community map of forageable food. Contributions of all sizes are welcome — this
page is about **how to actually get a change merged**. For setup, architecture,
and styling, see [`/docs`](./docs) (start with [`docs/setup.md`](./docs/setup.md)).

## Talk first

Most changes go smoother if you raise them before writing much code:

- **Slack** — day-to-day chat and the fastest way to get feedback or sanity-check
  an idea. Join at [fallingfruit.org/join-slack](https://fallingfruit.org/join-slack).
- **Monthly community calls** for bigger discussions, and the **newsletter** to
  poll the wider community.
- **GitHub issues** for concrete bugs and proposals.

Maintainers are **Ethan Welty** and **Wojtek Bażant**; Ethan decides when a merged
change is deployed to [fallingfruit.org](https://fallingfruit.org). Large or
governance-type decisions go through board meetings. For anything beyond a small,
self-contained fix, get buy-in from a maintainer (and ideally the community) first
— it's the difference between a PR that lands and one that stalls.

## Opening a pull request

1. Fork the repo and branch off `main` (`feature/…`, `fix/…`, `docs/…`).
2. Keep it focused — small enough to review in one sitting.
3. **Green CI is required.** The [`main`](./.github/workflows/main.yml) workflow runs,
   in order: `yarn format:check` → `yarn lint:check` → `yarn knip` → `yarn build`.
   Run them locally first (`yarn format` and `yarn lint` auto-fix). A Husky
   pre-commit hook formats/lints staged files for you.
4. Write a description that says **what changed, why, and how to test it**, and
   link any issue (e.g. `Closes #1234`).
5. Open the PR against `falling-fruit/falling-fruit-web` `main`. Use a **draft PR**
   for work in progress or early feedback. Depending on the change, a maintainer
   may pull your branch and open the draft PR themselves — coordinate on Slack.
6. **Test it like a user.** `main` deploys to
   [falling-fruit-web.pages.dev](https://falling-fruit-web.pages.dev/), and each
   branch/PR gets its own Cloudflare Pages preview
   (e.g. `issue-1234.falling-fruit-web.pages.dev`) — handy for trying a change on
   your phone in the field before it merges.

## Proposing larger features or new content

Adding a new kind of content to locations/types is usually more work than the data
itself. Lessons from past proposals:

- **Design the UI/UX first.** It has to fit existing structures — e.g. content
  under a location's `type`, and how the accordion handles a location with
  _multiple_ types (search "Fruta Campground" in Utah for an extreme case). A good
  idea won't merge until the UX is worked out.
- **Fetch from the backend; don't hardcode.** Content that varies by type or
  language belongs in the backend, with a workflow to add entries as new types or
  languages appear.
- **Mind translation.** Design new content to be translatable from the start.
- **Scope it.** Type-level text (e.g. ripeness guides) reads best on (sub)specific
  taxa, not generic ones — compare _Pyrus_ vs _Pyrus calleryana_.
- **Tie it to the roadmap.** Much of this feeds the larger goal of fleshing out
  [location types](https://docs.google.com/document/d/1ah6jKO9uizBqeBtTVoIXi51gpYEQEyYzzastcMKOp5Y/edit),
  which don't yet have their own pages — framing a proposal that way helps.

Not sure where to start? Ask on Slack or open an issue. Thanks for contributing!
