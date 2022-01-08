import { useField } from 'formik'
import Reaptcha from 'reaptcha'

import { PhotoUploader } from '../photo/PhotoUploader'
import Checkbox from '../ui/Checkbox'
import Input from '../ui/Input'
import RatingInput from '../ui/RatingInput'
import { Select } from '../ui/Select'
import { Slider } from '../ui/Slider'
import Textarea from '../ui/Textarea'
import { withLabeledField } from './withLabeledField'

const DateInput = ({ $invalid: _$invalid, ...props }) => (
  <input type="date" {...props} />
)

const FormikInput = withLabeledField(Input)
const FormikTextarea = withLabeledField(Textarea)
const FormikDateInput = withLabeledField(DateInput)
const FormikSlider = withLabeledField(Slider, undefined, true)
const FormikSelect = withLabeledField(Select, undefined, true)
const FormikPhotoUploader = withLabeledField(PhotoUploader, undefined, true)

const FormikRecaptcha = ({ name, ...props }) => {
  const [, , helpers] = useField(name)

  return (
    <Reaptcha
      sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
      onVerify={helpers.setValue}
      {...props}
    />
  )
}

const FormikRatingInput = ({ name, ...props }) => {
  const [{ value }] = useField(name)
  return <RatingInput name={name} score={value} {...props} />
}

const FormikCheckbox = ({ name, ...props }) => {
  const [{ value }, , helpers] = useField(name)
  return (
    <Checkbox
      onClick={(e) => helpers.setValue(e.target.checked)}
      name={name}
      checked={value}
      {...props}
    />
  )
}

export {
  FormikCheckbox as Checkbox,
  FormikDateInput as DateInput,
  FormikInput as Input,
  FormikPhotoUploader as PhotoUploader,
  FormikRatingInput as RatingInput,
  FormikRecaptcha as Recaptcha,
  FormikSelect as Select,
  FormikSlider as Slider,
  FormikTextarea as Textarea,
}
