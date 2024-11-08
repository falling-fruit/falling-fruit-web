import React, { useEffect, useState } from 'react'
import { useHistory,useParams } from 'react-router-dom'

const UserProfile = () => {
  const { id } = useParams()
  const history = useHistory()
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    console.log('Inside useEffect...')
    fetch(`https://fallingfruit.org/api/0.3/users/${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched user data:', data)
        setUserData(data)
      })
      .catch((error) => console.error('Error fetching user data:', error))
  }, [id])

  return (
    <div>
      <button onClick={() => history.goBack()}>Back</button>
      {userData ? (
        <div>
          <h1>{userData.name}</h1>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default UserProfile
