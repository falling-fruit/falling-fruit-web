import { ChevronLeft, ChevronRight } from '@styled-icons/boxicons-regular'
import { useTranslation } from 'react-i18next'

const ForwardChevronIcon = (props) => {
  const { i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'

  return isRTL ? <ChevronLeft {...props} /> : <ChevronRight {...props} />
}

export default ForwardChevronIcon
