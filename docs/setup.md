# Setup

To run locally:

1. Clone the repo: `git clone https://github.com/falling-fruit/falling-fruit-web`

2. Setup environment variables: `cp example.env .env`, then edit and fill in `.env`.

   - `API_URL`: URL for [falling-fruit-api](https://github.com/falling-fruit/falling-fruit-api). Use https://fallingfruit.org/api/0.3 for the production API or http://localhost:3300/api/0.3 (by default) if running locally.

   - `API_KEY`: API key for [falling-fruit-api](https://github.com/falling-fruit/falling-fruit-api). Use `AKDJGHSD` for the production API or any value in column `api_keys.api_key` if running [falling-fruit](https://github.com/falling-fruit/falling-fruit) locally (see [database seeds](https://github.com/falling-fruit/falling-fruit/blob/main/db/seeds.rb)).

   - `RECAPTCHA_SITE_KEY`: Site key for [reCAPTCHA v3](https://developers.google.com/recaptcha/intro). Use `6Ld99kUdAAAAAAB5nCofKrQB6Vp-e5wR42u5TNZZ` for the production API or the site key matching the secret key if running [falling-fruit-api](https://github.com/falling-fruit/falling-fruit-api) locally. reCAPTCHA is only required for adding and editing content as an anonymous (unauthenticated) user.

   - `GOOGLE_MAPS_API_KEY`: Your own API key for [Google Maps Platform](https://developers.google.com/maps/documentation/javascript/get-api-key).

3. Install dependencies: `yarn`

4. Run: `yarn start`
