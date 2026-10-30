import { rgba } from 'polished'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import { createActivityDiary } from '../activity/ActivityDiary'
import { ActivityLines } from '../activity/DiaryEntry'
import worldMapPaths from '../activity/worldMapPaths.json'

const MAP_WIDTH = worldMapPaths.width
const MAP_HEIGHT = worldMapPaths.height

const CLUSTER_RADIUS_DEGREES = 28
const DOT_RADIUS = 5
const MIN_CLUSTER_DIAMETER = 24
const MAX_CLUSTER_DIAMETER = 56

const projectX = (lng) => ((lng + 180) / 360) * MAP_WIDTH
const projectY = (lat) => ((90 - lat) / 180) * MAP_HEIGHT

const clusterDiameter = (count) =>
  Math.min(
    Math.max((Math.round(Math.log10(count)) + 2) * 10, MIN_CLUSTER_DIAMETER),
    MAX_CLUSTER_DIAMETER,
  )

const clusterLabel = (count) =>
  count < 1000 ? count : `${Math.ceil(count / 1000)}K`

const GlobeWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-block: 0.5em 1em;
`

const MapFrame = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: ${MAP_WIDTH} / ${MAP_HEIGHT};
  background-color: ${({ theme }) => theme.navBackground};
  border-radius: 8px;
  overflow: hidden;
`

const WorldSvg = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;

  path {
    fill: ${({ theme }) => theme.secondaryBackground};
  }
`

const MarkerLayer = styled.div`
  position: absolute;
  inset: 0;
`

const Dot = styled.button`
  position: absolute;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  transform: translate(-50%, -50%);
`

const DotCircle = styled.span`
  display: block;
  width: ${DOT_RADIUS * 2}px;
  height: ${DOT_RADIUS * 2}px;
  border-radius: 50%;
  background-color: ${({ theme }) => rgba(theme.blue, 0.9)};
  box-shadow: 0 0 0 2px ${({ theme }) => rgba(theme.background, 0.8)};
`

const ClusterCircle = styled.button`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: 50%;
  color: ${({ theme }) => theme.background};
  background-color: ${({ theme }) => rgba(theme.blue, 0.9)};
  font-family: ${({ theme }) => theme.fonts};
  font-size: 0.75rem;
  font-weight: 400;
  cursor: pointer;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 3px ${({ theme }) => theme.shadow};
`

const POPUP_ARROW_SIZE = 8
const POPUP_GAP = POPUP_ARROW_SIZE + 4

const Popup = styled.div`
  position: absolute;
  z-index: 2;
  left: 12px;
  right: 12px;
  max-height: 220px;
  overflow-y: auto;
  padding: 10px 12px;
  background-color: ${({ theme }) => theme.background};
  border-radius: 8px;
  box-shadow: 0 2px 10px ${({ theme }) => theme.shadow};

  p {
    font-size: 0.875rem;
    line-height: 1.4;
  }
`

const PopupArrow = styled.span`
  position: absolute;
  width: 0;
  height: 0;
  transform: translateX(-50%);
  border-style: solid;
  border-width: ${POPUP_ARROW_SIZE}px;
  border-color: transparent;

  ${({ $pointsDown, theme }) =>
    $pointsDown
      ? `
    top: 100%;
    border-top-color: ${theme.background};
    border-bottom-width: 0;
  `
      : `
    bottom: 100%;
    border-bottom-color: ${theme.background};
    border-top-width: 0;
  `}
