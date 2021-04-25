import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// the translations
const resources = {
  en: {
    translation: {
      'Falling Fruit': 'Falling Fruit',
      'Search for a location': 'Search for a location',
      'Municipal Tree Inventories': 'Municipal Tree Inventories',
      'Invasive Species Only': 'Invasive Species Only',
      Report: 'Report',
      Review: 'Review',
      'Other Resources': 'Other Resources',
      Wikipedia: 'Wikipedia',
      'Last Updated': 'Last Updatd',
      'Back to Results': 'Back to Results',
      Verified: 'Verified',
      Map: 'Map',
      About: 'About',
      Login: 'Login',
      'Private but overhanging': 'Private but overhanging',
      'Public Property': 'Public Property',
      Filter: 'Filter',
    },
  },
  fr: {
    translation: {
      'Welcome to React': 'Bienvenue à React et react-i18next',
    },
  },
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

export default i18n
