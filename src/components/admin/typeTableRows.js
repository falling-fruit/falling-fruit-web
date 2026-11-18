import { Check, Plus, X } from '@styled-icons/boxicons-regular'
import { Pencil, Trash } from '@styled-icons/boxicons-solid'
import { useState } from 'react'
import styled from 'styled-components/macro'

import { theme } from '../ui/GlobalStyle'
import SingleSelect from '../ui/SingleSelect'
import { typeStrings } from './typeStrings'
import { IconButton } from './typeStyles'
import { useFocusOnMount } from './typeUtils'

const LabelCell = styled.td`
  width: 30%;
  color: ${({ theme }) => theme.secondaryText};
  font-weight: bold;
`

const FocusInput = (props) => {
  const ref = useFocusOnMount()
  return <input ref={ref} {...props} />
}

export const EditableRow = ({
  label,
  value: name,
  canDelete = true,
  isReadOnly = false,
  isSaving,
  renderValue,
  onRename,
  onDelete,
  onAddSame,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(name)

  const confirm = async () => {
    const trimmed = draft.trim()
    if (!trimmed || trimmed === name) {
      setIsEditing(false)
      setDraft(name)
      return
    }
    if (await onRename(trimmed)) {
      setIsEditing(false)
    }
  }

  const cancel = () => {
    setIsEditing(false)
    setDraft(name)
  }

  if (isReadOnly) {
    return (
      <tr>
        <LabelCell>{label}</LabelCell>
        <td>{renderValue ? renderValue(name) : name}</td>
        <td className="actions" />
      </tr>
    )
  }

  return (
    <tr>
      <LabelCell>{label}</LabelCell>
      {isEditing ? (
        <>
          <td>
            <FocusInput
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  confirm()
                } else if (event.key === 'Escape') {
                  cancel()
                }
              }}
              disabled={isSaving}
            />
          </td>
          <td className="actions">
            <div>
              <IconButton
                onClick={cancel}
                color={theme.red}
                title={typeStrings.names.cancel}
                disabled={isSaving}
              >
                <X />
              </IconButton>
              <IconButton
                onClick={confirm}
                color={theme.green}
                title={typeStrings.names.confirm}
                disabled={isSaving}
              >
                <Check />
              </IconButton>
            </div>
          </td>
        </>
      ) : (
        <>
          <td>{renderValue ? renderValue(name) : name}</td>
          <td className="actions">
            <div>
              {onAddSame && (
                <IconButton
                  onClick={onAddSame}
                  title={typeStrings.names.addSame}
                  disabled={isSaving}
                >
                  <Plus />
                </IconButton>
              )}
              <IconButton
                onClick={() => {
                  setDraft(name)
                  setIsEditing(true)
                }}
                title={typeStrings.names.edit}
                disabled={isSaving}
              >
                <Pencil />
              </IconButton>
              <IconButton
                onClick={onDelete}
                title={
                  canDelete
                    ? typeStrings.names.delete
                    : typeStrings.names.lastNameBlocked
                }
                disabled={isSaving || !canDelete}
              >
                <Trash />
              </IconButton>
            </div>
          </td>
        </>
      )}
    </tr>
  )
}

export const AddRow = ({
  options = [],
  fixedKey,
  fixedLabel,
  placeholder,
  isSaving,
  onAdd,
  onCancel,
}) => {
  const [language, setLanguage] = useState(
    fixedKey ??
      (options.find((option) => !option.isDisabled) ?? options[0]).value,
  )
  const [name, setName] = useState('')

  const confirm = async () => {
    const trimmed = name.trim()
    if (language && trimmed) {
      await onAdd(language, trimmed)
    }
  }

  return (
    <tr>
      {fixedKey !== undefined ? (
        <LabelCell>{fixedLabel}</LabelCell>
      ) : (
        <td>
          <SingleSelect
            options={options}
            value={language}
            onChange={(option) => setLanguage(option.value)}
            aria-label={typeStrings.names.chooseLanguage}
          />
        </td>
      )}
      <td>
        <FocusInput
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              confirm()
            } else if (event.key === 'Escape') {
              onCancel()
            }
          }}
          placeholder={placeholder}
          disabled={isSaving}
        />
      </td>
      <td className="actions">
        <div>
          <IconButton
            onClick={onCancel}
            color={theme.red}
            title={typeStrings.names.cancel}
            disabled={isSaving}
          >
            <X />
          </IconButton>
          <IconButton
            onClick={confirm}
            color={theme.green}
            title={typeStrings.names.confirm}
            disabled={isSaving || !name.trim()}
          >
            <Check />
          </IconButton>
        </div>
      </td>
    </tr>
  )
}
