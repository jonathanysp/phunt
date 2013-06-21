
//connect
var socket = io.connect('192.168.74.105:3000');
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
		var string = data.player + " has completed " + data.progress + "%!";
		var span = document.createElement(span);
		$(span).text(string);
		$("#notif").append(span);
		$("#notif").append(document.createElement('br'));
	})
}

var addLeaderboardEvents = function(){
	socket.on('progress', function(data){
		console.log('Progress update!');
		console.log(data);
	})

	var totalTasks;

	socket.on('info', function(data){
		console.log(data.g);
		//setup current progress bars for all current players
		totalTasks = data.g.tasks.length;
		var progressSection = document.getElementById("progressBars");
		for(var i = 0; i < data.g.players.length; i++) {
			
			//create container for each player's summary
			var progressSummary = document.createElement("p");

			//create player's name
			progressSummary.setAttribute("class", "progressSummary");
			var progressPlayer = document.createElement("span");
			progressPlayer.innerHTML = data.g.players[i];

			//a span with a progress bar with the current percentage (calculate with object with images uploaded)
			var bar = document.createElement("progress");
			var arrOfPics = data.g.images[data.g.players[i]];
			var percentage = (arrOfPics.length / totalTasks) * 100;
			bar.setAttribute("value", percentage.toFixed(2));
			bar.setAttribute("max", 100);
			var barId = player + "_bar";
			bar.setAttribute("id", barId);
			var spanForBar = document.createElement("span");
			spanForBar.setAttribute("class", "spanForProgress");
			spanForBar.appendChild(bar);

			//and a span with the percentage display
			var percentageDisplay = document.createElement("span");
			percentageDisplay.setAttribute("id", data.g.players[i] + "_progress_display");
			percentageDisplay.innerHTML = percentage.toFixed(2) + "%";

			//append to container with new lines where necessary
			//append container to progressSection
			
			progressSummary.appendChild(progressPlayer);
			progressSummary.appendChild(spanForBar);
			progressSummary.appendChild(percentageDisplay);
			
			progressSection.appendChild(progressSummary);
			var newLine = document.createElement("br");
			progressSection.appendChild(newLine);
			
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
				$(image).hide().appendTo("#"+tdLocation).fadeIn("slow");
			}
		}

		for(var player in data.g.scores) {
			var arrOfScores = data.g.scores[player];
			for(var i = 0; i < arrOfScores.length; i++) {
				console.log("arrOfScores[" + i + "]: " + arrOfScores[i]);
				if(arrOfScores[i] == 2) {
					var placeholder = document.getElementById((i + 1) + "_" + player);
					placeholder.style.backgroundColor="#F3F781";
				}
			}
		}

		//insert lat and lon for imgaes so far
		for(var player in data.g.coord) {
			for(var i = 0; i < data.g.coord[player].length; i++) {
				var latLonObject = data.g.coord[player][i]; 
				var placeholder = document.getElementById((i + 1) + "_" + player);
				var latLonInfo = document.createElement("p");
				var latLonId = "latLon_" + player;
				latLonInfo.setAttribute("id", latLonId);
				console.log(latLonObject);
				latLonInfo.innerHTML = "Latitude: " + parseInt(latLonObject.lat).toFixed(7) + " 	Longitude: " + parseInt(latLonObject.lon).toFixed(7);
				//placeholder.appendChild(latLonInfo);
				var tdLocation = (i + 1) + "_" + player;
				$(latLonInfo).hide().appendTo("#"+tdLocation).fadeIn("slow");
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
		var td = document.getElementById(tdLocation);
		//if data.score == 2, fill in cell/highlight
		if(data.score == "2") {
			td.style.backgroundColor="#F3F781";
		}

		//if there's an img already at tdLocation, replace its src
		var placeholder = $("#"+tdLocation).children();
		if(placeholder.length == 0) {
			var image = document.createElement('img');
			image.src = data.image;
			image.setAttribute("class", "incomingPics");
			$(image).hide().appendTo("#"+tdLocation).fadeIn("slow");
			//create paragraph with lat/long information (give it an id)
			var latLon = document.createElement("p");
			var latLonId = "latLon_" + data.playerid;
			latLon.setAttribute("id", latLonId);

			latLon.innerHTML = "Latitude: " + parseInt(data.lat).toFixed(7) + "	Longitude: " + parseInt(data.lon).toFixed(7);
			//$("#"+tdLocation).append(latLon);
			$(latLon).hide().appendTo("#"+tdLocation).fadeIn("slow");

			latLon.innerHTML = "Latitude: " + data.lat + "	Lontitude: " + data.lon;
			var alink = document.createElement('a');
			//alink.href = "https://maps.google.com/maps?q=" + data.lat + "," + data.lon;
			alink.href = "#";
			$(alink).text("Map it!");
			$(alink).click(function(){
				window.open("https://maps.google.com/maps?q=" + data.lat + "," + data.lon);
			})
			$("#"+tdLocation).append(latLon);
			$("#"+tdLocation).append(alink);

		} else {
			$(placeholder[0]).hide();
			placeholder[0].src = data.image;
			$(placeholder[0]).fadeIn("slow");
			//update paragraph with lat/long information
			var latLon = document.getElementById("latLon_" + data.playerid);
			latLong.innerHTML = "Latitude: " + parseInt(data.lat).toFixed(7) + "	Lontitude: " + parseInt(data.lon).toFixed(7);
		}
		
	})

	//format:
	//playerid, number of tasks
	socket.on('miniProgress', function(data){
		console.log("small progress update");
		console.log(data);
		//update progress bar
		var newPercentage = (data.numTasks / totalTasks) * 100;
		var barId = data.playerid + "_bar";
		var bar = document.getElementById(barId);
		bar.setAttribute("value", newPercentage);
		//update progress display
		
		var progressDisplayId = data.playerid + "_progress_display";
		var percentageDisplay = document.getElementById(progressDisplayId);
		percentageDisplay.innerHTML = newPercentage.toFixed(2) + "%";
		
	})

	//format:
	//player id
	socket.on('newPlayer', function(data){
		console.log("new player!");
		console.log(data);

		//PROGRESS BAR SECTION
		var progressSection = document.getElementById("progressBars");
		var progressSummary = document.createElement("p");

		//IN CSS: inline these spans!!!!!!
		progressSummary.setAttribute("class", "progressSummary");
		var progressPlayer = document.createElement("span");
		progressPlayer.innerHTML = data.player;;

		var bar = document.createElement("progress");
		bar.setAttribute("value", 0);
		bar.setAttribute("max", 100);
		var barId = data.player + "_bar";
		bar.setAttribute("id", barId);
		var spanForBar = document.createElement("span");
		spanForBar.setAttribute("class", "spanForProgress");
		spanForBar.appendChild(bar);

		var percentageDisplay = document.createElement("span");
		percentageDisplay.setAttribute("id", data.player + "_progress_display");
		percentageDisplay.innerHTML = "0%";
		
		progressSummary.appendChild(progressPlayer);
		progressSummary.appendChild(spanForBar);
		progressSummary.appendChild(percentageDisplay);
		
		progressSection.appendChild(progressSummary);
		var newLine = document.createElement("br");
		progressSection.appendChild(newLine);

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

	socket.on('finish', function(data){
		console.log(data);

	})

	socket.on('disqualify', function(data){
		console.log(data);

	})
}

var getInfo = function(gameid){
	socket.emit('getInfo', {gameid: gameid});
}

var disqualify = function(gameid, userid, taskid){
	socket.emit('disqualify', {
		gameid: gameid,
		userid: userid,
		taskid: taskid
	});
	//add css filter to image?!?!?
}
