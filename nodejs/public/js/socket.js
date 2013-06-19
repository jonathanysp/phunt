//connect
var socket = io.connect('http://192.168.74.79:3000');
//var socket = io.connect('http://192.168.20.217:3000')
//lets the server know which game notifications to send us
//set userid to null for leaderboard
var register = function(gameid, userid){
	socket.emit("register", {gameid: gameid, userid: userid})
}

var addMobileEvents = function(){
	socket.on('progress', function(data){
		console.log('Progress update!');
		//send progress notification
		console.log(data);
	})
}

var addLeaderboardEvents = function(){
	socket.on('progress', function(data){
		console.log('Progress update!');
		console.log(data);
	})

	socket.on('info', function(data){
		console.log('info!')
		console.log(data.g);
		var span = document.createElement('span');
		$(span).text(data.g.tasks);
		$("#div").append(span);
	})

	//format:
	//playerid, tasknum, image
	socket.on('newImage', function(data){

		$('#img')[0].src = data.image;

		console.log('New Image!')
		console.log(data);
		//update appropriate cell with image
		var location = "" + data.tasknumber + "_" + data.playerid;
		var placeholder = document.getElementById(location);
		var image = document.createElement('img');
		image.setAttribute(src, image);
		//set dimensions?
		placeholder.appendChild(image);
	})

	//format:
	//playerid, number of tasks
	socket.on('miniProgress', function(data){
		console.log("small progress update");
		console.log(data);
		//update progress bar
	})

	//format:
	//player id
	socket.on('newPlayer', function(data){
		console.log("new player!");
		console.log(data);
		//add new empty column for new player
	})
}

var getInfo = function(gameid){
	socket.emit('getInfo', {gameid: gameid});
}

var updateImage = function(){}