var games = {};

var id = 0;

var socket;

var game = {
	gameid: 0,
	tasks: ['one', 'two', 'three'],
	players: ['p1', 'p2'],
	images: {
		'p1': ['http://placehold.it/200x150'],
		'p2': [],
	}
}

games[id.toString()] = game;
id++

exports.setSocket = function(sock){
	socket = sock;
}

var imageSubmit = function(gameid, userid, task, filepath){
	var g = getGame(gameid);
	var tasknum = g.tasks.indexOf(task);
	g.players[userid][tasknum] = filepath;

}
exports.imageSubmit = imageSubmit;

var getGame = function(gameid){
	return games[0];
}
exports.getGame = getGame;