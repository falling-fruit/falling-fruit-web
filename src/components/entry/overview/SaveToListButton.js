import { Check, Plus, X } from '@styled-icons/boxicons-regular'
import { Bookmark as BookmarkSolid } from '@styled-icons/boxicons-solid'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import {
  addList,
  addLocationToList,
  fetchLists,
  removeLocationFromList,
} from '../../../redux/saveSlice'
import Button from '../../ui/Button'
import { theme } from '../../ui/GlobalStyle'
import Input from '../../ui/Input'
import useSavedLists from './useSavedLists'

const SkeletonItemRow = styled.div`
  padding: 10px 14px;
`
const SkeletonListItems = ({ count = 2 }) => (
  <>
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonItemRow key={index}>
        <Skeleton width="70%" height={16} />
      </SkeletonItemRow>
    ))}
  </>
)
const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`

const Dropdown = styled.div`
  position: absolute;
  bottom: calc(100% + 4px);
  left: 0;
  z-index: 100;
  background: ${theme.background};
  border: 1px solid ${theme.secondaryBackground};
  border-radius: 0.375em;
  box-shadow: 0 4px 12px ${theme.shadow};
  min-width: 200px;
  overflow: hidden;
  font-family: ${theme.fonts};
  display: flex;
  flex-direction: column;
  max-height: ${({ maxHeight }) => (maxHeight ? `${maxHeight}px` : '400px')};
`

const ListScrollArea = styled.div`
  overflow-y: auto;
  flex: 1;
  min-height: 0;
`

const ListItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  background: ${({ checked }) => (checked ? theme.transparentOrange : 'none')};
  border: none;
  border-bottom: 1px solid ${theme.secondaryBackground};
  cursor: ${({ pending }) => (pending ? 'wait' : 'pointer')};
  font-size: 0.875rem;
  font-family: ${theme.fonts};
  font-weight: normal;
  color: ${theme.secondaryText};
  text-align: left;
  box-sizing: border-box;
  opacity: ${({ pending }) => (pending ? 0.5 : 1)};
  transition: opacity 0.15s ease;

  &:hover {
    background: ${({ checked, pending }) =>
      !pending && !checked && theme.transparentBlue};
  }
`

const Divider = styled.hr`
  margin: 0;
  border: none;
  border-top: 1px solid ${theme.secondaryBackground};
`

const AddNewItem = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px 14px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-family: ${theme.fonts};
  font-weight: bold;
  color: ${theme.headerText};
  text-align: center;
  box-sizing: border-box;
  flex-shrink: 0;

  &:hover {
    background: ${theme.transparentBlue};
  }
`

const AddNewRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  box-sizing: border-box;
  flex-shrink: 0;
`

const AddNewInput = styled(Input)`
  flex: 1;
  height: 34px;
  font-size: 0.875rem;
`

const IconActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: ${({ color }) => color || theme.secondaryText};

  &:hover {
    background: ${theme.secondaryBackground};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`

const BottomSection = styled.div`
  flex-shrink: 0;
`

const SaveToListButton = ({ locationId, isSavedToAny, containerRef }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const isLoading = useSelector((state) => state.save.isLoading)
  const isAddingNew = useSelector((state) => state.save.isAddingNew)
  const pendingToggles = useSelector((state) => state.save.pendingToggles)
  const [open, setOpen] = useState(false)
  const [addingNew, setAddingNew] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [dropdownMaxHeight, setDropdownMaxHeight] = useState(null)
  const wrapperRef = useRef(null)
  const newListInputRef = useRef(null)
  const addingNewSkeletonRef = useRef(null)

  const { lists } = useSavedLists(locationId)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
        setAddingNew(false)
        setNewListName('')
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  useEffect(() => {
    if (addingNew && newListInputRef.current) {
      newListInputRef.current.focus()
    }
  }, [addingNew])

  useEffect(() => {
    if (open && wrapperRef.current && containerRef?.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const buttonRect = wrapperRef.current.getBoundingClientRect()
      // Available space = from top of container to top of button, minus a small gap
      const available = buttonRect.top - containerRect.top - 8
      setDropdownMaxHeight(Math.max(available, 120))
    }
  }, [open, containerRef])

  // Scroll the pending skeleton into view when isAddingNew becomes true
  useEffect(() => {
    if (isAddingNew && addingNewSkeletonRef.current) {
      addingNewSkeletonRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [isAddingNew])

  const handleButtonClick = () => {
    if (!open) {
      dispatch(fetchLists())
    }
    setOpen((o) => !o)
  }

  const handleToggle = (listId, checked) => {
    if (listId in pendingToggles) {
      return
    }
    if (checked) {
      dispatch(removeLocationFromList({ listId, locationId }))
    } else {
      dispatch(addLocationToList({ listId, locationId }))
    }
  }

  const handleAddNewClick = () => {
    setAddingNew(true)
    setNewListName('')
  }

  const handleConfirmNewList = () => {
    const trimmed = newListName.trim()
    if (trimmed) {
      dispatch(addList({ name: trimmed }))
    }
    setAddingNew(false)
    setNewListName('')
  }

  const handleCancelNewList = () => {
    setAddingNew(false)
    setNewListName('')
  }

  return (
    <Wrapper ref={wrapperRef}>
      <Button secondary={!isSavedToAny} onClick={handleButtonClick}>
        {isSavedToAny ? (
          <>
            <BookmarkSolid size={18} />
            {t('save_location_to_list.saved_label')}
          </>
        ) : (
          <>
            <Plus size={18} />
            {t('save_location_to_list.save_label')}
          </>
        )}
      </Button>
      {open && (
        <Dropdown maxHeight={dropdownMaxHeight}>
          <ListScrollArea>
            {isLoading ? (
              <SkeletonListItems count={2} />
            ) : (
              <>
                {lists.map(({ listId, name, checked }) => {
                  const isPending = listId in pendingToggles
                  // Show the optimistic (flipped) checked state while pending
                  const effectiveChecked = isPending
                    ? pendingToggles[listId]
                    : checked
                  return (
                    <ListItem
                      key={listId}
                      checked={effectiveChecked}
                      pending={isPending}
                      onClick={() => handleToggle(listId, checked)}
                    >
                      {name}
                    </ListItem>
                  )
                })}
                {isAddingNew && (
                  <div ref={addingNewSkeletonRef}>
                    <SkeletonListItems count={1} />
                  </div>
                )}
              </>
            )}
          </ListScrollArea>
          <BottomSection>
            <Divider />
            {addingNew ? (
              <AddNewRow>
                <AddNewInput
                  ref={newListInputRef}
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder={t('save_location_to_list.new_list_placeholder')}
                  onEnter={handleConfirmNewList}
                />
                <IconActionButton
                  onClick={handleCancelNewList}
                  color={theme.red}
                  title={t('form.button.cancel')}
                >
                  <X />
                </IconActionButton>
                <IconActionButton
                  onClick={handleConfirmNewList}
                  color={theme.green}
                  title={t('form.button.confirm')}
                >
                  <Check />
                </IconActionButton>
              </AddNewRow>
            ) : (
              <AddNewItem onClick={handleAddNewClick}>
                {t('save_location_to_list.add_new_list')}
              </AddNewItem>
            )}
          </BottomSection>
        </Dropdown>
      )}
    </Wrapper>
  )
}

export default SaveToListButton
