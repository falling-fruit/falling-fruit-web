import styled from 'styled-components/macro'

const IconBesideText = styled.div`
  display: flex;
  flex-wrap: wrap;
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

  svg {
    flex-shrink: 0;
    align-self: flex-start;
    margin-block-start: 2px;
  }

  ${($props) =>
    $props.onClick &&
    `
  cursor: pointer;
  `};
`

export default IconBesideText
