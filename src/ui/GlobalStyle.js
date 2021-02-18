import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Lato', sans-serif;
  }
`

const theme = {
  textColor: '#9B9B9B',
}

export default GlobalStyle
export { theme }
