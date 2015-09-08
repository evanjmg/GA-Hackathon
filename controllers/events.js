var User = require('../models/user');
var Event = require('../models/event');

function eventsCreate (req, res){
    Event.create(req.body, function (err, event){
      if (err) res.send(err);
      // res.send({status: 201 });
      res.json({ event: event})
    })
}

// ALL OF OWNERS EVENTS
function eventsIndex (req, res) {
  Event.find().populate('invites._attendees').exec(function (err,events) {
    if(err) res.json({ message: "There was a problem with your request"});
    res.json(events);
  })
}

function eventsUpdate (req, res) {
  Event.find({_id: req.params.id },function(err, event) {
    if (err) res.json( { message: "Event not found or you don't own the event"});
    Event.findByIdAndUpdate(event._id, req.body, function (error, eventUpdated) {
      if (err) res.json( {message:"Event not found or you don't own the event" })
        res.json({ message: "Successfully updated event"})
    })
  });
}
function eventsDelete (req,res) {
  Event.findById(req.params._id, function (err, event) {
    if (err) res.json({ message: "An error occurred."})
      if(event) {
       event.remove();
      res.json({ message: "Event Successfully Deleted"}); }
      else {
        res.json({ message: "No event found"})
      }

  })
}
function eventsShow (req, res) {
  Event.findById(req.params.id).populate('invites._invitee').populate('_owner').exec( function (err, event){
    if (err) res.json({ message: "An error occurred"})
      if (event) { return res.json(event); } 
    else { res.json({ message: 'Event not found'})}
  })
}
function eventsCurrent (req, res) {
  // Event.findOne( {}, { sort: { created_at: -1} }).populate('invites._invitee').populate('_owner').exec( function (err, event) {
  //   if(err) res.json({ message: "An error occurred"})
  //   if (event)  { res.json({ event: event, user: req.user }) }
  //   else { 
  //   res.json({message: "You have no active events"}) }
  // })
}

module.exports = {
 eventsCreate: eventsCreate,
 eventsDelete: eventsDelete,
 eventsShow:eventsShow,
 eventsUpdate: eventsUpdate,
 eventsIndex: eventsIndex,
 eventsCurrent: eventsCurrent
}