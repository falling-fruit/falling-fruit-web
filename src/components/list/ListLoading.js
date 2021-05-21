import styled from 'styled-components/macro'

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`

const ListState = ({ image, text, ...props }) => (
  <LoadingContainer {...props}>
    {image && <img src={image} alt="loading-list-icon" />}
    <p>{text}</p>
  </LoadingContainer>
)

const ShouldZoomIn = (props) => (
  <ListState
    image="/magnify_map.svg"
    text="Zoom into a location to see Entry Data"
    {...props}
  />
)

const NoResultsFound = (props) => (
  <ListState image="/no_results_icon.svg" text="No Results Found" {...props} />
)

export { NoResultsFound, ShouldZoomIn }
