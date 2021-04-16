import { useField } from 'formik'
import { forwardRef, useContext, useEffect } from 'react'
import Reaptcha from 'reaptcha'

import MapContext from '../map/MapContext'
import Input from '../ui/Input'
import { Select } from '../ui/Select'
import { Slider } from '../ui/Slider'
import Textarea from '../ui/Textarea'
import { withLabeledField } from './withLabeledField'

const FormikInput = withLabeledField(Input)
const FormikTextarea = withLabeledField(Textarea)
const FormikSlider = withLabeledField(Slider, undefined, true)
const FormikSelect = withLabeledField(Select, undefined, true)

const FormikRecaptcha = ({ name, ...props }) => {
  const [_field, _meta, helpers] = useField(name)

  return <Reaptcha onVerify={helpers.setValue} {...props} />
}

const FormikMapCenter = ({ name }) => {
  const [_field, _meta, { setValue }] = useField(name)
  const {
    view: { center },
  } = useContext(MapContext)

  useEffect(() => setValue({ lat: center.lat, lng: center.lng }), [
    setValue,
    center.lat,
    center.lng,
  ])

  return null
}

const FormikFileUpload = forwardRef(({ name, ...props }, ref) => {
  const [_field, _meta, helpers] = useField(name)

  return (
    <input
      ref={ref}
      name={name}
      type="file"
      onChange={(event) => {
        helpers.setValue(event.currentTarget.files[0])
      }}
      {...props}
    />
  )
})
FormikFileUpload.displayName = 'FormikFileUpload'

export {
  FormikFileUpload as FileUpload,
  FormikInput as Input,
  FormikMapCenter as MapCenter,
  FormikRecaptcha as Recaptcha,
  FormikSelect as Select,
  FormikSlider as Slider,
  FormikTextarea as Textarea,
}
