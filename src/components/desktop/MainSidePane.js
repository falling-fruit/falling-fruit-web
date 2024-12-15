import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import styled from 'styled-components/macro'

import { VISIBLE_CLUSTER_ZOOM_LIMIT } from '../../constants/map'
import { useAppHistory } from '../../utils/useAppHistory'
import Search from '../search/Search'
import Button from '../ui/Button'
import FilterWrapper from './FilterWrapper'

const AddLocationButton = styled(Button)`
  margin-left: 0.75em;
  margin-right: 0.75em;
  margin-top: 0;
  margin-bottom: 1em;
  padding-top: 1em;
  padding-bottom: 1em;
  padding-left: 0;
  padding-right: 0;
  opacity: ${({ greyedOut }) => (greyedOut ? '0.5' : '1')};
  cursor: ${({ greyedOut }) => (greyedOut ? 'help' : 'pointer')};
`

const MainPane = () => {
  const { t } = useTranslation()
  const history = useAppHistory()
  const { googleMap } = useSelector((state) => state.map)
  const isZoomSufficient =
    !googleMap || googleMap.getZoom() >= VISIBLE_CLUSTER_ZOOM_LIMIT

  const handleAddLocation = () => {
    if (isZoomSufficient) {
      history.push('/locations/new')
    } else {
      toast.info(t('menu.zoom_in_to_add_location'))
    }
  }

  return (
    <>
      <Search />
      <FilterWrapper />
      <AddLocationButton
        greyedOut={!isZoomSufficient}
        onClick={handleAddLocation}
      >
        {t('menu.add_location')}
      </AddLocationButton>
    </>
  )
}

export default MainPane
