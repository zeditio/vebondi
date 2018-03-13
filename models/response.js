const mongoose = require('mongoose') // mongoose for mongodb

// define model ================================================================
var Schema = mongoose.Schema

// create a schema
var ResponseSchema = new Schema({
  stopCode: String,
  httpStatus: Number,
  line: Number,
  latitudParada: Number,
  longitudParada: Number,
  latitud: Number,
  longitud: Number,
  text: String,
  created_at: {
    type: Date,
    // `Date.now()` returns the current unix timestamp as a number
    default: Date.now
  }
})

// the schema is useless so far
// we need to create a model using it
// make this available to our users in our Node applications
module.exports = mongoose.model('ResponseDatabase', ResponseSchema)
