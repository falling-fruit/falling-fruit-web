import '@reach/slider/styles.css'

import { Slider, SliderInput, SliderMarker, SliderTrack } from '@reach/slider'
import styled from 'styled-components/macro'

const StyledSlider = styled(Slider)`
  width: 80%;
  margin-right: 40px;
  margin-left: 40px;

  [data-reach-slider] {
  }

  [data-reach-slider-range] {
    background: ${({ theme }) => theme.secondaryBackground};
    align-self: center;
  }

  [data-reach-slider-handle] {
    border: 4px solid;
    border-color: orange;
    background: ${({ theme }) => theme.transparentOrange};
    border-radius: 50%;
  }
  color: gray;
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

const FeedbackSlider = ({ labels, steps }) => (
  <StyledSlider min={0} max={steps - 1} step={1}>
    {populateMarkers(labels)}
    <SliderInput>
      <SliderTrack></SliderTrack>
    </SliderInput>
  </StyledSlider>
)

export { FeedbackSlider }
