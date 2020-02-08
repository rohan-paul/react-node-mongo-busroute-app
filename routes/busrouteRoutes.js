'use strict'

let express = require('express'),
  router = express.Router(),
  Busroute = require('../models/busroute')
const _ = require('lodash')
const flatMap = require('lodash/flatMap')
const { createAllocationBusroute } = require('./createAllocationLodash')

// To GET ALL Busroutes after flattening the nested reference to busstops obj-id- working
router.get('/', (req, res, next) => {
  Busroute.find(
    {},
    null,
    {
      sort: { createdAt: -1 },
    },
    (err, records) => {
      if (err) {
        return next(err)
      } else {
        const flatDocs = _.flatMap(records, item => [
          createAllocationBusroute(item),
        ])
        // res.status(200).json(docs)
        res.status(200).json(flatDocs)
      }
    },
  )
})

// To Add New Busroute with One-to-One relation
router.post('/', (req, res, next) => {
  let busroute = new Busroute(req.body)
  busroute.save((error, newDocument) => {
    if (error) {
      if (error.name === 'MongoError' && error.code === 11000) {
        res.status(400).send(error)
      } else {
        next(error)
      }
    } else {
      res.status(200).send(newDocument)
    }
  })
})

// To upload in batch - Working but auto-increment of routeId with 'mongoose-sequence' will not work (per their documentation)
router.post('/upload-batch-routes', (req, res, next) => {
  let batchedDocuments = req.body

  Busroute.insertMany(batchedDocuments, (error, newDocument) => {
    if (error) {
      if (error.name === 'MongoError' && error.code === 11000) {
        res.status(400).send(error)
      } else {
        next(error)
      }
    } else {
      // busroute.busstop_objectId.push(req.body.busstop_objectId)
      res.status(200).send(newDocument)
    }
   });
})


// Edit/update by busroute's _id - Working
router.put('/:id', (req, res) => {
  Busroute.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
        type: req.body.type,
      },
    },
    { new: true },
    (err, updatedRecord) => {
      if (err) {
        console.error(err)
        res.send(err)
      } else {
        res.status(200).send(updatedRecord)
      }
    },
  )
})


// Delete by _id - Working
router.route('/delete').delete((req, res, next) => {
  Busroute.remove(
    { _id: { $in: req.body.busroute_id_list_arr } },
    (err, result) => {
      if (err) {
        console.log(err)
        return next(err)
      } else {
        res.status(200).send(result)
      }
    },
  )
})

module.exports = router

/*
1> < Busroute.find({}, "-updatedAt -createdAt -__v", (err, records) > Means exclude updatedAt and createdAt, include other fields

https://mongoosejs.com/docs/api.html#model_Model.find

https://mongoosejs.com/docs/api.html#query_Query-select

2> To Test Delete route in Postman - (http://localhost:3000/api/busroutes/delete)

{
    "busroute_id_list_arr":["5c5eefa0518f005ac93cb4da", "5c5eef9b518f005ac93cb4d9"]
}

*/
