var mongoose = require('mongoose');

var Event = new mongoose.Schema({
  name: String,
  address: String,
  host: String,
  location: String,
  url: String,
  price: String,
  img_url: String,
  lat: String,
  lon: String,
  description: String,
  date: Date,
  invites: [{ 
      _attendee: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      _paireduser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }]
})

module.exports = mongoose.model('Event', Event);