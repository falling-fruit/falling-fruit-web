import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { fetchLocationChanges } from '../../redux/locationSlice'
import { fetchAndLocalizeTypes } from '../../redux/typeSlice'
import { debounce } from '../../utils/debounce'
import { groupChangesByDate } from '../../utils/groupChangesByDate'
import { PageScrollWrapper, PageTemplate } from '../about/PageTemplate'
import SkeletonLoader from '../ui/SkeletonLoader'
import InfinityList from './InfinityList'

const MAX_RECORDS = 1000

const ActivityPage = () => {
  const dispatch = useDispatch()
  const { i18n } = useTranslation()
  const language = i18n.language

  const [locationChanges, setLocationChanges] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [offset, setOffset] = useState(0)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const loadMoreRef = useRef()
  const scrollPositionRef = useRef(0)

  const { type, error } = useSelector((state) => ({
    type: state.type.typesAccess.localizedTypes,
    error: state.location.error,
  }))

  const loadMoreChanges = useCallback(async () => {
    if (isLoading) {
      return
    }

    setIsLoading(true)
    scrollPositionRef.current = window.scrollY

    try {
      const newChanges = await dispatch(
        fetchLocationChanges({ offset }),
      ).unwrap()

      if (newChanges.length > 0) {
        setLocationChanges((prevChanges) => {
          const updatedChanges = [...prevChanges, ...newChanges]
          return updatedChanges.length > MAX_RECORDS
            ? updatedChanges.slice(-MAX_RECORDS)
            : updatedChanges
        })
        setOffset((prevOffset) => prevOffset + newChanges.length)
      }
    } finally {
      setIsLoading(false)
      setIsInitialLoad(false)
      window.scrollTo({
        top: scrollPositionRef.current,
        behavior: 'smooth',
      })
    }
  }, [dispatch, isLoading, offset])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedLoadMoreChanges = useCallback(debounce(loadMoreChanges, 300), [
    loadMoreChanges,
  ])

  useEffect(() => {
    dispatch(fetchAndLocalizeTypes(language))
  }, [dispatch, language])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          setIsLoading(true)
          debouncedLoadMoreChanges()
        }
      },
      { threshold: 1.0 },
    )

    const currentRef = loadMoreRef.current

    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [isLoading, debouncedLoadMoreChanges])

  const getPlantName = (typeId) => {
    const plant = type.find((t) => t.id === typeId)
    return plant ? plant.commonName || plant.scientificName : 'Unknown Plant'
  }

  const groupedChanges = groupChangesByDate(locationChanges)

  return (
    <PageScrollWrapper>
      <PageTemplate from="Settings">
        <h1>Recent Changes</h1>
        <p>
          Explore the latest contributions from our community as they document
          fruit-bearing trees and plants across different regions.
        </p>
        {error && (
          <p>
            Error fetching changes: {error.message || JSON.stringify(error)}
          </p>
        )}
        {locationChanges.length > 0 && (
          <InfinityList
            groupedChanges={groupedChanges}
            getPlantName={getPlantName}
          />
        )}
        <div ref={loadMoreRef}></div>
        {isLoading && <SkeletonLoader count={isInitialLoad ? 5 : 1} />}{' '}
        {/* Render 3 skeletons on initial load */}
      </PageTemplate>
    </PageScrollWrapper>
  )
}

export default ActivityPage
