import { Book, Calendar } from '@styled-icons/boxicons-regular'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { getUserById } from '../../utils/api'
import { useAppHistory } from '../../utils/useAppHistory'
import { formatISOString } from '../entry/textFormatters'
import { BackButton } from '../ui/ActionButtons'
import { theme } from '../ui/GlobalStyle'
import IconBesideText from '../ui/IconBesideText'
import { LoadingOverlay } from '../ui/LoadingIndicator'
import { Page } from '../ui/PageTemplate'

const UserProfile = () => {
  const { userId } = useParams()
  const history = useAppHistory()
  const { t, i18n } = useTranslation()
  const [userData, setUserData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const { locationId } = useSelector((state) => state.location)

  useEffect(() => {
    async function fetchUserData() {
      setIsLoading(true)

      try {
        const data = await getUserById(userId)
        setUserData(data)
      } catch (error) {
        history.push('/map')
        toast.error(
          t('error_message.api.fetch_user_failed', {
            id: userId,
            message: error.message || t('error_message.unknown_error'),
          }),
        )
      }

      setIsLoading(false)
    }

    fetchUserData()
  }, [userId]) //eslint-disable-line

  if (isLoading) {
    return <LoadingOverlay />
  }

  const { created_at, name, bio } = userData

  return (
    <Page>
      <BackButton
        backPath={locationId ? `/locations/${locationId}` : '/changes'}
      />
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
          <Link to={`/users/${userId}/activity`}>{t('glossary.activity')}</Link>
        </p>
      </IconBesideText>
    </Page>
  )
}

export default UserProfile
