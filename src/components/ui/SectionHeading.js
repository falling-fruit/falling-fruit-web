import styled from 'styled-components'

import LabelTag from './LabelTag'

const SectionHeadingTitle = styled.h5`
  display: inline-block;
  color: ${({ theme }) => theme.tertiaryText};
  font-weight: bold;
  margin: 20px 5px 10px 0;
`
const SectionHeading = ({ title, labelText }) => (
  <SectionHeadingTitle>
    {title}
    <LabelTag>{labelText}</LabelTag>
  </SectionHeadingTitle>
)
export default SectionHeading
