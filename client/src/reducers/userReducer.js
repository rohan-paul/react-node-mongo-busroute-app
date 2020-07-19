import {
  LOAD_INITIAL_TABLE,
  ERROR_WHILE_FETCHING_INITIAL_TABLE,
  IF_BUS_STOP_EDIT_MODAL,
  IF_BUS_STOP_TABLE_SHOULD_RENDER,
  LOAD_INITIAL_BUS_STOPS_TABLE,
  ERROR_WHILE_FETCHING_INITIAL_BUS_STOPS_TABLE,
} from '../actions/types'

const initialState = {
  loading: true,
  ifBusStopEditModal: false,
  ifBusStopTableShouldRender: false,
  allBusRoutes: {
    name: '',
    busstop_name: [],
    direction: '',
    status: '',
    routeType: '',
  },
  allBusStops: {
    name: '',
    latitude: 0,
    longitude: 0,
  },
  error_while_fetching_initial_table: false,
  error_while_fetching_initial_table_BusStops: false,
  snackbar: false,
}

export default (state = initialState, actions) => {
  switch (actions.type) {
    case LOAD_INITIAL_TABLE:
      return {
        ...state,
        loading: false,
        snackbar: false,
        allBusRoutes: actions.payload,
      }
    case ERROR_WHILE_FETCHING_INITIAL_TABLE:
      return {
        ...state,
        snackbar: actions.payload,
      }

    case IF_BUS_STOP_EDIT_MODAL:
      // console.log('ACTIONS.PAYLOAD FOR ifBusStopEditModal ', actions.payload)
      return {
        ...state,
        ifBusStopEditModal: actions.payload,
      }

    case IF_BUS_STOP_TABLE_SHOULD_RENDER:
      return {
        ...state,
        ifBusStopTableShouldRender: actions.payload,
      }

    case LOAD_INITIAL_BUS_STOPS_TABLE:
      return {
        ...state,
        loading: false,
        snackbar: false,
        allBusStops: actions.payload,
      }
    case ERROR_WHILE_FETCHING_INITIAL_BUS_STOPS_TABLE:
      return {
        ...state,
        snackbar: actions.payload,
      }

    default:
      return state
  }
}
