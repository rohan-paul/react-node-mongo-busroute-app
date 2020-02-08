import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Typography from '@material-ui/core/Typography'
import BusRoutesRowDefinition from './BusRoutesRowDefinition'
import BusStopsRowDefinition from './BusStopsRowDefinition'

const useStyles = makeStyles({
  checkboxContainer: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  tableCell: {
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
})

const BusRoutesTableRowHead = ({ busRoutes, selected, order, onOrderChange, setSelected }) => {
  const globalStore = useSelector(state => state.globalStore)
  const dispatch = useDispatch()
  const classes = useStyles()
  const indeterminate = busRoutes.length !== selected.length && selected.length > 0
  const checked = busRoutes.length > 0 && busRoutes.length === selected.length
  const selectAll = () => setSelected(checked ? [] : [...busRoutes])

  const RoutesRowDefinitionToRender = globalStore.ifBusStopTableShouldRender
    ? BusStopsRowDefinition
    : BusRoutesRowDefinition

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" className={classes.checkboxContainer}>
          <Checkbox
            indeterminate={indeterminate}
            checked={checked}
            onChange={selectAll}
            key="th-checkbox"
            disabled={busRoutes.length === 0}
            color="primary"
          />
        </TableCell>
        {RoutesRowDefinitionToRender.map(
          row => (
            <TableCell
              component="th"
              scope="row"
              align={row.align}
              key={`th-${row.field}`}
              sortDirection={order.field === row.field ? order.direction : false}
              className={classes.tablecell}
              style={{ width: row.width }}
            >
              <TableSortLabel
                active={order.field === row.field}
                direction={order.direction}
                onClick={() => onOrderChange(row.field)}
              >
                <Typography variant="subtitle1">{row.label}</Typography>
              </TableSortLabel>
            </TableCell>
          ),
          this
        )}
      </TableRow>
    </TableHead>
  )
}

BusRoutesTableRowHead.propTypes = {
  busRoutes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  selected: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  order: PropTypes.shape({
    field: PropTypes.string,
    direction: PropTypes.string,
  }).isRequired,
  onOrderChange: PropTypes.func.isRequired,
  setSelected: PropTypes.func.isRequired,
}

export default BusRoutesTableRowHead
