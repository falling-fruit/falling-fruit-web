import styled from 'styled-components/macro'

import SearchWrapper from '../SearchWrapper'

const SearchOverlay = styled(SearchWrapper)`
  & > div:first-child {
    // ComboboxInput
    padding: 10px 10px 0 10px;
  }

  [data-reach-combobox-popover] {
    // TODO: this is tricky, but make highlighting contained within the border radius
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px;
    padding-bottom: 10px;
    // TODO: siraj fix border radius ^ and box shadow here
    box-shadow: 0 8px 4px -4px ${({ theme }) => theme.shadow};
  }
`

export default SearchOverlay
