/*import { SearchAlt2 as Search } from '@styled-icons/boxicons-regular'
import { Cog, Flag, Star } from '@styled-icons/boxicons-solid'
import { useState } from 'react'

import Button from '../ui/Button'
import CaptionInput from '../ui/CaptionInput'
import Input from '../ui/Input'
import ListEntry from '../ui/ListEntry'
import Modal from '../ui/Modal'
import ProgressBar from '../ui/ProgressBar'
import {
  AccordionItem,
  AccordionPanel,
  SettingsAccordion,
  SettingsAccordionButton,
} from '../ui/SettingsAccordion'
import { Slider } from '../ui/Slider'
import { Tag, TagList } from '../ui/Tag'*/
import styled from 'styled-components/macro'

import Checkbox from '../ui/Checkbox'
import CircleIcon from '../ui/CircleIcon'
import ToggleSwitch from '../ui/ToggleSwitch'

const PageMargin = styled.div`
  margin: 26px;

  & > *:not(:last-child) {
    margin-bottom: 14px;
  }

  h5 {
    margin: 0px;
    color: ${({ theme }) => theme.secondaryText};
  }

  small {
    color: ${({ theme }) => theme.tertiaryText};
  }
`

const CheckboxLabels = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

// rename to something more holistic
const ToggleLabels = styled.div`
  display: flex;
  justify-content: space-between;
`

const StyledCircleIcon = styled(CircleIcon)`
  height: 70px;
  width: 70px;
  border-radius: 5%;
  color: gray;
`

const SettingsPage = () => (
  <PageMargin>
    <h2>Settings</h2>
    <h3>Viewing Preferences</h3>
    <CheckboxLabels>
      <Checkbox />
      <h5>Show Labels</h5>
    </CheckboxLabels>

    <CheckboxLabels>
      <Checkbox />
      <h5>Show Scientific Names</h5>
    </CheckboxLabels>

    <h3>Map Preferences</h3>
    <ToggleLabels>
      <h5>Show Labels</h5>
      <ToggleSwitch />
    </ToggleLabels>

    <h3>Language Preferences</h3>

    <h5>Map</h5>

    <StyledCircleIcon></StyledCircleIcon>
  </PageMargin>
)

export default SettingsPage
