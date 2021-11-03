import styled from 'styled-components/macro'

const Grid = styled.div`
  @media ${({ theme }) => theme.device.mobile} {
    grid-template-columns: 160px 160px;
    gap: 6px;
    margin-top: 17px;
    margin-bottom: 17px;
  }
  @media ${({ theme }) => theme.device.desktop} {
    margin: 16px;
    gap: 8px;
    grid-template-columns: 156px auto;
  }
  color: ${({ theme }) => theme.secondaryText};
  float: ${(props) => props.float || 'right'};
  display: grid;
`

const Image = styled.img`
  @media ${({ theme }) => theme.device.mobile} {
    width: 160px;
    height: 94px;
  }
  @media ${({ theme }) => theme.device.desktop} {
    width: 156px;
    height: 195px;
  }
  object-fit: cover;
  display: block;
`

export { Grid, Image }
