import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

import { addReport } from '../../utils/api'
import Modal from '../ui/Modal'
import { Input, Select, Textarea } from './FormikWrappers'

const PROBLEM_TYPE_OPTIONS = [
  { label: 'Location is spam', value: 0 },
  { label: 'Location does not exist', value: 1 },
  { label: 'Location is a duplicate', value: 2 },
  { label: 'Inappropriate review photo', value: 3 },
  { label: 'Inappropriate review comment', value: 4 },
  { label: 'Other (explain below)', value: 5 },
]

const ReportModal = ({ locationId, title, onDismiss, ...props }) => {
  const isLoggedIn = useSelector((state) => !!state.auth.user)
  const { t } = useTranslation()

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
    } catch (error) {
      toast.error(`Report submission failed: ${error.message}`)
    }

    if (response && !response.error) {
      onDismiss()
    }
  }

  return (
    <Modal
      title={title}
      onDismiss={onDismiss}
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
      onSubmit={handleSubmit}
      {...props}
    >
      <Select
        name="problem_code"
        label={t('problems.problem_type')}
        isSearchable={false}
        options={PROBLEM_TYPE_OPTIONS}
        required
      />
      <Textarea
        name="comment"
        label={t('glossary.description')}
        placeholder={t('problems.description_subtext')}
      />
      {!isLoggedIn && (
        <>
          <Input name="name" label={t('glossary.name')} />
          <Input name="email" label={t('glossary.email')} required />
        </>
      )}
    </Modal>
  )
}

export { ReportModal }
