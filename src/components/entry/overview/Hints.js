import { ChevronDown, ChevronUp } from '@styled-icons/boxicons-regular'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Reaptcha from 'reaptcha'
import styled from 'styled-components/macro'

import {
  editExistingLocation,
  setExistingLocationVisibility,
} from '../../../redux/locationSlice'
import { locationToApiValues } from '../../../utils/form'
import { useAppHistory } from '../../../utils/useAppHistory'
import { adminStrings } from '../../admin/adminStrings'
import ResetButton from '../../ui/ResetButton'
import { formatISOString } from '../textFormatters'
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

const UnverifiedLabel = styled(OldLabelInline)`
  margin-inline-start: 0;
`

const ExistenceActionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1em;
  margin-block: 0.75em;
`

const ReportsList = styled.ul`
  margin-block: 0.5em 0;
  padding-inline-start: 1.5em;
  list-style: none;
  font-style: italic;
  color: ${({ theme }) => theme.tertiaryText};

  li::before {
    content: '-';
    margin-inline-end: 0.5em;
  }
`

const ReportComment = styled.span`
  display: block;
  margin-inline-start: 1em;
  font-style: normal;
  color: ${({ theme }) => theme.secondaryText};
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
  lastUpdatedDate,
  expanded,
  onToggle,
}) => {
  const { t } = useTranslation()
  const { fullyOpenPaneDrawerIfMobile } = useLocationPane()

  const updatedAt = new Date(lastUpdatedDate)
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
  const { fullyOpenPaneDrawerIfMobile, openReportModal } = useLocationPane()

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
          openReportModal({
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

export const UnverifiedHintToggle = ({ expanded, onToggle }) => {
  const { t } = useTranslation()
  const { fullyOpenPaneDrawerIfMobile } = useLocationPane()

  return (
    <UnverifiedLabel
      onClick={(e) => {
        e.stopPropagation()
        fullyOpenPaneDrawerIfMobile()
        onToggle()
      }}
      role="button"
      aria-expanded={expanded}
    >
      {t('locations.hints.unverified_may_be_inaccurate')}
      {expanded ? <ChevronUp size="1em" /> : <ChevronDown size="1em" />}
    </UnverifiedLabel>
  )
}

export const UnverifiedHintActions = ({ locationData }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const history = useAppHistory()
  const { fullyOpenPaneDrawerIfMobile, openReportModal } = useLocationPane()
  const isLoggedIn = useSelector((state) => !!state.auth.user)
  const recaptchaRef = useRef(null)

  const markAsVerified = (recaptcha) => {
    dispatch(
      editExistingLocation({
        locationId: locationData.id,
        locationValues: {
          ...locationToApiValues({
            ...locationData,
            unverified: false,
          }),
          ...(recaptcha && { 'g-recaptcha-response': recaptcha }),
        },
      }),
    )
  }

  const handleMarkAsVerified = () => {
    if (!confirm(t('confirm_message.mark_as_verified'))) {
      return
    }

    if (isLoggedIn) {
      markAsVerified()
    } else {
      Promise.resolve(recaptchaRef.current?.reset()).finally(() => {
        recaptchaRef.current?.execute()
      })
    }
  }

  return (
    <ExistenceActionsContainer>
      {!isLoggedIn && (
        <Reaptcha
          ref={recaptchaRef}
          sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
          size="invisible"
          onVerify={markAsVerified}
        />
      )}
      <HintAction onClick={handleMarkAsVerified}>
        {t('locations.hints.unverified_mark_as_verified')}
      </HintAction>
      <HintAction
        onClick={() => {
          fullyOpenPaneDrawerIfMobile()
          history.push(`/locations/${locationData.id}/edit/position`)
        }}
      >
        {t('locations.hints.unverified_edit_position')}
      </HintAction>
      <HintAction
        onClick={() => {
          fullyOpenPaneDrawerIfMobile()
          history.push(`/locations/${locationData.id}/edit`, {
            focus: 'types',
          })
        }}
      >
        {t('locations.hints.unverified_edit_types')}
      </HintAction>
      <HintAction
        onClick={() => {
          openReportModal({
            problem_code: 1,
          })
        }}
      >
        {t('locations.hints.unverified_report_does_not_exist')}
      </HintAction>
    </ExistenceActionsContainer>
  )
}

export const ReportsHintToggle = ({ expanded, onToggle }) => {
  const { t } = useTranslation()
  const { fullyOpenPaneDrawerIfMobile } = useLocationPane()

  return (
    <UnverifiedLabel
      onClick={(e) => {
        e.stopPropagation()
        fullyOpenPaneDrawerIfMobile()
        onToggle()
      }}
      role="button"
      aria-expanded={expanded}
    >
      {t('locations.hints.reported_pending_review')}
      {expanded ? <ChevronUp size="1em" /> : <ChevronDown size="1em" />}
    </UnverifiedLabel>
  )
}

export const ReportsHintList = ({ reports }) => {
  const { t, i18n } = useTranslation()

  const problemTypeLabels = {
    0: t('problems.problem_types.0'),
    1: t('problems.problem_types.1'),
    2: t('problems.problem_types.2'),
    3: t('problems.problem_types.3'),
    4: t('problems.problem_types.4'),
    5: t('problems.problem_types.5'),
  }

  return (
    <ReportsList>
      {reports.map((report) => {
        const problem = problemTypeLabels[report.problem_code]
        const date = formatISOString(report.created_at, i18n.language)
        const reportedLabel = t('locations.hints.reported_on', { date })

        const reporterName = report.reporter
          ? report.reporter.name || adminStrings.reports.anonymous
          : null

        return (
          <li key={`${report.problem_code}-${report.created_at}`}>
            {`${problem} ${reportedLabel}`}
            {reporterName && (
              <>
                {' — '}
                {report.reporter.user_id != null ? (
                  <Link to={`/users/${report.reporter.user_id}`}>
                    {reporterName}
                  </Link>
                ) : (
                  reporterName
                )}
              </>
            )}
            {report.comment && <ReportComment>{report.comment}</ReportComment>}
          </li>
        )
      })}
    </ReportsList>
  )
}

export const HiddenHintToggle = ({ expanded, onToggle }) => {
  const { t } = useTranslation()
  const { fullyOpenPaneDrawerIfMobile } = useLocationPane()

  return (
    <UnverifiedLabel
      onClick={(e) => {
        e.stopPropagation()
        fullyOpenPaneDrawerIfMobile()
        onToggle()
      }}
      role="button"
      aria-expanded={expanded}
    >
      {t('locations.hints.hidden_not_on_shared_map')}
      {expanded ? <ChevronUp size="1em" /> : <ChevronDown size="1em" />}
    </UnverifiedLabel>
  )
}

export const HiddenHintActions = ({ locationData }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const handleUnhide = () => {
    dispatch(
      setExistingLocationVisibility({
        locationId: locationData.id,
        hidden: false,
      }),
    ).then((result) => {
      if (setExistingLocationVisibility.fulfilled.match(result)) {
        toast.success(t('success_message.location_unhidden'))
      } else {
        toast.error(
          t('error_message.api.location_unhide_failed', {
            message: result.error?.message || t('error_message.unknown_error'),
          }),
        )
      }
    })
  }

  return (
    <ExistenceActionsContainer>
      <HintAction onClick={handleUnhide}>
        {t('locations.hints.unhide')}
      </HintAction>
    </ExistenceActionsContainer>
  )
}
