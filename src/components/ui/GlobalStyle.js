import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Lato', sans-serif;
  }
`

const theme = {
  // text colors
  text: '#9B9B9B',
  secondaryText: '#5A5A5A',
  tertiaryText: '#979797',
  // background
  background: '#FFFFFF',
  secondaryBackground: '#E0E1E2',
  // palette
  orange: '#FFA41B',
  blue: '#4183C4',
  green: '#73CD7C',
}

export default GlobalStyle
export { theme }
