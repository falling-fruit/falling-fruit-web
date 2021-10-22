import { useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components/macro'

import { clearAuthCredentials, fetchAccessToken } from '../redux/authSlice'
import Header from './desktop/Header'
import Button from './ui/Button'
import Checkbox from './ui/Checkbox'
import StyledInput from './ui/Input'
import Label from './ui/Label'
import LabeledRow from './ui/LabeledRow'

const LoginContainer = styled.div`
  display: flex;
  margin-left: 20%;
  margin-top: 5%;
  flex-direction: column;
  max-width: 350px;

  h1 {
    font-size: 32px;
    margin-bottom: 10px;
  }

  label {
    font-size: 1rem;
  }

  span {
    margin: 11px 8px 11px 0;
  }
  button {
    width: 110px;
    margin: 10px 0;
  }
  a {
    color: ${({ theme }) => theme.orange};
    margin: 4px;
  }
`

const LoginPage = () => {
  const [isChecked, setIsChecked] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const getJWTToken = () => {
    dispatch(
      fetchAccessToken({
        email: username,
        password: password,
        isChecked: isChecked,
      }),
    )
  }

  // remove underscore when making changes
  const _logout = () => {
    localStorage.clear()
    sessionStorage.clear()
    dispatch(clearAuthCredentials())
  }

  return (
    <>
      <Header />
      <LoginContainer>
        <h1>Login</h1>

        <Label>Email</Label>
        <StyledInput
          placeholder="e.g. user@example.com"
          value={username}
          label={'Email'}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Label>Password</Label>

        <StyledInput
          label={'Password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <LabeledRow
          label={<label htmlFor={'Remember Me'}>Remember Me</label>}
          left={
            <Checkbox
              id={'isRemember'}
              checked={isChecked}
              name={'Stay logged in'}
              onChange={() => setIsChecked(!isChecked)}
            />
          }
        />

        <Button onClick={getJWTToken}>Login</Button>
        {/* <Button onClick={logout}>Logout</Button> */}

        <a href="signup">Signup</a>
        <a href="reset">Reset your password</a>
        <a href="resend">Resend confirmation instructions</a>
      </LoginContainer>
    </>
  )
}

export default LoginPage
