/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
/* eslint-disable global-require */
/* eslint-disable no-lone-blocks */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Checkbox from '@material-ui/core/Checkbox'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import { Link } from 'react-router-dom'
import TableCellWithTooltip from './TableCellWithTooltip'
import BusRoutesRowDefinition from './BusRoutesRowDefinition'
import BusStopsRowDefinition from './BusStopsRowDefinition'

const useStyles = makeStyles({
  tableCell: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  imageClass: {
    width: '35px',
    height: '35px',
    color: 'green',
  },
})

// New Refactor - added Array.isArray(routeObj.busstop_objectId) - else sometime was getting routeObj.busstop_objectId.map is not a function error
const getArrOfObjectsForGoogleMaps = (routeObj, busStopsArr) => {
  const newArr = []
  routeObj &&
    Array.isArray(routeObj.busstop_objectId) &&
    routeObj.busstop_objectId.map(i => {
      if (Array.isArray(busStopsArr)) {
        busStopsArr.map(j => {
          if (i == j._id) {
            const newObj = {
              lat: j.latitude,
              lng: j.longitude,
            }
            newArr.push(newObj)
          }
        })
      }
    })
  return newArr
}

const RenderMapLink = pathProp => {
  const classes = useStyles()
  return (
    <Link to={{ pathname: '/map', state: pathProp }}>
      <img
        className={classes.imageClass}
        src={require('../../assets/images/city-bus-vector-2.png')}
        alt=""
      />
    </Link>
  )
}

const BusRoutesTableRow = ({ busRoute, selected, onSelected, selectedItems }) => {
  const classes = useStyles()
  const globalStore = useSelector(state => state.globalStore)
  const { allBusStops } = globalStore
  const [path, setPath] = useState([])

  useEffect(() => {
    setPath(getArrOfObjectsForGoogleMaps(selectedItems[0], allBusStops))
  }, [selectedItems.length])

  const RoutesRowDefinitionToRender = globalStore.ifBusStopTableShouldRender
    ? BusStopsRowDefinition
    : BusRoutesRowDefinition

  return (
    <TableRow
      hover
      onClick={() => onSelected(busRoute)}
      role="checkbox"
      aria-checked={selected}
      tabIndex={-1}
      key={busRoute._id}
      selected={selected}
    >
      {/* {console.log('SELECTED IN TABLE ROW ', JSON.stringify(selectedItems[0]))} */}
      {/* {console.log('PATH FOR GOOGLE POLYLINE ', JSON.stringify(path))} */}
      <TableCell padding="checkbox" className={classes.tableCell}>
        <Checkbox color="primary" checked={selected} key={`${busRoute._id}checkbox`} />
      </TableCell>
      {RoutesRowDefinitionToRender.map(row => {
        const value = row.valueFunction ? (
          row.valueFunction(busRoute)
        ) : row.label === 'Route Polymap' ? (
          <RenderMapLink pathProp={path} />
        ) : Array.isArray(busRoute[row.field]) ? (
          busRoute[row.field].join(', ').toString()
        ) : (
          busRoute[row.field]
        )

        if (row.useTooltip) {
          return (
            <TableCellWithTooltip
              align={row.align}
              value={value}
              width={row.width}
              key={busRoute._id + row.field}
            />
          )
        }
        return (
          <TableCell
            align={row.align}
            className={classes.tableCell}
            style={{ width: row.width }}
            key={busRoute._id + row.field}
          >
            <Typography variant="h4">{value}</Typography>
          </TableCell>
        )
      })}
    </TableRow>
  )
}

BusRoutesTableRow.propTypes = {
  busRoute: PropTypes.shape({
    _id: PropTypes.string,
  }).isRequired,
  selected: PropTypes.bool.isRequired,
  onSelected: PropTypes.func.isRequired,
  selectedItems: PropTypes.array.isRequired,
}

export default BusRoutesTableRow
