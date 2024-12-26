import { Check, X } from '@styled-icons/boxicons-regular'
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
  const history = useAppHistory()
  const { form } = useSelector((state) => state.location)

  return (
    <TopBarNav
      left={
        <Instructions>
          {form
            ? 'Edit position for your new location.'
            : 'Choose a position for your new location.'}
        </Instructions>
      }
      rightIcons={
        <>
          <IconButton
            label="Cancel choose location"
            icon={<X />}
            raised
            size={54}
            onClick={() => history.push('/map')}
          />
          <IconButton
            label="Confirm choose location"
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
