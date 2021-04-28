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
      Settings: 'Settings',
      'Viewing Preferences': 'Viewing Preferences',
      'Show Labels': 'Show Labels',
      'Show Scientific Names': 'Show Scientific Names',
      'Map Preferences': 'Map Preferences',
      'Map View': 'Map View',
      Default: 'Default',
      Satellite: 'Satellite',
      Terrain: 'Terrain',
      'Bicycle Overlay': 'Bicycle Overlay',
      'Transit Overlay': 'Transit Overlay',
      'Language Preferences': 'Language Preferences',
      'Language Preference': 'Language Preference',
      'Data Language': 'Data Language',
      'New Location': 'New Location',
      Types: 'Types',
      Description: 'Description',
      'Property Access': 'Property Access',
      Selection: 'Selection',
      Continue: 'Continue',
      Previous: 'Previous',
      Next: 'Next',
      'Choose a location for your new entry.':
        'Choose a location for your new entry.',
      'Confirm location.': 'Confirm location.',
      REQUIRED: 'REQUIRED',
      OPTIONAL: 'OPTIONAL',
      Seasonality: 'Seasonality',
      January: 'January',
      February: 'February',
      March: 'March',
      April: 'April',
      May: 'May',
      June: 'June',
      July: 'July',
      August: 'August',
      September: 'September',
      October: 'October',
      November: 'November',
      December: 'December',
      'Leave a Review': 'Leave a Review',
      'Lorem ipsum…': 'Lorem ipsum…',
      'Fruiting Status': 'Fruiting Status',
      Quality: 'Quality',
      Yield: 'Yield',
      'Upload Images': 'Upload Images',
      'Take or Upload Photo': 'Take or Upload Photo',
      Step: 'Step',
      'Problem Type': 'Problem Type',
      Email: 'Email',
      'E.g. name@example.com': 'E.g. name@example.com',
      Cancel: 'Cancel',
      'Add a caption…': 'Add a caption…',
      'Search for a location...': 'Search for a location...',
      'Search for a type…': 'Search for a type…',
      'Edible Type': 'Edible Type',
      'Entries of Interest': 'Entries of Interest',
      Invasive: 'Invasive',
      'In Season': 'In Season',
      Photos: 'Photos',
      Logout: 'Logout',
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
