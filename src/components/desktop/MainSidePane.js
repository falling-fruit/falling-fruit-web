import { useTranslation } from 'react-i18next'

import Search from '../search/Search'
import { AddLocationDesktop } from '../ui/AddLocation'
import { PageTitle } from '../ui/Headers'
import FilterWrapper from './FilterWrapper'

const MainPane = () => {
  const { t } = useTranslation()

  return (
    <>
      <PageTitle>{t('glossary.map')}</PageTitle>
      <Search />
      <FilterWrapper />
      <AddLocationDesktop />
    </>
  )
}

export default MainPane
