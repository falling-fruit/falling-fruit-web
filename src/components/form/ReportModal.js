import { Form, Formik } from 'formik'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import styled from 'styled-components/macro'
import * as Yup from 'yup'

import { addReport } from '../../utils/api'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import { Input, Select, Textarea } from './FormikWrappers'
import { useInvisibleRecaptcha } from './useInvisibleRecaptcha'

const PROBLEM_TYPE_OPTIONS = [
  { label: 'Location is spam', value: 0 },
  { label: 'Location does not exist', value: 1 },
  { label: 'Location is a duplicate', value: 2 },
  { label: 'Inappropriate review photo', value: 3 },
  { label: 'Inappropriate review comment', value: 4 },
  { label: 'Other (explain below)', value: 5 },
]

const StyledModal = styled(Modal)`
  max-width: 800px;

  margin: 15vh auto;
  @media ${({ theme }) => theme.device.mobile} {
    margin: 8vh auto;
  }

  h3 {
    margin-top: 0;
  }
`

const Buttons = styled.div`
  margin-top: 20px;

  @media ${({ theme }) => theme.device.mobile} {
    text-align: center;
  }

  button {
    // Should width be manually adjusted?
    width: 130px;

    @media ${({ theme }) => theme.device.mobile} {
      width: 110px;
    }

    &:not(:last-child) {
      margin-right: 12px;
    }
  }
`

const ReportModal = ({ locationId, name, onDismiss, ...props }) => {
  const isLoggedIn = useSelector((state) => !!state.auth.user)

  const handleSubmit = async (values) => {
    const reportValues = {
      ...values,
      problem_code: values.problem_code.value,
      location_id: locationId,
    }

    let response
    try {
      response = await addReport(reportValues)
      toast.success('Report submitted successfully!')
    } catch (e) {
      toast.error('Report submission failed.')
      console.error(e.response)
    }

    if (response && !response.error) {
      onDismiss()
    }
  }

  const { Recaptcha, handlePresubmit } = useInvisibleRecaptcha(handleSubmit)

  return (
    <StyledModal aria-label="Report dialog" onDismiss={onDismiss} {...props}>
      <h3>Report {name}</h3>

      <Formik
        initialValues={{
          problem_code: null,
          comment: '',
          name: '',
          email: '',
        }}
        validationSchema={Yup.object({
          problem_code: Yup.object().required(),
          comment: Yup.string().when('problem_code', (problem_code, schema) =>
            problem_code?.value === 5 ? schema.required() : schema,
          ),
          email: !isLoggedIn && Yup.string().email().required(),
        })}
        onSubmit={isLoggedIn ? handleSubmit : handlePresubmit}
      >
        {({ dirty, isSubmitting, isValid }) => (
          <Form>
            <Select
              name="problem_code"
              label="Problem Type"
              isSearchable={false}
              options={PROBLEM_TYPE_OPTIONS}
              invalidWhenUntouched
              required
            />
            <Textarea name="comment" label="Description" />
            {!isLoggedIn && (
              <>
                <Input name="name" label="Name" />
                <Input name="email" label="Email" required />
                <Recaptcha />
              </>
            )}
            <Buttons>
              <Button type="button" onClick={onDismiss} secondary>
                Cancel
              </Button>
              <Button
                disabled={!dirty || isSubmitting || !isValid}
                type="submit"
              >
                {isSubmitting ? 'Submitting' : 'Submit'}
              </Button>
            </Buttons>
          </Form>
        )}
      </Formik>
    </StyledModal>
  )
}

export { ReportModal }
