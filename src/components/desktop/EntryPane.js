import EntryBack from './EntryBack'
import EntryContent from './EntryContent'
import NavPane from './NavPane'

const EntryPane = () => (
  <NavPane nav={<EntryBack />} content={<EntryContent />} />
)

export default EntryPane
