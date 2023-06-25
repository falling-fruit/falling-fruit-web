import './i18n'

import React from 'react'
import ReactDOM from 'react-dom'
import { setLocale } from 'yup'

import App from './App'
import reportWebVitals from './utils/reportWebVitals'

// Translate yup error messages
// https://github.com/jquense/yup#localization-and-i18n
setLocale({
  mixed: {
    oneOf: { key: 'form.error.confirmation' },
    // Use single space to hide message but still invalidate field
    required: ' ',
  },
  string: {
    min: ({ min }) => ({ key: 'form.error.too_short', options: { min } }),
  },
})

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
