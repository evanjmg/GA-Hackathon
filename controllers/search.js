var unirest = require('unirest');


function postEventbriteSearch (req,res) {
  var apiRequest = unirest("GET", "https://www.eventbriteapi.com/v3/events/search/?q="+ req.body.query + "&location.latitude=51.518959&location.longitude=-0.0680837&location.within=2mi&sort_by=distance");

  apiRequest.headers({
    "Authorization": "Bearer "+ process.env.EVENTBRITE_API_TOKEN
  });


  apiRequest.end(function (resp) {
    console.log(resp);
    if (res.error) throw new Error(res.error);
    // if (resp.error) res.json({ message: "There was a problem with your request", error: resp.error});
    if (resp.body.events == []) res.json({ message: "no events found", events: resp.body.events });

    var events = [];
    var oneEvent; 
    var i=0; for(i;i < resp.body.events.length;i++) {
      oneEvent = { name: resp.body.events[i].name.text, 
        description: resp.body.events[i].description.text,  url: resp.body.events[i].url, date: resp.body.events[i].start.local
    }
    if (resp.body.events[i].logo !== null) {
      oneEvent.img_url = resp.body.events[i].logo.url
    }
    events.push(oneEvent);
  }
    res.json(events)
});

}


module.exports = {
  postEventbriteSearch: postEventbriteSearch
}