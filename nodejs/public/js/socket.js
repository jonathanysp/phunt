//connect
<<<<<<< HEAD
var socket = io.connect('http://192.168.74.151:3000');

=======
var socket = io.connect('http://192.168.20.217:3000')
>>>>>>> 0d1b35117796d910357505629f961fc09e3b003a
//lets the server know which game notifications to send us
//set userid to null for leaderboard
var register = function(gameid, userid){
	socket.emit("register", {gameid: gameid, userid: userid})
}

var addMobileEvents = function(){
	socket.on('progress', function(data){
		console.log('Progress update!');
		//send progress notification
	})
}

var addLeaderboardEvents = function(){
	socket.on('progress', function(data){
		console.log('Progress update!');
	})

	socket.on('info', function(data){
		console.log(data.g);
		var span = document.createElement('span');
		$(span).text(data.g.tasks);
		$("#div").append(span);
	})

	//format:
	//playerid, tasknumber, image
	socket.on('newImage', function(data){
		console.log('New Image!')
		//update appropriate cell with image
		var location = "" + tasknumber + "_" + playerid;
		var placeholder = document.getElementById(location);
		var image = document.createElement(img);
		image.setAttribute(src, image);
		//set dimensions?
		placeholder.appendChild(image);
	})

	//format:
	//playerid, number of tasks
	socket.on('miniProgress', function(data){
		console.log("small progress update");
		console.log(data.number);
		//update progress bar
	})

	//format:
	//player id
	socket.on('newPlayer', function(data){
		console.log("new player!");
		//add new empty column for new player
	})
}

var getInfo = function(gameid){
	socket.emit('getInfo', {gameid: gameid});
}

var updateImage = function(){}