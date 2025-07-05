import './i18n'

import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { setLocale } from 'yup'

import App from './components/init/App'
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
    <Suspense fallback="">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
