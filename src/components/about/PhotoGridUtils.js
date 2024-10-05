import styled from 'styled-components/macro'

const Grid = styled.div`
  @media ${({ theme }) => theme.device.mobile} {
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
    margin-top: 17px;
    margin-bottom: 17px;
    justify-content: center;
    float: 'top';
  }
  @media ${({ theme }) => theme.device.desktop} {
    margin: 16px;
    gap: 8px;
    grid-template-columns: 156px auto;
    float: ${(props) => props.float || 'right'};
  }
  color: ${({ theme }) => theme.secondaryText};
  display: grid;
`

const Image = styled.img`
  @media ${({ theme }) => theme.device.mobile} {
    width: 100%;
    max-height: 250px;
    height: auto;
  }
  @media ${({ theme }) => theme.device.desktop} {
    width: 156px;
    height: 195px;
  }
  object-fit: cover;
  display: block;
`

export { Grid, Image }
