import { CupertinoPane } from 'cupertino-pane'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'

const MainContainer = styled.div`
  position: absolute;
  height: 100%;
  overflow: hidden;
  width: 100%;
  bottom: 80px;
  left: 0;
`

function BottomSheet({ id, children }) {
  const history = useHistory()

  useEffect(() => {
    const drawer = new CupertinoPane(`#${id}`, {
      breaks: {
        top: { enabled: true, height: 500, bounce: true },
        middle: { enabled: true, height: 325 },
      },
      initialBreak: 'middle',
      pushMinHeight: 370,
      fastSwipeClose: true,
      bottomClose: true,
      buttonDestroy: false,
      onDidDismiss: () => history.push('/map'),
    })

    setTimeout(() => drawer.present({ animate: true }), 0)
  }, [id])

  return <div id={id}>{children}</div>
}

export default function Drawer({ children }) {
  return (
    <MainContainer>
      <BottomSheet id={'map-bottom-drawer'}>{children}</BottomSheet>
    </MainContainer>
  )
}
