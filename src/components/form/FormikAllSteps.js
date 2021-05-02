import { Formik } from 'formik'

import Button from '../ui/Button'
import { ProgressButtons } from './FormikStepper'

// TODO: to be used when combining the validation schemas of individual steps
const _mergeSchemas = (...schemas) => {
  const [first, ...rest] = schemas

  const merged = rest.reduce(
    (mergedSchemas, schema) => mergedSchemas.concat(schema),
    first,
  )

  return merged
}

const FormikAllSteps = ({ children, onCancel, ...props }) => (
  <Formik
    /*validationSchema={mergeSchemas(
            ...steps.map((step) => step.props.validationSchema),
          )}*/
    {...props}
  >
    {({ isSubmitting }) => (
      <>
        {children}

        <ProgressButtons>
          <Button
            secondary
            type="button"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Submitting' : 'Submit'}
          </Button>
        </ProgressButtons>
      </>
    )}
  </Formik>
)

export default FormikAllSteps
