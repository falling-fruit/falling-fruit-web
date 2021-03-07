import { Flag, Star } from '@styled-icons/boxicons-solid'
import { useRouteMatch } from 'react-router-dom'
//import Image from 'react'
import styled from 'styled-components'

import Button from '../ui/Button'
import { Tag } from '../ui/Tag'

/*
axios.get('/user', {
    params: {
      ID: 12345
    }
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })
  .then(function () {
    // always executed
  });  
*/

// Just make width 100% and the height will automatically be fit
const ImageContainer = styled.img`
  width: 100%;
`

const TextContainer = styled.div`
  margin: 23px;
`

//I have no clue where the bottom margin was ever set to something other than 0, but it needs
const PlantName = styled.h2`
  margin-bottom: 0px;
  color: #333333;
`

const ScientificName = styled.small`
  font-style: italic;
`

const TagContainer = styled.div`
  margin-top: 12px;
`

/* Row gap nor line-height is working here to make the distance between all elements 14px
const DescriptionContainer = styled.div`
  grid-template-rows: 100%
  row-gap: 14px;
`
*/

const Description = styled.p`
  color: #5a5a5a;
`

const UpdateText = styled.p`
  font-size: 14px;
  font-style: italic;
`

const ButtonSpacing = styled.div`
  button {
    margin-right: 14px;
  }
`

const ResourceHeader = styled.h3`
  color: #333333;
`

const IndividualResourceContainer = styled.small`
  display: flex;
  column-count: 2;
  column-gap: 12px;
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
        <div>
          <PlantName>American Tulip Tree</PlantName>
          <ScientificName>Liriodendron Tulipifera</ScientificName>
          <TagContainer>
            <Tag>Invasive</Tag>
            <Tag>Private, But Overhanging</Tag>
          </TagContainer>
        </div>

        <>
          <Description>
            [1x] Tuliptree (Liriodendron tulipifera) @ 211 E John St (Front).
            Tree Lawn or Parkway.
          </Description>

          <UpdateText>Last Updated June 26, 2019 by Jeffrey Tang</UpdateText>

          <ButtonSpacing>
            <Button icon={<Star />}> Review </Button>
            <Button icon={<Flag />} secondary>
              {' '}
              Report{' '}
            </Button>
          </ButtonSpacing>
        </>

        <>
          <ResourceHeader>Other Resources</ResourceHeader>
          <IndividualResourceContainer>
            <Star height="20px" width="25px" />
            <div>Wikipedia</div>
          </IndividualResourceContainer>
          <IndividualResourceContainer>
            <Flag height="20px" width="25px" />
            <div>Eat the Weeds</div>
          </IndividualResourceContainer>
        </>
        <p>EntryDetails for id: {id}</p>
      </TextContainer>
    </div>
  )
}

export default EntryDetails
