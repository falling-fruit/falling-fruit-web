import { useEffect, useState } from 'react'

import { getTypes } from '../utils/api'

const Types = () => {
  const [types, setTypes] = useState(null)

  useEffect(() => {
    const fetchTypes = async () => {
      setTypes(await getTypes())
    }
    fetchTypes()
  }, [])

  return (
    <div>
      {types &&
        types.map((type, index) => <div key={index}>{type.en_name}</div>)}
    </div>
  )
}

export default Types
