
/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	http = require('http'),
	path = require('path'),
	fs = require('fs'),
	game = require('./require/game.js'),
	mkdirp = require('mkdirp'),
	qrcode = require('qrcode'),
	papercut = require('papercut'),
	getDirName = path.dirname;

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

io.configure(function () {
	io.set("transports", ["xhr-polling"]);
	io.set("polling duration", 10);
	io.set('log level', 1);
});

game.setSocket(io);

/*
papercut.configure(function(){
	papercut.set('storage', 'file');
	papercut.set('directory', './public/uploads');
	papercut.set('url', '/uploads');
});
*/

papercut.configure(function(){
	papercut.set('storage', 's3');
	papercut.set('S3_KEY', process.env.S3_KEY);
	papercut.set('S3_SECRET', process.env.S3_SECRET);
	papercut.set('bucket', 'phunt');
});

AvatarUploader = papercut.Schema(function() {
	this.version({
		name: 'display',
		size: '300x300'
	});
	this.version({
		name: 'original',
		process: 'copy'
	})
});

uploader = new AvatarUploader();

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
app.get('/progress', function(req, res){
	var gameid = req.query.gameid;
	if(gameid === undefined){
		//gameid = 0;
		res.send(404);
		return;
	}
	qrcode.toDataURL("http://phunt.jonathanysp.com/m?gameid=" + gameid, function(err, dataurl){
		game.getGame(gameid, function(err, g){
			if(g === null){
				res.send(404);
				return;
			}
			res.render("progressPage", {title: "Game: " + gameid, g: g, gameid: gameid, dataurl: dataurl});
		})
	});
});

app.get('/m', function(req, res){
	res.render('login', {title: "PHunt Login", gameid: req.query.gameid});
});
app.get('/login', function(req, res){
	res.render('login', {title: "PHunt Login", gameid: req.query.gameid});
});

app.get('/create', function(req, res){
	res.render('create');
});

app.get('/help', function(req, res){
	res.render('help', {title: "PHunt Help"});
});

app.get('/show', function(req, res){
	var templateid = req.query.tid;
	console.log(templateid);
	var tasks = game.getTemplate(templateid);
	res.render('show', {title: templateid, tid: templateid, tasks: tasks});
});

app.get('/new', function(req, res){
	var templateid = req.query.tid;
	game.createGame(templateid, function(err, gameid){
		if(gameid === null){
			res.send("Please try again");
			return;
		}
		console.log(gameid);
		res.redirect('/progress?gameid=' + gameid);
	});
});
app.post('/new', function(req, res){
	var template = req.body.task;
	if(!(template instanceof Array)){
		template = [template];
	}
	var name = req.body.name;
	game.addTemplate(template, name);
	res.redirect('/new?tid=' + name);
});

app.post('/login', function(req, res){
	var gameid = req.body.gameid.toLowerCase();
	var userid = req.body.userid;

	game.getGame(gameid, function(err, g){
		console.log(g);
		if(g){
			if(game.isPlayer(g, userid)){
				res.redirect('/tasks?gameid=' + gameid + "&userid=" + userid);
			} else {
				game.addPlayer(g, userid, function(){
					res.redirect('/tasks?gameid=' + gameid + "&userid=" + userid);
				});
			}
		} else {
			res.render('login', {error: "Invalid game id"});
		}
	});
});

app.get('/tasks', function(req, res){
	var gameid = req.query.gameid;
	var userid = req.query.userid;

	game.getGame(gameid, function(err, g){
		if(g === null){
			res.send(404);
			return;
		}
		console.log(g);
		var tasks = g.tasks;
		var done = g.images[userid];
		res.render('tasks', {title: userid, tasks: tasks, gameid: g.gameid, userid: userid, done: done});
	});
});

app.get('/upload', function(req, res){
	var gameid = req.query.gameid;
	var taskid = req.query.taskid;
	var userid = req.query.userid;
	game.getGame(gameid, function(err, g){
		if(g === null) return;
		console.log(g);
		console.log(g.images[userid]);
		var link = g.images[userid][parseInt(taskid)];
		//res.send("HI"); return;
		res.render('upload', {title: "Task: "+taskid, gameid: gameid, taskid: taskid, userid:userid, link: link});
	});
});

app.post('/upload', function(req, res){
	//res.send("uploaded");
	console.log(req.body.gameid);
	var gameid = req.body.gameid;
	var userid = req.body.userid;
	var tasknum = req.body.taskid;
	var lat = req.body.lat;
	var lon = req.body.lon;

	game.getGame(gameid, function(err, g){
		if(g === null){
			res.send(404);
			return;
		}

		uploader = new AvatarUploader();
		uploader.process(gameid+'/'+userid+'-'+tasknum, req.files.image.path, function(err, images){
			game.imageSubmit(gameid, userid, tasknum, images.display, lat, lon, images.display, function(err, score, num){
				console.log(images);
				res.redirect('/tasks?gameid=' + gameid + "&userid=" + userid);
				io.sockets.in(gameid).emit('miniProgress', {
					playerid: userid,
					totalTasks: g.tasks.length,
					numTasks: num
				});
			});
		});
	})
});

app.get("/qr", function(req, res){
	qrcode.toDataURL("text", function(err, dataurl){
		res.render("qr", {data: dataurl});
	});
});

var done = 0;

io.sockets.on('connection', function(socket){

	socket.on('register', function(data){
		game.isGameId(data.gameid, function(err, is){
			if(is){
				if(data.userid !== null){
					console.log("New member registered on gameid: " + data.gameid);
				} else {
					console.log("New leaderboard joined");
				}
				socket.join(data.gameid);
			} else {
				socket.emit("error");
			}
		});
	});

	socket.on('getInfo', function(data){
		game.getGame(data.gameid, function(err, g){
			console.log(g);
			socket.emit('info', {g: g});
		});
	});

	socket.on('msg', function(data){
		console.log(data);
		socket.broadcast.emit('news', data);
	});

	socket.on('echo', function(data){
		console.log(data);
	});

	socket.on('disqualify', function(data){
		game.disqualify(data.gameid, data.userid, data.taskid);
	});

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
