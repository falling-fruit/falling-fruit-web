import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import styled from 'styled-components/macro'

import { VISIBLE_CLUSTER_ZOOM_LIMIT } from '../../constants/map'
import { useAppHistory } from '../../utils/useAppHistory'
import Filter from '../filter/Filter'
import Search from '../search/Search'
import Button from '../ui/Button'
import { SettingsAccordionButton } from '../ui/SettingsAccordion'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const StyledButton = styled(Button)`
  margin: 10px 10px;
  padding: 15px 0;
  opacity: ${({ greyedOut }) => (greyedOut ? '0.5' : '1')};
  cursor: ${({ greyedOut }) => (greyedOut ? 'help' : 'pointer')};
  // TODO: Siraj add box shadow and extra white border. What's the best way to add another white border? ("raised" prop)
`

const SettingsButton = styled(SettingsAccordionButton).attrs((props) => ({
  ...props,
  forwardedAs: 'button',
}))`
  padding: 5px 0;
  border-top: 1px solid ${({ theme }) => theme.secondaryBackground};
`

const MainPane = () => {
  const { t } = useTranslation()
  const history = useAppHistory()
  const zoom = useSelector((state) => state.map.view?.zoom)
  const isZoomSufficient = zoom >= VISIBLE_CLUSTER_ZOOM_LIMIT

  const handleAddLocation = () => {
    if (isZoomSufficient) {
      history.push({
        pathname: '/locations/new',
        state: { fromPage: '/map' },
      })
    } else {
      toast.info(t('menu.zoom_in_to_add_location'))
    }
  }

  return (
    <Container>
      <Search />
      <Filter isOpen />
      <StyledButton
        secondary
        greyedOut={!isZoomSufficient}
        onClick={handleAddLocation}
      >
        {t('menu.add_location')}
      </StyledButton>
      <SettingsButton
        text={t('settings')}
        onClick={() =>
          history.push({
            pathname: '/settings',
            state: { fromPage: '/map' },
          })
        }
      />
    </Container>
  )
}

export default MainPane
