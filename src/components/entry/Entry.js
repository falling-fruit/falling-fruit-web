import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components/macro'

import { useSearch } from '../../contexts/SearchContext'
import { getLocationById, getReviews } from '../../utils/api'
import { EntryTabs, Tab, TabList, TabPanel, TabPanels } from '../ui/EntryTabs'
import LoadingIndicator from '../ui/LoadingIndicator'
import EntryOverview from './EntryOverview'
import EntryReviews from './EntryReviews'
import PhotoGrid from './PhotoGrid'

// Wraps the entire page and gives it a top margin if on mobile
export const Page = styled.div`
  @media ${({ theme }) => theme.device.mobile} {
    ${({ isInDrawer }) =>
      isInDrawer ? 'padding-bottom: 27px' : 'padding-top: 87px;'}
  }

  overflow: auto;
  width: 100%;
`

export const TextContent = styled.article`
  padding: 20px 23px;

  @media ${({ theme }) => theme.device.desktop} {
    padding: 12px;
  }
  h2 {
    margin-top: 0;
    font-size: 18px;
  }

  box-sizing: border-box;

  ul {
    margin: 0 0 12px 0;
  }
`

const Entry = ({ isInDrawer }) => {
  const { typesById } = useSearch()
  const [locationData, setLocationData] = useState()
  const [reviews, setReviews] = useState()
  const { id } = useParams()

  useEffect(() => {
    async function fetchEntryData() {
      const [locationData, reviews] = await Promise.all([
        getLocationById(id),
        getReviews(id),
      ])

      setLocationData(locationData)
      setReviews(reviews)
    }

    if (typesById) {
      fetchEntryData()
    }
  }, [id, typesById])

  let content
  if (!locationData || !reviews) {
    content = <LoadingIndicator vertical cover />
  } else {
    const entryOverview = <EntryOverview locationData={locationData} />
    const entryReviews = <EntryReviews reviews={reviews} />

    content = (
      <>
        <PhotoGrid
          photos={locationData.photos}
          altText={locationData.type_names.join(', ')}
        />

        {isInDrawer ? (
          <EntryTabs>
            <TabList>
              {/* TODO: Use Routing */}
              <Tab>Overview</Tab>
              <Tab>Reviews</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>{entryOverview}</TabPanel>
              <TabPanel>{entryReviews}</TabPanel>
            </TabPanels>
          </EntryTabs>
        ) : (
          <>
            {entryOverview}
            {entryReviews}
          </>
        )}
      </>
    )
  }

  return <Page isInDrawer={isInDrawer}>{content}</Page>
}

export default Entry
