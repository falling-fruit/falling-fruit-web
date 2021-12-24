import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'

import { login } from '../redux/authSlice'
import { getPathWithMapState } from '../utils/getInitialUrl'
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
  const { user, error } = useSelector((state) => state.auth)
  const history = useHistory()
  const [rememberMe, setRememberMe] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const handleLogin = () => {
    dispatch(
      login({
        email: username,
        password: password,
        rememberMe: rememberMe,
      }),
    )
  }

  useEffect(() => {
    if (user) {
      console.log('new url', getPathWithMapState('/map'))
      history.push('/map')
    }
  }, [user, history])

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
          label="Email"
          onChange={(e) => setUsername(e.target.value)}
        />
        <Label>Password</Label>

        <StyledInput
          label="Password"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <LabeledRow
          label={<label htmlFor="remember_me">Remember Me</label>}
          left={
            <Checkbox
              id="remember_me"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
          }
        />

        <Button onClick={handleLogin}>Login</Button>

        {error && <ErrorMessage>Invalid Login</ErrorMessage>}

        {/* TODO: Update links below */}
        <a href="signup">Signup</a>
        <a href="reset">Reset your password</a>
        <a href="resend">Resend confirmation instructions</a>
      </LoginContainer>
    </>
  )
}

export default LoginPage
