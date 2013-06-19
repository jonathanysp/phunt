
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
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
app.post('/new', function(req, res){
	res.send(req.body.task);
})
app.get('/pic', routes.camera);
app.post('/login', function(req, res){
	var gameid = req.body.gameid | '0';
	var userid = req.body.userid;
	var tasknum = req.body.tasknum;
})
app.post('/upload', function(req, res){
	//res.send("uploaded");
	console.log(req.body.gameid)
	var gameid = req.body.gameid | '0';
	var userid = req.body.userid;
	var tasknum = req.body.tasknum;
	var g = game.getGame(gameid);
	fs.readFile(req.files.image.path, function(err, data){
		if(err){
			res.redirect('back');
			return;
		}
		//check player id
		//public/upload/gameid/userid/tasknum.jpg
		var newPath = 'public/upload/new.jpg';
		var link = '/upload/new.jpg';
		fs.writeFile(newPath, data, function(err){
			if(err){
				res.redirect('back');
				return;
			}
			res.redirect('back');
			g.imageSubmit(gameid, userid, tasknum, newPath);

			io.sockets.in('0').emit('newImage', {
				playerid: userid,
				tasknum: tasknum,
				image: link
			})
		})
	})
});

var done = 0;

io.sockets.on('connection', function(socket){
	//console.log("HIHIHIHI");
	//socket.broadcast.emit('news', {my: "joined"});

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

	//debug responses
	socket.on('debug', function(data){
		console.log(data);
		socket.broadcast.emit(data.msg, data);
	});

});

//http server
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
