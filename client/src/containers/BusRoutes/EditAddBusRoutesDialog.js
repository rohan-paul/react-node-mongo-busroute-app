/* eslint-disable array-callback-return */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import StyledTextField from '../../components/StyledTextField'
import choloApi from '../../choloApi'
import SelectBusstop from './BusstopLoader/SelectBusstop'
import SelectMenuPropsForUpdateEdit from '../../components/SelectMenuPropsForUpdateEdit'
import { handleBusStopTableOpen } from '../../actions/busStopsActions'
import { errorOn, isNotEmpty, pipe } from '../../utils/validators'

const omit = require('lodash.omit')

const getArrOfObjectIds = (arr1, arr2) => {
  const newArr = []
  console.log('ARR2, arr2')
  arr2.map(i => {
    arr1.map(j => {
      if (i === j.name) {
        const item = { _id: j._id }
        newArr.push(item)
      }
    })
  })
  return newArr
}

const useStyles = makeStyles(theme => ({
  container: {
    border: '1px solid red',
    width: '100px',
    eight: '100px',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 450,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  actionsContainer: {
    margin: theme.spacing(2),
  },
  headerTypography: {
    marginTop: '2%',
  },
  modalButtonLabel: {
    color: theme.palette.primary.main,
  },
  modalButtonLabelEnabled: {
    color: theme.common.white,
  },
}))

const EditAddBusRoutesDialog = ({ open, busRoute, onCancel, onSuccess }) => {
  const globalStore = useSelector(state => state.globalStore)
  const dispatch = useDispatch()
  const classes = useStyles()
  const [form, setForm] = useState({ target: { ...busRoute }, errors: {} })
  const [actionError, setActionError] = useState(undefined)
  const [loading, setLoading] = useState(false)
  const [allBusStops, setAllBusStops] = useState([])

  const onChange = (targetChange, errorsChange) =>
    setForm({ target: { ...targetChange }, errors: { ...errorsChange } })

  useEffect(() => {
    onChange({ ...busRoute }, {})
    setActionError(undefined)
    choloApi.loadBusstops().then(res => {
      setAllBusStops(res.data)
    })
  }, [busRoute])

  const onClose = () => {
    onChange({ ...busRoute }, {})
    onCancel()
  }

  const formatBusStopNameArrBeforeBusRouteUpload = arr => {
    return arr.map(i => {
      return {
        ...i,
        busstop_name: i.busstop_name && i.busstop_name.split(','),
      }
    })
  }

  // console.log('form.target.busstop_name ', form.target.busstop_name)

  const onSaveBusRoutes = async () => {
    setLoading(true)
    setActionError(undefined)

    try {
      const reqBody = omit(form.target, ['latitude', 'longitude'])
      const selectedBusStops = form.target.busstop_name

      const modReqBody = {
        ...reqBody,
        busstop_objectId: getArrOfObjectIds(allBusStops, selectedBusStops),
        busstop_name: formatBusStopNameArrBeforeBusRouteUpload(selectedBusStops),
      }
      await choloApi.updateOrCreateBusRoute(modReqBody)
    } catch (e) {
      setLoading(false)
      if (e.response !== undefined) {
        setActionError(e.response.data.message || e.response.data.error)
        return
      }
      setActionError(e)
      return
    }
    setLoading(false)
    onSuccess(form.target)
  }

  const onSaveBusStops = async () => {
    setLoading(true)
    setActionError(undefined)

    try {
      const reqBody = omit(form.target, ['busstop_name', 'direction', 'status', 'routeType'])
      await choloApi.updateOrCreateBusStops(reqBody)
    } catch (e) {
      setLoading(false)

      if (e.response !== undefined) {
        setActionError(e.response.data.message || e.response.data.error)
        return
      }
      setActionError(e)
      return
    }
    setLoading(false)
    onSuccess(form.target)
  }

  // IIFE
  const isSaveDisabled = (() => {
    if (loading) {
      return true
    }
    if (
      !globalStore.ifBusStopTableShouldRender &&
      (form.target.name === '' ||
        form.target.direction === '' ||
        form.target.status === '' ||
        form.target.routeType === '')
    ) {
      return true
    }
    if (
      globalStore.ifBusStopTableShouldRender &&
      (form.target.name === '' || form.target.latitude === '' || form.target.longitude === '')
    ) {
      return true
    }
    const errors = Object.keys(form.errors).filter(key => form.errors[key] !== undefined)
    return errors.length > 0
  })()

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="md"
      variant="contained"
      onClose={onClose}
      onEnter={() => {
        if (globalStore.ifBusStopEditModal) {
          dispatch(handleBusStopTableOpen(true))
        } else {
          dispatch(handleBusStopTableOpen(false))
        }
      }}
    >
      <DialogTitle>
        <Typography variant="subtitle2" className={classes.headerTypography}>
          {!globalStore.ifBusStopTableShouldRender && form.target._id
            ? 'Edit Route'
            : !globalStore.ifBusStopTableShouldRender && !form.target._id
            ? 'Add New Route'
            : globalStore.ifBusStopTableShouldRender && form.target._id
            ? 'Edit Bus Stop'
            : globalStore.ifBusStopTableShouldRender && !form.target._id
            ? 'Add Bus Stop'
            : null}
        </Typography>
      </DialogTitle>
      <DialogContent>
        {!globalStore.ifBusStopTableShouldRender ? (
          <SelectBusstop
            target={form.target}
            field="busstop_name"
            label="Bus Stops"
            onChange={onChange}
            errors={form.errors}
            hasValidationError={pipe([errorOn(isNotEmpty, 'Bus Stops should not be empty')])}
          />
        ) : null}

        <StyledTextField
          target={form.target}
          field="name"
          label={!globalStore.ifBusStopTableShouldRender ? 'Route Name' : 'Bus Stop Name'}
          onChange={onChange}
          errors={form.errors}
          hasValidationError={errorOn(isNotEmpty, 'Name field should not be empty')}
        />

        {globalStore.ifBusStopTableShouldRender ? (
          <StyledTextField
            target={form.target}
            field="latitude"
            label="Latitude"
            onChange={onChange}
            errors={form.errors}
            hasValidationError={errorOn(isNotEmpty, 'Latitude should not be empty')}
          />
        ) : null}

        {globalStore.ifBusStopTableShouldRender ? (
          <StyledTextField
            target={form.target}
            field="longitude"
            label="Longitude"
            onChange={onChange}
            errors={form.errors}
            hasValidationError={errorOn(isNotEmpty, 'Longitude should not be empty')}
          />
        ) : null}

        {!globalStore.ifBusStopTableShouldRender ? (
          <SelectMenuPropsForUpdateEdit
            target={form.target}
            field="direction"
            label="Route Direction"
            onChange={onChange}
            errors={form.errors}
            hasValidationError={pipe([errorOn(isNotEmpty, 'Route Direction should not be empty')])}
            options={[{ name: 'UP' }, { name: 'Down' }]}
          />
        ) : null}

        {!globalStore.ifBusStopTableShouldRender ? (
          <SelectMenuPropsForUpdateEdit
            target={form.target}
            field="status"
            label="Route Status"
            onChange={onChange}
            errors={form.errors}
            hasValidationError={pipe([errorOn(isNotEmpty, 'Route Status should not be empty')])}
            options={[{ name: 'Active' }, { name: 'Inactive' }]}
          />
        ) : null}

        {!globalStore.ifBusStopTableShouldRender ? (
          <SelectMenuPropsForUpdateEdit
            target={form.target}
            field="routeType"
            label="Route Type"
            onChange={onChange}
            errors={form.errors}
            hasValidationError={pipe([errorOn(isNotEmpty, 'Route Type should not be empty')])}
            options={[{ name: 'AC' }, { name: 'General' }]}
          />
        ) : null}

        <Typography color="error" align="right">
          {actionError}
        </Typography>
      </DialogContent>
      <DialogActions className={classes.actionsContainer}>
        <Button
          onClick={onClose}
          variant="outlined"
          size="large"
          color="primary"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={!globalStore.ifBusStopTableShouldRender ? onSaveBusRoutes : onSaveBusStops}
          variant="contained"
          size="large"
          color="primary"
          disabled={isSaveDisabled}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

EditAddBusRoutesDialog.defaultProps = {
  open: true,
  busRoute: {
    name: '',
    busstop_name: [],
    direction: '',
    status: '',
    routeType: '',
    latitude: '',
    longitude: '',
  },
  onCancel: () => {},
  onSuccess: () => {},
}

EditAddBusRoutesDialog.propTypes = {
  open: PropTypes.bool,
  busRoute: PropTypes.shape({
    id: PropTypes.number,
  }),
  busStop: PropTypes.shape({
    id: PropTypes.number,
  }),
  onCancel: PropTypes.func,
  onSuccess: PropTypes.func,
}

export default EditAddBusRoutesDialog
