import { Cog } from '@styled-icons/boxicons-solid'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'

import PagedList from '../list/PagedList'
import Button from '../ui/Button'
import {
  AccordionItem,
  SettingsAccordion,
  SettingsAccordionButton,
} from '../ui/SettingsAccordion'
import SearchOverlay from './SearchOverlay'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const StyledButton = styled(Button)`
  background-color: white;
  color: ${({ theme }) => theme.orange};
  margin: 10px 10px;
  padding: 15px 0;
`

const StyledSettingsAccordion = styled(SettingsAccordion)`
  padding: 10px 0 10px 0;
  border-top: 1px solid ${({ theme }) => theme.secondaryBackground};
`

const MainPane = () => {
  const history = useHistory()

  return (
    <Container>
      <SearchOverlay />
      <PagedList />
      <StyledButton>Add a Location</StyledButton>
      <StyledSettingsAccordion>
        <AccordionItem>
          <SettingsAccordionButton
            LeftIcon={Cog}
            text="Settings"
            onClick={() =>
              history.push({
                pathname: '/settings',
                state: { fromPage: '/map' },
              })
            }
          />
        </AccordionItem>
      </StyledSettingsAccordion>
    </Container>
  )
}

export default MainPane
