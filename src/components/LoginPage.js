import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  clearAuthCredentials,
  fetchAccessToken,
} from '../redux/credentialSlice'
import Checkbox from './ui/Checkbox'

const LoginPage = () => {
  const { authToken } = useSelector((state) => state.credential)
  const [isChecked, setIsChecked] = useState(false)
  const dispatch = useDispatch()

  const getJWTToken = () => {
    dispatch(
      fetchAccessToken({
        email: '',
        password: '',
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
      <input placeholder="Enter Username"></input>
      <input placeholder="Enter Password"></input>
      <h5>{`token: ${authToken} `}</h5>
      <Checkbox
        id={'isRemember'}
        checked={isChecked}
        name={'Stay logged in'}
        onChange={() => setIsChecked(!isChecked)}
        label={<label htmlFor={'isRemember'}>Stay logged in</label>}
      />
      <button onClick={getJWTToken}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

export default LoginPage
