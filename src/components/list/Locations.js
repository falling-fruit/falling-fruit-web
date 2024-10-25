import { useWindowSize } from '@reach/window-size'
import { ChevronRight } from '@styled-icons/boxicons-solid'
import { forwardRef, useEffect, useRef } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useSelector } from 'react-redux'
import { VariableSizeList } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
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

// Constants for layout calculations
const LEFT_PADDING = 14
const RIGHT_PADDING = 16
const LEFT_ICON_WIDTH = 35
const RIGHT_ICON_WIDTH = 18
const TAG_HEIGHT = 28
const FAT_TAG_EXTRA_HEIGHT = 20
const TAG_MARGIN_RIGHT = 4
const TAG_MARGIN_BOTTOM = 2
const TAG_PADDING_HORIZONTAL = 10
const FONT_WIDTH = 6.5
const BASE_ITEM_HEIGHT = 57

const LocationItem = styled.li`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  padding: 0 14px;
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
  margin-right: 18px;
  margin-top: 11px;
`

const RightIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 18px;
  margin-top: 22px;
`

const ImageIcon = ({ imageSrc }) => (
  <CircleIcon backgroundColor={theme.green}>
    {imageSrc ? <img src={imageSrc} alt="icon" /> : <LeafIcon />}
  </CircleIcon>
)

const Locations = forwardRef(
  (
    {
      locations,
      itemCount,
      loadNextPage,
      isNextPageLoading,
      onLocationClick,
      ...props
    },
    ref,
  ) => {
    const listRef = useRef(null)
    const { width: windowWidth } = useWindowSize()

    useEffect(() => {
      if (listRef.current) {
        listRef.current.resetAfterIndex(0)
      }
    }, [locations])

    useEffect(() => {
      if (listRef.current) {
        listRef.current.resetAfterIndex(0)
      }
    }, [windowWidth])

    const { typesAccess } = useSelector((state) => state.type)
    const { types: selectedTypes } = useSelector((state) => state.filter)

    const getItemSize = (index) => {
      const location = locations[index]
      if (!location) {
        return BASE_ITEM_HEIGHT
      }

      const availableWidth =
        windowWidth -
        LEFT_PADDING -
        RIGHT_PADDING -
        LEFT_ICON_WIDTH -
        RIGHT_ICON_WIDTH

      let currentLineWidth = 0
      let linesCount = 1
      let numFatLines = 0

      location.type_ids.forEach((typeId) => {
        const type = typesAccess.getType(typeId)
        const tagContent = `${type?.commonName || ''} ${
          type?.scientificName || ''
        }`.trim()
        let tagWidth = tagContent.length * FONT_WIDTH + TAG_PADDING_HORIZONTAL

        if (tagWidth > availableWidth - 30) {
          tagWidth = Math.ceil(tagWidth / 2)
          numFatLines++
        }

        if (currentLineWidth + tagWidth > availableWidth) {
          linesCount++
          currentLineWidth = tagWidth + TAG_MARGIN_RIGHT
        } else {
          currentLineWidth += tagWidth + TAG_MARGIN_RIGHT
        }
      })

      return (
        BASE_ITEM_HEIGHT +
        (linesCount - 1) * (TAG_HEIGHT + TAG_MARGIN_BOTTOM) +
        numFatLines * FAT_TAG_EXTRA_HEIGHT
      )
    }

    const Item = ({ index, style }) => {
      const location = locations[index]

      let content
      if (location) {
        content = (
          <LocationItem
            key={location.id}
            onClick={(e) => onLocationClick?.(location.id, e)}
            style={style}
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
        )
      } else {
        // Row not yet loaded
        content = (
          <LocationItem style={style}>
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
        )
      }

      return content
    }

    const loadMoreItems = isNextPageLoading ? () => void 0 : loadNextPage
    const isItemLoaded = (index) => index < locations.length

    return (
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={itemCount}
        loadMoreItems={loadMoreItems}
      >
        {({ onItemsRendered, ref: infiniteLoaderRef }) => (
          <VariableSizeList
            ref={(list) => {
              listRef.current = list
              if (typeof ref === 'function') {
                ref(list)
              } else if (ref) {
                ref.current = list
              }
              infiniteLoaderRef(list)
            }}
            onItemsRendered={onItemsRendered}
            {...props}
            itemCount={itemCount}
            itemSize={getItemSize}
          >
            {Item}
          </VariableSizeList>
        )}
      </InfiniteLoader>
    )
  },
)
Locations.displayName = 'Locations'

export default Locations
