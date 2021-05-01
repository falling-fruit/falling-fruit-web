import EntryDetails from '../entry/EntryDetails'
import EntryBack from './EntryBack'
import NavPane from './NavPane'

const EntryPane = () => (
  <NavPane nav={<EntryBack />} content={<EntryDetails />} />
)

export default EntryPane
