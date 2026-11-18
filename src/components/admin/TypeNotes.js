import { Check, X } from '@styled-icons/boxicons-regular'
import { Pencil } from '@styled-icons/boxicons-solid'
import { useState } from 'react'
import styled from 'styled-components/macro'

import { theme } from '../ui/GlobalStyle'
import Textarea from '../ui/Textarea'
import { typeStrings } from './typeStrings'
import { IconButton, Muted, Section, SectionTitle } from './typeStyles'

const NotesText = styled.p`
  margin: 0;
  white-space: pre-wrap;
`

const EditRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5em;
`

const TypeNotes = ({ type, save, isSaving }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState('')

  const startEditing = () => {
    setDraft(type.notes ?? '')
    setIsEditing(true)
  }

  const confirm = async () => {
    const trimmed = draft.trim()
    if (trimmed === (type.notes ?? '')) {
      setIsEditing(false)
      return
    }
    if (await save({ notes: trimmed || null })) {
      setIsEditing(false)
    }
  }

  return (
    <Section>
      <SectionTitle>
        {typeStrings.notes.title}
        {!isEditing && (
          <IconButton
            onClick={startEditing}
            title={typeStrings.notes.edit}
            aria-label={typeStrings.notes.edit}
          >
            <Pencil />
          </IconButton>
        )}
      </SectionTitle>
      {isEditing ? (
        <EditRow>
          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            disabled={isSaving}
          />
          <IconButton
            onClick={() => setIsEditing(false)}
            color={theme.red}
            title={typeStrings.notes.cancel}
            disabled={isSaving}
          >
            <X />
          </IconButton>
          <IconButton
            onClick={confirm}
            color={theme.green}
            title={typeStrings.notes.confirm}
            disabled={isSaving}
          >
            <Check />
          </IconButton>
        </EditRow>
      ) : type.notes ? (
        <NotesText>{type.notes}</NotesText>
      ) : (
        <Muted>{typeStrings.notes.empty}</Muted>
      )}
    </Section>
  )
}

export default TypeNotes
