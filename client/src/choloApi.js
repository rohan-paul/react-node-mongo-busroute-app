/* eslint-disable no-underscore-dangle */
import axios from 'axios'
import config from './config'

const headers = {
  'Content-Type': 'application/json',
}

const loadBusRoutes = async () =>
  axios({
    method: 'get',
    url: `/api/busroutes`,
    headers,
  })

const loadBusstops = async () =>
  axios({
    method: 'get',
    url: `/api/busstops`,
    headers,
  })

const loadBusRoutesUsers = async busRoutes =>
  Promise.all(
    busRoutes.map(i =>
      axios({
        url: `${config.url}busRoutes/${i.id}/users`,
        headers,
      })
    )
  ).then(x => x.map(r => r.data).flat())

const createBusRoute = async data =>
  axios({
    method: 'post',
    url: `/api/busroutes`,
    data,
    headers,
  })

const createBusRouteBatchUpload = async data =>
  axios({
    method: 'post',
    url: `/api/busroutes/upload-batch-routes`,
    data,
    headers,
  })

const editBusRoutes = async data =>
  axios({
    method: 'put',
    url: `/api/busroutes/${data._id}`,
    data,
    headers,
  })

const deleteBusRoutes = async payload => {
  axios({
    method: 'delete',
    url: `/api/busroutes/delete`,
    headers,
    data: payload,
  })
}

const updateOrCreateBusRoute = async data =>
  data._id !== undefined ? editBusRoutes(data) : createBusRoute(data)

const createBusStops = async data =>
  axios({
    method: 'post',
    url: `/api/busstops`,
    data,
    headers,
  })

const createBusStopsBatchUpload = async data =>
  axios({
    method: 'post',
    url: `/api/busstops/upload-batch-stops`,
    data,
    headers,
  })

const editBusStops = async data =>
  axios({
    method: 'put',
    url: `/api/busstops/${data._id}`,
    data,
    headers,
  })

const deleteBusStops = async payload => {
  axios({
    method: 'delete',
    url: `/api/busstops/delete`,
    headers,
    data: payload,
  })
}

const updateOrCreateBusStops = async data =>
  data._id !== undefined ? editBusStops(data) : createBusStops(data)

export default {
  loadBusRoutes,
  loadBusstops,
  updateOrCreateBusRoute,
  loadBusRoutesUsers,
  deleteBusRoutes,
  createBusRouteBatchUpload,
  createBusStops,
  editBusStops,
  deleteBusStops,
  updateOrCreateBusStops,
  createBusStopsBatchUpload,
}
