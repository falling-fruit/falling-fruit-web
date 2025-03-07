import { Check, X } from '@styled-icons/boxicons-regular'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import styled from 'styled-components/macro'

import { parseCurrentUrl } from '../../utils/appUrl'
import { useAppHistory } from '../../utils/useAppHistory'
import { theme } from '../ui/GlobalStyle'
import IconButton from '../ui/IconButton'
import TopBarNav from '../ui/TopBarNav'

const Instructions = styled.span`
  margin-left: 15px;
`

const InitLocationNav = () => {
  const { t } = useTranslation()
  const history = useAppHistory()
  const { locations } = useSelector((state) => state.map)
  const { form } = useSelector((state) => state.location)
  const { view } = parseCurrentUrl()

  const isTooCloseToExistingLocation = () => {
    if (!view.center || !locations || locations.length === 0) {
      return false
    }

    return locations.some((location) => {
      const latDiff = Math.abs(location.lat - view.center.lat)
      const lngDiff = Math.abs(location.lng - view.center.lng)
      return latDiff + lngDiff < 1e-5
    })
  }

  const tooClose = isTooCloseToExistingLocation()

  const handleConfirmClick = () => {
    if (tooClose) {
      toast.warning(t('locations.init.position_too_close'))
      return
    }
    history.push('/locations/new')
  }

  return (
    <TopBarNav
      left={
        <Instructions>
          {form
            ? t('locations.init.edit_instructions')
            : t('locations.init.choose_instructions')}
        </Instructions>
      }
      rightIcons={
        <>
          <IconButton
            label={t('locations.init.cancel')}
            icon={<X />}
            raised
            size={54}
            onClick={() => history.push('/map')}
          />
          <IconButton
            label={t('locations.init.confirm')}
            icon={<Check />}
            raised
            size={54}
            color={theme.green}
            onClick={handleConfirmClick}
            style={{
              opacity: tooClose ? 0.5 : 1,
              cursor: tooClose ? 'help' : 'pointer',
            }}
          />
        </>
      }
    />
  )
}

export default InitLocationNav
