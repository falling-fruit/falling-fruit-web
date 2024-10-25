import { ChevronRight } from '@styled-icons/boxicons-solid'
import { useEffect, useRef } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import CircleIcon from '../ui/CircleIcon'
import { theme } from '../ui/GlobalStyle'
import { TypeName } from '../ui/TypeName'
import DistanceText from './DistanceText'
import { ReactComponent as LeafIcon } from './leaf.svg'

const TypeNameTagWrapper = styled.span`
  display: inline-block;
  background-color: ${({ theme }) => theme.transparentOrange};
  border-radius: 12px;
  padding: 5px 10px;
  margin-right: 4px;
  margin-bottom: 4px;
  opacity: ${({ isSelected }) => (isSelected ? 1 : 0.5)};
`

const LocationItem = styled.li`
  display: flex;
  flex-direction: row;
  padding-left: 1em;
  padding-right: 1em;
  padding-top: 0.75em;
  padding-bottom: 0.25em;
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  overflow: hidden;
  height: 100%;
`

const TagsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  overflow: scroll;
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
  margin-right: 1.5em;
`

const RightIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 1.5em;
  margin-top: 1em;
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
            <TagsWrapper>
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
            </TagsWrapper>
            <DistanceText distance={location.distance} />
          </ContentWrapper>
          <RightIcon>
            <ChevronRight size="16" color={theme.blue} />
          </RightIcon>
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
            <RightIcon>
              <ChevronRight size="16" color={theme.tertiaryText} />
            </RightIcon>
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
              <RightIcon>
                <ChevronRight size="16" color={theme.tertiaryText} />
              </RightIcon>
            </LocationItem>
          ))}
        </>
      )}
    </>
  )
}
Locations.displayName = 'Locations'

export default Locations
