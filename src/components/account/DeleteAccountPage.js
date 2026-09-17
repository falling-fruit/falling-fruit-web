import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { deleteAccount } from '../../redux/authSlice'
import { useAppHistory } from '../../utils/useAppHistory'
import Button from '../ui/Button'
import FormButtons from '../ui/FormButtons'
import { PageHeader } from '../ui/Headers'
import LoadingIndicator from '../ui/LoadingIndicator'
import { TopSafeAreaInsetPage } from '../ui/PageTemplate'
import withRedirectToAuth from './withRedirectToAuth'

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
    <TopSafeAreaInsetPage backPath="/account/edit">
      <PageHeader>{t('users.delete_account')}</PageHeader>

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
