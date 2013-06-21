
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Phunt!' });
};

exports.progress = function(req, res){
  res.render('progressPage');
}

exports.camera = function(req, res){
	console.log('hi');
  res.render('camera');
};