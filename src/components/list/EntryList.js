import { useWindowSize } from '@reach/window-size'
import { ChevronRight } from '@styled-icons/boxicons-solid'
import { forwardRef, useEffect, useRef } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useSelector } from 'react-redux'
import { VariableSizeList } from 'react-window'
import styled from 'styled-components/macro'

import CircleIcon from '../ui/CircleIcon'
import { theme } from '../ui/GlobalStyle'
import { TypeName } from '../ui/TypeName'
import { ReactComponent as LeafIcon } from './leaf.svg'

const TypeNameTagWrapper = styled.span`
  display: inline-block;
  background-color: ${({ theme }) => theme.transparentOrange};
  border-radius: 12px;
  padding: 5px 10px;
  margin-right: 4px;
  margin-bottom: 4px;
`

const METERS_IN_FOOT = 0.3048
const FEET_IN_MILE = 5280
const CONVERSION_THRESHOLD = 1000
const METERS_IN_KILOMETER = 1000
const IMPERIAL = 'imperial'

// Constants for layout calculations
const LEFT_PADDING = 14
const RIGHT_PADDING = 14
const LEFT_ICON_WIDTH = 18
const RIGHT_ICON_WIDTH = 18
const TAG_HEIGHT = 28
const TAG_MARGIN_RIGHT = 4
const TAG_MARGIN_BOTTOM = 8
const TAG_PADDING_HORIZONTAL = 20
const BASE_ITEM_HEIGHT = 57

const convertDistance = (distance, setting) => {
  if (setting === IMPERIAL) {
    const feet = Math.round(distance / METERS_IN_FOOT)
    if (feet < CONVERSION_THRESHOLD) {
      return `${parseFloat(feet.toPrecision(2))} feet`
    } else {
      return `${parseFloat((feet / FEET_IN_MILE).toPrecision(2))} miles`
    }
  } else {
    const meters = Math.round(distance)
    if (meters < CONVERSION_THRESHOLD) {
      return `${parseFloat(meters.toPrecision(2))} meters`
    } else {
      return `${parseFloat(
        (meters / METERS_IN_KILOMETER).toPrecision(2),
      )} kilometers`
    }
  }
}

const StyledListEntry = styled.li`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  padding: 0 14px;
  height: 42px;
  align-items: center;
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
  overflow: hidden;
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
`

const RightIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 18px;
`

const EntryIcon = ({ imageSrc }) => (
  <CircleIcon backgroundColor={theme.green}>
    {imageSrc ? <img src={imageSrc} alt="icon" /> : <LeafIcon />}
  </CircleIcon>
)

const EntryList = forwardRef(({ locations, onEntryClick, ...props }, ref) => {
  const listRef = useRef(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.resetAfterIndex(0)
    }
  }, [locations])
  const distanceUnit = useSelector((state) => state.settings.distanceUnit)
  const { typesAccess } = useSelector((state) => state.type)
  const { width: windowWidth } = useWindowSize()

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

    location.type_ids.forEach((typeId) => {
      const type = typesAccess.getType(typeId)
      const tagContent = `${type?.commonName || ''} ${
        type?.scientificName || ''
      }`.trim()
      const tagWidth = tagContent.length * 6 + TAG_PADDING_HORIZONTAL

      if (currentLineWidth + tagWidth > availableWidth) {
        linesCount++
        currentLineWidth = tagWidth + TAG_MARGIN_RIGHT
      } else {
        currentLineWidth += tagWidth + TAG_MARGIN_RIGHT
      }
    })

    return (
      BASE_ITEM_HEIGHT + (linesCount - 1) * (TAG_HEIGHT + TAG_MARGIN_BOTTOM)
    )
  }

  const Item = ({ index, style }) => {
    const location = locations[index]

    let content
    if (location) {
      content = (
        <StyledListEntry
          key={location.id}
          onClick={(e) => onEntryClick?.(location.id, e)}
          style={style}
        >
          <LeftIcon>
            <EntryIcon imageSrc={location.photo} />
          </LeftIcon>
          <ContentWrapper>
            <TagsWrapper>
              {location.type_ids.map((typeId) => {
                const type = typesAccess.getType(typeId)
                return (
                  <TypeNameTagWrapper key={typeId}>
                    <TypeName
                      commonName={type?.commonName}
                      scientificName={type?.scientificName}
                    />
                  </TypeNameTagWrapper>
                )
              })}
            </TagsWrapper>
            <SecondaryText>
              {convertDistance(location.distance, distanceUnit)}
            </SecondaryText>
          </ContentWrapper>
          <RightIcon>
            <ChevronRight size="16" color={theme.blue} />
          </RightIcon>
        </StyledListEntry>
      )
    } else {
      // Row not yet loaded
      content = (
        <StyledListEntry style={style}>
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
        </StyledListEntry>
      )
    }

    return content
  }

  return (
    <VariableSizeList
      ref={(list) => {
        listRef.current = list
        if (typeof ref === 'function') {
          ref(list)
        } else if (ref) {
          ref.current = list
        }
      }}
      {...props}
      itemSize={getItemSize}
    >
      {Item}
    </VariableSizeList>
  )
})
EntryList.displayName = 'EntryList'

export default EntryList
