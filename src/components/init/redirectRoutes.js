import { useSelector } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'

import { addParam, pathWithCurrentView, pathWithView } from '../../utils/appUrl'
import { useIsDesktop } from '../../utils/useBreakpoint'

const EmbedRedirect = () => {
  const mapPath = pathWithCurrentView('/map')
  const pathWithEmbed = addParam(mapPath, 'embed', 'true')
  return <Redirect to={pathWithEmbed} />
}

const DumpstersRedirect = () => {
  const mapPath = pathWithCurrentView('/map')
  const pathWithCategory = addParam(mapPath, 'c', 'freegan')
  return <Redirect to={pathWithCategory} />
}

const GrafterRedirect = () => {
  const mapPath = pathWithCurrentView('/map')
  const pathWithCategory = addParam(mapPath, 'c', 'grafter')
  return <Redirect to={pathWithCategory} />
}

const CommunityFruitTreesRedirect = () => {
  const view = {
    center: { lat: 38.48128, lng: -99.09492 },
    zoom: 5,
  }
  let mapPath = pathWithView('/map', view)
  mapPath = addParam(mapPath, 'f', '4628')
  return <Redirect to={mapPath} />
}

const SeedLibraryRedirect = () => {
  const view = {
    center: { lat: 38.48128, lng: -99.09492 },
    zoom: 5,
  }
  let mapPath = pathWithView('/map', view)
  mapPath = addParam(mapPath, 'f', '3082')
  return <Redirect to={mapPath} />
}

const HomeRedirect = () => {
  const { isLoading, isFirstLoad } = useSelector((state) => state.auth)
  const isDesktop = useIsDesktop()

  if (isLoading) {
    return null
  }

  if (isFirstLoad && !isDesktop) {
    return <Redirect to="/about/welcome" />
  } else {
    return <Redirect to={pathWithCurrentView('/map')} />
  }
}

const redirects = [
  {
    path: '/',
    exact: true,
    component: HomeRedirect,
  },
  {
    path: '/locations/embed',
    component: EmbedRedirect,
  },
  {
    path: ['/dumpsters', '/freegan'],
    component: DumpstersRedirect,
  },
  {
    path: '/grafter',
    component: GrafterRedirect,
  },
  {
    path: '/communityfruittrees',
    component: CommunityFruitTreesRedirect,
  },
  {
    path: ['/seedlibrary', '/seedlibraries'],
    component: SeedLibraryRedirect,
  },
  {
    path: '/users/sign_in',
    component: () => <Redirect to={pathWithCurrentView('/auth/sign_in')} />,
  },
  {
    path: '/users/sign_up',
    component: () => <Redirect to={pathWithCurrentView('/auth/sign_up')} />,
  },
  {
    path: '/users/password/new',
    component: () => (
      <Redirect to={pathWithCurrentView('/auth/password/new')} />
    ),
  },
  {
    path: '/users/password/edit',
    component: () => (
      <Redirect to={pathWithCurrentView('/auth/password/edit')} />
    ),
  },
  {
    path: '/users/confirmation/new',
    component: () => (
      <Redirect to={pathWithCurrentView('/auth/confirmation/new')} />
    ),
  },
  {
    path: '/users/confirmation',
    component: () => (
      <Redirect to={pathWithCurrentView('/auth/confirmation')} />
    ),
  },
  {
    path: '/users/edit',
    component: () => <Redirect to={pathWithCurrentView('/account/edit')} />,
  },
  {
    path: '/users/change-password',
    component: () => (
      <Redirect to={pathWithCurrentView('/account/change-password')} />
    ),
  },
  {
    path: '/users/change-email',
    component: () => (
      <Redirect to={pathWithCurrentView('/account/change-email')} />
    ),
  },
  {
    path: ['/home', '/locations/home', '/routes', '/routes/:routeId'],
    component: () => <Redirect to={pathWithCurrentView('/map')} />,
  },
  {
    path: '/about',
    exact: true,
    component: () => <Redirect to="/about/about-the-project" />,
  },
  {
    path: ['/data', '/datasets'],
    component: () => <Redirect to="/about/the-data" />,
  },
  {
    path: '/press',
    component: () => <Redirect to="/about/in-the-press" />,
  },
  {
    path: '/sharing',
    component: () => <Redirect to="/about/sharing-the-harvest" />,
  },
]

const redirectRoutes = redirects.map((props) => (
  <Route key={props.path} {...props} />
))
export default redirectRoutes
