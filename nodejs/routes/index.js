
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'team quality' });
};

exports.progress = function(req, res){
  res.render('progressPage');
};