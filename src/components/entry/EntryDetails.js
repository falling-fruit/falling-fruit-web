import { useRouteMatch } from 'react-router-dom'

const EntryDetails = () => {
  const {
    params: { id },
  } = useRouteMatch()

  return (
    <div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <p>EntryDetails for id: {id}</p>
    </div>
  )
}

export default EntryDetails
