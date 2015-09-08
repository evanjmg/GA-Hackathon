
function postEventbriteSearch (req,res) {
  var apiRequest = unirest("GET", "https://www.eventbriteapi.com/v3/events/search/?q="+ req.body.query + "&location.latitude=51.518959&location.longitude=-0.0680837&location.within=2mi&sort_by=distance");

  apiRequest.headers({
    "Authorization": "Bearer "+ process.env.EVENTBRITE_API_TOKEN
  });


  apiRequest.end(function (resp, callback) {
    console.log(resp);
    if (res.error) throw new Error(res.error);
    // if (resp.error) res.json({ message: "There was a problem with your request", error: resp.error});
    if (resp.body.events == []) res.json({ message: "no events found", events: resp.body.events });
    var events = [];
    var oneEvent; 
    // START LOOP

     var i=0; for(i;i < 9;i++) {
      // INSERT BASIC DATA
      oneEvent = { name: resp.body.events[i].name.text, 
        description: resp.body.events[i].description.text,  url: resp.body.events[i].url, date: resp.body.events[i].start.local,
    }
    if (resp.body.events[i].logo !== null) {
      oneEvent.img_url = resp.body.events[i].logo.url
    }
    // REQUEST PRICE
    // var apiRequestPrice = unirest("GET", "https://www.eventbriteapi.com/v3/events/"+resp.body.events[i].id +"/ticket_classes/");
    // apiRequestPrice.headers({
    //   "Authorization": "Bearer "+ process.env.EVENTBRITE_API_TOKEN
    // });

    // apiRequestPrice.end(function (respPrice) {
    //   if (respPrice.ticket_classes) {
    //     oneEvent.price = respPrice.ticket_classes[0].cost.display;
    //     }
        // REQUEST VENUE
      var apiRequestVenue = unirest("GET", "https://www.eventbriteapi.com/v3/venues/"+resp.body.events[i].venue_id + "/");
      apiRequestVenue.headers({
        "Authorization": "Bearer "+ process.env.EVENTBRITE_API_TOKEN
      });
      apiRequestVenue.end(function (respVenue) {
        console.log(respVenue);
        if (respVenue.name) {
        oneEvent.location = respVenue.name
      }
        if (respVenue.address) {
        oneEvent.address = respVenue.address.address_1 + " " +  respVenue.address.city
      }
        oneEvent.lat = respVenue.latitude
        oneEvent.lon = respVenue.longitude
      events.push(oneEvent);
    });


  // });
 }
 if (i == 8) {
   
     res.json(events);
 } 
}) 
}
