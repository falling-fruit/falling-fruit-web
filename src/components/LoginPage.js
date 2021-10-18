import { useDispatch, useSelector } from 'react-redux'

import { fetchAccessToken } from '../redux/credentialSlice'

const LoginPage = () => {
  const { authToken } = useSelector((state) => state.credential)

  const dispatch = useDispatch()

  const getJWTToken = () => {
    dispatch(
      fetchAccessToken({
        email: '',
        password: '',
      }),
    )
  }

  return (
    <div>
      <h1>Login</h1>
      <input placeholder="Enter Username"></input>
      <input placeholder="Enter Password"></input>
      <h5>{`token ${authToken} `}</h5>
      <button onClick={getJWTToken}>Login</button>
    </div>
  )
}

export default LoginPage
