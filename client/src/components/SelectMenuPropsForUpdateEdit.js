/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import FormHelperText from '@material-ui/core/FormHelperText'

const useStyles = makeStyles(theme => ({
  onError: {
    color: theme.palette.error.main,
  },
}))

const SelectMenuPropsForUpdateEdit = ({
  target,
  errors,
  field,
  label,
  onChange,
  hasValidationError,
  options,
}) => {
  const classes = useStyles()
  // const [selectedData, setSelectedData] = React.useState([])
  const inputLabel = React.useRef(null)
  const [labelWidth, setLabelWidth] = React.useState(0)
  const [focused, setFocused] = React.useState(false)
  const [blurred, setBlurred] = React.useState(false)
  const touched = focused && blurred

  const updateField = (value, override) => {
    console.log('target[field] is ', value)
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

  useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth)
  }, [])

  // const handleChange = event => {
  //   setSelectedData(event.target.value)
  // }

  return (
    <>
      {/* {console.log('selected ', selectedData)} */}
      <FormControl />
      <FormControl variant="standard" required error={!!errors[field]}>
        <InputLabel
          ref={inputLabel}
          id="demo-simple-select-outlined-label"
          style={{ borderTopWidth: 0 }}
        >
          {label}
        </InputLabel>
        <Select
          required
          value={target[field] || ''}
          onChange={e => updateField(e.target.value)}
          label={label}
          fullWidth
          onFocus={() => (focused ? {} : setFocused(true))}
          onBlur={e => {
            if (!blurred) {
              setBlurred(true)
              updateField(e.target.value, true)
            }
          }}
          labelWidth={labelWidth}
        >
          <FormHelperText className={classes.onError}>
            {errors[field] ? `${label} can not be empty` : null}
          </FormHelperText>
          {options.map(item => (
            <MenuItem key={item.name} value={item.name}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  )
}

SelectMenuPropsForUpdateEdit.propTypes = {
  options: PropTypes.array.isRequired,
  target: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}).isRequired,
  field: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  hasValidationError: PropTypes.func,
}

export default SelectMenuPropsForUpdateEdit
