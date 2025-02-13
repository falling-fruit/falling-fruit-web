import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'
import { initReactI18next, useTranslation } from 'react-i18next'

import { Select } from './components/ui/Select'

export const LANGUAGE_CACHE_KEY = 'language'
export const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
]

const LanguageSelect = () => {
  const { i18n } = useTranslation()
  // Style the select component with width: 10em
  return (
    <Select
      options={LANGUAGE_OPTIONS}
      value={LANGUAGE_OPTIONS.find((option) => option.value === i18n.language)}
      onChange={(option) => {
        i18n.changeLanguage(option.value, () => {
          localStorage.setItem(LANGUAGE_CACHE_KEY, option.value)
        })
      }}
      isSearchable={false}
      menuPlacement="top"
    />
  )
}

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

export { LanguageSelect }
export default i18n
