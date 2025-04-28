import styled from 'styled-components/macro'

export default styled.div`
  display: flex;
  font-style: normal;
  font-weight: ${($props) => ($props.bold ? 'bold' : 'normal')};
  align-items: center;

  ${'' /* TODO: Add another wrapper */}
  & + & {
    margin-block-start: 4px !important;
  }

  p {
    margin-block: 0;
    margin-inline: 4px 0;
  }

  svg {
    flex-shrink: 0;
    align-self: center;
  }

  ${($props) =>
    $props.onClick &&
    `
  cursor: pointer;
  `};
`
