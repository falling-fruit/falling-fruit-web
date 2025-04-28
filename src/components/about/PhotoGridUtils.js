import styled from 'styled-components/macro'

const Grid = styled.div`
  @media ${({ theme }) => theme.device.mobile} {
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
    margin-block-start: 17px;
    margin-block-end: 17px;
    justify-content: center;
    float: 'block-start';
  }
  @media ${({ theme }) => theme.device.desktop} {
    margin: 16px;
    gap: 8px;
    grid-template-columns: 156px auto;
    float: ${(props) => props.float || 'inline-end'};
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