`

const clusterChanges = (changes) => {
  const points = changes
    .filter(
      (change) =>
        typeof change.lat === 'number' && typeof change.lng === 'number',
    )
    .map((change) => ({
      change,
      x: projectX(change.lng),
      y: projectY(change.lat),
    }))

  const threshold = (CLUSTER_RADIUS_DEGREES / 360) * MAP_WIDTH

  const clusters = []
  for (const point of points) {
    let target = null
    for (const cluster of clusters) {
      const dx = cluster.x - point.x
      const dy = cluster.y - point.y
      if (Math.sqrt(dx * dx + dy * dy) <= threshold) {
        target = cluster
        break
      }
    }
    if (target) {
      target.points.push(point)
      target.sumX += point.x
      target.sumY += point.y
      target.x = target.sumX / target.points.length
      target.y = target.sumY / target.points.length
    } else {
      clusters.push({
        x: point.x,
        y: point.y,
        sumX: point.x,
        sumY: point.y,
        points: [point],
      })
    }
  }

  return clusters.map((cluster, index) => ({
    id: index,
    xPercent: (cluster.x / MAP_WIDTH) * 100,
    yPercent: (cluster.y / MAP_HEIGHT) * 100,
    changes: cluster.points.map((point) => point.change),
  }))
}

const ActivityGlobe = () => {
  const { t, i18n } = useTranslation()
  const { last24hChanges } = useSelector((state) => state.activity)
  const { typesAccess } = useSelector((state) => state.type)
  const wrapperRef = useRef(null)
  const mapFrameRef = useRef(null)
  const popupRef = useRef(null)
  const [openClusterId, setOpenClusterId] = useState(null)
  const [popupLayout, setPopupLayout] = useState(null)

  const changes = last24hChanges.data

  const clusters = useMemo(() => clusterChanges(changes), [changes])

  useEffect(() => {
    if (openClusterId === null) {
      return undefined
    }

    const handlePointerDown = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpenClusterId(null)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [openClusterId])

  const openCluster = clusters.find((cluster) => cluster.id === openClusterId)

  const popupDiary = useMemo(() => {
    if (!openCluster) {
      return null
    }
    return createActivityDiary(
      openCluster.changes,
      typesAccess,
      t,
      i18n.language,
    )
  }, [openCluster, typesAccess, t, i18n.language])

  const toggleCluster = (clusterId) =>
    setOpenClusterId((current) => (current === clusterId ? null : clusterId))

  useLayoutEffect(() => {
    if (!openCluster || !mapFrameRef.current || !popupRef.current) {
      setPopupLayout(null)
      return
    }

    const mapRect = mapFrameRef.current.getBoundingClientRect()
    const popupHeight = popupRef.current.offsetHeight
    const popupRect = popupRef.current.getBoundingClientRect()

    const dotX = (openCluster.xPercent / 100) * mapRect.width
    const dotY = (openCluster.yPercent / 100) * mapRect.height

    const spaceAbove = dotY
    const pointsDown = spaceAbove >= popupHeight + POPUP_GAP

    const top = pointsDown ? dotY - popupHeight - POPUP_GAP : dotY + POPUP_GAP

    const dotViewportX = mapRect.left + dotX
    const arrowMin = POPUP_ARROW_SIZE + 4
    const arrowMax = popupRect.width - POPUP_ARROW_SIZE - 4
    const arrowLeft = Math.min(
      Math.max(dotViewportX - popupRect.left, arrowMin),
      arrowMax,
    )

    setPopupLayout({ top, pointsDown, arrowLeft })
  }, [openCluster, popupDiary])

  return (
    <GlobeWrapper ref={wrapperRef}>
      <MapFrame ref={mapFrameRef}>
        <WorldSvg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {worldMapPaths.paths.map((d, index) => (
            <path key={index} d={d} />
          ))}
        </WorldSvg>
        <MarkerLayer>
          {clusters.map((cluster) => {
            const count = cluster.changes.length
            const position = {
              left: `${cluster.xPercent}%`,
              top: `${cluster.yPercent}%`,
            }

            if (count === 1) {
              return (
                <Dot
                  key={cluster.id}
                  style={position}
                  onClick={() => toggleCluster(cluster.id)}
                  aria-label={t('pages.changes.recent_activity')}
                >
                  <DotCircle />
                </Dot>
              )
            }

            const diameter = clusterDiameter(count)
            return (
              <ClusterCircle
                key={cluster.id}
                style={{
                  ...position,
                  width: `${diameter}px`,
                  height: `${diameter}px`,
                }}
                onClick={() => toggleCluster(cluster.id)}
                aria-label={t('pages.changes.recent_activity')}
              >
                {clusterLabel(count)}
              </ClusterCircle>
            )
          })}
        </MarkerLayer>
      </MapFrame>
      {openCluster && popupDiary && (
        <Popup
          ref={popupRef}
          style={{
            top: popupLayout ? `${popupLayout.top}px` : 0,
            visibility: popupLayout ? 'visible' : 'hidden',
          }}
        >
          {popupLayout && (
            <PopupArrow
              $pointsDown={popupLayout.pointsDown}
              style={{ left: `${popupLayout.arrowLeft}px` }}
            />
          )}
          {popupDiary.entries.map((entry) => (
            <ActivityLines
              key={entry.formattedDate}
              activities={entry.activities}
              hideAuthor={false}
              onClickLink={() => setOpenClusterId(null)}
              currentUserId={undefined}
            />
          ))}
        </Popup>
      )}
    </GlobeWrapper>
  )
}

export default ActivityGlobe
