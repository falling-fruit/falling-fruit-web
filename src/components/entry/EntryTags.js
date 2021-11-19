import { useTranslation } from 'react-i18next'

import { theme } from '../ui/GlobalStyle'
import { Tag, TagList } from '../ui/Tag'
import { ACCESS_TYPE } from './textFormatters'

const EntryTags = ({ locationData }) => {
  const { t } = useTranslation()
  return (
    <TagList>
      {locationData.access && (
        <Tag color={theme.tag.access}>{ACCESS_TYPE[locationData.access]}</Tag>
      )}
      {locationData.unverified ? (
        <Tag color={theme.tag.unverified}>{t('Unverified')}</Tag>
      ) : (
        <Tag color={theme.tag.verified}>{t('Verified')}</Tag>
      )}
    </TagList>
  )
}

export default EntryTags
