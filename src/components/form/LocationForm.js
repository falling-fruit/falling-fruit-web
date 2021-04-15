import styled from 'styled-components/macro'

import Button from '../ui/Button'
import Label from '../ui/Label'
import { Optional } from '../ui/LabelTag'
import SectionHeading from '../ui/SectionHeading'
import { Step, Stepper } from './FormikStepper'
import { Input, Select, Slider, Textarea } from './FormikWrappers'

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
`

const step1 = (
  <Step label="Step 1">
    <Input name="types" label="Types" required />
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
    <WideButton>Take or Upload Photo</WideButton>
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

export const LocationForm = () => (
  <Stepper
    initialValues={{
      types: [],
      description: '',
      access: null,
      fruiting: 1,
      quality_rating: 2,
      yield_rating: 2,
    }}
  >
    {step1}
    {step2}
    {step3}
  </Stepper>
)
