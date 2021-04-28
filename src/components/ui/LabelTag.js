import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

import { validatedColor } from './GlobalStyle'

const LabelTag = styled.span`
  border-radius: 4px;
  vertical-align: 0.25em;
  height: 15px;
  padding: 2px;
  margin-left: 5px;
  font-size: 9px;
  font-weight: bold;
  color: ${validatedColor('text', 'background')};
  background-color: ${validatedColor('secondaryBackground')};
  text-transform: uppercase;
`

const Required = (props) => {
  const { t } = useTranslation()
  return <LabelTag {...props}>{t('Required')}</LabelTag>
}

const Optional = (props) => {
  const { t } = useTranslation()
  return <LabelTag {...props}>{t('Optional')}</LabelTag>
}

export default LabelTag
export { Optional, Required }
