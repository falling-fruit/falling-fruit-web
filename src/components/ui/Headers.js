import { Helmet } from 'react-helmet'

const createHeader = (Heading) => {
  const Header = ({ children, ...props }) => {
    const tabTitle = typeof children === 'string' ? children : null

    return (
      <>
        {tabTitle && (
          <Helmet>
            <title>{tabTitle}</title>
          </Helmet>
        )}
        <Heading {...props}>{children}</Heading>
      </>
    )
  }

  return Header
}

export const PageHeader = createHeader('h1')

export const NavHeader = createHeader('h3')

export const PageTitle = ({ children }) => {
  const tabTitle = typeof children === 'string' ? children : null

  return tabTitle ? (
    <Helmet>
      <title>{tabTitle}</title>
    </Helmet>
  ) : null
}
