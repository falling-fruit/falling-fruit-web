import ListEntry from '../ui/ListEntry'

const SearchEntry = ({ children }) => {
  const [primaryText, secondaryText] = children

  return <ListEntry primaryText={primaryText} secondaryText={secondaryText} />
}

export default SearchEntry
