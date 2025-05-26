import Search from '../search/Search'
import { AddLocationDesktop } from '../ui/AddLocation'
import FilterWrapper from './FilterWrapper'

const MainPane = () => (
  <>
    <Search />
    <FilterWrapper />
    <AddLocationDesktop />
  </>
)

export default MainPane
