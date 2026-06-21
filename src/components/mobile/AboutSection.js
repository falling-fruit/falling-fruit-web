import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

import { useAppHistory } from '../../utils/useAppHistory'
import ForwardChevronIcon from '../ui/ForwardChevronIcon'
import ListEntry, { PrimaryText } from '../ui/ListEntry'

const StyledListEntry = styled(ListEntry)`
  width: 100%;
  padding: 0px;

  :not(:last-child) {
    margin-block-end: 7px;
  }
`

const AboutSection = () => {
  const { t } = useTranslation()
  const history = useAppHistory()

  return (
    <div>
      <StyledListEntry
        rightIcons={<ForwardChevronIcon size="16" />}
        onClick={() => history.push('/about/project')}
      >
        <PrimaryText>{t('layouts.application.menu.the_project')}</PrimaryText>
      </StyledListEntry>
      <StyledListEntry
        rightIcons={<ForwardChevronIcon size="16" />}
        onClick={() => history.push('/about/data')}
      >
        <PrimaryText>{t('layouts.application.menu.the_data')}</PrimaryText>
      </StyledListEntry>
      <StyledListEntry
        rightIcons={<ForwardChevronIcon size="16" />}
        onClick={() => history.push('/changes')}
      >
        <PrimaryText>{t('pages.changes.recent_activity')}</PrimaryText>
      </StyledListEntry>
      <StyledListEntry
        rightIcons={<ForwardChevronIcon size="16" />}
        onClick={() => history.push('/about/sharing')}
      >
        <PrimaryText>
          {t('layouts.application.menu.sharing_the_harvest')}
        </PrimaryText>
      </StyledListEntry>
      <StyledListEntry
        rightIcons={<ForwardChevronIcon size="16" />}
        onClick={() => history.push('/about/press')}
      >
        <PrimaryText>{t('layouts.application.menu.in_the_press')}</PrimaryText>
      </StyledListEntry>
    </div>
  )
}

export default AboutSection
