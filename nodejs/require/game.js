var tasks = require('./tasks.js').tasks;
var words = require('./words.js').words;
var games = {};

var id = 0;

var io;

var tasktemplate = {
	'sample': ['q1', 'q2', 'q3', 'q4'],
}

var game = {
	gameid: 0,
	tasks: ['one', 'two', 'three', 'four'],
	players: ['p1', 'p2'],
	images: {
		'p1': ['http://placehold.it/200x150', 'http://placehold.it/200x150',
		'http://placehold.it/200x150', 'http://placehold.it/200x150'],
		'p2': ['http://placehold.it/200x150', 'http://placehold.it/200x150',
		'http://placehold.it/200x150', 'http://placehold.it/200x150'],
	},
	scores: {
		'p1': [2,1,2],
		'p2': [1,2,1]
	}
}

games[id.toString()] = game;
id++

exports.setSocket = function(sockio){
	io = sockio;
}

var imageSubmit = function(gameid, userid, tasknum, filepath){
	if(isFirst(gameid, userid, tasknum)){
		var score = 2;
	} else {
		var score = 1;
	}

	var g = getGame(gameid);
	g.images[userid][parseInt(tasknum)] = filepath;
	console.log(g.images[userid]);

	var numTasks = getTasks(gameid).length;
	var numDone = getNumDone(gameid, userid);

	g.scores[userid][parseInt(tasknum)] = score;

	var q1 = Math.floor(numTasks*0.25);
	var q2 = Math.floor(numTasks*0.5);
	var q3 = Math.floor(numTasks*0.75);

	switch(numDone){
		case q1:
			io.sockets.in(gameid).emit('progress', {player: userid, progress: 25});
			break;
		case q2:
			io.sockets.in(gameid).emit('progress', {player: userid, progress: 50});
			break;
		case q3:
			io.sockets.in(gameid).emit('progress', {player: userid, progress: 75});
			break;
		case numDone:
			io.sockets.in(gameid).emit('progress', {player: userid, progress: 100});
	}
	return score;
}
exports.imageSubmit = imageSubmit;

var getGame = function(gameid){
	return games[gameid];
}
exports.getGame = getGame;

var isGameId = function(gameid){
	if(games[gameid]){
		return true;
	} else {
		return false;
	}
}
exports.isGameId = isGameId;

var isPlayer = function(gameid, userid){
	var g = getGame(gameid);
	if(g.players.indexOf(userid) != -1){
		return true;
	} else {
		return false;
	}
}
exports.isPlayer = isPlayer;

var addPlayer = function(gameid, userid){
	var g = getGame(gameid);
	g.players.push(userid);
	g.images[userid] = [];
	g.scores[userid] = [];
	console.log(g);
	io.sockets.in(gameid).emit('newPlayer', {
		player: userid,
	})
}
exports.addPlayer = addPlayer;

var getTasks = function(gameid){
	return getGame(gameid).tasks;
}
exports.getTasks = getTasks;

var getDone = function(gameid, userid){
	return getGame(gameid).images[userid];
}
exports.getDone = getDone;

var doneLink = function(gameid, userid, taskid){
	return getGame(gameid).images[userid][parseInt(taskid)];
}
exports.doneLink = doneLink;

var createGame = function(templateid){
	var gameid = generateID();
	var t = tasks[templateid];
	var newGame = {
	gameid: gameid,
	tasks: t,
	players: [],
	images: {},
	scores: {}
	}
	games[gameid] = newGame;
	return gameid;
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

var getNumDone = function(gameid, userid){
	var list = getDone(gameid, userid);
	var counter = 0;
	for(var i = 0 ; i < list.length; i++){
		if(list[i] !== undefined){
			counter++;
		}
	}
	return counter;
}
exports.getNumDone = getNumDone;

var isFirst = function(gameid, userid, taskid){
	var g = getGame(gameid);
	for(var i = 0; i < g.players.length; i++){
		if(g.images[g.players[i]][taskid] !== undefined){
			return false;
		}
	}
	return true;
}
exports.isFirst = isFirst;
