import { useDispatch, useSelector } from 'react-redux'

import {
  fetchAccessToken,
  saveTokenToReduxStore,
} from '../redux/credentialSlice'

const LoginPage = () => {
  const { credentials } = useSelector((state) => state.credential)

  const dispatch = useDispatch()

  const getJWTToken = () => {
    const jwtToken = fetchAccessToken({
      email: 'email',
      password: 'email',
    })
    dispatch(jwtToken)
    dispatch(saveTokenToReduxStore(jwtToken))
  }

  return (
    <div>
      <h1>Login</h1>
      <input placeholder="Enter Username"></input>
      <input placeholder="Enter Password"></input>
      <h5>{`token ${credentials}`}</h5>
      <button onClick={getJWTToken}>Login</button>
    </div>
  )
}

export default LoginPage
