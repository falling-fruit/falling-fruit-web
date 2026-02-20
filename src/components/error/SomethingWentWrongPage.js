import { useLocation } from 'react-router-dom'

import SomethingWentWrongContent from './SomethingWentWrongContent'

const SomethingWentWrongPage = () => {
  const location = useLocation()

  const errorMessage = location.state?.errorMessage
  const fromPage = location.state?.fromPage || '/'

  return (
    <SomethingWentWrongContent
      errorMessage={errorMessage}
      fromPage={fromPage}
    />
  )
}

export default SomethingWentWrongPage
