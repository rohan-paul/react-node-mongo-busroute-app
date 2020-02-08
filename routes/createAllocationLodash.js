/* Utility function (createAllocationLodash) to create a top-level field (named 'busroute_objectId') from a field from the nested Busroute-object (i.e. from the referenced Busroute schema).
When I send a data back to client (front-end), it should give me the item's Busroute name ('busroute_name' filed) as a top-level field to the schema instead of this being fetched from the nested object.

The key requirement is, for the referenced Model (Busroute), I am passing only the ObjectId for the field 'busroute_objectId' with req.body but in the returned data, I will need the field 'busroute_name' as a separate top level field with data populated from the referenced Model 'Busroute'

The reason I need this variable as a top-level field rather than as a nested object, is because of the sort functionality of Material-UI table. While I was able to render the table rows properly by fetching this value from the nested returned object. But the sort functionality's various util functions were becoming too uncontrollable without a top-level field value.
*/

module.exports = {

  createAllocationBusroute: item => ({
    _id: item._id,
    busstop_objectId: item.busstop_objectId && item.busstop_objectId.map(i => i._id),
    busstop_name: item.busstop_objectId && item.busstop_objectId.map(i => i.name),


    direction: item.direction,
    name: item.name,
    routeId: item.routeId,
    status: item.status,
    routeType: item.routeType,
  }),
  // createAllocationBusroute: item => ({
  //   _id: item._id,
  //   busstop_objectId: item.busstop_objectId && item.busstop_objectId.map(i => {
  //     return {
  //       'id':i._id,
  //     'name':i.name
  //     }
  //   }),
  //   busstop_name: item.busstop_objectId && item.busstop_objectId.map(i => i.name),
  //   direction: item.direction,
  //   name: item.name,
  //   routeId: item.routeId,
  //   status: item.status,
  //   routeType: item.routeType,
  // }),
  createAllocationBusstop: item => ({
    _id: item._id,
    busroute_objectId: item.busroute_objectId && item.busroute_objectId._id,
    busroute_name: item.busroute_objectId && item.busroute_objectId.name,
    stopId: item.stopId,
    name: item.name,
    latitude: item.latitude,
    longitude: item.longitude,
  }),
}


/*
// busstop_lat_long: item.busstop_objectId && item.busstop_objectId.map(i => {
    //       return {
    //         'latitude':i._latitude,
    //       'longitude':i.longitude
    //       }
    //     }),
*/