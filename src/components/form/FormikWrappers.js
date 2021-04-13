import Input from '../ui/Input'
import { SelectWrapper } from '../ui/Select'
import { Slider } from '../ui/Slider'
import Textarea from '../ui/Textarea'
import { withLabeledField } from './withLabeledField'

const FormikInput = withLabeledField(Input)
const FormikTextarea = withLabeledField(Textarea)
const FormikSlider = withLabeledField(Slider, undefined, true)
const FormikSelect = withLabeledField(SelectWrapper, undefined, true)

export {
  FormikInput as Input,
  FormikSelect as Select,
  FormikSlider as Slider,
  FormikTextarea as Textarea,
}
