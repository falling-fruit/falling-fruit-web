import { Form, Formik } from 'formik'
import styled from 'styled-components/macro'
import * as Yup from 'yup'

import Button from '../ui/Button'
import Modal from '../ui/Modal'
import { Input, Select, Textarea } from './FormikWrappers'

const StyledModal = styled(Modal)`
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

    &:first-child {
      margin-right: 12px;
    }
  }
`

// Flagging is currently not supported in the main API
const PROBLEM_TYPE_OPTIONS = [
  { label: 'Spam', value: 0 },
  { label: 'Does not exist', value: 1 },
  { label: 'Duplicate', value: 2 },
  { label: 'Inappropriate review photo', value: 3 },
  { label: 'Inappropriate review comment', value: 4 },
]

const ReportModal = ({ typeId: _typeId, name, ...props }) => (
  <StyledModal {...props}>
    <h3>Report {name}</h3>

    <Formik
      initialValues={{ problemType: '', description: '', email: '' }}
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
          options={PROBLEM_TYPE_OPTIONS}
        />
        <Textarea name="description" label="Description" />
        <Input name="email" label="Email" optional />
        <Buttons>
          <Button secondary>Cancel</Button>
          <Button type="submit">Submit</Button>
        </Buttons>
      </Form>
    </Formik>
  </StyledModal>
)

export { ReportModal }
