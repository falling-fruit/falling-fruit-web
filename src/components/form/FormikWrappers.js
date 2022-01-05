import { useField } from 'formik'

import { PhotoUploader } from '../photo/PhotoUploader'
import Checkbox from '../ui/Checkbox'
import Input from '../ui/Input'
import { Select } from '../ui/Select'
import { Slider } from '../ui/Slider'
import Textarea from '../ui/Textarea'
import { withLabeledField } from './withLabeledField'

const FormikInput = withLabeledField(Input)
const FormikTextarea = withLabeledField(Textarea)
const FormikSlider = withLabeledField(Slider, undefined, true)
const FormikSelect = withLabeledField(Select, undefined, true)
const FormikPhotoUploader = withLabeledField(PhotoUploader, undefined, true)

const FormikCheckbox = ({ name, ...props }) => {
  const [{ value }, , helpers] = useField(name)
  return (
    <Checkbox
      onClick={(e) => helpers.setValue(e.target.checked)}
      checked={value}
      {...props}
    />
  )
}

export {
  FormikCheckbox as Checkbox,
  FormikInput as Input,
  FormikPhotoUploader as PhotoUploader,
  FormikSelect as Select,
  FormikSlider as Slider,
  FormikTextarea as Textarea,
}
