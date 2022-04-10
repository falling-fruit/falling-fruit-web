# Setup

To run locally:

1. Clone the repo: `git clone https://github.com/falling-fruit/falling-fruit-web`

2. Setup environment variables: `cp example.env .env`, then edit and fill in `.env`.

   `REACT_APP_API_KEY`: API key for [Falling Fruit backend](https://github.com/falling-fruit/api)
   `REACT_APP_GOOGLE_MAPS_API_KEY`: API key for [Google Maps](https://developers.google.com/maps/documentation/javascript/get-api-key)
   `REACT_APP_RECAPTCHA_SITE_KEY`: [reCAPTCHA site key](https://developers.google.com/recaptcha/intro). Must match backend. Only used for forms

3. Install dependencies: `yarn`

4. Run: `yarn start`

You can always find the latest deployment of Falling Fruit at [falling-fruit.vercel.app](https://falling-fruit.vercel.app).
