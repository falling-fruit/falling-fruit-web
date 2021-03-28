import { CurrentLocation } from '@styled-icons/boxicons-regular/CurrentLocation'
import React from 'react'
import styled from 'styled-components'

import { theme } from '../ui/GlobalStyle'
import Input from '../ui/Input'

const DesktopSearch = () => {
  console.log('hi')

  const LocationButton = styled.button`
    background: none;
    color: inherit;
    border: none;
    border-right: 1px solid;
    border-color: #e0e1e2;
    padding: 10px;
    font: inherit;
    cursor: pointer;
    outline: inherit;
  `

  const DesktopInput = styled.div`
    display: flex;
    border-radius: 23px;
    border: 1px solid ${({ theme }) => theme.secondaryBackground};
    box-sizing: border-box;

    &:focus-within {
      box-shadow: 0 0 0 1pt rgb(0, 95, 204);
      box-shadow: 0 0 0 1pt -webkit-focus-ring-color;
    }

    svg {
      height: 28px;
      width: auto;
      pointer-events: none;
    }
  `

  const StyledInput = styled(Input)`
    margin-left: 10px;

    & > div {
      border: none;
    }
    &:focus-within {
      box-shadow: none;
    }
  `

  return (
    <DesktopInput>
      <LocationButton>
        <CurrentLocation color={theme.blue} size={24} />
      </LocationButton>
      <StyledInput />
    </DesktopInput>
  )
}

DesktopSearch.displayName = 'DesktopSearch'

export default DesktopSearch
