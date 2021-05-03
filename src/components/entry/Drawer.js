import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'

import CupertinoPane from '../ui/CupertinoPane'

const Container = styled.div`
  position: absolute;
  height: 100%;
  overflow: hidden;
  width: 100%;
  bottom: 80px;
  left: 0;
`

export default function Drawer({ children }) {
  const history = useHistory()
  return (
    <Container>
      <CupertinoPane
        id="map-entry-bottom-drawer"
        config={{
          breaks: {
            top: { enabled: true, height: 500, bounce: true },
            middle: { enabled: true, height: 325 },
          },
          initialBreak: 'middle',
          pushMinHeight: 370,
          bottomClose: true,
          buttonDestroy: false,
          onDidDismiss: () => history.push('/map'),
        }}
      >
        {children}
      </CupertinoPane>
    </Container>
  )
}
