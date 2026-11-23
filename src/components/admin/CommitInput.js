import { useEffect, useRef, useState } from 'react'

import Input from '../ui/Input'

const CommitInput = ({
  id,
  value,
  onCommit,
  normalize = (text) => text.trim(),
  disabled = false,
  placeholder,
  focusOnMount = false,
  ...props
}) => {
  const [draft, setDraft] = useState(value)
  const inputRef = useRef(null)

  useEffect(() => {
    if (focusOnMount) {
      inputRef.current?.focus()
    }
  }, [focusOnMount])

  useEffect(() => {
    setDraft(value)
  }, [value])

  const commit = async () => {
    const normalized = normalize(draft)
    if (normalized === value) {
      setDraft(value)
      return
    }
    if (await onCommit(normalized)) {
      setDraft(normalized)
    } else {
      setDraft(value)
    }
  }

  return (
    <Input
      {...props}
      id={id}
      value={draft}
      disabled={disabled}
      placeholder={placeholder}
      ref={inputRef}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault()
          event.currentTarget.blur()
        } else if (event.key === 'Escape') {
          setDraft(value)
        }
      }}
    />
  )
}

export default CommitInput
