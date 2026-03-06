import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'

import { editProfile } from '../../redux/authSlice'
import { BackButton } from '../ui/ActionButtons'
import Button from '../ui/Button'
import { TopSafeAreaInsetPage } from '../ui/PageTemplate'

const StyledBackButton = styled(BackButton)`
  margin-bottom: 23px;
`

const Explanation = styled.div`
  margin-bottom: 2em;
  line-height: 1.6;

  p {
    margin-bottom: 1em;
  }

  ul {
    margin: 0.5em 0 1em 1.5em;
    list-style: disc;
  }

  li {
    margin-bottom: 0.4em;
  }
`

const explanationHtml = `
  <p>Hiding your profile will make your account invisible to other users of the platform. Here's what that means:</p>
  <ul>
    <li>Your name and bio will no longer appear on any activity you've contributed.</li>
    <li>Other users will not be able to visit your profile page.</li>
    <li>Your locations and reviews will remain on the map, but will be shown anonymously.</li>
    <li>You can reverse this at any time.</li>
  </ul>
`

const HideProfilePage = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const handleHideProfile = () => {
    dispatch(editProfile({ private: true })).then(() => {
      history.push('/account/edit')
    })
  }

  return (
    <TopSafeAreaInsetPage>
      <StyledBackButton backPath="/account/edit" />
      <h1>Hide your profile</h1>
      <Explanation dangerouslySetInnerHTML={{ __html: explanationHtml }} />
      <Button type="button" onClick={handleHideProfile}>
        Hide my profile
      </Button>
    </TopSafeAreaInsetPage>
  )
}

export default HideProfilePage
