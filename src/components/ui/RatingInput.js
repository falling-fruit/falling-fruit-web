import { Star as StarEmpty, X } from '@styled-icons/boxicons-regular'
import { Star } from '@styled-icons/boxicons-solid'
import { Field } from 'formik'
import { useState } from 'react'
import styled from 'styled-components/macro'

import { theme } from './GlobalStyle'

const RatingWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  color: ${({ theme }) => theme.orange};

  label {
    cursor: pointer;

    input {
      position: fixed;
      opacity: 0;
      pointer-events: none;
    }
  }

  svg {
    width: 1.6em;
    height: 1.6em;
  }
`

const RatingInput = ({ name, score, total }) => {
  const [previewing, setPreviewing] = useState(null)

  const stars = new Array(total).fill(null).map((_, idx) => {
    if (idx + 1 > (previewing ?? Number(score))) {
      return <StarEmpty key={idx} />
    }
    return <Star key={idx} />
  })

  return (
    <RatingWrapper role="group" aria-labelledby={`${name}-group`}>
      {Number(score) !== 0 && (
        // eslint-disable-next-line jsx-a11y/label-has-associated-control
        <label>
          <Field type="radio" name={name} value={'0'} />
          <X color={theme.tertiaryText} />
        </label>
      )}
      {stars.map((icon, idx) => (
        <label
          key={idx}
          onMouseEnter={() => setPreviewing(idx + 1)}
          onMouseLeave={() => setPreviewing(null)}
        >
          <Field type="radio" name={name} value={`${idx + 1}`} />
          {icon}
        </label>
      ))}
    </RatingWrapper>
  )
}

export default RatingInput
