'use strict'

const mongoose = require('mongoose'),
AutoIncrement = require('mongoose-sequence')(mongoose),
  autopopulate = require('mongoose-autopopulate'),
  Busroute = require('./busroute'),
  Schema = mongoose.Schema

let busstopSchema = new Schema(
  {
    busroute_objectId: {
      type: Schema.Types.ObjectId,
      ref: 'Busroute',
      autopopulate: true,
    },
    name: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    stopId: { type: Number },
  },
  {
    timestamps: true,
  },
)

// plugins
busstopSchema.plugin(autopopulate)
busstopSchema.plugin(AutoIncrement, {inc_field: 'stopId'});

module.exports = mongoose.model('Busstop', busstopSchema)
