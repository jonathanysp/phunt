var tasks = require('./tasks.js').tasks;
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
	}
}

games[id.toString()] = game;
id++

exports.setSocket = function(sockio){
	io = sockio;
}

var imageSubmit = function(gameid, userid, tasknum, filepath){
	var g = getGame(gameid);
	g.images[userid][parseInt(tasknum)] = filepath;
	console.log(g.images[userid]);
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
	images: {}
	}
	games[gameid] = newGame;
	return gameid;
}
exports.createGame = createGame;

var generateID = function(){
	return Math.random().toString(36).substr(2,5);
}

var addTemplate = function(template, name){
	tasks[name] = template;
}
exports.addTemplate = addTemplate;

var getTemplate = function(tid){
	return tasks[tid];
}
exports.getTemplate = getTemplate;
