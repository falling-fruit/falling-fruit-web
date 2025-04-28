import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

import { validatedColor } from './GlobalStyle'

const LabelTag = styled.span`
  border-radius: 0.375em;
  vertical-align: 0.25em;
  height: 15px;
  padding: 2px;
  margin-inline-start: 5px;
  font-size: 0.5625rem;
  font-weight: bold;
  color: ${validatedColor('text', 'background')};
  background-color: ${validatedColor('secondaryBackground')};
  text-transform: uppercase;
`

const Required = (props) => {
  const { t } = useTranslation()
  return <LabelTag {...props}>{t('form.required')}</LabelTag>
}

const Optional = (props) => {
  const { t } = useTranslation()
  return <LabelTag {...props}>{t('form.optional')}</LabelTag>
}

export default LabelTag
export { Optional, Required }
