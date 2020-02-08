/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { CSVLink } from 'react-csv'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import moment from 'moment'
import ExportTableIcon from '../../components/ExportTableIcon'

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.background.default,
    position: 'relative',
  },
  actionContainer: {
    textAlign: 'right',
    position: 'absolute',
    right: '0px',
  },
}))

const BusRoutesToolbar = ({ selected, onEditBusRoutes, confirmDeleteCustom }) => {
  const classes = useStyles()
  const active = selected.length > 0
  const enableEdit = selected.length === 1
  const filename = `busRoute_${moment().format('L/h:mm')}.csv`

  const buildMenu = () => {
    return (
      <div className={classes.actionContainer}>
        <CSVLink data={selected} filename={filename}>
          <IconButton color="primary">
            <ExportTableIcon />
          </IconButton>
        </CSVLink>
        <IconButton
          color="primary"
          onClick={() => {
            const idsToDeleteArr = selected.map(i => i._id)
            confirmDeleteCustom(idsToDeleteArr)
          }}
        >
          <DeleteIcon />
        </IconButton>
        <IconButton
          color="primary"
          disabled={!enableEdit}
          // onClick={() => onEditBusRoutes(selected[0])}
          onClick={() => onEditBusRoutes(selected[0])}
        >
          <EditIcon />
        </IconButton>
      </div>
    )
  }

  return (
    <Toolbar className={classes.container}>
      <div>
        {active ? <Typography variant="subtitle1">{selected.length} selected</Typography> : null}
      </div>
      {active ? buildMenu() : null}
    </Toolbar>
  )
}

BusRoutesToolbar.propTypes = {
  selected: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onEditBusRoutes: PropTypes.func.isRequired,
  confirmDeleteCustom: PropTypes.func.isRequired,
}

export default BusRoutesToolbar
