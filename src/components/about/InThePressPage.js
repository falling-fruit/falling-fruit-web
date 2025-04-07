import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

import pressData from '../../constants/data/press.json'
import { InfoPage } from '../ui/PageTemplate'

const TimelineSection = styled.section`
  ol {
    list-style: none;
    padding: 0;
  }

  li {
    display: flex;
    align-items: top;

    :not(:last-of-type) {
      margin-bottom: 2em;
    }

    > div:first-of-type {
      width: 11ch;
      margin-right: 1em;
      text-align: right;
      color: ${({ theme }) => theme.tertiaryText};
    }

    > div:last-of-type {
      flex: 1;
    }
  }

  time {
    line-height: 1.5;
    display: block;
    color: ${({ theme }) => theme.secondaryText};
  }

  h3 {
    margin: 0;
    font-size: 1rem;

    a {
      font-weight: bold;
      font-size: inherit;
      text-decoration: none;
    }
  }
`

const Embed = styled.div`
  margin-top: 1em;

  @media ${({ theme }) => theme.device.mobile} {
    iframe {
      width: 100%;
      height: auto;
    }
  }
`

const Photo = styled.img`
  display: block;
  margin: 1em 0 0.5em;
  border: 1px solid #eee;
  max-width: 100%;
`

const ConditionalLink = ({ href, children }) =>
  href ? <a href={href}>{children}</a> : <>{children}</>

const TimelineItem = ({ data }) => {
  const {
    published_on,
    outlet,
    outlet_url,
    embed_html,
    author,
    title,
    url,
    photo_url,
  } = data

  const date = new Date(published_on)
  const { t, i18n } = useTranslation()
  const dateString = date.toLocaleDateString(i18n.language, {
    day: 'numeric',
    month: 'long',
  })
  const year = date.getFullYear()

  return (
    <li>
      <div>
        <time dateTime={published_on}>{dateString}</time>
        {year}
      </div>
      <div>
        <h3>
          <ConditionalLink href={outlet_url}>{outlet}</ConditionalLink>
        </h3>
        <ConditionalLink href={url}>{title}</ConditionalLink>
        {author && <> {t('glossary.by_author', { author: author })}</>}
        {embed_html && (
          <Embed dangerouslySetInnerHTML={{ __html: embed_html }} />
        )}
        {photo_url && <Photo src={photo_url} alt={title} />}
      </div>
    </li>
  )
}

const InThePressPage = () => {
  const years = Object.keys(pressData)
  years.sort().reverse()

  return (
    <InfoPage>
      {years.map((year) => (
        <TimelineSection key={year}>
          <h2>{year}</h2>
          <ol>
            {pressData[year].map((data) => (
              <TimelineItem key={data.title + data.published_on} data={data} />
            ))}
          </ol>
        </TimelineSection>
      ))}
    </InfoPage>
  )
}

export default InThePressPage
