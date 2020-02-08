/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/button-has-type */
/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import { orderBy } from 'lodash'
import { confirmAlert } from 'react-confirm-alert' // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import { Typography } from '@material-ui/core'
import BusRoutesTableRowHead from './BusRoutesTableRowHead'
import CholoSnackbar from '../../components/CholoSnackbar'
import BusRoutesTableRow from './BusRoutesTableRow'
import BusRoutesToolbar from './BusRoutesToolbar'
import NewBusRoutesFab from './NewBusRoutesFab'
import EditAddBusRoutesDialog from './EditAddBusRoutesDialog'
import LoadingSpinner from '../../components/LoadingSpinner'
import { loadInitialTable } from '../../actions/busRoutesActions'
import {
  loadInitialBusStopsTable,
  handleBusStopTableOpen,
  handleBusStopEditModal,
} from '../../actions/busStopsActions'
import choloApi from '../../choloApi'
import BusRoutesBatchUpload from './BusRoutesBatchUpload'

const useStyles = makeStyles(theme => ({
  container: {
    margin: 'auto',
    backgroundColor: theme.background.default,
  },
  tableAndFabContainer: {
    position: 'relative',
    margin: 'auto',
    maxWidth: '1400px',
    minHeight: 'calc(100vh - 100px)',
  },
  tableContainer: {
    borderRadius: theme.shape.borderRadius,
  },
  innerTableContainer: {
    height: 'calc(100vh - 190px)',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.background.paper,
  },
  table: {
    backgroundColor: theme.background.paper,
    borderRadius: theme.shape.borderRadius,
    paddingBottom: '100px',
  },
  fabContainer: {
    position: 'absolute',
    right: '0px',
    bottom: '30px',
    float: 'right',
  },
  fabToOpenBussstoptable: {
    position: 'absolute',
    left: '200px',
    bottom: '30px',
    float: 'left',
  },
  batchUploadContainer: {
    position: 'absolute',
    left: '10px',
    bottom: '50px',
    float: 'left',
  },
  changeTable: {
    position: 'absolute',
    left: '250px',
    marginLeft: '15px',
    bottom: '50px',
    float: 'left',
    height: '30px',
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius,
  },
  changeTableText: {
    color: theme.common.white,
    cursor: 'pointer',
    paddingLeft: '10px',
    paddingRight: '10px',
    paddingTop: '5px',
    paddingBottom: '4px',
  },
  spinner: {
    width: '1400px',
    height: 'calc(100vh - 100px)',
  },
  // below for the delete confirmation
  custom_ui: {
    textAlign: 'center',
    width: '500px',
    padding: '40px',
    background: theme.palette.primary.main,
    boxShadow: '0 20px 75px rgba(0, 0, 0, 0.23)',
    color: theme.common.white,
  },
  custom_ui_h1: {
    marginTop: '0',
  },
  custom_ui_button: {
    width: '160px',
    padding: '10px',
    border: '1px solid #fff',
    margin: '10px',
    cursor: 'pointer',
    background: 'none',
    color: '#fff',
    fontSize: '14px',
  },
}))

