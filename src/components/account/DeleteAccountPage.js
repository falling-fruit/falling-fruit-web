import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import { deleteAccount } from '../../redux/authSlice'
import { useAppHistory } from '../../utils/useAppHistory'
import { BackButton } from '../ui/ActionButtons'
import Button from '../ui/Button'
import FormButtons from '../ui/FormButtons'
import LoadingIndicator from '../ui/LoadingIndicator'
import { TopSafeAreaInsetPage } from '../ui/PageTemplate'
import withRedirectToAuth from './withRedirectToAuth'

const StyledBackButton = styled(BackButton)`
  margin-bottom: 23px;
`

const DeleteAccountPage = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { t } = useTranslation()
  const history = useAppHistory()

  const handleDelete = () => {
    if (window.confirm(t('users.delete_account_confirmation'))) {
      dispatch(deleteAccount()).then((action) => {
        if (!action.error) {
          history.push('/')
        }
      })
    }
  }

  return (
    <TopSafeAreaInsetPage>
      <StyledBackButton backPath="/account/edit" />
      <h1>{t('users.delete_account')}</h1>

      {user ? (
        <>
          <p>{t('users.this_will_delete_your_account')}</p>
          <p>{t('users.this_will_delete_your_account_explanation')}</p>
          <FormButtons>
            <Button type="delete" onClick={handleDelete}>
              {t('form.button.delete')}
            </Button>
          </FormButtons>
        </>
      ) : (
        <LoadingIndicator vertical cover />
      )}
    </TopSafeAreaInsetPage>
  )
}

export default withRedirectToAuth(DeleteAccountPage)
