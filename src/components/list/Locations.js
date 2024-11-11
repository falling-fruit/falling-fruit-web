import { useEffect, useRef } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import CircleIcon from '../ui/CircleIcon'
import { theme } from '../ui/GlobalStyle'
import DistanceText from './DistanceText'
import { ReactComponent as LeafIcon } from './leaf.svg'

const TypeNameTagWrapper = styled.span`
  display: inline-block;
  margin-bottom: 0.5em;
  opacity: ${({ isSelected }) => (isSelected ? 1 : 0.5)};
  font-size: 0.875rem;
  &:not(:nth-last-child(2))::after {
    content: '·';
    margin: 0 0.5em;
    color: ${({ theme }) => theme.secondaryText};
  }
`
const CommonName = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.headerText};
`

const ScientificName = styled.span`
  font-weight: normal;
  font-style: italic;
  color: ${({ theme }) => theme.secondaryText};
`

const TypeName = ({ commonName, scientificName }) => (
  <span>
    {commonName && <CommonName>{commonName}</CommonName>}
    {commonName && scientificName && <span style={{ margin: '0 0.25em' }} />}
    {scientificName && <ScientificName>{scientificName}</ScientificName>}
  </span>
)

const LocationItem = styled.li`
  display: flex;
  flex-direction: row;
  padding-left: 1em;
  align-items: start;
  cursor: pointer;
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.secondaryBackground};
  }
`

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.secondaryText};
  justify-content: center;
  flex: 1;
  overflow: hidden;
  white-space: nowrap;

  div {
    align-items: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`

const ContentWrapper = styled.div`
  flex: 1;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
`

const PrimaryText = styled.div`
  font-weight: bold;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.headerText};
`

const SecondaryText = styled.div`
  font-weight: normal;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.secondaryText};
`

const LeftIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 1em;
  margin-top: 0.5em;
`

const ImageIcon = ({ imageSrc }) => (
  <CircleIcon backgroundColor={theme.green}>
    {imageSrc ? <img src={imageSrc} alt="icon" /> : <LeafIcon />}
  </CircleIcon>
)

const Locations = ({
  locations = [],
  itemCount,
  loadNextPage,
  onLocationClick,
}) => {
  const { typesAccess } = useSelector((state) => state.type)
  const { types: selectedTypes } = useSelector((state) => state.filter)

  const observerTarget = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && locations.length < itemCount) {
          loadNextPage?.()
        }
      },
      { rootMargin: '300px 0px 0px 0px' },
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [itemCount, loadNextPage]) //eslint-disable-line

  return (
    <>
      {locations.map((location, index) => (
        <LocationItem
          key={index}
          onClick={(e) => onLocationClick?.(location.id, e)}
        >
          <LeftIcon>
            <ImageIcon imageSrc={location.photo} />
          </LeftIcon>
          <ContentWrapper>
            {location.type_ids.map((typeId) => {
              const type = typesAccess.getType(typeId)
              const isSelected = selectedTypes.includes(typeId)
              return (
                <TypeNameTagWrapper key={typeId} isSelected={isSelected}>
                  <TypeName
                    commonName={type?.commonName}
                    scientificName={type?.scientificName}
                  />
                </TypeNameTagWrapper>
              )
            })}
            <DistanceText distance={location.distance} />
          </ContentWrapper>
        </LocationItem>
      ))}
      {locations.length < itemCount && (
        <>
          <LocationItem ref={observerTarget}>
            <LeftIcon>
              <Skeleton circle width="1.75rem" height="1.75rem" />
            </LeftIcon>
            <TextContainer>
              <PrimaryText>
                <Skeleton width={150} />
              </PrimaryText>
              <SecondaryText>
                <Skeleton width={50} />
              </SecondaryText>
            </TextContainer>
          </LocationItem>
          {[
            ...Array(
              Math.min(Math.max(0, itemCount - locations.length - 1), 4),
            ),
          ].map((_, i) => (
            <LocationItem key={`skeleton-${i}`}>
              <LeftIcon>
                <Skeleton circle width="1.75rem" height="1.75rem" />
              </LeftIcon>
              <TextContainer>
                <PrimaryText>
                  <Skeleton width={150} />
                </PrimaryText>
                <SecondaryText>
                  <Skeleton width={50} />
                </SecondaryText>
              </TextContainer>
            </LocationItem>
          ))}
        </>
      )}
    </>
  )
}
Locations.displayName = 'Locations'

export default Locations
