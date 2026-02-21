const isNetworkError = (error) =>
  !navigator.onLine ||
  error?.message === 'Network Error' ||
  error?.message === 'Failed to fetch'

export default isNetworkError
