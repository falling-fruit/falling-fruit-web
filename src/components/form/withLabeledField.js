import { useField } from 'formik'
import compose from 'ramda/src/compose'

import Label from '../ui/Label'

export const withLabel = (WrappedField) => ({ label, $invalid, ...props }) => {
  const FieldWithLabel = (
    <>
      {label && (
        <Label htmlFor={props.id || props.name} $invalid={$invalid}>
          {label}
        </Label>
      )}
      <WrappedField $invalid={$invalid} {...props} />
    </>
  )

  return FieldWithLabel
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

export const withLabeledField = compose(withLabel, withField)
