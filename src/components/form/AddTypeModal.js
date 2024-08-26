import { ErrorMessage, FieldArray } from 'formik'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'

import { LANGUAGE_OPTIONS } from '../../i18n'
import { addTypeAndUpdate, closeAddTypeModal } from '../../redux/typeSlice'
import { useIsDesktop } from '../../utils/useBreakpoint'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import { Input, Select, Textarea } from './FormikWrappers'

const SCIENTIFIC_LANGUAGE_OPTION = {
  value: 'scientific',
  label: 'Latin/Scientific',
}
const languageOptionsDropdown = [
  SCIENTIFIC_LANGUAGE_OPTION,
  ...LANGUAGE_OPTIONS,
]
const LanguageNamePair = ({ index, showRemoveButton, remove }) => {
  const isDesktop = useIsDesktop()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isDesktop ? 'row' : 'column',
        gap: '10px',
        marginBottom: '10px',
        alignItems: isDesktop ? 'flex-end' : 'stretch',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: isDesktop ? 'row' : 'column',
          gap: '10px',
          flex: 1,
        }}
      >
        <div style={{ width: isDesktop ? '200px' : '100%' }}>
          <Select
            name={`name_pairs.${index}.language`}
            label="Language"
            options={languageOptionsDropdown}
            isSearchable={false}
            placeholder="Select language"
            required={index === 0}
            toFormikValue={(x) => x.value}
            fromFormikValue={(x) =>
              languageOptionsDropdown.find((o) => o.value === x)
            }
          />
          <ErrorMessage name={`name_pairs.${index}.language`} />
        </div>
        <div style={{ flex: 1 }}>
          <Input
            name={`name_pairs.${index}.name`}
            label="Name"
            placeholder="name"
            required={index === 0}
          />
          <ErrorMessage name={`name_pairs.${index}.name`} />
        </div>
      </div>
      {showRemoveButton && index !== 0 && (
        <div>
          <Button type="button" onClick={() => remove(index)} secondary>
            Remove
          </Button>
        </div>
      )}
    </div>
  )
}

const NamesFieldArray = () => (
  <FieldArray name="name_pairs">
    {({ push, remove, form }) => (
      <>
        {form.values.name_pairs.map((value, index) => (
          <LanguageNamePair
            key={index}
            index={index}
            showRemoveButton={form.values.name_pairs.length > 1}
            remove={remove}
          />
        ))}
        <Button
          type="button"
          onClick={() => push({ language: null, name: '' })}
          style={{ marginBottom: '10px', marginRight: '10px' }}
        >
          Add Name
        </Button>
      </>
    )}
  </FieldArray>
)

// follows submission schema: https://petstore.swagger.io/?url=https://raw.githubusercontent.com/falling-fruit/api/main/docs/openapi.yml#/Types/post_types
const validationSchema = Yup.object().shape({
  parent_id: Yup.object().nullable(),
  pending: Yup.boolean(),
  taxonomic_rank: Yup.number().integer().nullable(),
  name_pairs: Yup.array()
    .of(
      Yup.object({
        language: Yup.string().required('Language is required'),
        name: Yup.string().required('Name is required'),
      }),
    )
    .min(1, 'At least one name is required'),
  categories: Yup.array().of(Yup.string()),
  notes: Yup.string(),
})

const AddTypeModal = ({ initialName }) => {
  const { i18n } = useTranslation()
  const dispatch = useDispatch()
  const { locationId } = useSelector((state) => state.location)
  const { isAddTypeModalOpen } = useSelector((state) => state.type)

  // Initialize state
  const initialLanguage = LANGUAGE_OPTIONS.find(
    (option) => option.value === i18n.language,
  )

  const initialValues = {
    name_pairs: [
      {
        language: initialLanguage.value,
        name: initialName,
      },
    ],
    parent_id: null,
    taxonomic_rank: null,
    pending: true,
    notes: '',
  }

  const handleSubmit = (values, { setSubmitting }) => {
    const common_names = {}
    const scientific_names = []
    values.name_pairs.forEach(({ language, name }) => {
      if (language === SCIENTIFIC_LANGUAGE_OPTION.value) {
        scientific_names.push(name)
      } else {
        if (!common_names[language]) {
          common_names[language] = []
        }
        common_names[language].push(name)
      }
    })
    const submitData = {
      ...values,
      common_names: common_names,
      scientific_names: scientific_names,
    }
    delete submitData.name_pairs

    dispatch(
      addTypeAndUpdate({
        submitData,
        language: i18n.language,
        locationId,
      }),
    )
    setSubmitting(false)
  }

  if (!isAddTypeModalOpen) {
    return null
  }

  return (
    <Modal
      title="Add New Type"
      onDismiss={() => dispatch(closeAddTypeModal())}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      initialDirty={!!initialName}
    >
      <NamesFieldArray />

      <Textarea
        placeholder="Description, Wikipedia link, taxonomic information ..."
        name="notes"
        label="Notes"
        rows={4}
      />
      <div>
        <p style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>
          Note: All new types are set to pending by default. Only administrators
          can add non-pending types.
        </p>
      </div>
    </Modal>
  )
}

export { AddTypeModal }
