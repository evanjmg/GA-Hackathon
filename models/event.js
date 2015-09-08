var mongoose = require('mongoose');

var Event = new mongoose.Schema({
  name: String,
  address: String,
  host: String,
  location: String,
  url: String,
  // price: Number,
  img_url: String,
  lat: String,
  lon: String,
  description: String,
  date: Date,
  invites: [{ 
      _attendee: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      _paired_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }]
})

module.exports = mongoose.model('Event', Event);