import { useFormikContext } from 'formik'
import { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components/macro'

import { getTypes } from '../../utils/api'
import Button from '../ui/Button'
import ImagePreview from '../ui/ImagePreview'
import Label from '../ui/Label'
import { Optional } from '../ui/LabelTag'
import SectionHeading from '../ui/SectionHeading'
import { FormikStepper, Step } from './FormikStepper'
import { FileUpload, Select, Slider, Textarea } from './FormikWrappers'

const PROPERTY_ACCESS_LABELS = [
  'Source is on my property',
  'I have permission from the owner to add the source',
  'Source is on public land',
  'Source is on private property but overhangs public land',
  'Source is on private property (ask before you pick)',
]

// TODO: move this to commmon utils constants
export const MONTH_LABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const labelsToOptions = (labels) =>
  labels.map((label, index) => ({
    label,
    value: index,
  }))

const PROPERTY_ACCESS_OPTIONS = labelsToOptions(PROPERTY_ACCESS_LABELS)

const MONTH_OPTIONS = labelsToOptions(MONTH_LABELS)

const StyledLocationForm = styled.div`
  width: 100%;

  @media ${({ theme }) => theme.device.mobile} {
    margin-top: 87px;
  }
`

const InlineSelects = styled.div`
  display: flex;
  align-items: center;

  span {
    // Text
    margin: 0 10px;
  }

  > div {
    // Select
    flex: 1;
  }
`

const WideButton = styled(Button).attrs({
  secondary: true,
})`
  width: 100%;
  height: 46px;
  border-width: 1px;
  font-weight: normal;

  margin-bottom: 24px;
`

const Step1 = ({ typeOptions }) => (
  <>
    <Select
      name="types"
      label="Types"
      options={typeOptions}
      isMulti
      closeMenuOnSelect={false}
      blurInputOnSelect={false}
      required
    />
    <Textarea name="description" label="Description" />
    <Select
      name="access"
      label="Property Access"
      options={PROPERTY_ACCESS_OPTIONS}
    />
    <Label>
      Seasonality
      <Optional />
    </Label>
    <InlineSelects>
      <Select name="season_start" options={MONTH_OPTIONS} />
      <span>to</span>
      <Select name="season_end" options={MONTH_OPTIONS} />
    </InlineSelects>
  </>
)

const Step2 = () => {
  const fileUploadRef = useRef()
  // TODO: instead of doing this... just wrap both the file upload and the caption inputs in a new Formik field
  const {
    values: { photo },
    setFieldValue,
  } = useFormikContext()

  const captionInput = useMemo(
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
      {captionInput}
    </>
  )
}

const Step3 = () => (
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

export const LocationForm = () => {
  const [typeOptions, setTypeOptions] = useState([])

  useEffect(() => {
    async function fetchTypes() {
      const types = await getTypes()
      const options = types.map((t) => ({
        value: t.id,
        label: t.name,
      }))
      setTypeOptions(options)
    }
    fetchTypes()
  }, [])

  const steps = [
    <Step1 key={1} typeOptions={typeOptions} />,
    <Step2 key={2} />,
    <Step3 key={3} />,
  ]
  const formikSteps = steps.map((step, index) => (
    <Step key={index} label={`Step ${index + 1}`}>
      {step}
    </Step>
  ))

  return (
    <StyledLocationForm>
      <FormikStepper
        initialValues={{
          types: [],
          description: '',
          access: null,
          fruiting: 0,
          quality_rating: 0,
          yield_rating: 0,
        }}
        onSubmit={(values) => console.log('submitted location form', values)}
      >
        {formikSteps}
      </FormikStepper>
    </StyledLocationForm>
  )
}
