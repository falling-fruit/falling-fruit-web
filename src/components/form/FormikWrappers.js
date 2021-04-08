import { useField } from 'formik'

import Input from '../ui/Input'
import { Slider } from '../ui/Slider'
import Textarea from '../ui/Textarea'
import { withLabel, withLabeledField } from './withLabeledField'

const FormikInput = withLabeledField(Input)

const FormikTextarea = withLabeledField(Textarea)

const FormikSlider = ({ name, props }) => {
  const [_field, meta, helpers] = useField(name)

  const { value, touched, error } = meta
  const { setValue } = helpers

  const LabeledSlider = withLabel(
    <Slider value={value} onChange={setValue} {...props} />,
  )

  return <LabeledSlider $invalid={touched && error} />
}

export {
  FormikInput as Input,
  FormikSlider as Slider,
  FormikTextarea as Textarea,
}
