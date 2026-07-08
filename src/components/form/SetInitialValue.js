import { useFormikContext } from 'formik'
import { useEffect } from 'react'

const SetInitialValue = ({ name, value }) => {
  const { setFieldValue } = useFormikContext()
  useEffect(() => {
    if (value != null) {
      setFieldValue(name, value, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}

export default SetInitialValue
