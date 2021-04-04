import '@reach/slider/styles.css'

import {
  SliderHandle,
  SliderInput,
  SliderMarker,
  SliderTrack,
} from '@reach/slider'
import styled from 'styled-components/macro'

const StyledSliderInput = styled(SliderInput)`
  [data-reach-slider-track] {
    height: 6px;
    background: ${({ theme }) => theme.secondaryBackground};
  }

  [data-reach-slider-handle] {
    box-sizing: border-box;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    border: 4px solid ${({ theme }) => theme.orange};
    background-color: ${({ theme }) => theme.transparentOrange};
  }

  [data-reach-slider-marker] {
    position: relative;
    height: 12px;
    width: 12px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.secondaryBackground};

    div {
      font-size: 12px;
      margin-top: 20px;
      /* Centers labels under each marker */
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      /* Centers text inside the label */
      text-align: center;
      /* Prevents line breaks */
      white-space: nowrap;
    }
  }
`

// We intentionally omit SliderRange because we don't want to highlight parts of the track
const Slider = ({ labels, ...props }) => (
  <StyledSliderInput max={labels.length - 1} {...props}>
    <SliderTrack>
      {labels.map((label, index) => (
        <SliderMarker key={index} value={index}>
          <div>{label}</div>
        </SliderMarker>
      ))}

      <SliderHandle />
    </SliderTrack>
  </StyledSliderInput>
)

export { Slider }
