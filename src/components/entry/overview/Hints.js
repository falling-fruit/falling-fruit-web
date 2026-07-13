import { ChevronDown, ChevronUp } from '@styled-icons/boxicons-regular'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

import { useAppHistory } from '../../../utils/useAppHistory'
import ResetButton from '../../ui/ResetButton'
import useLocationPane from '../useLocationPane'

const HintAction = styled(ResetButton)`
  font-style: italic;
  text-decoration: underline;
  color: ${({ theme }) => theme.tertiaryText};

  &:hover {
    color: ${({ theme }) => theme.secondaryText};
  }
`
const HintsContainerInline = styled.span`
  margin-inline: 0.5em;
`

const OldLabelInline = styled(ResetButton)`
  display: inline-flex;
  align-items: center;
  gap: 0.25em;
  margin-inline-start: 0.5em;
  font-style: italic;
  color: ${({ theme }) => theme.tertiaryText};

  &:hover {
    color: ${({ theme }) => theme.secondaryText};
  }
`

const ExistenceActionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1em;
  margin-block-start: 0.75em;
`

export const AddDescriptionHint = ({ locationData }) => {
  const { t } = useTranslation()
  const history = useAppHistory()
  const { fullyOpenPaneDrawerIfMobile } = useLocationPane()

  return (
    <HintAction
      onClick={() => {
        fullyOpenPaneDrawerIfMobile()
        history.push(`/locations/${locationData.id}/edit`, {
          focus: 'description',
        })
      }}
    >
      {t('locations.hints.add_description')}
    </HintAction>
  )
}

export const AddSeasonStartHint = ({ locationData }) => {
  const { t } = useTranslation()
  const history = useAppHistory()
  const { fullyOpenPaneDrawerIfMobile } = useLocationPane()

  return (
    <HintsContainerInline>
      <HintAction
        onClick={() => {
          fullyOpenPaneDrawerIfMobile()
          history.push(`/locations/${locationData.id}/edit`, {
            focus: 'season_start',
          })
        }}
      >
        {t('locations.hints.add_season_start')}
      </HintAction>
    </HintsContainerInline>
  )
}

export const AddSeasonStopHint = ({ locationData }) => {
  const { t } = useTranslation()
  const history = useAppHistory()
  const { fullyOpenPaneDrawerIfMobile } = useLocationPane()

  return (
    <HintsContainerInline>
      <HintAction
        onClick={() => {
          fullyOpenPaneDrawerIfMobile()
          history.push(`/locations/${locationData.id}/edit`, {
            focus: 'season_stop',
          })
        }}
      >
        {t('locations.hints.add_season_end')}
      </HintAction>
    </HintsContainerInline>
  )
}

export const StaleLocationHintToggle = ({
  locationData,
  expanded,
  onToggle,
}) => {
  const { t } = useTranslation()
  const { fullyOpenPaneDrawerIfMobile } = useLocationPane()

  const updatedAt = new Date(locationData.updated_at)
  const yearsAgo = Math.floor(
    (Date.now() - updatedAt.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
  )

  return (
    <OldLabelInline
      onClick={(e) => {
        e.stopPropagation()
        fullyOpenPaneDrawerIfMobile()
        onToggle()
      }}
      role="button"
      aria-expanded={expanded}
    >
      {t('locations.hints.over_x_years_ago', { yearsAgo })}
      {expanded ? <ChevronUp size="1em" /> : <ChevronDown size="1em" />}
    </OldLabelInline>
  )
}

export const StaleLocationHintActions = ({ locationData }) => {
  const { t } = useTranslation()
  const history = useAppHistory()
  const { fullyOpenPaneDrawerIfMobile } = useLocationPane()

  const comment = t(
    'locations.hints.report_comment_placeholder_no_longer_exists',
  )

  const reviewComment = t(
    'locations.hints.review_comment_placeholder_still_exists',
  )

  return (
    <ExistenceActionsContainer>
      <HintAction
        onClick={() => {
          fullyOpenPaneDrawerIfMobile()
          history.push(`/locations/${locationData.id}/review`, {
            defaultComment: reviewComment,
            focus: 'review.comment',
          })
        }}
      >
        {t('locations.hints.confirm_still_exists')}
      </HintAction>
      <HintAction
        onClick={() => {
          fullyOpenPaneDrawerIfMobile()
          history.addParam('report', 'true', {
            problem_code: 1,
            comment: comment,
            focus: 'comment',
          })
        }}
      >
        {t('locations.hints.report_no_longer_exists')}
      </HintAction>
    </ExistenceActionsContainer>
  )
}
