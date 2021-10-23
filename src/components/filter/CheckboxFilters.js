import { css } from 'styled-components'
import styled from 'styled-components/macro'

import Checkbox from '../ui/Checkbox'

const CHECKBOX_FIELDS = [
  {
    field: 'muni',
    label: 'Municipal Tree Inventories',
  },
  {
    field: 'invasive',
    label: 'Invasive Species Only',
  },
]

const StyledLabel = styled.label`
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: bold;
  color: ${({ theme }) => theme.secondaryText};

  ${({ addMargin }) =>
    addMargin &&
    css`
      &:not(:last-child) {
        margin-bottom: ${({ addMargin }) => addMargin && '8px'};

        @media ${({ theme }) => theme.device.mobile} {
          margin-top: ${({ addMargin }) => addMargin && '15px'};
        }
      }
    `}
`

const ShowOnMapFilter = ({ values, onChange }) => (
  <StyledLabel addMargin={false} key={'showOnMap'} htmlFor={'showOnMap'}>
    <Checkbox
      id={'showOnMap'}
      checked={values.showOnMap}
      name={'showOnMap'}
      onChange={(event) =>
        onChange({
          ...values,
          ['showOnMap']: event.target.checked,
        })
      }
    />
    {'Show On Map'}
  </StyledLabel>
)

const MuniAndInvasiveFilters = ({ values, onChange }) =>
  CHECKBOX_FIELDS.map(({ field, label }) => (
    <StyledLabel addMargin key={field} htmlFor={field}>
      <Checkbox
        id={field}
        checked={values[field]}
        name={field}
        onChange={(event) =>
          onChange({
            ...values,
            [field]: event.target.checked,
          })
        }
      />
      {label}
    </StyledLabel>
  ))

export { MuniAndInvasiveFilters, ShowOnMapFilter }
