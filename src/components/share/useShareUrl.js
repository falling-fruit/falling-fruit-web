import { useSelector } from 'react-redux'

/**
 * Custom hook to generate a shareable URL with the current map type
 * @returns {string} The shareable URL
 */
const useShareUrl = () => {
  const mapType = useSelector((state) => state.settings.mapType)

  // Create URL with mapType parameter
  const url = new URL(window.location.href)
  url.searchParams.set('mapType', mapType)
  return url.toString()
}

export default useShareUrl
