import { Check, X } from '@styled-icons/boxicons-regular'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'

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
  const { form } = useSelector((state) => state.location)

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
            onClick={() => history.push('/locations/new')}
          />
        </>
      }
    />
  )
}

export default InitLocationNav
