import { CaretDown } from '@styled-icons/boxicons-regular'
import { User } from '@styled-icons/boxicons-solid'
import { useTranslation } from 'react-i18next'
import { Link, NavLink } from 'react-router-dom'
import styled from 'styled-components/macro'

const StyledHeader = styled.header`
  height: 70px;
  background-color: ${({ theme }) => theme.background};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.12);
  z-index: 1;

  img {
    height: 60%;
    width: auto;
    margin: 20% 10px;
  }

  nav {
    height: 100%;
    ul {
      list-style: none;
      padding: 0;
      margin: 0 10px 0 0;
      height: 100%;

      li {
        display: inline-grid;
        place-items: center;
        width: 110px;
        margin: 0;
        height: 100%;
        color: ${({ theme }) => theme.text};
        cursor: pointer;
        position: relative;

        a {
          text-decoration: none;
          color: ${({ theme }) => theme.text};
          text-align: center;
        }

        .active {
          background-color: ${({ theme }) => theme.secondaryBackground};
          color: ${({ theme }) => theme.orange};
          box-sizing: border-box;
          padding-top: 25px;
          height: 100%;
          width: 100%;

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
const Dropdown = ({ className, children, text }) => (
  <div className={className}>
    <div className="button">
      {text} <CaretDown height="8px"> </CaretDown>
    </div>
    <div className="content">{children}</div>
  </div>
)

const StyledDropdown = styled(Dropdown)`
  display: inline-block;

  .button {
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    padding: 16px;
    display: inline;
    border: none;
    height: 100%;
    width: 100%;
  }

  &:hover .content {
    display: block;
  }

  .content {
    display: none;
    position: absolute;
    margin-top: 15px;
    background-color: ${({ theme }) => theme.background};
    border-radius: 0px 0px 6px 6px;
    box-shadow: rgba(0, 0, 0, 0.05) 0 15px 15px;
    text-align: center;
    min-width: 100%;
    left: 0;

    a {
      color: black;
      padding: 12px 16px;
      text-decoration: none;
      display: block;
    }
  }
`

// TODO: Clean up file structure (i.e. logo_white.svg) from ./public
const Header = () => {
  const { t } = useTranslation()
  return (
    <StyledHeader>
      <img src="/logo_orange.svg" alt="Falling Fruit Logo" />
      <nav>
        <ul>
          <li>
            <NavLink to="/map" activeClassName="active">
              {t('Map')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/page2" activeClassName="active">
              {t('Page 2')}
            </NavLink>
          </li>
          <li>
            <StyledDropdown text={t('About')}>
              <Link to="/project">{t('The project')}</Link>
              <Link to="/dataset">{t('Imported datasets')}</Link>
              <Link to="/share">{t('Sharing the harvest')}</Link>
              <Link to="/press">{t('In the press')}</Link>
            </StyledDropdown>
          </li>
          <li>
            <button>
              <User /> {t('Login')}
            </button>
          </li>
        </ul>
      </nav>
    </StyledHeader>
  )
}

export default Header
