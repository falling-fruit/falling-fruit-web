import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import styled from 'styled-components/macro'

import {
  duplicateIntoNewLocation,
  fetchLocationData,
  initNewLocation,
  setFromSettings,
  setIsBeingEditedAndResetPosition,
  setStreetView,
} from '../../redux/locationSlice'
import { setInitialView } from '../../redux/mapSlice'
import { currentPathWithView, parseCurrentUrl } from '../../utils/appUrl'
import { useAppHistory } from '../../utils/useAppHistory'
import { useIsDesktop } from '../../utils/useBreakpoint'
import Button from '../ui/Button'

const LessPaddingButton = styled(Button)`
  padding: 0 10px;
`

const ToastContent = () => {
  const { t } = useTranslation()
  const history = useAppHistory()
  const dispatch = useDispatch()
  const { view } = parseCurrentUrl()
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        width: '100%',
      }}
    >
      {t('success_message.location_submitted')}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          width: '100%',
          flexWrap: 'wrap',
        }}
      >
        <LessPaddingButton
          type="button"
          onClick={() => {
            dispatch(duplicateIntoNewLocation())
            history.push(`/locations/init`)
          }}
        >
          {t('locations.add_similar')}
        </LessPaddingButton>
        <LessPaddingButton
          type="button"
          secondary
          onClick={() => {
            dispatch(initNewLocation(view.center))
            history.push(`/locations/init`)
          }}
        >
          {t('locations.add_new')}
        </LessPaddingButton>
      </div>
    </div>
  )
}

const ConnectLocation = ({
  locationId,
  isBeingEdited,
  isBeingEditedPosition,
  isStreetView,
  isSuccessfullyAdded,
  isFromListLocations,
}) => {
  const dispatch = useDispatch()
  const { initialView, googleMap } = useSelector((state) => state.map)
  const {
    position,
    location,
    pane: { drawerFullyOpen },
  } = useSelector((state) => state.location)
  const { isOpenInMobileLayout: filterOpen } = useSelector(
    (state) => state.filter,
  )
  const history = useAppHistory()
  const isDesktop = useIsDesktop()
  const [hasCentered, setHasCentered] = useState(false)

  useEffect(() => {
    if (location && `${locationId}` === `${location.id}`) {
      /*
       * We redo this effect each time locationId changes
       * but the component itself could be getting rerendered
       * (e.g. location to settings and back)
       * so if data is present in redux, don't fetch
       * */
      if (isFromListLocations) {
        history.push(`/locations/${locationId}`)
      }
      return
    }
    dispatch(
      fetchLocationData({
        locationId,
        isBeingEdited,
        isStreetView,
        paneDrawerDisabled: isFromListLocations,
      }),
    ).then((action) => {
      if (action.payload && !initialView) {
        const { view: viewUrl } = parseCurrentUrl()
        const view = viewUrl || {
          center: {
            lat: action.payload.lat,
            lng: action.payload.lng,
          },
          zoom: 16,
        }
        dispatch(setInitialView(view))
        // navigate to the page with the new URL
        // to trigger component reload
        const newUrl = currentPathWithView(view)
        history.push(newUrl)
      }

      if (isFromListLocations) {
        history.push(`/locations/${locationId}`)
      }
    })
  }, [dispatch, locationId]) //eslint-disable-line

  useEffect(() => {
    if (location && !initialView) {
      const { view } = parseCurrentUrl()
      if (view) {
        dispatch(setInitialView(view))
      }
    }
  }, [!!location, !!initialView]) //eslint-disable-line

  useEffect(() => {
    dispatch(setIsBeingEditedAndResetPosition(isBeingEdited))
  }, [dispatch, isBeingEdited])

  useEffect(() => {
    dispatch(setStreetView(isStreetView))
  }, [dispatch, isStreetView])

  useEffect(
    () => () => {
      dispatch(setFromSettings(false))
    },
    [dispatch, locationId],
  )

  useEffect(() => {
    if (
      isBeingEdited &&
      isBeingEditedPosition &&
      position &&
      !isDesktop &&
      googleMap &&
      !hasCentered
    ) {
      // On mobile, we need to center the map on the edited location
      // because the UX involves panning the map under a central pin
      googleMap.setCenter(position)
      if (googleMap.getZoom() < 16) {
        googleMap.setZoom(16)
      }
      setHasCentered(true)
    }
  }, [
    isBeingEdited,
    isBeingEditedPosition,
    position,
    isDesktop,
    googleMap,
    hasCentered,
  ])

  useEffect(() => {
    // Reset hasCentered when locationId changes
    setHasCentered(false)
  }, [locationId])

  const initialUIState = !drawerFullyOpen && !filterOpen && !isBeingEdited
  useEffect(() => {
    if (!initialUIState) {
      // Opening drawer or filter dismisses any toasts
      toast.dismiss()
    } else if (isSuccessfullyAdded) {
      toast.success(<ToastContent locationId={locationId} />, {
        autoClose: false,
        style: { width: '100%' },
      })
      /*
       * We don't want to toast again after user presses back in the browser
       * so remove 'success' from URL
       * the effect will re-run, with isSuccessfullyAdded false this time
       */
      history.replace(`/locations/${locationId}`)
    } else {
      /*
       * Closed drawer, but still on location page
       * We're probably here after history.replace happened
       * The user might have closed the toast or be still looking at it
       * Prepare to close after navigating away
       */
      return () => {
        if (window.location.href.indexOf(`/locations/${locationId}`) === -1) {
          toast.dismiss()
        }
      }
    }
  }, [isSuccessfullyAdded, initialUIState, locationId]) //eslint-disable-line

  return null
}

export default ConnectLocation
