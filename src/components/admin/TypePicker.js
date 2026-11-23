import { useCallback, useMemo } from 'react'

import { MultiSelect } from '../ui/MultiSelect'
import TypeLabel from './TypeLabel'
import { typeStrings } from './typeStrings'
import { matchesOptionSearch } from './typeUtils'

const MENU_MAX_HEIGHT = '300px'

const filterOption = (candidate, input) =>
  matchesOptionSearch(candidate.data.search, input)

const noOptionsMessage = () => typeStrings.settings.pickerNoOptions

const TypePicker = ({
  options,
  excludedIds,
  value,
  onChange,
  language,
  isMulti = false,
  clearable = false,
  disabled = false,
  inputId,
  placeholder = typeStrings.settings.pickerPlaceholder,
  ...props
}) => {
  const availableOptions = useMemo(
    () =>
      excludedIds
        ? options.filter((option) => !excludedIds.has(option.value))
        : options,
    [options, excludedIds],
  )
  const optionById = useMemo(
    () => new Map(options.map((option) => [option.value, option])),
    [options],
  )

  const selected = isMulti
    ? (value ?? []).map((id) => optionById.get(id)).filter(Boolean)
    : (optionById.get(value) ?? null)

  const formatOptionLabel = useCallback(
    (option) => <TypeLabel type={option.type} language={language} showId />,
    [language],
  )

  const handleChange = useCallback(
    (next) =>
      onChange(
        isMulti
          ? (next ?? []).map((option) => option.value)
          : (next?.value ?? null),
      ),
    [isMulti, onChange],
  )

  return (
    <MultiSelect
      {...props}
      inputId={inputId}
      isMulti={isMulti}
      isClearable={clearable || isMulti}
      isDisabled={disabled}
      isVirtualized
      menuMaxHeight={MENU_MAX_HEIGHT}
      options={availableOptions}
      value={selected}
      placeholder={placeholder}
      noOptionsMessage={noOptionsMessage}
      filterOption={filterOption}
      formatOptionLabel={formatOptionLabel}
      closeMenuOnSelect={!isMulti}
      onChange={handleChange}
    />
  )
}

export default TypePicker
