import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { fetchLocationChanges } from '../../redux/locationSlice'
import { fetchAndLocalizeTypes } from '../../redux/typeSlice'
import { PageScrollWrapper, PageTemplate } from '../about/PageTemplate'
import InfinityList from './InfinityList'
import LazyLoader from './LazyLoader'
import { LazyLoaderWrapper } from './styles/ActivityPageStyles'
import { groupChangesByDate, timePeriods } from './utils/listSortUtils'

const MAX_RECORDS = 1000

const ActivityPage = () => {
  const dispatch = useDispatch()
  const { i18n } = useTranslation()
  const language = i18n.language

  const [locationChanges, setLocationChanges] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [offset, setOffset] = useState(0)

  const loadMoreRef = useRef()

  const { type, error } = useSelector((state) => ({
    type: state.type.typesAccess.localizedTypes,
    error: state.location.error,
  }))

  const loadMoreChanges = useCallback(async () => {
    if (isLoading || locationChanges.length >= MAX_RECORDS) {
      return
    }

    setIsLoading(true)

    try {
      const newChanges = await dispatch(
        fetchLocationChanges({ offset }),
      ).unwrap()

      if (newChanges.length > 0) {
        setLocationChanges((prevChanges) => [...prevChanges, ...newChanges])
        setOffset((prevOffset) => prevOffset + newChanges.length)
      }
    } finally {
      setIsLoading(false)
    }
  }, [dispatch, isLoading, offset, locationChanges.length])

  useEffect(() => {
    dispatch(fetchAndLocalizeTypes(language))
  }, [dispatch, language])

  useEffect(() => {
    const handleScroll = () => {
      if (
        !isLoading &&
        loadMoreRef.current &&
        loadMoreRef.current.getBoundingClientRect().bottom <= window.innerHeight
      ) {
        loadMoreChanges()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isLoading, loadMoreChanges])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMoreChanges()
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
  }, [isLoading, loadMoreChanges])

  const getPlantName = (typeId) => {
    const plant = type.find((t) => t.id === typeId)
    return plant ? plant.commonName || plant.scientificName : 'Unknown Plant'
  }

  const groupedChanges = groupChangesByDate(locationChanges)

  return (
    <PageScrollWrapper>
      {/* eslint-disable-next-line react/style-prop-object */}
      <PageTemplate from="Settings">
        <h1>Recent Activity</h1>
        <p>
          Explore the latest contributions from our community as they document
          fruit-bearing trees and plants across different regions. Your input
          helps make foraging and sustainable living accessible to everyone!
        </p>

        <p>
          Join the growing community of foragers and urban explorers by adding
          your own findings or discovering what’s nearby. Together, we can map
          the world’s!
        </p>

        <p>
          Browse through the latest additions to find trees near you, or sign up
          to add your own. Click on a tree name for more details about the
          location and type of fruit.
        </p>

        {error && (
          <p>
            Error fetching changes: {error.message || JSON.stringify(error)}
          </p>
        )}

        {locationChanges.length > 0 && (
          <InfinityList
            groupedChanges={groupedChanges}
            timePeriods={timePeriods}
            getPlantName={getPlantName}
          />
        )}

        <div ref={loadMoreRef}></div>

        {isLoading && (
          <LazyLoaderWrapper>
            <LazyLoader />
          </LazyLoaderWrapper>
        )}
        {locationChanges.length >= MAX_RECORDS && (
          <LazyLoaderWrapper>
            You have only viewed the first {MAX_RECORDS} activities!
          </LazyLoaderWrapper>
        )}
      </PageTemplate>
    </PageScrollWrapper>
  )
}

export default ActivityPage