const BusRoutesMainTable = () => {
  const globalStore = useSelector(state => state.globalStore)
  const dispatch = useDispatch()
  const classes = useStyles()
  const [order, setOrder] = React.useState({
    field: 'name',
    direction: 'asc',
  })
  const [editMode, setEditMode] = useState(false)
  const [selected, setSelected] = useState([])
  const [snackbar, setSnackbar] = useState(false)
  const [initialLoadingErrSnackbar, setInitialLoadingErrSnackbar] = useState(false)

  const closeSnackbar = () => setSnackbar(false)

  const tableToRender = globalStore.ifBusStopTableShouldRender
    ? globalStore.allBusStops
    : globalStore.allBusRoutes

  const onBatchUpload = () => {
    if (globalStore.ifBusStopTableShouldRender) {
      dispatch(loadInitialBusStopsTable())
    } else {
      dispatch(loadInitialTable())
    }
  }

  useEffect(() => {
    dispatch(loadInitialBusStopsTable())
    dispatch(loadInitialTable())
    setInitialLoadingErrSnackbar(globalStore.snackbar)
    setSelected([...selected])
  }, [tableToRender.length, globalStore.snackbar, globalStore.ifBusStopTableShouldRender])

  const onOrderChange = property =>
    setOrder({
      field: property,
      direction: order.field === property && order.direction === 'asc' ? 'desc' : 'asc',
    })

  const isSelected = busRoute => selected.indexOf(busRoute) !== -1

  const updateSelected = busRoute => {
    const index = selected.indexOf(busRoute)
    if (index !== -1) {
      selected.splice(index, 1)
    } else {
      selected.push(busRoute)
    }
    setSelected([...selected])
  }

  const toggleEditMode = () => setEditMode(!editMode)

  const onEditBusRoutes = () => toggleEditMode()

  const confirmDeleteCustom = idsToDeleteArr => {
    let payload = {}
    if (globalStore.ifBusStopTableShouldRender) {
      payload = {
        busstop_id_list_arr: idsToDeleteArr,
      }
    } else {
      payload = {
        busroute_id_list_arr: idsToDeleteArr,
      }
    }
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className={classes.custom_ui}>
            <div className={classes.custom_ui_h1}>Are you sure ?</div>
            <p>You want to delete this Bus Route Record</p>

            <button className={classes.custom_ui_button} onClick={onClose}>
              No
            </button>
            <button
              className={classes.custom_ui_button}
              onClick={() => {
                if (globalStore.ifBusStopTableShouldRender) {
                  choloApi
                    .deleteBusStops(payload)
                    .then(() => {
                      dispatch(loadInitialBusStopsTable())
                      setSelected([])
                      onClose()
                    })
                    .catch(err => setSnackbar(err.response.data.message || err.response.data.error))
                } else {
                  choloApi
                    .deleteBusRoutes(payload)
                    .then(() => {
                      dispatch(loadInitialTable())
                      setSelected([])
                      onClose()
                    })
                    .catch(err => setSnackbar(err.response.data.message || err.response.data.error))
                }
              }}
            >
              Yes, Delete it!
            </button>
          </div>
        )
      },
    })
  }

  const onNewBusRoute = () => {
    setSelected([])
    setEditMode(true)
  }

  const onSaveBusRoute = busRoute => {
    setSnackbar(busRoute)
    setSelected([])
    toggleEditMode()
    if (globalStore.ifBusStopTableShouldRender) {
      dispatch(loadInitialBusStopsTable())
    } else {
      dispatch(loadInitialTable())
    }
  }

  return (
    <div className={classes.container}>
      {/* {console.log('ALL SELECTED ', JSON.stringify(selected))}
      {console.log('ROUTE NAME ', window.location.pathname)} */}

      <div className={classes.tableAndFabContainer}>
        {globalStore.loading ? (
          <div className={classes.spinner}>
            <LoadingSpinner />
          </div>
        ) : (
          <div>
            <BusRoutesToolbar
              confirmDeleteCustom={confirmDeleteCustom}
              selected={selected}
              onEditBusRoutes={onEditBusRoutes}
            />
            <TableContainer className={classes.tableContainer}>
              <div className={classes.innerTableContainer}>
                <Table stickyHeader className={classes.table}>
                  <BusRoutesTableRowHead
                    busRoutes={tableToRender}
                    selected={selected}
                    order={order}
                    onOrderChange={onOrderChange}
                    setSelected={setSelected}
                  />

                  <TableBody>
                    {orderBy(tableToRender, [order.field], [order.direction]).map(busRoute => (
                      <BusRoutesTableRow
                        busRoute={busRoute}
                        selectedItems={selected.filter(i => i._id === busRoute._id)}
                        selected={isSelected(busRoute)}
                        onSelected={updateSelected}
                        key={busRoute._id || busRoute.name}
                      >
                        {/* {console.log('CURRENT VALUE ', busRoute)} */}
                      </BusRoutesTableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TableContainer>
          </div>
        )}
        <div className={classes.batchUploadContainer}>
          <BusRoutesBatchUpload onBatchUpload={onBatchUpload} />
        </div>
        <div className={classes.changeTable}>
          {globalStore.ifBusStopTableShouldRender ? (
            <div
              onClick={() => {
                setSelected([])
                dispatch(handleBusStopEditModal(false))
                dispatch(handleBusStopTableOpen(false))
              }}
            >
              <Typography className={classes.changeTableText}>
                Click to see Bus Route Table
              </Typography>
            </div>
          ) : (
            <div
              onClick={() => {
                setSelected([])
                dispatch(handleBusStopEditModal(true))
                dispatch(handleBusStopTableOpen(true))
              }}
            >
              <Typography variant="body1" className={classes.changeTableText}>
                Click to see Bus Stops Table
              </Typography>
            </div>
          )}
        </div>
        <div className={classes.fabContainer}>
          {globalStore.ifBusStopTableShouldRender ? (
            <NewBusRoutesFab ifBusstopEditModalShouldOpen onNewBusRoute={onNewBusRoute} />
          ) : (
            <NewBusRoutesFab onNewBusRoute={onNewBusRoute} />
          )}
        </div>
        {/* {console.log('INIT LOADING SNACKBAR ', initialLoadingErrSnackbar)} */}

        <CholoSnackbar
          open={
            snackbar === true ||
            typeof snackbar === 'object' ||
            initialLoadingErrSnackbar === 'Error occurred while loading BusRoute data'
          }
          variant="error"
          message={
            // eslint-disable-next-line no-nested-ternary
            initialLoadingErrSnackbar === 'Error occurred while loading BusRoute data'
              ? 'Error occurred while loading BusRoute data'
              : snackbar && snackbar._id
              ? `${snackbar && snackbar.name} was successfully edited`
              : `${snackbar && snackbar.name} was successfully added`
          }
          onClose={closeSnackbar}
        />
      </div>
      <EditAddBusRoutesDialog
        busRoute={selected.length === 0 ? undefined : selected[0]}
        open={editMode}
        onCancel={toggleEditMode}
        onSuccess={onSaveBusRoute}
      />
    </div>
  )
}

BusRoutesMainTable.propTypes = {
  onClose: PropTypes.func.isRequired,
}

export default BusRoutesMainTable
