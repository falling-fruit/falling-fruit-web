import styled from 'styled-components/macro'

const Grid = styled.div`
  color: ${({ theme }) => theme.secondaryText};
  float: float_div;
  display: grid;
  grid-template-columns: auto auto;
  gap: 10px;
  grid-auto-rows: minmax(156px, auto);
`

// photos: [links str]
const PhotoGridTemplate = ({ photos, float }) => (
  <Grid floatdiv={float}>
    {photos.map((photo, index) => (
      <div key={index}>
        <img alt={index} src={photo}></img>
      </div>
    ))}
  </Grid>
)

export default PhotoGridTemplate
