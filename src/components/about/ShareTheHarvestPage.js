import { useTranslation } from 'react-i18next'

import ShareTheHarvestTable from '../table/ShareTheHarvestTable'
import { InfoPage } from '../ui/PageTemplate'

const ShareTheHarvestPage = () => {
  const { t } = useTranslation()
  return (
    <InfoPage>
      <h1>{t('pages.sharing.grow_pick_and_distribute')}</h1>
      <p dangerouslySetInnerHTML={{ __html: t('pages.sharing.intro_html') }} />
      <ShareTheHarvestTable />
    </InfoPage>
  )
}

export default ShareTheHarvestPage
