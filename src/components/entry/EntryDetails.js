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

// Just make width 100% and the height will automatically be fit
const ImageContainer = styled.img`
  width: 100%;
`

const TextContainer = styled.div`
  margin: 23px;
`

const EntryHeader = styled.div`
  line-height: 12px;
`

/* Row gap nor line-height is working here to make the distance between all elements 14px
const DescriptionContainer = styled.div`
  grid-template-rows: 100%
  row-gap: 14px;
`
*/

const ButtonSpacing = styled.div`
  button {
    margin-right: 14px;
  }
`

const EntryDetails = () => {
  const {
    params: { id },
  } = useRouteMatch()

  return (
    <div>
      <ImageContainer
        src="https://www.gardenia.net/storage/app/public/uploads/images/detail/643gzxmHGfT9MuRJNRiGTeuIYZYoqvEyUaTEyGJw.jpeg"
        alt="american tulip tree"
      />

      <TextContainer>
        <EntryHeader>
          <h3>American Tulip Tree</h3>
          <Tag>Invasive</Tag>
          <Tag>Private, But Overhanging</Tag>
        </EntryHeader>

        <>
          <p>
            [1x] Tuliptree (Liriodendron tulipifera) @ 211 E John St (Front).
            Tree Lawn or Parkway.
          </p>

          <ItalicizedText>
            Last Updated June 26, 2019 by Jeffrey Tang
          </ItalicizedText>

          <ButtonSpacing>
            <Button icon={<Star />}> Review </Button>
            <Button icon={<Flag />} secondary>
              {' '}
              Report{' '}
            </Button>
          </ButtonSpacing>
        </>
        <p>EntryDetails for id: {id}</p>
      </TextContainer>
    </div>
  )
}

export default EntryDetails
