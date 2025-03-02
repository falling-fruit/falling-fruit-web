import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'
import { initReactI18next, useTranslation } from 'react-i18next'

import { Select } from './components/ui/Select'

const setDocumentDir = (language) => {
  document.dir = ['ar', 'he'].includes(language) ? 'rtl' : 'ltr'
}

export const LANGUAGE_CACHE_KEY = 'language'

export const LANGUAGE_OPTIONS = [
  { value: 'ar', label: 'ﺎﻠﻋﺮﺒﻳﺓ' },
  { value: 'de', label: 'Deutsch' },
  { value: 'en', label: 'English' },
  { value: 'el', label: 'Ελληνικά' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'he', label: 'עברית' },
  { value: 'it', label: 'Italiano' },
  { value: 'nl', label: 'Nederlands' },
  { value: 'pl', label: 'Polski' },
  { value: 'pt-br', label: 'Português' },
  { value: 'sv', label: 'Svenska' },
  { value: 'tr', label: 'Türkçe' },
  { value: 'uk-UA', label: 'Українська' },
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'zh-CN', label: '中文' },
]

const LanguageSelect = () => {
  const { i18n } = useTranslation()
  return (
    <Select
      options={LANGUAGE_OPTIONS}
      value={LANGUAGE_OPTIONS.find((option) => option.value === i18n.language)}
      onChange={(option) => {
        i18n.changeLanguage(option.value, () => {
          localStorage.setItem(LANGUAGE_CACHE_KEY, option.value)
          setDocumentDir(option.value)
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
  .init(
    {
      detection: {
        order: ['localStorage', 'navigator'],
        lookupLocalStorage: LANGUAGE_CACHE_KEY,
        caches: false,
      },
      react: {
        useSuspense: true,
      },
      supportedLngs: LANGUAGE_OPTIONS.map((option) => option.value),
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      backend: {
        loadPath: '/locales/{{lng}}.json',
      },
    },
    () => setDocumentDir(i18n.language),
  )

export { LanguageSelect }
export default i18n
