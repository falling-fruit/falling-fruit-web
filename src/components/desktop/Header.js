import { User } from '@styled-icons/boxicons-solid'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

const StyledHeader = styled.header`
  height: 70px;
  background-color: ${({ theme }) => theme.background};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.12);

  img {
    height: 60%;
    width: auto;
    margin: 20% 10px;
  }

  nav {
    height: 100%;
    z-index: 2;
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

        li,
        &.active {
          background-color: ${({ theme }) => theme.secondaryBackground};
          color: ${({ theme }) => theme.orange};
          box-sizing: border-box;
          border-bottom: 3px solid ${({ theme }) => theme.orange};
        }

        .dropdown {
          position: relative;
          display: inline-block;
        }

        .dropbtn {
          background-color: ${({ theme }) => theme.background};
          color: ${({ theme }) => theme.text};
          padding: 16px;
          font-size: 16px;
          border: none;
        }

        .dropdown-content {
          display: none;
          position: absolute;
          background-color: ${({ theme }) => theme.background};
          min-width: 160px;
          box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
          z-index: 1;
        }

        .dropdown-content a {
          color: black;
          padding: 12px 16px;
          text-decoration: none;
          display: block;
        }

        .dropdown:hover .dropdown-content {
          display: block;
        }

        .dropdown:hover .dropbtn {
          background-color: ${({ theme }) => theme.secondaryBackground};
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
        }

        button,
        &.active {
          background-color: ${({ theme }) => theme.background};
          color: ${({ theme }) => theme.orange};
        }
      }
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
          <li className="active">{t('Map')}</li>
          <li>{t('Page 2')}</li>
          <li>
            <div className="dropdown">
              <button className="dropbtn">Dropdown</button>
              <div className="dropdown-content">
                <a href="#hi">Page 1</a>
                <a href="#hi">Page 2</a>
                <a href="#hi">Page 3</a>
              </div>
            </div>
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
