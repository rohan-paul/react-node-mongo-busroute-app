import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'
import { handleBusStopEditModal } from '../../actions/busStopsActions'

const useStyles = makeStyles(theme => ({
  fab: {
    margin: theme.spacing(2),
  },
  tooltipClass: {
    fontsize: '10px !important',
    marginLeft: '5px !important',
    fontFamily: 'Montserrat !important',
    backgroundColor: `${theme.palette.secondary.main} !important`,
    borderRadius: `${theme.shape.borderRadius} !important`,
    pointerEvents: 'auto !important',
    '&:hover': {
      visibility: 'visible !important',
      opacity: 1,
    },
    '&:after': {
      borderTopColor: `${theme.palette.secondary.main} !important`,
      borderTopWidth: '6px !important',
      left: '50% !important',
    },
  },
}))

const NewBusRoutesFab = ({ onNewBusRoute, ifBusstopEditModalShouldOpen }) => {
  const dispatch = useDispatch()
  const classes = useStyles()
  return (
    <Fab
      color="primary"
      aria-label="add"
      onClick={() => {
        if (ifBusstopEditModalShouldOpen) {
          dispatch(handleBusStopEditModal(true))
        } else {
          dispatch(handleBusStopEditModal(false))
        }
        onNewBusRoute()
      }}
      className={classes.fab}
    >
      <ReactTooltip
        className={classes.tooltipClass}
        place="top"
        type="info"
        effect="solid"
        delayShow={300}
        border
      />
      <p data-tip={!ifBusstopEditModalShouldOpen ? 'Add New Bus Routes' : 'Add New Bus Stops'}>
        <AddIcon />
      </p>
    </Fab>
  )
}

NewBusRoutesFab.defaultProps = {
  onNewBusRoute: () => {},
}

NewBusRoutesFab.propTypes = {
  onNewBusRoute: PropTypes.func,
  ifBusstopEditModalShouldOpen: PropTypes.bool,
}

export default NewBusRoutesFab
