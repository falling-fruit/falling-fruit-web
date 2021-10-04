//import "../../../node_modules/rc-tree/assets/index.css";
import './rc-tree.css'
import './rc-select.css'

import TreeSelect from 'rc-tree-select'

//import { updateSelection } from '../../redux/filterSlice'

const RCTreeSelect = ({
  data,
  onChange,
  //...props
}) => (
  //const { t } = useTranslation()
  <TreeSelect
    onChange={onChange}
    treeData={[data]}
    placeholder={<span>Search for a type...</span>}
    style={{ width: 300 }}
    dropdownStyle={{
      maxHeight: 200,
      overflow: 'auto',
      zIndex: 1500,
    }}
    showSearch
    allowClear
    multiple
    treeCheckable
    treeDefaultExpandAll
  />
)

export default RCTreeSelect
