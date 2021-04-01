import styled from 'styled-components/macro'

import Search from '../search/Search'

const SearchOverlay = styled(Search)`
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
