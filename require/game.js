var tasks = require('./tasks.js').tasks;
var words = require('./words.js').words;
var games = {};

var id = 0;

var Datastore = require('nedb')
var db = new Datastore({filename: __dirname + '/../db/games', autoload: true});
//var db = new Datastore();

//========================================
var repl = require('repl');
var context = repl.start({
  prompt: "node via stdin> ",
  input: process.stdin,
  output: process.stdout
}).context;

context.db = db;

context.cb = function(err){
	console.log(JSON.stringify(arguments,null, 4));
};

context.set = function(name) {
	return function(err, value) {
		if (err) throw(err);
		context[name] = value;
		console.log("\n-[" + name + " set]-\n");
	};
};
//============================================

var io;

var gameDemo = {
	gameid: "0",
	tasks: ['one', 'two', 'three', 'four'],
	players: ['p1', 'p2'],
	images: {
		'p1': ['http://placehold.it/200x150', 'http://placehold.it/200x150',
		'http://placehold.it/200x150', 'http://placehold.it/200x150'],
		'p2': ['http://placehold.it/200x150', 'http://placehold.it/200x150',
		'http://placehold.it/200x150', 'http://placehold.it/200x150'],
	},
	scores: {
		'p1': [2,1,2,2],
		'p2': [1,2,1,1]
	},
	coord: {
		'p1': [{lat: 1, lon: 0}, {lat: 1, lon: 0}, {lat: 1, lon: 0}, {lat: 1, lon: 0}],
		'p2': [{lat: 1, lon: 0}, {lat: 1, lon: 0}, {lat: 1, lon: 0}, {lat: 1, lon: 0}],
	}
}

db.update({}, gameDemo, {upsert: true}, function(er, game){console.log(game)});

exports.setSocket = function(sockio){
	io = sockio;
}

var imageSubmit = function(gameid, userid, tasknum, filepath, lat, lon, link, cb){
	getGame(gameid, function(err, g){
		if(isFirst(g, userid, tasknum)){
			var score = 2;
		} else {
			var score = 1;
		}

		g.images[userid][parseInt(tasknum)] = filepath;
		console.log(g.images[userid]);

		var numTasks = getTasks(g).length;
		var numDone = getNumDone(g, userid);

		g.scores[userid][parseInt(tasknum)] = score;

		g.coord[userid][parseInt(tasknum)] = {lat: lat, lon: lon};

		var q1 = Math.floor(numTasks*0.25);
		var q2 = Math.floor(numTasks*0.5);
		var q3 = Math.floor(numTasks*0.75);

		io.sockets.in(g.gameid).emit('newImage', {
			playerid: userid,
			tasknum: g.tasks[tasknum],
			tasknumber: parseInt(tasknum),
			image: link,
			lat: lat,
			lon: lon,
			score: score
		})

		switch(numDone){
			case q1:
				io.sockets.in(g.gameid).emit('progress', {player: userid, progress: 25});
				break;
			case q2:
				io.sockets.in(g.gameid).emit('progress', {player: userid, progress: 50});
				break;
			case q3:
				io.sockets.in(g.gameid).emit('progress', {player: userid, progress: 75});
				break;
			case numTasks:
				io.sockets.in(g.gameid).emit('progress', {player: userid, progress: 100});
				io.sockets.in(g.gameid).emit('finish', {player: userid, score: arraySum(g.scores[userid])});
		}

		db.update({gameid: gameid}, g, function(err){
			cb(err, score, g.images[userid].length);
		})
	});
}
exports.imageSubmit = imageSubmit;

var getGame = function(gameid, cb){
	db.findOne({gameid: gameid}, cb);
}
exports.getGame = getGame;

var isGameId = function(gameid, cb){
	db.findOne({gameid: gameid}, function(err, game){
		if(game === null){
			cb(err, false);
			return;
		}
			cb(err, true);
			return;
	});
}
exports.isGameId = isGameId;

var isPlayer = function(g, userid){
	if(g.players.indexOf(userid) != -1){
		return true;
	} else {
		return false;
	}
}
exports.isPlayer = isPlayer;

var addPlayer = function(g, userid, cb){
	g.players.push(userid);
	g.images[userid] = [];
	g.scores[userid] = [];
	console.log(g);
	g.coord[userid] = [];
	io.sockets.in(g.gameid).emit('newPlayer', {
		player: userid,
	});
	db.update({gameid: g.gameid}, g, {}, function(err, num){
		cb();
	});
}
exports.addPlayer = addPlayer;

var getTasks = function(g){
	return g.tasks;
}
exports.getTasks = getTasks;

var getDone = function(g, userid){
	return g.images[userid];
}
exports.getDone = getDone;

var doneLink = function(g, userid, taskid){
	return g.images[userid][parseInt(taskid)];
}
exports.doneLink = doneLink;

var createGame = function(templateid, cb){
	var gameid = generateID();
	var t = tasks[templateid];
	var newGame = {
		gameid: gameid,
		tasks: t,
		players: [],
		images: {},
		scores: {},
		coord: {},
	}
	//games[gameid] = newGame;
	db.insert(newGame, function(err, g){
		cb(err, g.gameid);
	});
}
exports.createGame = createGame;

var generateID = function(){
	//return Math.random().toString(36).substr(2,5);
	var max = words.length;
	return words[Math.floor(Math.random()*max)];
}

var addTemplate = function(template, name){
	tasks[name] = template;
}
exports.addTemplate = addTemplate;

var getTemplate = function(tid){
	return tasks[tid];
}
exports.getTemplate = getTemplate;

var getNumDone = function(g, userid, cb){
	var list = getDone(g, userid);
	var counter = 0;
	for(var i = 0 ; i < list.length; i++){
		if(list[i] !== undefined){
			counter++;
		}
	}
	return counter;
}
exports.getNumDone = getNumDone;

var isFirst = function(g, userid, taskid){
	for(var i = 0; i < g.players.length; i++){
		if(g.images[g.players[i]][taskid] !== undefined){
			return false;
		}
	}
	return true;
}
exports.isFirst = isFirst;

var disqualify = function(gameid, userid, tasknum){
	getGame(gameid, function(err, g){
		g.scores[userid][parseInt(tasknum)] = 0;
		g.images[userid][parseInt(tasknum)] = "/images/dis.png";

		io.sockets.in(g.gameid).emit("disqualify", {
			userid: userid,
			total: arraySum(g.scores[userid]),
		});
		db.update({gameid: gameid}, g, function(){});
	});
}
exports.disqualify = disqualify;

var arraySum = function(array){
	var total = 0;
	for(var i = 0 ; i < array.length; i++){
		total = total + array[i];
	}
	return total;
}
