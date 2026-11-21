import { Check, X } from '@styled-icons/boxicons-regular'
import { Pencil } from '@styled-icons/boxicons-solid'
import { useState } from 'react'
import styled from 'styled-components/macro'

import { theme } from '../ui/GlobalStyle'
import Textarea from '../ui/Textarea'
import { typeStrings } from './typeStrings'
import { IconButton, Muted, Section, SectionTitle } from './typeStyles'

const EdibilityText = styled.p`
  margin: 0;
  white-space: pre-wrap;
`

const EditRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5em;
`

const TypeEdibility = ({ type, save, isSaving }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState('')

  const startEditing = () => {
    setDraft(type.edibility ?? '')
    setIsEditing(true)
  }

  const confirm = async () => {
    const trimmed = draft.trim()
    if (trimmed === (type.edibility ?? '')) {
      setIsEditing(false)
      return
    }
    if (await save({ edibility: trimmed || null })) {
      setIsEditing(false)
    }
  }

  return (
    <Section>
      <SectionTitle>
        {typeStrings.edibility.title}
        {!isEditing && (
          <IconButton
            onClick={startEditing}
            title={typeStrings.edibility.edit}
            aria-label={typeStrings.edibility.edit}
          >
            <Pencil />
          </IconButton>
        )}
      </SectionTitle>
      {isEditing ? (
        <EditRow>
          <Textarea
            value={draft}
            maxLength={255}
            onChange={(event) => setDraft(event.target.value)}
            disabled={isSaving}
          />
          <IconButton
            onClick={() => setIsEditing(false)}
            color={theme.red}
            title={typeStrings.edibility.cancel}
            disabled={isSaving}
          >
            <X />
          </IconButton>
          <IconButton
            onClick={confirm}
            color={theme.green}
            title={typeStrings.edibility.confirm}
            disabled={isSaving}
          >
            <Check />
          </IconButton>
        </EditRow>
      ) : type.edibility ? (
        <EdibilityText>{type.edibility}</EdibilityText>
      ) : (
        <Muted>{typeStrings.edibility.empty}</Muted>
      )}
    </Section>
  )
}

export default TypeEdibility
