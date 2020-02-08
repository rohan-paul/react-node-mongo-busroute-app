import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
// import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormHelperText from '@material-ui/core/FormHelperText'
import MultiChipSelect from './MultiChipSelect'
import choloApi from '../../../choloApi'
// import { loadInitialBusStopsTable } from '../../../actions/busStopsActions'

const useStyles = makeStyles(theme => ({
  onError: {
    color: theme.palette.error.main,
  },
}))

const SelectBusstop = ({ target, errors, field, label, onChange, hasValidationError }) => {
  // const globalStore = useSelector(state => state.globalStore)
  // const dispatch = useDispatch()
  const classes = useStyles()
  const [selectedItem, setSelectedItem] = useState([])
  const [items, setItems] = useState([])
  const [inputValue, setInputValue] = useState(
    target.busstop_name && target.busstop_name.length === 0 ? [] : target.busstop_name
  )
  const [focused, setFocused] = React.useState(false)
  const [blurred, setBlurred] = React.useState(false)
  const [busStopName, setBusStopName] = useState([])
  const touched = focused && blurred

  const updateField = (value, override) => {
    console.log('VALUE IS ', value)
    // console.log('target.busstop_name ', target.busstop_name)
    setBusStopName(value)
    console.log('VALU IN STATE IS ', busStopName)
    onChange(
      {
        ...target,
        // busstop_name: [...target.busstop_name, value],
        busstop_name: busStopName,
      },
      {
        ...errors,
        [field]: override || touched ? hasValidationError(value) : undefined,
      }
    )
  }

  // New Refactor - changed the dependency array to busStopName.length instead of items.length
  useEffect(() => {
    // setInputValue(target.busstop_name.length === 0 ? [] : target.busstop_name) // This is making the edit act slightly out of control, will revisit later
    updateField(selectedItem)
  }, [busStopName.length])

  const addSelectedItem = item => {
    const restItems = items.filter(i => i.name !== item)
    setItems(restItems)
    setSelectedItem([...selectedItem, item])
  }

  const removeSelectedItem = item => {
    const restItems = selectedItem.filter(i => i !== item)
    setInputValue([])
    setSelectedItem(restItems)
    setItems([...items, { name: item, id: item.toLowerCase() }])
  }

  const handleChange = userSelectedItem => {
    if (selectedItem.includes(userSelectedItem)) {
      removeSelectedItem(userSelectedItem)
    } else {
      addSelectedItem(userSelectedItem)
    }
  }

  useEffect(() => {
    choloApi.loadBusstops().then(res => {
      setItems(res.data)
    })
  }, [])

  const handleChangeInput = inputVal => {
    setInputValue(inputVal)
  }

  return (
    <FormGroup>
      {/* {console.log('PREFILLED INPUT VALUE in SelectBusstop ', target[field])} */}
      <FormControl
        variant="standard"
        required
        error={!!errors[field] && selectedItem.length === 0}
        onFocus={() => (focused ? {} : setFocused(true))}
        onBlur={e => {
          if (!blurred) {
            setBlurred(true)
            updateField(e.target.value, true)
          }
        }}
      >
        <FormHelperText className={classes.onError}>
          {errors[field] && selectedItem.length === 0 ? `${label} can not be empty` : null}
        </FormHelperText>
        <MultiChipSelect
          onInputValueChange={handleChangeInput}
          inputValue={inputValue}
          availableItems={items}
          selectedItem={selectedItem}
          onChange={handleChange}
          onRemoveItem={removeSelectedItem}
        />
      </FormControl>
    </FormGroup>
  )
}

SelectBusstop.propTypes = {
  target: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}).isRequired,
  field: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  hasValidationError: PropTypes.func.isRequired,
}

export default SelectBusstop
