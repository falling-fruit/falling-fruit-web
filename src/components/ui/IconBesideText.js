import styled from 'styled-components/macro'

const IconBesideText = styled.div`
  display: flex;
  font-style: normal;
  font-weight: ${($props) => ($props.bold ? 'bold' : 'normal')};
  align-items: center;

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
  flex-wrap: wrap;
  svg {
    align-self: flex-start;
  }
  `
      : `
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
