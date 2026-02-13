import { useField } from 'formik'
import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import Reaptcha from 'reaptcha'

import { useIsMobile } from '../../utils/useBreakpoint'
import { PhotoUploader } from '../photo/PhotoUploader'
import Checkbox from '../ui/Checkbox'
import DateInput from '../ui/DateInput'
import Input from '../ui/Input'
import { CreatableMultiSelect } from '../ui/MultiSelect'
import PasswordInput from '../ui/PasswordInput'
import RatingInput from '../ui/RatingInput'
import Select from '../ui/SingleSelect'
import Textarea from '../ui/Textarea'
import { withLabeledField } from './withLabeledField'

const FormikDateInputInner = ({ $invalid: _$invalid, name, ...props }) => {
  const [field, _meta, helpers] = useField(name)

  return (
    <DateInput
      value={field.value}
      onChange={field.onChange}
      name={name}
      onClear={() => helpers.setValue('')}
      {...props}
    />
  )
}

const FormikInput = withLabeledField(Input)
const FormikPasswordInput = withLabeledField(PasswordInput)
const FormikTextarea = withLabeledField(Textarea)
const FormikDateInput = withLabeledField(FormikDateInputInner)
const FormikSelect = withLabeledField(Select, undefined, true)
const FormikCreatableMultiSelect = withLabeledField(
  CreatableMultiSelect,
  undefined,
  true,
)
const FormikPhotoUploader = withLabeledField(PhotoUploader, undefined, true)

const FormikRecaptcha = forwardRef(
  ({ name, isResponsive = true, size, ...props }, ref) => {
    const [, , helpers] = useField(name)
    const isMobile = useIsMobile()
    const { i18n } = useTranslation()

    return (
      <Reaptcha
        ref={ref}
        sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
        onVerify={helpers.setValue}
        onExpire={() => helpers.setValue(null)}
        size={isResponsive && isMobile ? 'compact' : size}
        hl={i18n.language}
        {...props}
      />
    )
  },
)
FormikRecaptcha.displayName = 'FormikRecaptcha'

const FormikRatingInput = ({ name, ...props }) => {
  const [{ value }] = useField(name)
  return <RatingInput name={name} score={value} {...props} />
}

const FormikCheckbox = ({ id, ...props }) => {
  const [{ value }, , helpers] = useField(id)
  return (
    <Checkbox
      onClick={(e) => helpers.setValue(e.target.checked)}
      id={id}
      checked={value ?? false}
      {...props}
    />
  )
}

export {
  FormikCheckbox as Checkbox,
  FormikCreatableMultiSelect as CreatableMultiSelect,
  FormikDateInput as DateInput,
  FormikInput as Input,
  FormikPasswordInput as PasswordInput,
  FormikPhotoUploader as PhotoUploader,
  FormikRatingInput as RatingInput,
  FormikRecaptcha as Recaptcha,
  FormikSelect as Select,
  FormikTextarea as Textarea,
}
