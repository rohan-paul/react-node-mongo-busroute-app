/* eslint-disable import/prefer-default-export */
import {
  LOAD_INITIAL_BUS_STOPS_TABLE,
  ERROR_WHILE_FETCHING_INITIAL_BUS_STOPS_TABLE,
  IF_BUS_STOP_EDIT_MODAL,
  IF_BUS_STOP_TABLE_SHOULD_RENDER,
} from './types'
import choloApi from '../choloApi'

export const loadInitialBusStopsTable = () => async dispatch => {
  try {
    const res = await choloApi.loadBusstops()
    dispatch({
      type: LOAD_INITIAL_BUS_STOPS_TABLE,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: ERROR_WHILE_FETCHING_INITIAL_BUS_STOPS_TABLE,
      payload: 'Error occurred while loading Bus Stops data',
    })
  }
}

export const handleBusStopEditModal = bool => {
  return {
    type: IF_BUS_STOP_EDIT_MODAL,
    payload: bool,
  }
}

export const handleBusStopTableOpen = bool => {
  return {
    type: IF_BUS_STOP_TABLE_SHOULD_RENDER,
    payload: bool,
  }
}
