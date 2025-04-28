import { ArrowBack } from '@styled-icons/boxicons-regular'
import { useTranslation } from 'react-i18next'

const ReturnIcon = (props) => {
  const { i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'

  return (
    <ArrowBack
      style={{ transform: `rotate(${isRTL ? 180 : 0}deg)` }}
      {...props}
    />
  )
}

export default ReturnIcon
