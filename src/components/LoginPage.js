import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { clearAuthCredentials, fetchAccessToken } from '../redux/authSlice'
import Button from './ui/Button'
import Checkbox from './ui/Checkbox'
import StyledInput from './ui/Input'

const LoginPage = () => {
  const { authToken } = useSelector((state) => state.credential)
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

  const logout = () => {
    localStorage.clear()
    sessionStorage.clear()
    dispatch(clearAuthCredentials())
  }

  return (
    <div>
      <h1>Login</h1>
      <StyledInput
        placeholder="Enter Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <StyledInput
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <h5>{`token: ${authToken} `}</h5>
      <Checkbox
        id={'isRemember'}
        checked={isChecked}
        name={'Stay logged in'}
        onChange={() => setIsChecked(!isChecked)}
        label={<label htmlFor={'isRemember'}>Stay logged in</label>}
      />
      <Button onClick={getJWTToken}>Login</Button>
      <Button onClick={logout}>Logout</Button>
    </div>
  )
}

export default LoginPage
