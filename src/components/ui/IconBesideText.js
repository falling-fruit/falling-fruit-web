import styled from 'styled-components/macro'

const IconBesideText = styled.div`
  font-style: normal;
  font-weight: ${($props) => ($props.bold ? 'bold' : 'normal')};

  & + & {
    margin-block-start: 4px !important;
  }

  p {
    margin-block: 0;
    margin-inline: 4px 0;
  }

  ${($props) =>
    $props.wrap
      ? `
  svg {
    vertical-align: middle;
  }
  p {
    display: inline;
  }
  `
      : `
  display: flex;
  align-items: center;
  svg {
    flex-shrink: 0;
    align-self: center;
  }
  `};

  ${($props) =>
    $props.onClick &&
    `
  cursor: pointer;
  `};
`

export default IconBesideText
