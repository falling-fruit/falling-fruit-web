import { Flag, Star } from '@styled-icons/boxicons-solid'
import { useRouteMatch } from 'react-router-dom'
//import Image from 'react'
import styled from 'styled-components'

import Button from '../ui/Button'
import { Tag } from '../ui/Tag'

const ItalicizedText = styled.p`
  font-size: 14px;
  font-style: italic;
`

const ImageContainer = styled.div`
  height: 279px;
  width: 375px;
`

const ImageDimensions = styled.img`
  height: 100%;
  width: 100%;
`

const EntryDetails = () => {
  const {
    params: { id },
  } = useRouteMatch()

  return (
    <div>
      <ImageContainer>
        <ImageDimensions
          src="https://www.gardenia.net/storage/app/public/uploads/images/detail/643gzxmHGfT9MuRJNRiGTeuIYZYoqvEyUaTEyGJw.jpeg"
          alt="american tulip tree"
        />
      </ImageContainer>

      <div style={{ margin: '23px' }}>
        <>
          <h3>American Tulip Tree</h3>
          <Tag>Invasive</Tag>
          <Tag>Private, But Overhanging</Tag>
        </>

        <>
          <p>
            [1x] Tuliptree (Liriodendron tulipifera) @ 211 E John St (Front).
            Tree Lawn or Parkway.
          </p>
          <ItalicizedText>
            Last Updated June 26, 2019 by Jeffrey Tang
          </ItalicizedText>

          <Button>
            <Star /> Review
          </Button>
          <Button secondary>
            <Flag /> Report
          </Button>
        </>
        <p>EntryDetails for id: {id}</p>
      </div>
    </div>
  )
}

export default EntryDetails
