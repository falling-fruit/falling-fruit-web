import {
  Check,
  ChevronDown,
  ChevronRight,
  X,
} from '@styled-icons/boxicons-regular'
import { Pencil, Trash } from '@styled-icons/boxicons-solid'
import { darken } from 'polished'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'

import {
  fetchLists,
  removeList,
  removeLocationFromList,
  renameList,
} from '../../redux/saveSlice'
import { BackButton } from '../ui/ActionButtons'
import { theme } from '../ui/GlobalStyle'
import Input from '../ui/Input'
import { Page } from '../ui/PageTemplate'

/* ─── Styled components ─────────────────────────────────────────── */

const ListCard = styled.div`
  border: 1px solid #ddd;
  overflow: hidden;
  background-color: #fff;
  opacity: ${({ $isDeleting }) => ($isDeleting ? 0.4 : 1)};
  pointer-events: ${({ $isDeleting }) => ($isDeleting ? 'none' : 'auto')};
  transition: opacity 0.2s ease;
`

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid ${theme.secondaryBackground};
`

const ListName = styled.h2`
  margin: 0;
  font-size: 1.1rem;
  flex: 1;
`

const ExpandRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0.6rem 1.25rem;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  user-select: none;

  &:hover {
    background: ${({ $clickable }) =>
      $clickable ? theme.secondaryBackground : 'transparent'};
  }
`

