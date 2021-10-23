import { CaretDown } from '@styled-icons/boxicons-regular'
import { User } from '@styled-icons/boxicons-solid'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components/macro'

import { clearAuthCredentials } from '../../redux/authSlice'

const StyledUser = styled.span`
  svg {
    fill: ${({ theme }) => theme.orange};
  }
`

const StyledHeader = styled.header`
  height: 56px;
  background-color: ${({ theme }) => theme.background};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.12);
  z-index: 1;

  img {
    height: 100%;
    width: auto;
  }

  nav {
    height: 100%;
    ul {
      list-style: none;
      padding: 0;
      margin: 0 10px 0 0;
      height: 100%;

      li {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        min-width: 110px;
        margin: 0;
        height: 100%;
        color: ${({ theme }) => theme.secondaryText};
        cursor: pointer;
        position: relative;
        font-family: Lato;
        font-style: normal;
        font-weight: bold;
        font-size: 1rem;

        .navbar {
          display: block;
          height: 100%;
          width: 100%;
        }

        a {
          text-decoration: none;
          color: ${({ theme }) => theme.secondaryText};
          text-align: center;
        }

        .active {
          background-color: ${({ theme }) => theme.navBackground};
          color: ${({ theme }) => theme.orange};
          box-sizing: border-box;
          height: 100%;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;

          ::before {
            content: '';
            width: 100%;
            position: absolute;
            background-color: ${({ theme }) => theme.orange};
            height: 3px;
            bottom: 0;
            left: 0;
          }
        }

        button {
          svg {
            width: 1em;
          }

          display: block;
          border-radius: 4px;
          border: none;
          width: 90%;
          height: 45px;
          font-size: 100%;
          font-family: inherit;
          font-weight: normal;
          cursor: pointer;
          background-color: ${({ theme }) => theme.background};
        }

        button,
        &.active {
          color: ${({ theme }) => theme.orange};
        }
      }
    }
  }
`
const Dropdown = ({ className, children, label, match }) => (
  <div className={className}>
    <div className={`button ${match && 'active'}`}>
      {label} <CaretDown height="8px" />
    </div>
    <div className="content">{children}</div>
  </div>
)

const StyledDropdown = styled(Dropdown)`
  display: inline-block;

  .button {
    color: ${({ theme }) => theme.secondaryText};
    padding: 16px;
    border: none;
    height: 100%;
    width: 100%;
    padding: 19px 31px;

    .active {
      height: 100%;
      width: 100%;
    }
  }

  &:hover .content {
    display: block;
  }

  .content {
    display: none;
    position: absolute;
    background-color: ${({ theme }) => theme.background};
    border-radius: 0px 0px 6px 6px;
    box-shadow: rgba(0, 0, 0, 0.05) 0 15px 15px;
    text-align: center;
    min-width: 100%;
    left: 0;

    a {
      color: ${({ theme }) => theme.secondaryText};
      padding: 12px 16px;
      text-decoration: none;
      display: block;
    }

    .active ::before {
      display: none;
    }
  }
`

const LogoLink = styled(Link)`
  display: block;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
`

// TODO: Clean up file structure (i.e. logo_white.svg) from ./public
const Header = () => {
  const { t } = useTranslation()
  const { authToken } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const logout = () => {
    localStorage.clear()
    sessionStorage.clear()
    dispatch(clearAuthCredentials())
  }
  return (
    <StyledHeader>
      <LogoLink to="/map">
        <img src="/logo_orange.svg" alt="Falling Fruit Logo" />
      </LogoLink>
      <nav>
        <ul>
          <li>
            <NavLink to="/map" className="navbar" activeClassName="active">
              {t('Map')}
            </NavLink>
          </li>
          <li>
            <StyledDropdown
              label={t('About')}
              match={useRouteMatch('/about/:slug')}
            >
              <NavLink to="/about/project" activeClassName="active">
                {t('The project')}
              </NavLink>
              <NavLink to="/about/dataset" activeClassName="active">
                {t('Imported datasets')}
              </NavLink>
              <NavLink to="/about/share" activeClassName="active">
                {t('Sharing the harvest')}
              </NavLink>
              <NavLink to="/about/press" activeClassName="active">
                {t('In the press')}
              </NavLink>
            </StyledDropdown>
          </li>
          <li>
            {authToken ? (
              <StyledDropdown
                label={
                  <StyledUser>
                    <User height={'15px'} />{' '}
                    {authToken ? 'Arman Rafati' : t('Login')}
                  </StyledUser>
                }
                match={false}
              >
                <button onClick={logout}>Logout</button>
              </StyledDropdown>
            ) : (
              <NavLink to="/login" className="navbar" activeClassName="active">
                <User height={'15px'} /> {t('Login')}
              </NavLink>
            )}
          </li>
        </ul>
      </nav>
    </StyledHeader>
  )
}

export default Header
