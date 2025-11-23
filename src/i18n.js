import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'
import { useState } from 'react'
import { initReactI18next, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

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
  { value: 'pt', label: 'Português' },
  { value: 'ru', label: 'Русский' },
  { value: 'sv', label: 'Svenska' },
  { value: 'tr', label: 'Türkçe' },
  { value: 'uk', label: 'Українська' },
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'zh-hans', label: '简体中文' },
  { value: 'zh-hant', label: '繁体中文' },
]

/**
 * Language used when the requested key is not found in the selected language
 */
const FALLBACK_LANGUAGE = 'en'

/**
 * Language fallbacks that deviate from the i18next default behavior
 * (i.e. strip to base language before mapping with fallbackLng).
 */
const CUSTOM_FALLBACKS = {
  'zh-cn': 'zh-hans',
  'zh-my': 'zh-hans',
  'zh-sg': 'zh-hans',
  'zh-hk': 'zh-hant',
  'zh-mo': 'zh-hant',
  'zh-tw': 'zh-hant',
  // Theoretically not needed for i18next 25.0+ but version throws module parsing error
  'zh-hans-cn': 'zh-hans',
  'zh-hans-my': 'zh-hans',
  'zh-hans-sg': 'zh-hans',
  'zh-hant-hk': 'zh-hant',
  'zh-hant-mo': 'zh-hant',
  'zh-hant-tw': 'zh-hant',
}

const findClosestSupportedLanguage = (locale) => {
  const supportedLanguages = LANGUAGE_OPTIONS.map((option) => option.value)
  const normalizedLocale = locale.toLowerCase()

  if (CUSTOM_FALLBACKS[normalizedLocale]) {
    const fallback = CUSTOM_FALLBACKS[normalizedLocale]
    if (supportedLanguages.includes(fallback)) {
      return fallback
    }
  }

  if (supportedLanguages.includes(normalizedLocale)) {
    return normalizedLocale
  }

  const parentLanguage = normalizedLocale.split('-')[0]
  if (supportedLanguages.includes(parentLanguage)) {
    return parentLanguage
  }

  const matchingVariant = supportedLanguages.find((lang) =>
    lang.startsWith(`${parentLanguage}-`),
  )
  if (matchingVariant) {
    return matchingVariant
  }

  return null
}

const setLanguageFromLocaleString = (locale) => {
  const value = findClosestSupportedLanguage(locale)

  if (value) {
    i18n.changeLanguage(value)
    localStorage.setItem(LANGUAGE_CACHE_KEY, value)
    setDocumentDir(value)
  }
}

const LanguageSelect = () => {
  const { t, i18n } = useTranslation()
  const { googleMap } = useSelector((state) => state.map)
  const [hasToasted, setHasToasted] = useState(false)
  return (
    <Select
      options={LANGUAGE_OPTIONS}
      value={LANGUAGE_OPTIONS.find((option) => option.value === i18n.language)}
      onChange={(option) => {
        i18n.changeLanguage(option.value, () => {
          localStorage.setItem(LANGUAGE_CACHE_KEY, option.value)
          setDocumentDir(option.value)
          if (!hasToasted && googleMap) {
            toast.info(
              t('error_message.language_changed_refresh_to_reload_map'),
            )
            setHasToasted(true)
          }
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
        convertDetectedLanguage: (language) => {
          language = language.toLowerCase()
          return CUSTOM_FALLBACKS[language] || language
        },
      },
      react: {
        useSuspense: true,
      },
      supportedLngs: LANGUAGE_OPTIONS.map((option) => option.value),
      lowerCaseLng: true,
      fallbackLng: FALLBACK_LANGUAGE,
      interpolation: {
        escapeValue: false,
      },
      backend: {
        loadPath: '/locales/{{lng}}.json',
      },
    },
    () => setDocumentDir(i18n.language),
  )

export { LanguageSelect, setLanguageFromLocaleString }
export default i18n
