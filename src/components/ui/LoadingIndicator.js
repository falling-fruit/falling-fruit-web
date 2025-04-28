import { transparentize } from 'polished'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

import Spinner from './Spinner'

const LoadingIndicatorWrapper = styled.div`
  ${(props) => props.cover && `width: 100%; height: 100%;`}

  z-index: 1;
  display: flex;
  flex-direction: ${(props) => (props.vertical ? 'column' : 'row')};
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: ${({ theme }) => theme.secondaryText};

  & > svg {
    ${(props) => !props.vertical && 'margin-inline-end: 5px'};
  }
`
/**
 * LoadingIndicator - animated loading indicator
 *
 * props:
 * - cover {boolean} - covers container with loading state when true
 * - vertical {boolean} - arranged vertically when true
 */
const LoadingIndicator = (props) => {
  const { t } = useTranslation()
  return (
    <LoadingIndicatorWrapper {...props}>
      <Spinner /> {t('layouts.loading')}
    </LoadingIndicatorWrapper>
  )
}

/**
 * LoadingOverlay - masked loading indicator
 */
const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  ${({ children, theme }) =>
    !children &&
    `background-color: ${transparentize(0.6, theme.secondaryBackground)};`}
`

export default LoadingIndicator
export { LoadingOverlay }
