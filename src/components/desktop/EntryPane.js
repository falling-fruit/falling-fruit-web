import EntryOverview from '../entry/EntryOverview'
import EntryBack from './EntryBack'
import NavPane from './NavPane'

const EntryPane = () => (
  <NavPane nav={<EntryBack />} content={<EntryOverview />} />
)

export default EntryPane
