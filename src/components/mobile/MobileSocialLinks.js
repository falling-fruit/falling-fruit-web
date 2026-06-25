import styled from 'styled-components/macro'

import SocialButtons from '../ui/SocialButtons'

const StyledSocialButtons = styled(SocialButtons)`
  width: 100%;
  display: flex;
  justify-content: space-between;

  a {
    color: ${({ theme }) => theme.text};
  }

  svg {
    height: 32px;
  }
`

const MobileSocialLinks = () => <StyledSocialButtons />

export default MobileSocialLinks
