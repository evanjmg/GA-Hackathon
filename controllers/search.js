var unirest = require('unirest');


function postEventbriteSearch (req,res) {
  var req = unirest("GET", "https://www.eventbriteapi.com/v3/events/search/?q="+ req.body.query + "&location.latitude=51.518959&location.longitude=-0.0680837&location.within=2mi&sort_by=distance&token="+process.env.EVENTBRITE_API_TOKEN);

  req.query({
    "url": url,
    "version": "2"
  });

  req.headers({
    "authorization": "Basic "+ process.env.IMAGGA_AUTH,
    "accept": "application/json"
  });


  req.end(function (resp) {
    if (res.error) throw new Error(res.error);
    res.json(resp.body)
});

}

module.exports = {
  postEventbriteSearch: postEventbriteSearch
}