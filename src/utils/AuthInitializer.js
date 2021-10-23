import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { setAuthFromStorage } from '../redux/authSlice'

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setAuthFromStorage())
  }, [dispatch])
  return <>{children}</>
}

export default AuthInitializer
