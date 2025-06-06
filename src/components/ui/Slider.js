import '@reach/slider/styles.css'

import {
  SliderHandle,
  SliderInput,
  SliderMarker,
  SliderTrack,
} from '@reach/slider'
import styled from 'styled-components/macro'

const StyledSliderInput = styled(SliderInput)`
  // Extra padding to account for space above handle and text under each marker
  padding-block: 7px 24px;
  padding-inline: 20px;

  [data-reach-slider-track] {
    height: 6px;
    background-color: ${({ theme }) => theme.secondaryBackground};
  }

  [data-reach-slider-handle] {
    box-sizing: border-box;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    border: 4px solid ${({ theme }) => theme.orange};
    background-color: ${({ theme }) => theme.transparentOrange};
    z-index: auto;
  }

  [data-reach-slider-marker] {
    position: relative;
    height: 12px;
    width: 12px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.secondaryBackground};

    div {
      font-size: 0.75rem;
      margin-block-start: 20px;
      /* Centers labels under each marker */
      position: absolute;
      inset-inline-start: 50%;
      transform: translateX(-50%);
      /* Centers text inside the label */
      text-align: center;
      /* Prevents line breaks */
      white-space: nowrap;
    }
  }
`

// TODO: fix slider losing focus after one keyboard left or right

// We intentionally omit SliderRange because we don't want to highlight parts of the track
const Slider = ({ labels = null, ...props }) =>
  labels && (
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
