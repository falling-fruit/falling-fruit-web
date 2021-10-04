import { Form, Formik } from 'formik'
import styled from 'styled-components/macro'
import * as Yup from 'yup'

import Button from '../ui/Button'
import Modal from '../ui/Modal'
import { Input, Recaptcha, Select, Textarea } from './FormikWrappers'

// Flagging is currently not supported in the Node API
const PROBLEM_TYPE_OPTIONS = [
  { label: 'Spam', value: 0 },
  { label: 'Does not exist', value: 1 },
  { label: 'Duplicate', value: 2 },
  { label: 'Inappropriate review photo', value: 3 },
  { label: 'Inappropriate review comment', value: 4 },
]

const StyledModal = styled(Modal)`
  margin: 15vh auto;
  h3 {
    margin-top: 0;
  }
`

const Buttons = styled.div`
  text-align: center;
  margin-top: 16px;

  button {
    // Should width be manually adjusted?
    width: 130px;

    &:not(last-child) {
      margin-right: 12px;
    }
  }
`

const ReportModal = ({
  locationId: _locationId,
  name,
  onDismiss,
  ...props
}) => (
  <StyledModal aria-label="Report dialog" onDismiss={onDismiss} {...props}>
    <h3>Report {name}</h3>

    <Formik
      initialValues={{
        problemType: PROBLEM_TYPE_OPTIONS[0],
        description: '',
        email: '',
      }}
      validationSchema={Yup.object({
        problemType: Yup.object().oneOf(PROBLEM_TYPE_OPTIONS).required(),
        description: Yup.string().required(),
        email: Yup.string().email().optional(),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2))
          setSubmitting(false)
        }, 400)
      }}
    >
      <Form>
        <Select
          name="problemType"
          label="Problem Type"
          isSearchable={false}
          options={PROBLEM_TYPE_OPTIONS}
        />
        <Textarea name="description" label="Description" />
        <Input name="email" label="Email" optional />
        <Recaptcha
          name="recaptcha"
          sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
          size="invisible"
        />
        <Buttons>
          <Button type="button" onClick={onDismiss} secondary>
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </Buttons>
      </Form>
    </Formik>
  </StyledModal>
)

export { ReportModal }
