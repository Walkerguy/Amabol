const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  event: {type:String, required: true},
  eventDomain: {type:String, required: true},
  date: {type:Date, required: true},
})

const Event = mongoose.model('event', EventSchema);
module.exports = Event;