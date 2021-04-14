import { useField } from 'formik'

import Label from '../ui/Label'
import LabelTag from '../ui/LabelTag'

export const withLabel = (WrappedField) => {
  const FieldWithLabel = ({
    label,
    required,
    optional,
    invalid,
    id,
    name,
    ...props
  }) => (
    <>
      {label && (
        <Label htmlFor={id || name} $invalid={invalid}>
          {label}
          {required && <LabelTag $invalid={invalid}>Required</LabelTag>}
          {optional && <LabelTag $invalid={invalid}>Optional</LabelTag>}
        </Label>
      )}
      <WrappedField $invalid={invalid} id={id || name} name={name} {...props} />
    </>
  )

  return FieldWithLabel
}

export const withField = (WrappedComponent, type, bypassFormik = false) => (
  props,
) => {
  const [field, meta, helpers] = useField({ ...props, type })
  const customProps = bypassFormik
    ? {
        value: meta.value,
        onChange: helpers.setValue,
      }
    : field

  return (
    <WrappedComponent
      invalid={meta.touched && meta.error}
      {...customProps}
      {...props}
    />
  )
}

export const withLabeledField = (WrappedField, ...args) =>
  withField(withLabel(WrappedField), ...args)
