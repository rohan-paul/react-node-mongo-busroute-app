'use strict'

const mongoose = require('mongoose'),
  AutoIncrement = require('mongoose-sequence')(mongoose),
  autopopulate = require('mongoose-autopopulate'),
  Busstop = require('./busstop'),
  Schema = mongoose.Schema

let busrouteSchema = new Schema(
  {
    busstop_objectId: [      {
      type: Schema.Types.ObjectId,
      ref: 'Busstop',
      autopopulate: true,
    }],
    name: { type: String },
    direction: { type: String },
    status: { type: String },
    routeType: { type: String },
    routeId: { type: Number },
  },
  {
    timestamps: true,
  },
)

// plugins
busrouteSchema.plugin(autopopulate)
busrouteSchema.plugin(AutoIncrement, {inc_field: 'routeId'});

// exports
module.exports = mongoose.model('Busroute', busrouteSchema)