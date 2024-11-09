import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { getUserById } from '../../utils/api'

const UserProfile = () => {
  const { id } = useParams()
  //const history = useAppHistory()
  //const { t } = useTranslation()
  const [userData, setUserData] = useState({})
  //const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('Inside useEffect...')

    async function fetchUserData() {
      //setIsLoading(true)
      const data = await getUserById(id)
      setUserData(data)

      // Log the fetched data
      console.log('Fetched User Data:', data)

      //setIsLoading(false)
    }

    fetchUserData()
  }, [id])

  //const { name, url, comments, muni, location_count, created_at, license } = userData;
  //const ud = userData;
  //console.log(userData);

  return (
    <div>
      <p>User ID: {userData.id}</p>
      <p>User Name: {userData.name}</p>
    </div>
  )
}

export default UserProfile
