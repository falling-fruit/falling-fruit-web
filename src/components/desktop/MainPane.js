import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'

import PagedList from '../list/PagedList'
import SearchWrapper from '../SearchWrapper'
import Button from '../ui/Button'
import { SettingsAccordionButton } from '../ui/SettingsAccordion'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const StyledButton = styled(Button)`
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.orange};
  margin: 10px 10px;
  padding: 15px 0;
  // TODO: Siraj add box shadow and extra white border. What's the best way to add another white border? ("raised" prop)
`

const SettingsButton = styled(SettingsAccordionButton)`
  padding: 5px 0;
  border-top: 1px solid ${({ theme }) => theme.secondaryBackground};
`

const MainPane = () => {
  const history = useHistory()

  return (
    <Container>
      <SearchWrapper />
      <PagedList />
      <StyledButton
        onClick={() =>
          history.push({
            pathname: '/entry/new',
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
