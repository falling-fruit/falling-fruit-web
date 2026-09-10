import { Check, X } from '@styled-icons/boxicons-regular'
import styled from 'styled-components/macro'

import { theme } from '../ui/GlobalStyle'
import IconButton from '../ui/IconButton'
import TopBarNav from '../ui/TopBarNav'

const Instructions = styled.span`
  margin-inline-start: 15px;
`

const PositionPickerNav = ({
  instructions,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
  tooClose,
}) => (
  <TopBarNav
    left={<Instructions>{instructions}</Instructions>}
    rightIcons={
      <>
        <IconButton
          label={cancelLabel}
          icon={<X />}
          raised
          size={54}
          onClick={onCancel}
        />
        <IconButton
          label={confirmLabel}
          icon={<Check />}
          raised
          size={54}
          color={theme.green}
          onClick={onConfirm}
          style={{
            opacity: tooClose ? 0.5 : 1,
            cursor: tooClose ? 'help' : 'pointer',
          }}
        />
      </>
    }
  />
)

export default PositionPickerNav
