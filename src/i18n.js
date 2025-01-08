import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

export const LANGUAGE_CACHE_KEY = 'language'
export const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
]

i18n
  .use(initReactI18next)
  .use(Backend)
  .use(LanguageDetector)
  .init({
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: LANGUAGE_CACHE_KEY,
      caches: false,
    },
    react: {
      useSuspense: true,
    },
    supportedLngs: LANGUAGE_OPTIONS.map((option) => option.value),
    fallbackLng: 'en', // default language if no language is detected by LanguageDetector
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}.json',
    },
  })

export default i18n
