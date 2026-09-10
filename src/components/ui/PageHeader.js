import { Helmet } from 'react-helmet'

/**
 * Renders a page's main heading (h1) and sets the browser tab title
 * to "{children} | Falling Fruit" via react-helmet.
 *
 * The `title` prop can be used to override the tab title text when it
 * should differ from the rendered heading (e.g. when children include
 * markup). Defaults to the children when they are a plain string.
 */
const PageHeader = ({ children, title, ...props }) => {
  const tabTitle = title ?? (typeof children === 'string' ? children : null)

  return (
    <>
      {tabTitle && (
        <Helmet>
          <title>{`${tabTitle} | Falling Fruit`}</title>
        </Helmet>
      )}
      <h1 {...props}>{children}</h1>
    </>
  )
}

export default PageHeader
