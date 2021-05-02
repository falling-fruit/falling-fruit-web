import { useFormikContext } from 'formik'
import { useMemo, useRef } from 'react'
import styled from 'styled-components/macro'

import Button from '../ui/Button'
import ImagePreview from '../ui/ImagePreview'
import Label from '../ui/Label'
import { Optional } from '../ui/LabelTag'
import SectionHeading from '../ui/SectionHeading'
import FormikAllSteps from './FormikAllSteps'
import { FileUpload, Slider, Textarea } from './FormikWrappers'

export const INITIAL_REVIEW_VALUES = {
  fruiting: 0,
  quality_rating: 0,
  yield_rating: 0,
}

const WideButton = styled(Button).attrs({
  secondary: true,
})`
  width: 100%;
  height: 46px;
  border-width: 1px;
  font-weight: normal;

  margin-bottom: 24px;
`

export const ReviewStep = () => (
  <>
    <SectionHeading>
      Leave a Review
      <Optional />
    </SectionHeading>
    <Textarea name="comment" placeholder="Lorem ipsum..." />

    <Slider
      name="fruiting"
      label="Fruiting Status"
      labels={['Unsure', 'Flowers', 'Unripe fruit', 'Ripe fruit']}
    />
    <Slider
      name="quality_rating"
      label="Quality"
      labels={['Unsure', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent']}
    />
    <Slider
      name="yield_rating"
      label="Yield"
      labels={['Unsure', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent']}
    />
  </>
)

export const ReviewPhotoStep = () => {
  const fileUploadRef = useRef()
  // TODO: instead of doing this... just wrap both the file upload and the caption inputs in a new Formik field
  const {
    values: { photo },
    setFieldValue,
  } = useFormikContext()

  const imagePreview = useMemo(
    () =>
      photo && (
        <ImagePreview
          onDelete={() => {
            fileUploadRef.current.value = ''
            setFieldValue('photo', null)
          }}
        >
          <img src={URL.createObjectURL(photo)} alt="Upload preview" />
        </ImagePreview>
      ),
    [photo, setFieldValue],
  )

  return (
    <>
      <Label>
        Upload Images
        <Optional />
      </Label>
      <WideButton type="button" onClick={() => fileUploadRef.current.click()}>
        Take or Upload Photo
      </WideButton>
      <FileUpload
        name="photo"
        style={{ display: 'none' }}
        ref={fileUploadRef}
      />
      {imagePreview}
    </>
  )
}

export const ReviewForm = () => {
  const handleSubmit = (values) => console.log('submitted review form', values)

  return (
    <FormikAllSteps
      onSubmit={handleSubmit}
      initialValues={INITIAL_REVIEW_VALUES}
      renderButtons={(isSubmitting) => (
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Publishing' : 'Publish Review'}
        </Button>
      )}
    >
      <ReviewStep />
      <ReviewPhotoStep />
    </FormikAllSteps>
  )
}
