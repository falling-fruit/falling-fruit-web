import styled from 'styled-components/macro'

// photos: [links str]
const PhotoGridTemplate = ({ photos, float }) => {
  const Grid = styled.div`
    color: ${({ theme }) => theme.secondaryText};
    float: ${float};
    display: grid;
    grid-template-columns: 156px 156px;
    gap: 8px;
    margin: 16px;
  `

  const Image = styled.img`
    object-fit: cover;
    display: block;
    width: 156px;
    height: 195px;
  `

  return (
    <Grid floatdiv={float}>
      {photos.map((photo, index) => (
        <div key={index}>
          <Image alt={index} src={photo} />
        </div>
      ))}
    </Grid>
  )
}

export default PhotoGridTemplate
