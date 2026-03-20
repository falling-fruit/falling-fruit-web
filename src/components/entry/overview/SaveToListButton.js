import { Check, Plus, X } from '@styled-icons/boxicons-regular'
import { Bookmark as BookmarkSolid } from '@styled-icons/boxicons-solid'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import styled from 'styled-components/macro'

import {
  addList,
  addLocationToList,
  removeLocationFromList,
} from '../../../redux/saveSlice'
import Button from '../../ui/Button'
import { theme } from '../../ui/GlobalStyle'
import Input from '../../ui/Input'
import useSavedLists from './useSavedLists'

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
  cursor: pointer;
  font-size: 0.875rem;
  font-family: ${theme.fonts};
  font-weight: normal;
  color: ${theme.secondaryText};
  text-align: left;
  box-sizing: border-box;

  &:hover {
    background: ${({ checked }) => !checked && theme.transparentBlue};
  }
`

const Divider = styled.hr`
  margin: 0;
  border: none;
  border-top: 1px solid ${theme.secondaryBackground};
`

const AddNewItem = styled(ListItem)`
  justify-content: center;
  color: ${theme.headerText};
  font-weight: bold;
`

const AddNewRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  box-sizing: border-box;
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

const SaveToListButton = ({ locationId }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [addingNew, setAddingNew] = useState(false)
  const [newListName, setNewListName] = useState('')
  const wrapperRef = useRef(null)
  const newListInputRef = useRef(null)

  const { lists, isSavedToAny } = useSavedLists(locationId)

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

  const handleToggle = (listId, checked) => {
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
      <Button secondary={!isSavedToAny} onClick={() => setOpen((o) => !o)}>
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
        <Dropdown>
          {lists.map(({ listId, name, checked }) => (
            <ListItem
              key={listId}
              checked={checked}
              onClick={() => handleToggle(listId, checked)}
            >
              {name}
            </ListItem>
          ))}
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
        </Dropdown>
      )}
    </Wrapper>
  )
}

export default SaveToListButton
