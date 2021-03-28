import { CurrentLocation } from '@styled-icons/boxicons-regular/CurrentLocation'
import React from 'react'
import styled from 'styled-components'

import { theme } from '../ui/GlobalStyle'
import Input from '../ui/Input'

const DesktopSearch = () => {
  const LocationButton = styled.button`
    width: 48px;
    background: none;
    color: inherit;
    border: none;
    border-radius: 50% 0 0 50%;
    border-right: 1px solid #e0e1e2;
    padding: 10px 0;
    &:focus {
      outline: none;
      box-shadow: 0 0 0 1px rgb(0, 95, 204);
      box-shadow: 0 0 0 1px -webkit-focus-ring-color;
    }
  `

  const DesktopInput = styled.div`
    display: flex;
    border-radius: 23px;
    border: 1px solid ${({ theme }) => theme.secondaryBackground};
    box-sizing: border-box;

    &:focus-within {
      border: solid 1px rgb(0, 95, 204);
      border-color: -webkit-focus-ring-color;
    }
  `

  const StyledInput = styled(Input)`
    width: 100%;
    margin-left: 10px;

    & > div {
      border: none;
      padding-left: 0;
    }
    &:focus-within > div {
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
