// @googlemaps/js-api-loader requires the loader options to be identical
// We consolidate the loader options here so there's no conflict between
// @googlemaps/react-wrapper (for search) and google-map-react

export const bootstrapURLKeys = {
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  version: 'beta',
  libraries: ['places'],
}
