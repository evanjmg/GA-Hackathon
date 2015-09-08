var User = require('../models/user');
var Event = require('../models/event');

function invitesIndex(req, res) {
  // Event.findById(req.params.id)
  //   .populate('invites._attendees')
  //   .exec( function (err, event) {
  //     if (err) res.status(403).send({ message: "An error occurred - Couldn't retreive invites"})

  //     var j=0; 
  //     var Invitations=[];
  //       for (j;j< event.invites.length; j++) {
  //         if (event.invites[j]._attendee == req.user.id) {
  //           Invitations.push(event);
  //           break;
  //         }
  //       }
  //     }

  //     if (Invitations) { 
  //       res.status(200).send(Invitations); 
  //     } else { 
  //       res.status(404).send({ message: "Could not find any invitations", Invitations: Invitations })}
  //     ); 
}

function invitesPending(req, res) {
  Event.find( 
    { "invites": { "$elemMatch": { "_invitee": req.user.id, "accepted": null  } } }
  )
    .populate('_owner')
    .populate('invites._invitees')
      .exec( function (err, events) {
        if (err) res.status(403).send({ message: "Unable to retrieve invites."})

        if (events.length > 0) { 
          res.status(200).send({ invites: events, currentUserId: req.user._id}); 
        } else { 
          res.status(404).send({ message: "Could not find any invitations."});
        }
      }); 
}

function invitesCreate (req, res) {
  Event.findById(req.body.eventId, function (err, event) {
    if (err) res.json({ message: "Could not invite user. An error occurred"})
    // go through the event to see if the user was already invited.
    if (event) {
      var i=0; 
      for(i;i < event.invites.length;i++) {
        if (event.invites[i]._attendee == req.body.userId) {
          return res.status(403).send({ message: "This user is already invited to this event"});
        } 
      }
    
      event.invites.push({ _attendee: req.body.userId });
      event.save(function (err) {
        if (err) res.status(403).send({ message: "Could not create invite."});
        res.status(200).send({ message: "Invited user to event", event: event})
      });

    } else {
      res.status(404).send({ message: "No event found."})
    }; 
  });
}

function invitesAccept (req, res) {
  Event.findById(req.body.eventId, function (err, event) {
    if (err) res.json({ message: "An error occurred. Please check your request"})
    
    event.invites.forEach(function(invite) {
      if (invite._invitee == req.user.id) {
        invite.accepted = true;
      } 
    });

    event.save( function (err) {
      res.status(200).send({ 
        message: "Invite accepted for event!", 
        event: event
      })
    });
  });
}

function invitesDelete (req,res) {
  Event.findById(req.body.eventId, function (err, event) { 
    if (err) res.json({ message: "An error occurred"});

    event.invites.forEach(function(invite) {
      if (invite._invitee == req.user.id) 
        invite.remove();
    });

    event.save( function (err) {
      if (err) res.json({ message: "An error occurred"});
      res.status(200).send({ message: "Deleted" });
    });
  });
}

module.exports = {
  invitesPending: invitesPending,
  invitesIndex: invitesIndex,
  invitesAccept: invitesAccept,
  invitesCreate: invitesCreate,
  invitesDelete: invitesDelete
}