import { useField } from 'formik'
import compose from 'ramda/src/compose'

import Label from '../ui/Label'

export const withLabel = (WrappedField) => ({ label, $invalid, ...props }) => {
  const id = props.id || props.name

  const fieldWithLabel = (
    <>
      {label && (
        <Label htmlFor={id} $invalid={$invalid}>
          {label}
        </Label>
      )}
      <WrappedField $invalid={$invalid} id={id} {...props} />
    </>
  )

  return fieldWithLabel
}

export const withField = (WrappedComponent, type) => (props) => {
  const [field, meta] = useField({ ...props, type })

  return (
    <WrappedComponent
      $invalid={meta.touched && meta.error}
      {...field}
      {...props}
    />
  )
}

export const withLabeledField = compose(withField, withLabel)
