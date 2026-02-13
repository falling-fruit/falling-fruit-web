import styled from 'styled-components/macro'

const dropdownSvg = `<svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path></svg>`

const dropdownSvgUrl = `url('data:image/svg+xml;charset=UTF-8,${encodeURIComponent(dropdownSvg)}')`

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;

  &::after {
    content: '';
    position: absolute;
    inset-inline-end: 0.75em;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    background-color: ${({ theme }) => theme.secondaryBackground};
    mask-image: ${dropdownSvgUrl};
    mask-repeat: no-repeat;
    mask-position: center;
    mask-size: 20px;
    -webkit-mask-image: ${dropdownSvgUrl};
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: center;
    -webkit-mask-size: 20px;
    pointer-events: none;
  }

  &:focus-within::after {
    background-color: ${({ theme }) => theme.secondaryText};
  }
`

const StyledSelect = styled.select`
  font-family: ${({ theme }) => theme.fonts};
  font-size: 1rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.secondaryText};
  background-color: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.secondaryBackground};
  border-radius: 0.375em;
  padding-block: 0.5em;
  padding-inline-start: 0.75em;
  padding-inline-end: 2em;
  width: 100%;
  appearance: none;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.text};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.blue};
  }

  option {
    height: 1.5em;
  }
`

const Select = ({
  options = [],
  value,
  onChange,
  clearable = false,
  ...props
}) => {
  const resolvedValue =
    value != null && typeof value === 'object' ? value.value : value
  const handleChange = (e) => {
    const selectedOption = options.find(
      (opt) => String(opt.value) === e.target.value,
    )
    onChange(selectedOption)
  }

  return (
    <SelectWrapper>
      <StyledSelect
        value={resolvedValue != null ? String(resolvedValue) : ''}
        onChange={handleChange}
        {...props}
      >
        <option value="" disabled={!clearable} hidden={!clearable} />
        {options.map((opt) => (
          <option key={opt.value} value={String(opt.value)}>
            {opt.label}
          </option>
        ))}
      </StyledSelect>
    </SelectWrapper>
  )
}

export default Select
