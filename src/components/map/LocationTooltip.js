import { X } from '@styled-icons/boxicons-regular'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

import CloseButton from '../ui/CloseButton'

const TooltipContainer = styled.div`
  position: absolute;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  inset-block-start: -170px;
  inset-inline-start: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  z-index: 4;
  font-size: 16px;

  &::after {
    content: '';
    position: absolute;
    inset-block-end: -10px;
    inset-inline-start: 50%;
    transform: translateX(-50%);
    border-width: 10px 10px 0;
    border-style: solid;
    border-color: ${({ theme }) => theme.background} transparent transparent
      transparent;
  }
`

const TooltipContent = styled.div`
  padding: 8px;
`

const Tooltip = ({ onClose }) => {
  const { t } = useTranslation()
  return (
    <TooltipContainer>
      <CloseButton
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
      >
        <X size={20} />
      </CloseButton>
      <TooltipContent
        dir="auto"
        dangerouslySetInnerHTML={{
          __html: t('locations.index.editmarker_html'),
        }}
      />
    </TooltipContainer>
  )
}

export default Tooltip
