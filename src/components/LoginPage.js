import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'

import { fetchToken } from '../redux/authSlice'
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
    font-size: 2rem;
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

const ErrorMessage = styled.p`
  color: red;
`
const LoginPage = () => {
  const { authToken, failedLogin } = useSelector((state) => state.auth)
  const history = useHistory()
  const [rememberMe, setRememberMe] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const getJWTToken = () => {
    dispatch(
      fetchToken({
        email: username,
        password: password,
        rememberMe: rememberMe,
      }),
    )
  }

  useEffect(() => {
    if (authToken) {
      history.push({
        pathname: '/map',
        state: { fromPage: '/login' },
      })
    }
  }, [authToken, history])

  return (
    <>
      <Header />
      <LoginContainer>
        <h1>Login</h1>

        <Label>Email</Label>
        <StyledInput
          placeholder="e.g. user@example.com"
          value={username}
          type="email"
          label={'Email'}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Label>Password</Label>

        <StyledInput
          label={'Password'}
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <LabeledRow
          label={<label htmlFor={'Remember Me'}>Remember Me</label>}
          left={
            <Checkbox
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
          }
        />

        <Button onClick={getJWTToken}>Login</Button>

        {failedLogin && <ErrorMessage>Invalid Login</ErrorMessage>}

        {/* TODO: Update links below */}
        <a href="signup">Signup</a>
        <a href="reset">Reset your password</a>
        <a href="resend">Resend confirmation instructions</a>
      </LoginContainer>
    </>
  )
}

export default LoginPage
