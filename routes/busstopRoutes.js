'use strict'

const express = require('express'),
  router = express.Router(),
  Busstop = require('../models/busstop')

const _ = require('lodash')
const flatMap = require('lodash/flatMap')
const { createAllocationBusstop } = require('./createAllocationLodash')

// To GET ALL Busstops - Working in Postman*
router.get('/', (req, res, next) => {
  Busstop.find(
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
          createAllocationBusstop(item),
        ])
        res.status(200).json(flatDocs)
      }
    },
  )
})

// Create a new item (note, I have to have an object_id reference of the relevant busroute) -Working in Postman*
router.post('/', (req, res, next) => {
  let busstop = new Busstop(req.body)
  busstop.save((err, newDocument) => {
    if (err) {
      console.log('Failed to post new data because of ', err)
      return next(err)
    } else {
      res.status(200).send(newDocument)
    }
  })
})

// To upload in batch - Working but auto-increment of routeId with 'mongoose-sequence' will not work (per their documentation)
router.post('/upload-batch-stops', (req, res, next) => {
  let batchedDocuments = req.body

  Busstop.insertMany(batchedDocuments, (error, newDocument) => {
    if (error) {
      if (error.name === 'MongoError' && error.code === 11000) {
        res.status(400).send(error)
      } else {
        next(error)
      }
    } else {
      res.status(200).send(newDocument)
    }
   });
})

// Edit / Update by _id - Working in Postman*
router.put('/:id', (req, res, next) => {
  let editedItem = req.body

  Busstop.findByIdAndUpdate(req.params.id, editedItem, {
    new: true,
  }).exec((err, updatedRecord) => {
    if (err) {
      console.log(err)
      return next(err)
    } else {
      res.status(200).json(updatedRecord)
    }
  })
})

// Delete by _id array - Working in Postman
router.delete('/delete', (req, res, next) => {
  Busstop.remove(
    { _id: { $in: req.body.busstop_id_list_arr } },
    (err, records) => {
      if (err) {
        console.log(err)
        return next(err)
      } else {
        res.status(200).send(records)
      }
    },
  )
})

module.exports = router

/* 1> To test the POST (New Item) route http://localhost:3000/api/busstop in Postman - ie. adding a new item, in below Postman request, I have to take an existing object_id from the busroute module - If I dont yet have a busroute module take an arbitrary _id for filling up the objectId field for the 'busroute_objectId' prop of the scheme.

The below one is with a real object_id

{
    "busroute_objectId":"5c6c0f969c84ea3c7194a7de",
    "avg_busstop_productivity":"6",
	"benchmark_busstop_productivity":"20",
    "date":"2019-02-26"
}

==========

2> To test Edit route - http://localhost:3000/api/busstop/5c75512bc014924f462b753b

{
        "direction": "Down",
        "name": "80ABC",
        "status": "Active",
        "routeType": "General"
    }

3> Testing DELETE - router.delete("/delete"

{
	"busstop_id_list_arr":["5c6a6ecc1c01895fcfa3fe5d"]
}

*/
