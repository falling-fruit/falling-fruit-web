import styled from 'styled-components/macro'

export default styled.div`
  display: flex;
  font-style: normal;
  font-weight: ${($props) => ($props.bold ? 'bold' : 'normal')};
  align-items: center;

  ${'' /* TODO: Add another wrapper */}
  & + & {
    margin-top: 4px !important;
  }

  p {
    margin: 0 0 0 4px;
  }

  ${($props) =>
    $props.onClick &&
    `
  cursor: pointer;
  `};
`