const LocationCount = styled.span`
  font-size: 0.9rem;
  color: ${theme.secondaryText};
`

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: ${({ color }) => color || theme.secondaryText};
  flex-shrink: 0;

  &:hover {
    background: ${theme.secondaryBackground};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`

const EditRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid #ddd;
`

const EditInput = styled(Input)`
  flex: 1;
  height: 34px;
  font-size: 1rem;
  font-weight: bold;
`

const LocationList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid ${theme.secondaryBackground};
`

const LocationItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1.25rem;
  border-bottom: 1px solid #efefef;
  position: relative;

  &:last-child {
    border-bottom: none;
  }
`

const LocationLink = styled(Link)`
  color: ${({ theme }) => theme.blue} !important;
  text-decoration: none;
  flex: 1;
  font-size: 1rem;

  &:hover {
    text-decoration: underline;
  }
`

const Address = styled.span`
  color: ${theme.secondaryText};
  font-size: 0.85rem;
  margin-left: 0.5rem;
`

const RemoveButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: ${theme.secondaryText};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  transition: color 0.15s ease;
  flex-shrink: 0;
  margin-left: 0.5rem;

  &:hover {
    color: ${darken(0.4, theme.secondaryText)};
  }
`

const ScientificName = styled.span`
  font-style: italic;
`

const CommonName = styled.span`
  font-weight: bold;
`

const SkeletonGroup = styled.div`
  border: 1px solid #ddd;
  background-color: #fff;
  overflow: hidden;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
`

/* ─── Skeleton loader ───────────────────────────────────────────── */

const SavedLocationsSkeletonLoader = ({ count = 3 }) => (
  <div>
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonGroup key={index}>
        <Skeleton width="40%" height={20} style={{ marginBottom: 8 }} />
        <Skeleton width="80%" height={16} style={{ marginBottom: 8 }} />
        <Skeleton width="55%" height={16} />
      </SkeletonGroup>
    ))}
  </div>
)

/* ─── Helpers ───────────────────────────────────────────────────── */

const LocationTypeDisplay = ({ location, typesAccess }) => {
  const typeIds = location.type_ids || []

  if (typeIds.length === 0) {
    return <span>{String(location.id)}</span>
  }

  const typeElements = typeIds.map((typeId, idx) => {
    const type = typesAccess.getType(typeId)
    if (!type) {
      return <span key={idx}>{typeId}</span>
    }
    if (type.commonName) {
      return <CommonName key={idx}>{type.commonName}</CommonName>
    }
    if (type.scientificName) {
      return <ScientificName key={idx}>{type.scientificName}</ScientificName>
    }
    return <span key={idx}>{typeId}</span>
  })

  return (
    <>
      {typeElements.reduce((prev, curr, idx) => {
        if (prev.length) {
          return [...prev, <span key={`sep-${idx}`}>, </span>, curr]
        }
        return [curr]
      }, [])}
    </>
  )
}

const getLocationPlainName = (location, typesAccess) => {
  const names = (location.type_ids || []).map((typeId) => {
    const type = typesAccess.getType(typeId)
    if (!type) {
      return typeId
    }
    return type.commonName || type.scientificName || typeId
  })
  return names.length > 0 ? names.join(', ') : String(location.id)
}

/* ─── LocationRow ───────────────────────────────────────────────── */

const LocationRow = ({ location, listId, typesAccess }) => {
  const [isRemoving, setIsRemoving] = useState(false)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const displayName = getLocationPlainName(location, typesAccess)

  const handleRemove = async () => {
    if (
      window.confirm(
        t('save_location_to_list.remove_from_list_confirm', {
          name: displayName,
        }),
      )
    ) {
      setIsRemoving(true)
      await dispatch(
        removeLocationFromList({ listId, locationId: location.id }),
      )
    }
  }

  return (
    <LocationItem
      style={{
        opacity: isRemoving ? 0.4 : 1,
        pointerEvents: isRemoving ? 'none' : 'auto',
        transition: 'opacity 0.2s ease',
      }}
    >
      <LocationLink to={`/locations/${location.id}`}>
        <LocationTypeDisplay location={location} typesAccess={typesAccess} />
        {location.address && <Address>{location.address}</Address>}
      </LocationLink>

      <RemoveButton
        onClick={handleRemove}
        disabled={isRemoving}
        aria-label={t('form.button.delete')}
        title={t('form.button.delete')}
      >
        <X size={20} />
      </RemoveButton>
    </LocationItem>
  )
}

/* ─── ListCardComponent ─────────────────────────────────────────── */

const ListCardComponent = ({ list }) => {
  const dispatch = useDispatch()
  const [expanded, setExpanded] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(list.name)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isBusy, setIsBusy] = useState(false)
  const inputRef = useRef(null)
  const { t } = useTranslation()

  const { typesAccess } = useSelector((state) => state.type)

  const locations = list.locations || []
  const hasLocations = locations.length > 0

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editing])

  const handleToggleExpand = () => {
    if (!hasLocations) {
      return
    }
    setExpanded((v) => !v)
  }

  const handleEditClick = (e) => {
    e.stopPropagation()
    setEditName(list.name)
    setEditing(true)
  }

  const handleCancelEdit = (e) => {
    e?.stopPropagation()
    setEditing(false)
    setEditName(list.name)
  }

  const handleConfirmEdit = async (e) => {
    e?.stopPropagation()
    const trimmed = editName.trim()
    if (trimmed && trimmed !== list.name) {
      setIsBusy(true)
      await dispatch(renameList({ listId: list.id, newName: trimmed }))
      setIsBusy(false)
    }
    setEditing(false)
  }

  const handleDeleteClick = async (e) => {
    e.stopPropagation()
    if (
      window.confirm(
        t('save_location_to_list.delete_list_confirm', { name: list.name }),
      )
    ) {
      setIsDeleting(true)
      await dispatch(removeList({ listId: list.id }))
    }
  }

  return (
    <ListCard $isDeleting={isDeleting}>
      {/* Row 1: title + edit/delete icons (or edit input) */}
      {editing ? (
        <EditRow>
          <EditInput
            ref={inputRef}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onEnter={handleConfirmEdit}
            disabled={isBusy}
          />
          <IconButton
            onClick={handleCancelEdit}
            color={theme.red}
            title={t('form.button.cancel')}
            disabled={isBusy}
          >
            <X />
          </IconButton>
          <IconButton
            onClick={handleConfirmEdit}
            color={theme.green}
            title={t('form.button.confirm')}
            disabled={isBusy}
          >
            <Check />
          </IconButton>
        </EditRow>
      ) : (
        <TitleRow>
          <ListName>{list.name}</ListName>
          <IconButton onClick={handleEditClick} title={t('form.button.edit')}>
            <Pencil />
          </IconButton>
          <IconButton
            onClick={handleDeleteClick}
            title={t('form.button.delete')}
          >
            <Trash />
          </IconButton>
        </TitleRow>
      )}

      {/* Row 2: chevron + "x locations" expand toggle */}
      <ExpandRow onClick={handleToggleExpand} $clickable={hasLocations}>
        {hasLocations &&
          (expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />)}
        <LocationCount>
          {`${locations.length} ${locations.length === 1 ? t('glossary.locations.one') : t('glossary.locations.other')}`}
        </LocationCount>
      </ExpandRow>

      {/* Expanded location list */}
      {expanded && (
        <LocationList>
          {locations.map((location) => (
            <LocationRow
              key={location.id}
              location={location}
              listId={list.id}
              typesAccess={typesAccess}
            />
          ))}
        </LocationList>
      )}
    </ListCard>
  )
}

/* ─── SavedLocationsPage ────────────────────────────────────────────── */

const SavedLocationsPage = () => {
  const dispatch = useDispatch()
  const { lists, isLoading } = useSelector((state) => state.save)
  const { t } = useTranslation()

  useEffect(() => {
    dispatch(fetchLists())
  }, [dispatch])

  return (
    <Page>
      <BackButton backPath="/account/edit" />
      <h1>{t('save_location_to_list.saved_locations_title')}</h1>

      {isLoading ? (
        <SavedLocationsSkeletonLoader />
      ) : (
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {lists.map((list) => (
            <ListCardComponent key={list.id} list={list} />
          ))}
        </div>
      )}
    </Page>
  )
}

export default SavedLocationsPage
