import styled from 'styled-components/macro'

// photos: [links str]
const PhotoGridTemplate = ({ photos, float }) => {
  const Grid = styled.div`
    @media ${({ theme }) => theme.device.mobile} {
      grid-template-columns: 160px 160px;
      gap: 6px;
      margin-top: 17px;
      margin-bottom: 17px;
    }
    @media ${({ theme }) => theme.device.desktop} {
      margin: 16px;
      gap: 8px;
      grid-template-columns: 156px auto;
    }
    color: ${({ theme }) => theme.secondaryText};
    float: ${float};
    display: grid;
  `

  const Image = styled.img`
    @media ${({ theme }) => theme.device.mobile} {
      width: 160px;
      height: 94px;
    }
    @media ${({ theme }) => theme.device.desktop} {
      width: 156px;
      height: 195px;
    }
    object-fit: cover;
    display: block;
  `

  return (
    <Grid floatdiv={float}>
      {photos.map((photo, index) => (
        <div key={index}>
          <Image alt={photo.alt} src={photo.link} />
        </div>
      ))}
    </Grid>
  )
}

export default PhotoGridTemplate
