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
  { value: 'sv', label: 'Svenska' },
  { value: 'tr', label: 'Türkçe' },
  { value: 'uk', label: 'Українська' },
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'zh-hans', label: '简体中文' },
  { value: 'zh-hant', label: '繁体中文' },
]

const LanguageSelect = () => {
  const { t, i18n } = useTranslation()
  const { googleMap } = useSelector((state) => state.map)
  const [hasToasted, setHasToasted] = useState(false)
  return (
    <Select
      options={LANGUAGE_OPTIONS}
      value={LANGUAGE_OPTIONS.find(
        (option) => option.value === i18n.languages[0],
      )}
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
      },
      react: {
        useSuspense: true,
      },
      supportedLngs: LANGUAGE_OPTIONS.map((option) => option.value),
      lowerCaseLng: true,
      fallbackLng: {
        'zh-cn': ['zh-hans', 'en'],
        'zh-my': ['zh-hans', 'en'],
        'zh-sg': ['zh-hans', 'en'],
        'zh-hk': ['zh-hant', 'en'],
        'zh-mo': ['zh-hant', 'en'],
        'zh-tw': ['zh-hant', 'en'],
        default: ['en'],
      },
      interpolation: {
        escapeValue: false,
      },
      backend: {
        loadPath: '/locales/{{lng}}.json',
      },
    },
    () => setDocumentDir(i18n.language),
  )

i18n.on('initialized', () => {
  // HACK: Pass single language to changeLanguage to avoid wrong fallback behavior
  // 'zh-TW' -> ['zh-hant', 'en'] instead of ['zh-TW', ...] -> ['zh-hans', 'en']
  let language = i18n.services.languageDetector.detect()
  if (Array.isArray(language)) {
    language = language[0]
  }
  i18n.changeLanguage(language)
})

export { LanguageSelect }
export default i18n
