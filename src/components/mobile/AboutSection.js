import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

import { useAppHistory } from '../../utils/useAppHistory'
import ForwardChevronIcon from '../ui/ForwardChevronIcon'
import ListEntry, { PrimaryText } from '../ui/ListEntry'
import SocialButtons from '../ui/SocialButtons'

const StyledListEntry = styled(ListEntry)`
  width: 100%;
  padding: 0px;

  :not(:last-child) {
    margin-block-end: 7px;
  }
`

const StyledSocialButtons = styled(SocialButtons)`
  width: 100%;
  display: flex;
  justify-content: space-between;

  a {
    color: ${({ theme }) => theme.text};
  }

  svg {
    height: 32px;
  }
`

const AboutSection = () => {
  const { t } = useTranslation()
  const history = useAppHistory()

  return (
    <div>
      <StyledListEntry
        rightIcons={<ForwardChevronIcon size="16" />}
        onClick={() => history.push('/changes')}
      >
        <PrimaryText>{t('glossary.activity')}</PrimaryText>
      </StyledListEntry>
      <StyledListEntry
        rightIcons={<ForwardChevronIcon size="16" />}
        onClick={() => history.push('/about/about-the-project')}
      >
        <PrimaryText>{t('layouts.application.menu.the_project')}</PrimaryText>
      </StyledListEntry>
      <StyledListEntry
        rightIcons={<ForwardChevronIcon size="16" />}
        onClick={() => history.push('/about/the-data')}
      >
        <PrimaryText>{t('layouts.application.menu.the_data')}</PrimaryText>
      </StyledListEntry>
      <StyledListEntry
        rightIcons={<ForwardChevronIcon size="16" />}
        onClick={() => history.push('/about/sharing-the-harvest')}
      >
        <PrimaryText>
          {t('layouts.application.menu.sharing_the_harvest')}
        </PrimaryText>
      </StyledListEntry>
      <StyledListEntry
        rightIcons={<ForwardChevronIcon size="16" />}
        onClick={() => history.push('/about/in-the-press')}
      >
        <PrimaryText>{t('layouts.application.menu.in_the_press')}</PrimaryText>
      </StyledListEntry>
      <br />
      <StyledSocialButtons />
    </div>
  )
}

export default AboutSection
