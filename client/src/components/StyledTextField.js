import React from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'

const StyledTextField = ({ target, errors, field, label, onChange, type, hasValidationError }) => {
  const [focused, setFocused] = React.useState(false)
  const [blurred, setBlurred] = React.useState(false)
  const touched = focused && blurred
  const updateField = (value, override) => {
    onChange(
      {
        ...target,
        [field]: value,
      },
      {
        ...errors,
        [field]: override || touched ? hasValidationError(value) : undefined,
      }
    )
  }
  return (
    <TextField
      required
      value={target[field] || ''}
      onChange={e => updateField(e.target.value)}
      label={label}
      fullWidth
      type={type}
      error={!!errors[field]}
      helperText={errors[field]}
      onFocus={() => (focused ? {} : setFocused(true))}
      onBlur={e => {
        if (!blurred) {
          setBlurred(true)
          updateField(e.target.value, true)
        }
      }}
    />
  )
}

StyledTextField.defaultProps = {
  type: 'text',
  hasValidationError: () => undefined,
}

StyledTextField.propTypes = {
  target: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}).isRequired,
  field: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  hasValidationError: PropTypes.func,
}

export default StyledTextField

// autoFocus={field === 'name'}
