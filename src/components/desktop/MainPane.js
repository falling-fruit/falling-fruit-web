import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'

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
  const history = useHistory()

  return (
    <Container>
      <Search />
      <Filter isOpen />
      <StyledButton
        secondary
        onClick={() =>
          history.push({
            pathname: '/map/entry/new',
            state: { fromPage: '/map' },
          })
        }
      >
        Add a Location
      </StyledButton>
      <SettingsButton
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
