import { Pencil } from '@styled-icons/boxicons-solid'
import { MapMarkerAlt as Map } from '@styled-icons/fa-solid'

import { theme } from '../ui/GlobalStyle'
import IconButton from '../ui/IconButton'

const EntryNav = () => {
  const onIconButtonClick = () => {
    console.log('Icon button clicked')
  }

  return (
    <>
      <p>EntryNav</p>
      <IconButton
        size={50}
        raised={false}
        icon={<Pencil size="20" color={theme.secondaryText} />}
        onClick={onIconButtonClick}
        label={'edit-entry-details'}
      />
      <IconButton
        size={50}
        raised={false}
        icon={<Map size="20" color={theme.secondaryText} />}
        onClick={onIconButtonClick}
        label={'map-entry-details'}
      />
    </>
  )
}

export default EntryNav
