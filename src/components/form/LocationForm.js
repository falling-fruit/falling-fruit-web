import LabelTag from '../ui/LabelTag'
import SectionHeading from '../ui/SectionHeading'
import { Step, Stepper } from './FormikStepper'
import { Input, Select, Slider, Textarea } from './FormikWrappers'

const step1 = (
  <Step label="Step 1">
    <Input name="types" label="Types" required />
    <Textarea name="description" label="Description" />
    <Select name="access" label="Property Access" />
  </Step>
)

const step2 = (
  <Step label="Step 2">
    <Input name="types" label="Types" required />
  </Step>
)

const step3 = (
  <Step label="Step 3">
    <SectionHeading>
      Leave a Review <LabelTag>Optional</LabelTag>
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
