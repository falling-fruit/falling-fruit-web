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

  FieldWithLabel.displayName = `${WrappedField.displayName || WrappedField.name || 'Component'}WithLabel`

  return FieldWithLabel
}

export const withField = (WrappedComponent, type, bypassFormik = false) => {
  const FieldComponent = ({
    invalidWhenUntouched,
    toFormikValue,
    fromFormikValue,
    ...props
  }) => {
    const [field, meta, helpers] = useField({ ...props, type })
    const customProps = bypassFormik
      ? {
          value: fromFormikValue ? fromFormikValue(meta.value) : meta.value,
          onChange: toFormikValue
            ? (v) => helpers.setValue(toFormikValue(v))
            : helpers.setValue,
        }
      : field

    // workaround: error was found to be {} when adding fields to AddTypeModal
    if (JSON.stringify(meta.error) === '{}') {
      meta.error = false
    }

    return (
      <WrappedComponent
        invalid={(invalidWhenUntouched || meta.touched) && meta.error}
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
