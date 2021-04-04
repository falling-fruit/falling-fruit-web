import '@reach/slider/styles.css'

import { Slider, SliderInput, SliderMarker, SliderTrack } from '@reach/slider'
import styled from 'styled-components/macro'

const StyledSlider = styled(Slider)`
  margin-right: 40px;
  margin-left: 40px;

  [data-reach-slider-track] {
    background: ${({ theme }) => theme.secondaryBackground};
  }

  [data-reach-slider-handle] {
    border: 4px solid;
    border-color: orange;
    background: ${({ theme }) => theme.transparentOrange};
    border-radius: 50%;
  }

  [data-reach-slider-marker] {
    background: ${({ theme }) => theme.secondaryBackground};
    border-radius: 50%;
    height: 16px;
    width: 16px;
  }
`

const StyledLabel = styled.div`
  margin-top: 20px;
`

const populateMarkers = (labels) =>
  labels.map((label, index) => (
    <SliderMarker key={label} value={index}>
      <StyledLabel>{label}</StyledLabel>
    </SliderMarker>
  ))

const FeedbackSlider = ({ labels, steps, ...props }) => (
  <StyledSlider min={0} max={steps - 1} step={1} {...props}>
    {populateMarkers(labels)}
    <SliderInput>
      <SliderTrack></SliderTrack>
    </SliderInput>
  </StyledSlider>
)

export { FeedbackSlider }
