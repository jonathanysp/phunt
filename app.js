
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

photoUploader = papercut.Schema(function(schema){
	this.version({
		name: 'display',
		size: '300x00',
		process: 'resize'
	});
});

AvatarUploader = papercut.Schema(function(schema) {
	this.version({
		name: 'display',
		size: '300x300'
	});
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
		res.render("progressPage", {title: "Game: " + gameid, g: game.getGame(gameid), gameid: gameid, dataurl: dataurl});
	});
});

app.get('/game', function(req, res){
	res.render('game', {g: game.getGame(0)});
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
	var gameid = game.createGame(templateid);
	res.redirect('/progress?gameid=' + gameid);
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

	if(game.isGameId(gameid)){
		if(game.isPlayer(gameid, userid)){
			res.redirect('/tasks?gameid=' + gameid + "&userid=" + userid);
		} else {
			game.addPlayer(gameid, userid);
			res.redirect('/tasks?gameid=' + gameid + "&userid=" + userid);
		}
	} else {
		res.render('login', {error: "Invalid game id"});
	}
});

app.get('/tasks', function(req, res){
	var gameid = req.query.gameid;
	var userid = req.query.userid;
	var tasks = game.getTasks(gameid);
	var done = game.getDone(gameid, userid);
	res.render('tasks', {title: userid, tasks: tasks, gameid: gameid, userid: userid, done: done});
});

app.get('/upload', function(req, res){
	var gameid = req.query.gameid;
	var taskid = req.query.taskid;
	var userid = req.query.userid;
	var link = game.doneLink(gameid, userid, taskid);
	res.render('upload', {title: "Task: "+taskid, gameid: gameid, taskid: taskid, userid:userid, link: link});
});

app.post('/upload', function(req, res){
	//res.send("uploaded");
	console.log(req.body.gameid);
	var gameid = req.body.gameid;
	var userid = req.body.userid;
	var tasknum = req.body.taskid;
	var lat = req.body.lat;
	var lon = req.body.lon;
	var g = game.getGame(gameid);

	res.redirect('/tasks?gameid=' + gameid + "&userid=" + userid);

	uploader = new AvatarUploader();
	uploader.process(gameid+'-'+userid+'-'+tasknum, req.files.image.path, function(err, images){
		var score = game.imageSubmit(gameid, userid, tasknum, images.display, lat, lon, images.display);
		io.sockets.in(gameid).emit('miniProgress', {
			playerid: userid,
			numTasks: game.getNumDone(gameid, userid)
		});
		//res.redirect('/tasks?gameid=' + gameid + "&userid=" + userid);
	});
});

app.get("/qr", function(req, res){
	qrcode.toDataURL("text", function(err, dataurl){
		res.render("qr", {data: dataurl});
	});
});

var done = 0;

io.sockets.on('connection', function(socket){
	//console.log("HIHIHIHI");
	//socket.broadcast.emit('news', {my: "joined"});

	socket.on('register', function(data){
		if(game.isGameId(data.gameid)){
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

	socket.on('getInfo', function(data){
		socket.emit('info', {g: game.getGame(data.gameid)});
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
