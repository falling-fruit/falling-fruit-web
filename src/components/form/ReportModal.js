import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'

import { addNewReport } from '../../redux/locationSlice'
import Modal from '../ui/Modal'
import { Input, Recaptcha, Select, Textarea } from './FormikWrappers'
import SetInitialValue from './SetInitialValue'

const ReportModal = ({
  locationId,
  title,
  onDismiss,
  defaultProblemCode,
  defaultComment,
  ...props
}) => {
  const isLoggedIn = useSelector((state) => !!state.auth.user)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const PROBLEM_TYPE_OPTIONS = [
    { label: t('problems.problem_types.0'), value: 0 },
    { label: t('problems.problem_types.1'), value: 1 },
    { label: t('problems.problem_types.2'), value: 2 },
    { label: t('problems.problem_types.3'), value: 3 },
    { label: t('problems.problem_types.4'), value: 4 },
    { label: t('problems.problem_types.5'), value: 5 },
  ]

  const defaultProblemCodeOption =
    defaultProblemCode != null
      ? (PROBLEM_TYPE_OPTIONS.find((o) => o.value === defaultProblemCode) ??
        null)
      : null

  const handleSubmit = async (values) => {
    const reportValues = {
      ...values,
      comment: values.comment === '' ? null : values.comment,
      name: values.name === '' ? null : values.name,
      problem_code: values.problem_code.value,
      location_id: locationId,
    }

    const result = await dispatch(addNewReport(reportValues))

    if (addNewReport.fulfilled.match(result)) {
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
        ...(!isLoggedIn && { 'g-recaptcha-response': '' }),
      }}
      validationSchema={Yup.object({
        problem_code: Yup.object().required(),
        comment: Yup.string().when('problem_code', (problem_code, schema) =>
          problem_code?.value === 5 ? schema.required() : schema.optional(),
        ),
        ...(!isLoggedIn && {
          email: Yup.string().email().required(),
          'g-recaptcha-response': Yup.string().required(),
        }),
      })}
      onSubmit={handleSubmit}
      {...props}
    >
      {defaultProblemCodeOption != null && (
        <SetInitialValue name="problem_code" value={defaultProblemCodeOption} />
      )}
      {defaultComment != null && (
        <SetInitialValue name="comment" value={defaultComment} />
      )}
      <Select
        name="problem_code"
        label={t('problems.problem_type')}
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
          <Recaptcha name="g-recaptcha-response" widthMargin={58} />
        </>
      )}
    </Modal>
  )
}

export { ReportModal }
