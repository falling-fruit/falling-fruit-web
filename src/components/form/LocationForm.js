import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components/macro'

import { getTypes } from '../../utils/api'
import Button from '../ui/Button'
import Label from '../ui/Label'
import { Optional } from '../ui/LabelTag'
import SectionHeading from '../ui/SectionHeading'
import { FormikStepper, Step } from './FormikStepper'
import { FileUpload, Select, Slider, Textarea } from './FormikWrappers'

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
`

export const LocationForm = () => {
  const [typeOptions, setTypeOptions] = useState([])
  const fileUploadRef = useRef()

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

  const step1 = (
    <Step label="Step 1">
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
      <Select name="access" label="Property Access" />
    </Step>
  )

  const step2 = (
    <Step label="Step 2">
      <Label>
        Seasonality
        <Optional />
      </Label>
      <InlineSelects>
        <Select name="season_start" />
        <span>to</span>
        <Select name="season_end" />
      </InlineSelects>

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
    </Step>
  )

  const step3 = (
    <Step label="Step 3">
      <SectionHeading>
        Leave a Review
        <Optional />
      </SectionHeading>
      <Textarea name="comment" placeholder="Lorem ipsum..." />

      <Slider
        name="fruiting"
        label="Fruiting Status"
        labels={['Flowers', 'Unripe fruit', 'Ripe fruit']}
      />
      <Slider
        name="quality_rating"
        label="Quality"
        labels={['Poor', 'Fair', 'Good', 'Very good', 'Excellent']}
      />
      <Slider
        name="yield_rating"
        label="Yield"
        labels={['Poor', 'Fair', 'Good', 'Very good', 'Excellent']}
      />
    </Step>
  )

  return (
    <StyledLocationForm>
      <FormikStepper
        initialValues={{
          types: [],
          description: '',
          access: null,
          fruiting: 1,
          quality_rating: 2,
          yield_rating: 2,
        }}
        onSubmit={() => console.log('submitted')}
      >
        {step1}
        {step2}
        {step3}
      </FormikStepper>
    </StyledLocationForm>
  )
}
