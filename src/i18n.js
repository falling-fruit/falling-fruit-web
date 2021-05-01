import i18n from 'i18next'
// import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

// the translations

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(Backend)
  .init({
    backend: {
      // for all available options read the backend's repository readme file
      loadPath: '/locales/{{lng}}.json',
    },
  })

//how to use language detector and namespaces for this (add init)
export default i18n
