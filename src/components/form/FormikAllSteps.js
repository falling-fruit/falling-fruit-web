import { Form, Formik } from 'formik'

// TODO: to be used when combining the validation schemas of individual steps
const mergeSchemas = (...schemas) => {
  const [first, ...rest] = schemas.filter((schema) => schema != null)

  const merged = rest.reduce(
    (mergedSchemas, schema) => mergedSchemas.concat(schema),
    first,
  )

  return merged
}

const FormikAllSteps = ({ children, renderButtons, ...props }) => (
  <Formik
    validationSchema={mergeSchemas(
      ...children.map((step) => step.props.validationSchema),
    )}
    {...props}
  >
    {({ isSubmitting }) => (
      <Form>
        {children}
        {renderButtons(isSubmitting)}
      </Form>
    )}
  </Formik>
)

export default FormikAllSteps
