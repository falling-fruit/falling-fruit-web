import '@fontsource/noto-sans/400.css'
import '@fontsource/noto-sans/400-italic.css'
import '@fontsource/noto-sans/700.css'
import '@fontsource/noto-sans-arabic/400.css'
import '@fontsource/noto-sans-arabic/700.css'
import '@fontsource/noto-sans-hebrew/400.css'
import '@fontsource/noto-sans-hebrew/700.css'
import '@fontsource/noto-sans-sc/400.css'
import '@fontsource/noto-sans-sc/700.css'

import { createGlobalStyle } from 'styled-components'

/**
 * @constant {number}
 * Max width in pixels for which the mobile layout should be displayed
 */
const MOBILE_MAX_WIDTH = 767

const theme = {
  fonts:
    '"Noto Sans", "Noto Sans Arabic", "Noto Sans Hebrew", "Noto Sans SC", sans-serif',
  // text colors
  text: '#9b9b9b',
  secondaryText: '#5a5a5a',
  tertiaryText: '#979797',
  headerText: '#333333',
  // background
  background: '#ffffff',
  secondaryBackground: '#e0e1e2',
  navBackground: '#f2f2f2',
  shadow: 'rgba(0, 0, 0, 0.12)',
  // palette
  orange: '#ffa41b',
  transparentOrange: '#ffedd1',
  transparentBlue: '#d9e6f3',
  transparentPink: '#fbe2fb',
  blue: '#4183c4',
  green: '#73cd7c',
  red: '#ff8188',
  invalid: '#ff2633',
  // tag colors
  tag: {
    access: '#ffa41b',
    verified: '#4183c4',
    unverified: '#ff61ef',
  },
}

// TODO: try to create more functional theme helpers
// and maybe move all the colors into a colors object, and add a getColor theme helper

const validatedColor =
  (validThemeColor = 'secondaryBackground', invalidThemeColor = 'invalid') =>
  ({ $invalid, theme }) =>
    $invalid ? theme[invalidThemeColor] : theme[validThemeColor]

const prepend =
  (prefix = '', value) =>
  ({ $prepend }) =>
    `${prefix}${$prepend ? '-end' : '-start'}${value && `: ${value};`}`

const zIndex = {
  mobileTablist: 1,
  topBar: 11,
  modal: 30,
}

const GlobalStyle = createGlobalStyle`
  :root {
    font-size: 14px;

    --toastify-icon-color-success: ${({ theme }) => theme.green};
    --toastify-font-family: ${({ theme }) => theme.fonts};
    --toastify-text-color-success:  ${({ theme }) => theme.green};
    --toastify-color-progress-success:  ${({ theme }) => theme.green};
    --toastify-color-progress-error: ${({ theme }) => theme.invalid};
    --toastify-text-color-error: ${({ theme }) => theme.invalid};
    --toastify-text-color-light: ${({ theme }) => theme.secondaryText};
  }

  html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: ${({ theme }) => theme.fonts};
    color: ${({ theme }) => theme.text};
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
  }

  #root {
    // We use innerHeight instead of vh here to avoid viewport issues on mobile
    // This gets passed in from App via @reach/window-size
    height: ${({ windowSize }) => windowSize.height}px;
  }

  h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme.headerText};
  }

  h1, h2, h3, h5, h6 {
    font-weight: bold;
  }

  h1 { font-size: 1.625rem; }
  h2 { font-size: 1.375rem; }
  h3 { font-size: 1.125rem; }
  h4 {
    font-weight: normal;
    font-size: 1.125rem;
  }
  h5 { font-size: 0.875rem; }
  h6 {
    font-size: 0.625rem;
    text-transform: uppercase;
  }

  p {
    font-size: 1.125rem;
  }

  p.small {
    font-size: 1rem;
  }

  a {
    text-decoration: underline;
    color: ${({ theme }) => theme.blue};
  }

  [data-reach-dialog-overlay] {
    z-index: ${zIndex.modal};
  }
`

export default GlobalStyle
export { MOBILE_MAX_WIDTH, prepend, theme, validatedColor, zIndex }
