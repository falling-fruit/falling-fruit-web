# Setup

- Clone the repo and change into the new directory.

  ```sh
  git clone https://github.com/falling-fruit/falling-fruit-web
  cd falling-fruit-web
  ```

- Install the [`node`](https://nodejs.org) version specified in the `.nvmrc` file. This is easiest using [`nvm`](https://github.com/nvm-sh/nvm#installing-and-updating).

  ```sh
  # Install node version specified in .nvmrc
  nvm install
  # Use node version specified in .nvmrc
  nvm use
  ```

- Install [`yarn`](https://classic.yarnpkg.com/en/docs/install). This is best done using `npm` (bundled with `node`).

  ```sh
  npm install --global yarn
  ```

- Install dependencies.

  ```sh
  yarn
  ```

- Initialize your private `.env` file.

  ```sh
  cp example.env .env
  ```

- Set environment variables in `.env`.

  - `REACT_APP_API_URL`: URL for [falling-fruit-api](https://github.com/falling-fruit/falling-fruit-api). Use https://fallingfruit.org/api/0.3 for the production API if you only want to make frontend changes, or http://localhost:3300/api/0.3 (by default) if you are contributing to both backend and frontend.

  - `REACT_APP_API_KEY`: API key for [falling-fruit-api](https://github.com/falling-fruit/falling-fruit-api). Use `AKDJGHSD` for the production API or any value in column `api_keys.api_key` if running [falling-fruit](https://github.com/falling-fruit/falling-fruit) locally (see [database seeds](https://github.com/falling-fruit/falling-fruit/blob/main/db/seeds.rb)).

  - `REACT_APP_RECAPTCHA_SITE_KEY`: Site key for [reCAPTCHA v3](https://developers.google.com/recaptcha/intro). Use `6Ld99kUdAAAAAAB5nCofKrQB6Vp-e5wR42u5TNZZ` for the production API or the site key matching the secret key if running [falling-fruit-api](https://github.com/falling-fruit/falling-fruit-api) locally. reCAPTCHA is only required for adding and editing content as an anonymous (unauthenticated) user.

  - `REACT_APP_GOOGLE_MAPS_API_KEY`: Your own API key for [Google Maps Platform](https://developers.google.com/maps/documentation/javascript/get-api-key).

- Start the application.

  ```sh
  yarn start
  ```
