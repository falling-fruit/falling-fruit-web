import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body {
    font-family: ${({ theme }) => theme.fonts};
    color: ${({ theme }) => theme.text};
    margin: 0;
    padding: 0;
  }

  h1, h2, h3, h5, h6 {
    font-weight: bold;
  }

  h1 { font-size: 26px; }
  h2 { font-size: 22.75px; }
  h3 { font-size: 18px; }
  h4 { 
    font-weight: normal;
    font-size: 18px;
  }
  h5 { font-size: 14px; }
  h6 { 
    font-size: 10px;
    text-transform: uppercase;
  }

  p {
    font-size: 18px;
  }

  p.small {
    font-size: 16px;
  }

  a {
    text-decoration: underline;
    color: ${({ theme }) => theme.blue};
  }
`

const theme = {
  fonts: '"Lato", sans-serif',
  // text colors
  text: '#9B9B9B',
  secondaryText: '#5A5A5A',
  tertiaryText: '#979797',
  // background
  background: '#FFFFFF',
  secondaryBackground: '#E0E1E2',
  // palette
  orange: '#FFA41B',
  transparentOrange: '#FFEDD1',
  blue: '#4183C4',
  green: '#73CD7C',
}

export default GlobalStyle
export { theme }
