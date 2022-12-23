import { CaretDown } from '@styled-icons/boxicons-regular'
import { User } from '@styled-icons/boxicons-solid'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components/macro'

import { logout } from '../../redux/authSlice'
import Button from '../ui/Button'
import ResetButton from '../ui/ResetButton'

const StyledUser = styled(User)`
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
  z-index: 2;

  img {
    height: 100%;
    width: auto;
  }

  nav {
    height: 100%;
    display: flex;
    justify-content: space-between;
    flex: 1;

    ul {
      list-style: none;
      padding: 0;
      margin: 0 10px 0 0;
      height: 100%;
      display: flex;

      li {
        display: flex;
        justify-content: stretch;
        align-items: stretch;
        min-width: 110px;
        margin: 0;
        color: ${({ theme }) => theme.secondaryText};
        cursor: pointer;
        position: relative;
        font-weight: bold;
        font-size: 1rem;

        a,
        .content button {
          text-decoration: none;
          color: ${({ theme }) => theme.secondaryText};
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          font-weight: inherit;
          font-size: inherit;

          &.active {
            background-color: ${({ theme }) => theme.navBackground};
            color: ${({ theme }) => theme.orange};

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
        }

        &.active {
          color: ${({ theme }) => theme.orange};
        }
      }
    }
  }
`
const Dropdown = ({ className, children, label, isMatch }) => (
  <div className={className}>
    <div className={`button${isMatch ? ' active' : ''}`}>
      {label} <CaretDown height="8px" />
    </div>
    <div className="content">{children}</div>
  </div>
)

const StyledDropdown = styled(Dropdown)`
  display: flex;

  .button {
    color: ${({ theme }) => theme.secondaryText};
    border: none;
    padding: 19px 31px;
    cursor: default;

    &.active {
      color: ${({ theme }) => theme.orange};
      background-color: ${({ theme }) => theme.navBackground};

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
  }

  &:hover .content {
    display: flex;
    flex-direction: column;
  }

  .content {
    display: none;
    position: absolute;
    background-color: ${({ theme }) => theme.background};
    border-radius: 0 0 0.375em 0.375em;
    overflow: hidden;
    box-shadow: rgba(0, 0, 0, 0.05) 0 15px 15px;
    text-align: center;
    top: 56px;
    width: 100%;

    a,
    button {
      color: ${({ theme }) => theme.secondaryText};
      padding: 12px 16px;
      text-decoration: none;
      display: block;
    }

    .active::before {
      display: none;
    }
  }
`

const LogoLink = styled(Link)`
  display: block;
  height: 100%;
  padding: 10px 2em 10px 10px;
  box-sizing: border-box;
`

const SignupButton = styled(Button)`
  svg {
    width: 1em;
  }

  display: block;
  border-radius: 0.375em;
  border: none;
  font-size: 100%;
  font-family: inherit;
  cursor: pointer;
  background-color: ${({ theme }) => theme.orange};
  color: ${({ theme }) => theme.background};
`

// TODO: Clean up file structure (i.e. logo_white.svg) from ./public
const Header = () => {
  const { t } = useTranslation()
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()
  const handleLogout = () => {
    dispatch(logout())
  }

  const isAboutPage = useRouteMatch('/about/:slug') !== null
  const isAccountPage = useRouteMatch('/account') !== null

  return (
    <StyledHeader>
      <LogoLink to="/map">
        <img src="/logo_orange.svg" alt="Falling Fruit Logo" />
      </LogoLink>
      <nav>
        <ul>
          <li>
            <NavLink to="/map" activeClassName="active">
              {t('Map')}
            </NavLink>
          </li>
          <li>
            <StyledDropdown label={t('About')} isMatch={isAboutPage}>
              <NavLink to="/about/project" activeClassName="active">
                {t('The project')}
              </NavLink>
              <NavLink to="/about/data" activeClassName="active">
                {t('The data')}
              </NavLink>
              <NavLink to="/about/share" activeClassName="active">
                {t('Sharing the harvest')}
              </NavLink>
              <NavLink to="/about/press" activeClassName="active">
                {t('In the press')}
              </NavLink>
            </StyledDropdown>
          </li>
        </ul>
        <ul>
          {user ? (
            <li>
              <StyledDropdown
                label={
                  <>
                    <StyledUser height={15} /> {user.name || user.email}
                  </>
                }
                isMatch={isAccountPage}
              >
                <NavLink to="/account" activeClassName="active">
                  {t('My Account')}
                </NavLink>
                <ResetButton onClick={handleLogout}>Logout</ResetButton>
              </StyledDropdown>
            </li>
          ) : (
            <>
              <li>
                <NavLink to="/login" activeClassName="active">
                  {t('Login')}
                </NavLink>
              </li>
              <li>
                <NavLink to="/signup" activeClassName="active">
                  <SignupButton>{t('Sign up')}</SignupButton>
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </StyledHeader>
  )
}

export default Header
