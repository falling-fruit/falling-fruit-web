import { ArrowBack, Book, Calendar, User } from '@styled-icons/boxicons-regular'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import styled from 'styled-components/macro'

import { getUserById } from '../../utils/api'
import { useAppHistory } from '../../utils/useAppHistory'
import { formatISOString } from '../entry/textFormatters'
import BackButton from '../ui/BackButton'
import { theme } from '../ui/GlobalStyle'
import IconBesideText from '../ui/IconBesideText'
import { LoadingOverlay } from '../ui/LoadingIndicator'
import { Page } from '../ui/PageTemplate'
import ReturnIcon from '../ui/ReturnIcon'

const StyledNavBack = styled.div`
  svg {
    height: 20px;
    margin-inline-end: 5px;
  }
`
const UserProfile = () => {
  const { id } = useParams()
  const history = useAppHistory()
  const { t, i18n } = useTranslation()
  const [userData, setUserData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const { lastBrowsedSection } = useSelector((state) => state.activity)

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
    <Page>
      <StyledNavBack>
        <BackButton
          onClick={(event) => {
            event.stopPropagation()
            if (lastBrowsedSection.id && !lastBrowsedSection.userId) {
              history.push('/changes')
            } else {
              history.goBack()
            }
          }}
        >
          <ReturnIcon />
          {t('layouts.back')}
        </BackButton>
      </StyledNavBack>
      <h3>{t('users.profile.title', { name })}</h3>
      {bio && (
        <p dir="auto" style={{ whiteSpace: 'pre-line' }}>
          {bio}
        </p>
      )}
      <IconBesideText>
        <Calendar color={theme.secondaryText} size={20} />
        <p>
          <time dateTime={created_at}>
            {t('users.joined_on', {
              date: formatISOString(created_at, i18n.language),
            })}
          </time>
        </p>
      </IconBesideText>
      <IconBesideText>
        <Book color={theme.secondaryText} size={20} />
        <p>
          <a href={`/changes/${id}`}>{t('glossary.activity')}</a>
        </p>
      </IconBesideText>
    </Page>
  )
}

export default UserProfile
