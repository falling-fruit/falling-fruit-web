import { User } from '@styled-icons/boxicons-solid'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

const StyledHeader = styled.header`
  height: 70px;
  background-color: ${({ theme }) => theme.orange};
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
    ul {
      list-style: none;
      padding: 0;
      margin: 0 10px 0 0;
      height: 100%;

      li {
        display: inline-grid;
        place-items: center;
        font-weight: 600;
        width: 110px;
        margin: 0;
        height: 100%;
        color: white;
        cursor: pointer;

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
          font-weight: 500;
          cursor: pointer;
        }

        button,
        &.active {
          background-color: white;
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
      <img src="/logo_white.svg" alt="Falling Fruit Logo" />
      <nav>
        <ul>
          <li className="active"> {t('Map')}</li>
          <li> {t('About')}</li>
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
