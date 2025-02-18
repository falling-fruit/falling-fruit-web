import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'
import { initReactI18next, useTranslation } from 'react-i18next'

import { Select } from './components/ui/Select'

export const LANGUAGE_CACHE_KEY = 'language'
/*
 *
 *       <option value="ar" <%= (I18n.locale == :ar) ? "selected" : "" %>>ﺎﻠﻋﺮﺒﻳﺓ</option>
      <option value="de" <%= (I18n.locale == :de) ? "selected" : "" %>>Deutsch</option>
      <option value="en" <%= (I18n.locale == :en) ? "selected" : "" %>>English</option>
      <option value="el" <%= (I18n.locale == :el) ? "selected" : "" %>>Ελληνικά</option>
      <option value="es" <%= (I18n.locale == :es) ? "selected" : "" %>>Español</option>
      <option value="fr" <%= (I18n.locale == :fr) ? "selected" : "" %>>Français</option>
      <option value="he" <%= (I18n.locale == :he) ? "selected" : "" %>>עברית</option>
      <option value="it" <%= (I18n.locale == :it) ? "selected" : "" %>>Italiano</option>
      <option value="nl" <%= (I18n.locale == :nl) ? "selected" : "" %>>Nederlands</option>
      <option value="pl" <%= (I18n.locale == :pl) ? "selected" : "" %>>Polski</option>
      <option value="pt-br" <%= (I18n.locale == :"pt-BR") ? "selected" : "" %>>Português</option>
      <option value="vi" <%= (I18n.locale == :"vi") ? "selected" : "" %>>Tiếng Việt</option>
*/
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
  { value: 'vi', label: 'Tiếng Việt' },
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
