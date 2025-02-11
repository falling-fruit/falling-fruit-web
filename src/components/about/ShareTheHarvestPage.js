import { useTranslation } from 'react-i18next'

import ShareTheHarvestTable from '../table/ShareTheHarvestTable'
import { PageScrollWrapper, PageTemplate } from './PageTemplate'

const ShareTheHarvestPage = () => {
  const { t } = useTranslation()
  return (
    <PageScrollWrapper>
      <PageTemplate backToSettingsOnMobile>
        <h1>{t('pages.sharing.grow_pick_and_distribute')}</h1>
        <p
          dangerouslySetInnerHTML={{ __html: t('pages.sharing.intro_html') }}
        />
        <ShareTheHarvestTable />
      </PageTemplate>
    </PageScrollWrapper>
  )
}

export default ShareTheHarvestPage
