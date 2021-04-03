import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body {
    font-family: ${({ theme }) => theme.fonts};
    color: ${({ theme }) => theme.text};
    margin: 0;
    padding: 0;
  }

  #root {
    // We use innerHeight instead of vh here to avoid viewport issues on mobile
    // This gets passed in from App via @reach/window-size
    height: ${({ windowSize }) => windowSize.height}px;
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

/**
 * @constant {number}
 * Max width in pixels for which the mobile layout should be displayed
 */
const MOBILE_MAX_WIDTH = 767

const theme = {
  // media queries for mobile and desktop
  device: {
    mobile: `(max-width: ${MOBILE_MAX_WIDTH}px)`,
    desktop: `(min-width: ${MOBILE_MAX_WIDTH + 1}px)`,
  },
  fonts: '"Lato", sans-serif',
  // text colors
  text: '#9b9b9b',
  secondaryText: '#5a5a5a',
  tertiaryText: '#979797',
  headerText: '#333333',
  // background
  background: '#ffffff',
  secondaryBackground: '#e0e1e2',
  shadow: 'rgba(0, 0, 0, 0.12)',
  // palette
  orange: '#ffa41b',
  transparentOrange: '#ffedd1',
  blue: '#4183c4',
  green: '#73cd7c',
  // tag colors
  tag: {
    access: '#ffa41b',
    verified: '#4183c4',
    unverified: '#ff61ef',
  },
}

export default GlobalStyle
export { MOBILE_MAX_WIDTH, theme }
