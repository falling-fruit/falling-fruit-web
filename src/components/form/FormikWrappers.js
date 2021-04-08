import { useField } from 'formik'

import Input from '../ui/Input'
import { Slider } from '../ui/Slider'
import Textarea from '../ui/Textarea'
import { withLabel, withLabeledField } from './withLabeledField'

const FormikInput = withLabeledField(Input)

const FormikTextarea = withLabeledField(Textarea)

const FormikSlider = (props) => {
  const [_field, meta, helpers] = useField(props)

  const { value, touched, error } = meta
  const { setValue } = helpers

  const LabeledSlider = withLabel(Slider)

  return (
    <LabeledSlider
      $invalid={touched && error}
      value={value}
      onChange={setValue}
      {...props}
    />
  )
}

export {
  FormikInput as Input,
  FormikSlider as Slider,
  FormikTextarea as Textarea,
}
