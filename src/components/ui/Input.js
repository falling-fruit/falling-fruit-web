import styled from 'styled-components'

const Input = ({ placeholder, onChange, onEnter, label, icon, className }) => {
  const id = label?.toLowerCase().split(' ').join('-').concat(`-${className}`)

  return (
    <div className={className}>
      {label && <label htmlFor={id}>{label}</label>}
      <div>
        <input
          onChange={onChange}
          onKeyDown={(e) => {
            e.key === 'Enter' && onEnter?.(e)
          }}
          type="text"
          placeholder={placeholder ?? ''}
          id={id}
        />
        {icon}
      </div>
    </div>
  )
}

const StyledInput = styled(Input)`
  label {
    color: ${({ theme }) => theme.secondaryText};
    font-weight: bold;
    line-height: 2;
  }

  & > div {
    height: 46px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 23px;
    border: 1px solid ${({ theme }) => theme.secondaryBackground};
    box-sizing: border-box;
    padding: 0 20px;

    input {
      color: ${({ theme }) => theme.secondaryText};
      font-size: 15px;
      font-family: ${({ theme }) => theme.fonts};
      padding: 0;
      border: none;
      display: block;
      width: 100%;
      outline: none;
      height: 44px;

      &::placeholder {
        color: ${({ theme }) => theme.tertiaryText};
      }
    }

    &:focus-within {
      box-shadow: 0 0 0 1pt rgb(0, 95, 204);
      box-shadow: 0 0 0 1pt -webkit-focus-ring-color;
    }

    svg {
      height: 28px;
      width: auto;
      pointer-events: none;
    }
  }
`

export default StyledInput
