
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , game = require('./require/game.js');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

game.setSocket(io);

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
//app.get('/progress', routes.progress);
app.get('/progress', function(req, res){
	res.render('progressPage', {g: game.getGame(0)})
});
app.get('/game', function(req, res){
	res.render('game', {g: game.getGame(0)})
});
app.get('/pic', routes.camera);
app.get('/users', user.list);

app.get('/login', function(req, res){
	res.render('login');
})
app.post('/login', function(req, res){
	res.send("finished");
})
app.get('/tasks', function(req, res){
	res.render('tasks');
})

//var server = http.createServer(app)

//socket io server
//var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket){
	//console.log("HIHIHIHI");
	socket.broadcast.emit('news', {my: "joined"});

	socket.on('register', function(data){
		if(game.isGameId(data.gameid)){
			if(data.userid != null){
				console.log("New member registered on gameid: " + data.gameid);
			} else {
				console.log("New leaderboard joined");
			}
			socket.join(data.gameid);
		} else {
			socket.emit("error");
		}
	})

	socket.on('getInfo', function(data){
		socket.emit('info', {g: game.getGame()});
	})

	socket.on('msg', function(data){
		console.log(data);
		socket.broadcast.emit('news', data);
	})
	
	socket.on('echo', function(data){
		console.log(data);
	})

});

//http server
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
