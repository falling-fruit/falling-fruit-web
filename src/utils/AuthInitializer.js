import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { checkAuth } from '../redux/authSlice'

const AuthInitializer = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  return null
}

export default AuthInitializer
