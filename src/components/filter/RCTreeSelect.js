//import "../../../node_modules/rc-tree/assets/index.css";
import 'rc-tree/assets/index.css'

import TreeSelect from 'rc-tree-select'

const RCTreeSelect = ({
  data,
  //...props
}) => 
  //const { t } = useTranslation()
   (
    <TreeSelect
      onSelect={(e) => console.log('select -> ', e)}
      treeData={data}
      placeholder={<span>Search for a type...</span>}
      style={{ width: 300 }}
      dropdownStyle={{
        maxHeight: 200,
        overflow: 'auto',
        zIndex: 1500,
      }}
      //showSearch={true}
      allowClear
    />
  )


export default RCTreeSelect
