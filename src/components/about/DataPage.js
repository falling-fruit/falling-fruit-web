import { useTranslation } from 'react-i18next'

import ImportsTable from '../table/ImportsTable'
import { PageScrollWrapper, PageTemplate } from './PageTemplate'

const DataPage = () => {
  const { t } = useTranslation()
  return (
    <PageScrollWrapper>
      <PageTemplate from="Settings">
        <p>{t('pages.data.intro')}</p>
        <blockquote>
          <a href="https://fallingfruit.org/locations.csv.bz2" dir="ltr">
            locations.csv.bz2
          </a>
          <br />
          <a href="https://fallingfruit.org/types.csv.bz2" dir="ltr">
            types.csv.bz2
          </a>
        </blockquote>
        <p dangerouslySetInnerHTML={{ __html: t('pages.data.beware_html') }} />
        <p dangerouslySetInnerHTML={{ __html: t('pages.data.license_html') }} />
        <p
          dangerouslySetInnerHTML={{
            __html: t('pages.data.caveat_emptor_html'),
          }}
        />
        <h2>{t('pages.datasets.imported_datasets')}</h2>
        <p
          dangerouslySetInnerHTML={{ __html: t('pages.datasets.intro_html') }}
        />
        <p>{t('pages.datasets.types_of_data')}</p>
        <p>{t('pages.datasets.table_info')}</p>
        <ImportsTable />
      </PageTemplate>
    </PageScrollWrapper>
  )
}

export default DataPage
