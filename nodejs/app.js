
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

//var server = http.createServer(app)

//socket io server
//var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket){
	//console.log("HIHIHIHI");
	socket.broadcast.emit('news', {my: "joined"});
	socket.on('msg', function(data){
		console.log(data);
		socket.broadcast.emit('news', data);
	})
});

//http server
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
