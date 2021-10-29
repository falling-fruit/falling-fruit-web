import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { login } from '../redux/authSlice'

const AuthInitializer = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(login())
  }, [dispatch])
  return <></>
}

export default AuthInitializer
