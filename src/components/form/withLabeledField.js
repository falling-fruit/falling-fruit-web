// TODO: Remove below
/* eslint-disable react/display-name */
import { useField } from 'formik'

import Label from '../ui/Label'
import { Optional, Required } from '../ui/LabelTag'

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
          {required && <Required $invalid={invalid} />}
          {optional && <Optional $invalid={invalid} />}
        </Label>
      )}
      <WrappedField $invalid={invalid} id={id || name} name={name} {...props} />
    </>
  )

  return FieldWithLabel
}

export const withField = (WrappedComponent, type, bypassFormik = false) => {
  const FieldComponent = (props) => {
    const [field, meta, helpers] = useField({ ...props, type })
    const customProps = bypassFormik
      ? {
          value: meta.value,
          onChange: helpers.setValue,
          onBlur: helpers.setTouched,
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
  FieldComponent.displayName = `${WrappedComponent.displayName}WithField`

  return FieldComponent
}

export const withLabeledField = (WrappedField, ...args) =>
  withField(withLabel(WrappedField), ...args)
