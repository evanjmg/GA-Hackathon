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
function myEventIndex(req, res) {
  Event.find( { "invites": { "$elemMatch": { "_attendee": req.body.userId  } } }).populate("invites._attendee").populate("invites._paireduser").exec(function (err, events) {
    if (err) res.json(err);
      // var i=0,j=0,pairedEvents = [];
      // for(i; i < events.length; i++) {
      //   for(j; j < events[i].invites.length; j++) {
      //     if(events[i].invites[j]._paireduser !=  undefined 
      //       && events[i].invites[j]._attendee == req.body.userId) {
      //         pairedEvents.push(events[i]);
      //       break
      //     }
      //   }
      // }
      // if(pairedEvents != []) {
      res.json(events) 
    // } else {
    //   res.json({ message: "you have no paired events"});
    // }
  })
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
function invitesPairUp(req,res) {
  User.findById(req.body.userId, function (err, user) {
    if(err) res.json({ message: "An Error occured with userId - either wrong or the server is not working"})
      Event.findById(req.body.eventId, function (err, mainEvent) {

        var i=0,j=0,k=0;
            pairedUsers= false; 

     
        for (i;i < mainEvent.invites.length; i++) {
         
          if(mainEvent.invites[i]._attendee !== (null || undefined) && mainEvent.invites[i]._attendee !== user._id) {
            if(mainEvent.invites[i]._paireduser == null) {
                var otherUserId = mainEvent.invites[i]._attendee
                pairedUsers = true;
              break;
            } 
          } 
        }
        if (pairedUsers) {
            for (j;j < mainEvent.invites.length; j++) {
              if(mainEvent.invites[j]._attendee == user.id) {
                 mainEvent.invites[j]._paireduser = otherUserId;
                  break;
              }
            }
            for (k;k < mainEvent.invites.length; k++) {
              if(mainEvent.invites[k]._attendee == otherUserId) {
                 mainEvent.invites[k]._paireduser = user.id;
                  break;
              }
            }
            mainEvent.save(function(err) {
              if (err) res.send(err)
            res.json(mainEvent); 
            });
        } else {
          res.json({ message: "no available paired users or may be already paired", success: false })
        }
     
      })

  })
}
module.exports = {
  myEventIndex: myEventIndex,
  invitesPairUp: invitesPairUp,
  invitesPending: invitesPending,
  invitesIndex: invitesIndex,
  invitesAccept: invitesAccept,
  invitesCreate: invitesCreate,
  invitesDelete: invitesDelete
}