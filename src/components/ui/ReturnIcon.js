import {
  ArrowBack,
  RightArrowAlt as ArrowForward,
} from '@styled-icons/boxicons-regular'
import { useTranslation } from 'react-i18next'

const ReturnIcon = (props) => {
  const { i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'

  return isRTL ? <ArrowForward {...props} /> : <ArrowBack {...props} />
}

export default ReturnIcon
