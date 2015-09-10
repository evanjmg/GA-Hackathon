exports.index = function(req, res) {
  res.render('index', { message: 'Hello' });
};

exports.partials = function(req, res) {
  var filename = req.params.filename;
  if(!filename) return;
  res.render("partials/" + filename);
};