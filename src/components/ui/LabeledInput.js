import styled from 'styled-components/macro'

const style = styled.div`
  // can labels pass styling on to descendents like this? or should i be doing & > * or something or is that the same thing
  label {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`

/* would prefer not to have to use this but idk
const labeled = styled.label`
  display: flex;
  flex-direction: row;
`*/

const LabeledInput = ({ id, caption, leftElement, rightElement, ...props }) => (
  <style>
    <label htmlFor={id}>
      <leftElement id={id} {...props} />
      <h5>{caption}</h5>
    </label>
    {rightElement && <rightElement {...props} />}
  </style>
)

export default LabeledInput
