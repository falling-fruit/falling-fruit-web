import { useTranslation } from 'react-i18next'

import ShareTheHarvestTable from '../table/ShareTheHarvestTable'
import { PageHeader } from '../ui/Headers'
import { InfoPage } from '../ui/PageTemplate'

const ShareTheHarvestPage = () => {
  const { t } = useTranslation()
  return (
    <InfoPage>
      <PageHeader>
        {t('layouts.application.menu.sharing_the_harvest')}
      </PageHeader>
      <h2>{t('pages.sharing.grow_pick_and_distribute')}</h2>
      <p dangerouslySetInnerHTML={{ __html: t('pages.sharing.intro_html') }} />
      <ShareTheHarvestTable />
    </InfoPage>
  )
}

export default ShareTheHarvestPage
