import { SearchAlt2 as Search } from '@styled-icons/boxicons-regular'
import { Cog, Flag, Star } from '@styled-icons/boxicons-solid'
import { useState } from 'react'

import Button from '../ui/Button'
import Input from '../ui/Input'
import ListEntry from '../ui/ListEntry'
import ProgressBar from '../ui/ProgressBar'
import {
  AccordionItem,
  AccordionPanel,
  SettingsAccordion,
  SettingsAccordionButton,
} from '../ui/SettingsAccordion'
import { Slider } from '../ui/Slider'
import { Tag, TagList } from '../ui/Tag'

const SettingsPage = () => {
  const [currentStep, setCurrentStep] = useState(2)
  return (
    <>
      <p>Settings</p>
      <Button icon={<Star />}>Review</Button>
      <Button icon={<Flag />} secondary>
        Report
      </Button>
      <br />
      <br />
      <Input
        placeholder="Search for a location..."
        onChange={(e) => console.log(e.target.value)}
        onEnter={(e) => window.alert(`Received:\n${e?.target?.value}`)}
        icon={<Search />}
      />
      <br />
      <Input
        label="Demo Form Input"
        placeholder="'Sugar Maple'"
        onChange={(e) => console.log(e.target.value)}
      />
      <br />
      <TagList>
        {['Rebecca', 'Jeffrey'].map((name) => (
          <Tag key={name}>{name}</Tag>
        ))}
      </TagList>
      <br />
      <ListEntry
        leftIcons={<Star size="16" />}
        primaryText="Entry"
        secondaryText="0.3 miles"
      />
      <ListEntry
        primaryText="Entry"
        secondaryText="0.3 miles"
        rightIcons={[<Star size="16" key={1} />, <Star size="16" key={2} />]}
        size={57}
      />

      <ListEntry primaryText="Entry" rightIcons={<Star size="16" />} />
      <SettingsAccordion>
        <AccordionItem>
          <SettingsAccordionButton LeftIcon={Cog} text="Options" />
          <AccordionPanel>
            Here are some detailed instructions about doing a thing. I am very
            complex and probably contain a lot of content, so a user can hide or
            show me by clicking the button above.
          </AccordionPanel>
        </AccordionItem>
      </SettingsAccordion>
      <Slider
        style={{ margin: '0 40px' }}
        labels={['Label 1', null, 'Label 3', 'Label 4', 'Label 5']}
        steps={5}
      />
      <br />
      <br />
      <ProgressBar
        labels={['step1', 'step2', 'step3', 'step4', 'step5']}
        step={currentStep}
        onChange={setCurrentStep}
      />
    </>
  )
}

export default SettingsPage
