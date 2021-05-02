import { Formik } from 'formik'

// TODO: to be used when combining the validation schemas of individual steps
const _mergeSchemas = (...schemas) => {
  const [first, ...rest] = schemas

  const merged = rest.reduce(
    (mergedSchemas, schema) => mergedSchemas.concat(schema),
    first,
  )

  return merged
}

const FormikAllSteps = ({ children, renderButtons, ...props }) => (
  <Formik
    /*validationSchema={mergeSchemas(
            ...steps.map((step) => step.props.validationSchema),
          )}*/
    {...props}
  >
    {({ isSubmitting }) => (
      <>
        {children}
        {renderButtons(isSubmitting)}
      </>
    )}
  </Formik>
)

export default FormikAllSteps
