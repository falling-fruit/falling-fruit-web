import { Grid, Image } from '../about/PhotoGridUtils'

const PhotoGridTemplate = ({ photos, float }) => (
  <Grid float={float}>
    {photos.map((photo, index) => (
      <div key={index}>
        <Image alt={photo.alt} src={photo.link} />
      </div>
    ))}
  </Grid>
)

export default PhotoGridTemplate
