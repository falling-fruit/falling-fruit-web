import styled from 'styled-components/macro'

import Button from '../ui/Button'

const FilterButtonsContainer = styled.div`
  Button {
    height: 26px;
    width: 88px;
    padding: 0;

    &:not(:last-child) {
      margin-right: 6px;
    }
  }
`

const FilterButtons = ({ onSelectAllClick, onDeselectAllClick }) => (
  <FilterButtonsContainer>
    <Button secondary onClick={onSelectAllClick}>
      Select All
    </Button>
    <Button secondary onClick={onDeselectAllClick}>
      Deselect All
    </Button>
  </FilterButtonsContainer>
)

export default FilterButtons
