import { useEffect } from 'react'

const ConnectRootHeight = () => {
  useEffect(() => {
    const root = document.getElementById('root')
    if (!root) {
      return undefined
    }

    root.classList.add('auto-height')
    return () => {
      root.classList.remove('auto-height')
    }
  }, [])

  return null
}

export default ConnectRootHeight
