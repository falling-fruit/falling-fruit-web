# Contributing to Falling Fruit (web)

The mobile-friendly frontend for [Falling Fruit](https://fallingfruit.org), a
community map of forageable food. Contributions of all sizes are welcome. For setup, architecture,
and styling, see [`/docs`](./docs) (start with [`docs/setup.md`](./docs/setup.md)).

## Opening a pull request

1. Fork the repo and branch off `main`
2. Make a change and test it locally first
3. Write a description that says **what changed, why, and how to test it**, and
   link any issue (e.g. `Closes #1234`).
4. Open the PR against `falling-fruit/falling-fruit-web` `main`. 
5. **Green CI is required for merges.** The [`main`](./.github/workflows/main.yml) workflow runs,
   in order: `yarn format:check` → `yarn lint:check` → `yarn knip` → `yarn build`.

Not sure where to start? Ask on Slack or open an issue. Thanks for contributing!
