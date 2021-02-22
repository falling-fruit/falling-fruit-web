import { Resizable } from 're-resizable'
import styled from 'styled-components'

const ResizablePane = styled(Resizable).attrs(() => ({
  defaultSize: { height: '100%' },
  enable: { right: true }, // enable resizing only to the right
}))`
  position: absolute !important;
  top: 0;
  left: 0;
  z-index: 1;
  background-color: ${({ theme }) => theme.background};
  // TODO: make box-shadows part of theme?
  box-shadow: 2px 0px 8px rgba(0, 0, 0, 0.12);
`

export default ResizablePane
