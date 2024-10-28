import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { fetchLocationChanges } from '../../redux/locationSlice'
import { fetchAndLocalizeTypes } from '../../redux/typeSlice'
import { PageScrollWrapper, PageTemplate } from '../about/PageTemplate'
import InfinityList from './InfinityList'
import LazyLoader from './LazyLoader'
import { LazyLoaderWrapper } from './styles/ActivityPageStyles'
import { groupChangesByDate } from './utils/listSortUtils'

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
    if (isLoading) {
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
  }, [dispatch, isLoading, offset])

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
      <PageTemplate from="Settings">
        <h1>Recent Activity</h1>
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

        {isLoading && (
          <LazyLoaderWrapper>
            <LazyLoader />
          </LazyLoaderWrapper>
        )}
      </PageTemplate>
    </PageScrollWrapper>
  )
}

export default ActivityPage
