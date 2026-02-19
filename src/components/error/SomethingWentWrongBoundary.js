import { Component } from 'react'

import SomethingWentWrongContent from './SomethingWentWrongContent'

class SomethingWentWrongBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, errorMessage: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error?.message || null }
  }

  componentDidCatch(error, errorInfo) {
    console.error(
      'SomethingWentWrongBoundary caught an error:',
      error,
      errorInfo,
    )
  }

  render() {
    const { hasError, errorMessage } = this.state
    const { children } = this.props

    if (hasError) {
      return <SomethingWentWrongContent errorMessage={errorMessage} />
    }

    return children
  }
}

export default SomethingWentWrongBoundary
