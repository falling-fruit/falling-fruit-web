/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import i18n from 'i18next'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

import { useAppHistory } from '../../utils/useAppHistory'

const ConnectSearchParams = () => {
  const location = useLocation()
  const history = useAppHistory()
  const searchParams = new URLSearchParams(location.search)
  const i18nViz = searchParams.get('i18n_viz')

  useEffect(() => {
    if (i18nViz) {
      const originalT = i18n.t.bind(i18n)
      i18n.t = (key, options) => {
        let translation = originalT(key, options)
        if (
          [
            'type',
            'glossary.address',
            'locations.form.comments_subtext',
          ].includes(key)
        ) {
          return `Localised text, key: ${key}, value: ${translation}`
        }
        if (i18nViz === 'keys') {
          const x = translation
          translation = key
          key = x
        }

        if (key.endsWith('_html')) {
          return `<span style="background-color: gold; cursor: pointer;" title="${key}" onclick="alert('Copied key for HTML element to clipboard: ${key}'); navigator.clipboard.writeText('${key}')">${translation}</span>`
        }
        return (
          <span
            style={{
              backgroundColor: 'yellow',
              position: 'relative',
              cursor: 'pointer',
            }}
            title={key}
            onClick={() => {
              navigator.clipboard.writeText(key)
              toast.info(`Copied to clipboard: ${key}`)
            }}
          >
            {translation}
          </span>
        )
      }
      history.removeParam('i18n_viz')
    }
  }, [i18nViz]) //eslint-disable-line

  return null
}

export default ConnectSearchParams
