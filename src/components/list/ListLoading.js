import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`

const ListState = ({ image, icon, text, ...props }) => (
  <LoadingContainer {...props}>
    {image && <img src={image} alt="loading-list-icon" />}
    {icon}
    <p>{text}</p>
  </LoadingContainer>
)

const ShouldZoomIn = (props) => {
  const { t } = useTranslation()
  return (
    <ListState image="/magnify_map.svg" text={t('list.zoom_in')} {...props} />
  )
}

const NoResultsFound = (props) => {
  const { t } = useTranslation()
  return (
    <ListState
      image="/no_results_icon.svg"
      text={t('list.no_results')}
      {...props}
    />
  )
}

const ResultsUnavailable = (props) => {
  const { t } = useTranslation()
  return (
    <ListState
      icon={<box-icon name="alert-triangle" type="solid" />}
      text={t('list.results_unavailable')}
      {...props}
    />
  )
}

export { NoResultsFound, ResultsUnavailable, ShouldZoomIn }
