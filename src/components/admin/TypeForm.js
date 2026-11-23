import TypeCategories from './TypeCategories'
import TypeEdibility from './TypeEdibility'
import TypeLinks from './TypeLinks'
import TypeNames from './TypeNames'
import TypeNotes from './TypeNotes'
import TypeSettings from './TypeSettings'

const TypeForm = ({ type, save, isSaving, ...settingsProps }) => (
  <>
    <TypeSettings
      {...settingsProps}
      type={type}
      save={save}
      isSaving={isSaving}
    />
    <TypeNames type={type} save={save} isSaving={isSaving} />
    <TypeLinks type={type} save={save} isSaving={isSaving} />
    <TypeEdibility type={type} save={save} isSaving={isSaving} />
    <TypeCategories type={type} save={save} isSaving={isSaving} />
    <TypeNotes type={type} save={save} isSaving={isSaving} />
  </>
)

export default TypeForm
