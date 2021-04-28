import { Plus } from '@styled-icons/boxicons-regular'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

import IconButton from './IconButton'

const AddLocationButton = styled(IconButton).attrs((props) => {
  const { t } = useTranslation()
  return {
    label: t('Add entry'),
    size: 68,
    icon: <Plus />,
    raised: true,
    ...props,
  }
})`
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 1;
`

export default AddLocationButton
