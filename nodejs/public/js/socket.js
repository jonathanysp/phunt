//connect
var socket = io.connect('http://10.1.1.112:3000');
//var socket = io.connect('http://192.168.20.217:3000')
//lets the server know which game notifications to send us
//set userid to null for leaderboard
var register = function(gameid, userid){
	socket.emit("register", {gameid: gameid, userid: userid})
}

var addMobileEvents = function(){
	socket.on('progress', function(data){
		console.log('Progress update!');
		console.log(data);
		var span1 = document.createElement('span');
		$(span1).text(data.player);
		console.log(span1);
		$("#notif").append(span1);

		var span2 = document.createElement('span');
		$(span2).text(" has made it to ");
		console.log(span2);
		$("#notif").append(span2);

		var span = document.createElement('span');
		$(span).text(data.progress);
		$("#notif").append(span);

		var span3 = document.createElement('span');
		$(span3).text("%. Hurry up!");
		console.log(span3);
		$("#notif").append(span3);
		$("#notif").append(document.createElement("br"))
	})
}

var addLeaderboardEvents = function(){
	socket.on('progress', function(data){
		console.log('Progress update!');
		console.log(data);
	})

	socket.on('info', function(data){
		console.log(data.g);
		//setup current progress bars for the current players
		var totalTasks = data.g.tasks.length;
		var progressSection = document.getElementById("progressBars");
		for(var i = 0; i < data.g.players.length; i++) {
			var player = data.g.players[i];
			var bar = document.createElement("progress");
			var arrOfPics = data.g.images[player];
			var percentage = (arrOfPics / totalTasks) * 100;
			bar.setAttribute("value", percentage);
			bar.setAttribute("max", 100);
			var barId = player + "_bar";
			bar.setAttribute("id", barId);
			progressSection.appendChild(bar);
		}

		//setup current table and populate recent table with data.g
		var headRow = document.getElementById("headingRow");
		for(var i = 0; i < data.g.players.length; i++) {
			var newCol = document.createElement("th");
			newCol.innerHTML = data.g.players[i];
			newCol.setAttribute("class", "headingCol");
			headRow.appendChild(newCol);	
		}
		
		for(var i = 0; i < data.g.players.length; i++) {
			var taskNumber = 1;
			$(".taskRow").each(function() {
				var td = document.createElement("td");
				var tdId = taskNumber + "_" + data.g.players[i];
				td.setAttribute("id", tdId);
				$(this).append(td);
				taskNumber++;
			});
		}

		//insert images uploaded by users so far
		for(var player in data.g.images) {
			var arrOfPics = data.g.images[player];
			for(var i = 0; i < arrOfPics.length; i++) {
				console.log(player + " uploaded " + arrOfPics[i]);
				var taskNum = i + 1;
				var tdLocation = taskNum + "_" + player;
				console.log("Inserting it into: " + tdLocation);
				var placeholder = document.getElementById(tdLocation);
				var image = document.createElement("img");
				image.src = arrOfPics[i];
				image.setAttribute("class", "incomingPics");
				placeholder.appendChild(image);
			}
		}
		
	})

	//format:
	//playerid, tasknum, image
	socket.on('newImage', function(data){
		console.log('New Image!');
		console.log(data);
		//update appropriate cell with image
		var newTaskNum = data.tasknumber + 1;
		var tdLocation = newTaskNum + "_" + data.playerid;
		console.log("In newImage: " + tdLocation);
		var placeholder = document.getElementById(tdLocation);
		var image = document.createElement('img');
		image.src = data.image;
		image.setAttribute("class", "incomingPics");
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

		var progressSection = document.getElementById("progressBars");
		var bar = document.createElement("progress");
		bar.setAttribute("value", 0);
		bar.setAttribute("max", 100);
		var barId = data.player + "_bar";
		bar.setAttribute("id", __);
		progressSection.appendChild(bar);

		var headRow = document.getElementById("headingRow");
		var newCol = document.createElement("th");
		newCol.innerHTML = data.player;
		newCol.setAttribute("class", "headingCol");
		headRow.appendChild(newCol);

		var taskNumber = 1;
		$(".taskRow").each(function() {
		  var td = document.createElement("td");
		  var tdId = taskNumber + "_" + data.player;
		  console.log("Assigning in newPlayer: " + tdId);
		  td.setAttribute("id", tdId);
		  $(this).append(td);
		  taskNumber++;
		});

	})
}

var getInfo = function(gameid){
	socket.emit('getInfo', {gameid: gameid});
}

var updateImage = function(){}