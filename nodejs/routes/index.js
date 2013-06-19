
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'team quality' });
};

exports.camera = function(req, res){
	console.log('hi');
  res.render('camera');
};