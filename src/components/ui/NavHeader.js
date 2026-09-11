import { Helmet } from 'react-helmet'

/**
 * Renders a nav/top-bar title (h3) and sets the browser tab title
 * to "{children} | Falling Fruit" via react-helmet.
 *
 * The compact counterpart to PageHeader: use it for titles that live in
 * a navigation or top bar rather than in the page body.
 *
 * The `title` prop can be used to override the tab title text when it
 * should differ from the rendered heading (e.g. when children include
 * markup). Defaults to the children when they are a plain string.
 */
const NavHeader = ({ children, title, ...props }) => {
  const tabTitle = title ?? (typeof children === 'string' ? children : null)

  return (
    <>
      {tabTitle && (
        <Helmet>
          <title>{`${tabTitle} | Falling Fruit`}</title>
        </Helmet>
      )}
      <h3 {...props}>{children}</h3>
    </>
  )
}

export default NavHeader
