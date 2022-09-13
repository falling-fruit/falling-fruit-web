import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

import pressData from '../../constants/data/press.json'
import { PageScrollWrapper, PageTemplate } from './PageTemplate'

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

const ConditionalLink = ({ href, children }) =>
  href ? <a href={href}>{children}</a> : <>{children}</>

const TimelineItem = ({ data }) => {
  const { published_on, outlet, outlet_url, embed_html, author, title, url } =
    data

  const date = new Date(published_on)
  const { i18n } = useTranslation()
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
        {author && ` by ${author}`}
        {embed_html && (
          <Embed dangerouslySetInnerHTML={{ __html: embed_html }} />
        )}
      </div>
    </li>
  )
}

const InThePressPage = () => {
  const years = Object.keys(pressData)
  years.sort().reverse()

  return (
    <PageScrollWrapper>
      <PageTemplate from="Settings">
        {years.map((year) => (
          <TimelineSection key={year}>
            <h2>{year}</h2>
            <ol>
              {pressData[year].map((data) => (
                <TimelineItem
                  key={data.title + data.published_on}
                  data={data}
                />
              ))}
            </ol>
          </TimelineSection>
        ))}
      </PageTemplate>
    </PageScrollWrapper>
  )
}

export default InThePressPage
