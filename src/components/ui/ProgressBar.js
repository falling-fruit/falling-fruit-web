import { React, useState } from 'react'

import ProgressBarStep from '../ui/ProgressBarStep'

const ProgressBar = ({ labels }) => {
  const [index, setIndex] = useState(1)
  labels.map((label) => {
    <ProgressBarStep label={label} stepNumber={index}></ProgressBarStep>
    setIndex(index + 1)
  })
}

export default ProgressBar
