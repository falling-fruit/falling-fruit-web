import { ErrorMessage, FastField, FieldArray, useFormikContext } from 'formik'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'

import { LANGUAGE_OPTIONS } from '../../i18n'
import { addTypeAndUpdate, closeAddTypeModal } from '../../redux/typeSlice'
import { useIsDesktop } from '../../utils/useBreakpoint'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import { Input, Select, Textarea } from './FormikWrappers'

const ScientificNameInput = ({ index, remove }) => {
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
      <div style={{ flex: 1 }}>
        <Input
          name={`scientific_names.${index}`}
          label="Scientific Name"
          placeholder="Scientific name"
        />
        <ErrorMessage name={`scientific_names.${index}`} />
      </div>
      <div style={{ marginTop: isDesktop ? '0' : '5px' }}>
        <Button type="button" onClick={() => remove(index)} secondary>
          Remove
        </Button>
      </div>
    </div>
  )
}

const ScientificNamesFieldArray = () => (
  <>
    <FieldArray name="scientific_names">
      {({ push, remove, form }) => (
        <>
          {form.values.scientific_names.map((_, index) => (
            <ScientificNameInput key={index} index={index} remove={remove} />
          ))}
          <Button
            type="button"
            onClick={() => push('')}
            style={{ marginBottom: '10px' }}
          >
            Add Scientific Name
          </Button>
        </>
      )}
    </FieldArray>
  </>
)

const LanguageCommonNamePair = ({ index, showRemoveButton, remove }) => {
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
            name={`common_name_pairs.${index}.language`}
            label="Language"
            options={LANGUAGE_OPTIONS}
            isSearchable={false}
            placeholder="Select language"
            required={index === 0}
            toFormikValue={(x) => x.value}
            fromFormikValue={(x) => LANGUAGE_OPTIONS.find((o) => o.value === x)}
          />
          <ErrorMessage name={`common_name_pairs.${index}.language`} />
        </div>
        <div style={{ flex: 1 }}>
          <Input
            name={`common_name_pairs.${index}.name`}
            label="Common Name"
            placeholder="Common name"
            required={index === 0}
          />
          <ErrorMessage name={`common_name_pairs.${index}.name`} />
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

const CommonNamesFieldArray = () => (
  <FieldArray name="common_name_pairs">
    {({ push, remove, form }) => (
      <>
        {form.values.common_name_pairs.map((value, index) => (
          <LanguageCommonNamePair
            key={index}
            index={index}
            showRemoveButton={form.values.common_name_pairs.length > 1}
            remove={remove}
          />
        ))}
        <Button
          type="button"
          onClick={() => push({ language: null, name: '' })}
          style={{ marginBottom: '10px', marginRight: '10px' }}
        >
          Add Common Name
        </Button>
      </>
    )}
  </FieldArray>
)

const ParentTypeSelect = () => {
  const { typesAccess } = useSelector((state) => state.type)

  const typeOptions = useMemo(
    () => typesAccess.onlyAllowedParents().asMenuEntries(),
    [typesAccess],
  )

  return (
    <Select
      name="parent_id"
      label="Parent Type"
      options={typeOptions}
      isClearable
      isVirtualized
      toFormikValue={(x) => x?.value}
      fromFormikValue={(x) => typesAccess.getMenuEntry(x)}
    />
  )
}

const TAXONOMIC_RANK_OPTIONS = [
  { label: 'Polyphyletic', value: 0 },
  { label: 'Kingdom', value: 1 },
  { label: 'Phylum', value: 2 },
  { label: 'Class', value: 3 },
  { label: 'Order', value: 4 },
  { label: 'Family', value: 5 },
  { label: 'Genus', value: 6 },
  { label: 'Multispecies', value: 7 },
  { label: 'Species', value: 8 },
  { label: 'Subspecies', value: 9 },
]
const TaxonomicRankSelect = () => {
  const { values, setFieldValue } = useFormikContext()
  const { typesAccess } = useSelector((state) => state.type)
  let isDisabled, rankOptions
  if (values.parent_id) {
    isDisabled = false
    const parentRank = typesAccess.getType(values.parent_id).taxonomicRank
    if (parentRank === 0) {
      rankOptions = TAXONOMIC_RANK_OPTIONS.filter((o) => o.value === 0)
    } else {
      rankOptions = TAXONOMIC_RANK_OPTIONS.filter((o) => o.value > parentRank)
    }
  } else {
    isDisabled = true
    rankOptions = TAXONOMIC_RANK_OPTIONS
  }

  useEffect(() => {
    if (!values.parent_id) {
      setFieldValue('taxonomic_rank', null)
    }
  }, [values.parent_id, setFieldValue])

  return (
    <Select
      name="taxonomic_rank"
      label="Taxonomic Rank"
      options={rankOptions}
      isSearchable={false}
      isDisabled={isDisabled}
      isClearable
      toFormikValue={(x) => x?.value}
      fromFormikValue={(x) => TAXONOMIC_RANK_OPTIONS.find((o) => o.value === x)}
    />
  )
}
// follows submission schema: https://petstore.swagger.io/?url=https://raw.githubusercontent.com/falling-fruit/api/main/docs/openapi.yml#/Types/post_types
const validationSchema = Yup.object().shape({
  parent_id: Yup.object().nullable(),
  pending: Yup.boolean(),
  scientific_names: Yup.array().of(
    Yup.string().required('Scientific name cannot be empty'),
  ),
  taxonomic_rank: Yup.number().integer().nullable(),
  // transformed on submission into common_names
  common_name_pairs: Yup.array()
    .of(
      Yup.object({
        language: Yup.string().required('Language is required'),
        name: Yup.string().required('Common name is required'),
      }),
    )
    .min(1, 'At least one common name is required'),
  categories: Yup.array().of(Yup.string()),
  notes: Yup.string(),
})

const AddTypeModal = ({ initialCommonName = '' }) => {
  const { i18n } = useTranslation()
  const dispatch = useDispatch()
  const { locationId } = useSelector((state) => state.location)
  const { isAddTypeModalOpen } = useSelector((state) => state.type)

  // Initialize state
  const initialLanguage = LANGUAGE_OPTIONS.find(
    (option) => option.value === i18n.language,
  )

  const initialValues = {
    common_name_pairs: [
      {
        language: initialLanguage.value,
        name: initialCommonName,
      },
    ],
    scientific_names: [],
    parent_id: null,
    taxonomic_rank: null,
    pending: true,
    notes: '',
  }

  const handleSubmit = (values, { setSubmitting }) => {
    const common_names = {}
    values.common_name_pairs.forEach(({ language, name }) => {
      if (!common_names[language]) {
        common_names[language] = []
      }
      common_names[language].push(name)
    })
    const submitData = {
      ...values,
      common_names: common_names,
    }
    delete submitData.common_name_pairs

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
    >
      <h4>Type Names</h4>
      <CommonNamesFieldArray />
      <ScientificNamesFieldArray />

      <h4>Taxonomy</h4>
      <ParentTypeSelect />
      <TaxonomicRankSelect />

      <h4>Additional Information</h4>
      <FastField
        as={Textarea}
        name="notes"
        label="Notes"
        rows={4}
        validateOnChange={false}
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
