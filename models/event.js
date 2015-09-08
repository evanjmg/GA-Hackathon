var mongoose = require('mongoose');

var Event = new mongoose.Schema({
  name: String,
  address: String,
  url: String,
  price: Number,
  img_url: String,
  lat: String,
  lon: String,
  description: String,
  date: Date,
  invites: [{ 
      accepted: { type: boolean, default:false },
      attendee: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      paired_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }]
})

module.exports = Event.model('Event', Event);