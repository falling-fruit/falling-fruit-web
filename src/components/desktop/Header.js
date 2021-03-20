import { User } from '@styled-icons/boxicons-solid'
import styled from 'styled-components/macro'

const StyledHeader = styled.header`
  height: 70px;
  background-color: ${({ theme }) => theme.orange};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.12);

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
        font-size: 16px;
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
          font-size: 16px;
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

const Header = () => (
  <StyledHeader>
    <div>LOGO</div>
    <nav>
      <ul>
        <li className="active">Map</li>
        <li>About</li>
        <li>
          <button>
            <User /> Login
          </button>
        </li>
      </ul>
    </nav>
  </StyledHeader>
)

export default Header
