/* eslint-disable import/prefer-default-export */
import { LOAD_INITIAL_TABLE, ERROR_WHILE_FETCHING_INITIAL_TABLE } from './types'
import choloApi from '../choloApi'

export const loadInitialTable = () => async dispatch => {
  try {
    const res = await choloApi.loadBusRoutes()
    dispatch({
      type: LOAD_INITIAL_TABLE,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: ERROR_WHILE_FETCHING_INITIAL_TABLE,
      payload: 'Error occurred while loading BusRoute data',
    })
  }
}
