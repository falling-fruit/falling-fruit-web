import SettingsPage from '../settings/SettingsPage'
import EntryBack from './EntryBack'
import NavPane from './NavPane'

const SettingsPane = () => (
  <NavPane nav={<EntryBack />} content={<SettingsPage hideTitle />} />
)

export default SettingsPane
