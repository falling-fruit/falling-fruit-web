import { ArrowBack, User } from '@styled-icons/boxicons-regular'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import styled from 'styled-components/macro'

import { getUserById } from '../../utils/api'
import { useAppHistory } from '../../utils/useAppHistory'
import { PageScrollWrapper, PageTemplate } from '../about/PageTemplate'
import BackButton from '../ui/BackButton'
import IconBesideText from '../ui/IconBesideText'
import { LoadingOverlay } from '../ui/LoadingIndicator'

const StyledNavBack = styled.div`
  svg {
    height: 20px;
    margin-right: 5px;
  }
`
const UserProfile = () => {
  const { id } = useParams()
  const history = useAppHistory()
  const { t } = useTranslation()
  const [userData, setUserData] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchUserData() {
      setIsLoading(true)

      const data = await getUserById(id)
      setUserData(data)

      setIsLoading(false)
    }

    fetchUserData()
  }, [id])

  if (isLoading) {
    return <LoadingOverlay />
  }

  const { created_at, name, bio } = userData

  return (
    <PageScrollWrapper>
      <PageTemplate>
        <StyledNavBack>
          <BackButton
            onClick={(event) => {
              event.stopPropagation()
              history.goBack()
            }}
          >
            <ArrowBack />
            {t('back')}
          </BackButton>
        </StyledNavBack>
        <IconBesideText>
          <User size={40} />
          <h2>{name}</h2>
        </IconBesideText>
        <p>
          <i>Joined on {new Date(created_at).toISOString().slice(0, 10)}</i>
        </p>
        <p>{bio}</p>
      </PageTemplate>
    </PageScrollWrapper>
  )
}

export default UserProfile
