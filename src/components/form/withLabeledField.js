import { useField } from 'formik'
import compose from 'ramda/src/compose'

import Label from '../ui/Label'
import LabelTag from '../ui/LabelTag'

export const withLabel = (WrappedField) => ({
  label,
  required,
  optional,
  invalid,
  ...props
}) => {
  const id = props.id || props.name

  const fieldWithLabel = (
    <>
      {label && (
        <Label htmlFor={id} $invalid={invalid}>
          {label}
          {required && <LabelTag $invalid={invalid}>Required</LabelTag>}
          {optional && <LabelTag $invalid={invalid}>Optional</LabelTag>}
        </Label>
      )}
      <WrappedField $invalid={invalid} id={id} {...props} />
    </>
  )

  return fieldWithLabel
}

export const withField = (WrappedComponent, type) => (props) => {
  const [field, meta] = useField({ ...props, type })

  return (
    <WrappedComponent
      invalid={meta.touched && meta.error}
      {...field}
      {...props}
    />
  )
}

export const withLabeledField = compose(withField, withLabel)
