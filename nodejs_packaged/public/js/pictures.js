var show = function(id) {
 document.getElementById(id).style.visibility = "visible";
}

var hide = function(id) {
 document.getElementById(id).style.visibility = "hidden";
}


//SF
$("#p1").mouseover(function(){
	show("top1");
})
$("#p1").mouseleave(function(){
	hide("top1");
})
$("#p1").click(function(){
	$("#HOME").fadeOut() ;
	$("#SF").fadeIn() ;
})
$("#buttSF").click(function(){
	$("#SF").fadeOut() ;
	$("#HOME").fadeIn() ;
})

//DISNEY
$("#p2").mouseover(function(){
	show("top2");
})
$("#p2").mouseleave(function(){
	hide("top2");
})
$("#p2").click(function(){
	$("#HOME").fadeOut() ;
	$("#DISNEY").fadeIn() ;
})
$("#buttDISNEY").click(function(){
	$("#DISNEY").fadeOut() ;
	$("#HOME").fadeIn() ;
})

//GOOGLE
$("#p3").mouseover(function(){
	show("top3");
})
$("#p3").mouseleave(function(){
	hide("top3");
})
$("#p3").click(function(){
	$("#HOME").fadeOut() ;
	$("#GOOGLE").fadeIn() ;
})
$("#buttGOOGLE").click(function(){
	$("#GOOGLE").fadeOut() ;
	$("#HOME").fadeIn() ;
})

//ZOO
$("#p4").mouseover(function(){
	show("top4");
})
$("#p4").mouseleave(function(){
	hide("top4");
})
$("#p4").click(function(){
	$("#HOME").fadeOut() ;
	$("#ZOO").fadeIn() ;
})
$("#buttZOO").click(function(){
	$("#ZOO").fadeOut() ;
	$("#HOME").fadeIn() ;
	
})

//TOWN
$("#p5").mouseover(function(){
	show("top5");
})
$("#p5").mouseleave(function(){
	hide("top5");
})
$("#p5").click(function(){
	$("#HOME").fadeOut() ;
	$("#TOWN").fadeIn() ;
})
$("#buttTOWN").click(function(){
	$("#TOWN").fadeOut() ;
	$("#HOME").fadeIn() ;
	
})

//CREATE
$("#p6").mouseover(function(){
	show("top6");
})
$("#p6").mouseleave(function(){
	hide("top6");
})
$("#p6").click(function(){
	$("#HOME").fadeOut() ;
	$("#CREATE").fadeIn() ;
})
$("#buttCREATE").click(function(){
	$("#CREATE").fadeOut() ;
	$("#HOME").fadeIn() ;
	
})

//HELP

$("#buttHELP").click(function(){
	$("#HELP").fadeOut() ;
	$("#HOME").fadeIn() ;
})
$("#instructions1").click(function(){
	$("#HOME").fadeOut() ;
	$("#HELP").fadeIn() ;
})
$('#instructions').click(function(){
	$("#HELP").fadeOut() ;
	$("#HELP2").fadeIn() ;
})
$("#buttHELP2").click(function(){
	$("#HELP2").fadeOut() ;
	$("#HELP").fadeIn() ;
})
$("#instructions2").click(function(){
	$("#HELP2").fadeOut() ;
	$("#HOME").fadeIn() ;
})

//
var counter = 0;
		$('#input2').keyup(function(event){
			if(event.keyCode == 13){
				if($('#input2').val() != ""){
					if($('#displaytitle').val() == null){
						var typed = $('#input2').val()
						var newdiv = $(document.createElement('div'))
						newdiv.append(typed)
						newdiv.attr('id','displaytitle')
						var newtitle_hidden = $(document.createElement('input'))
						newtitle_hidden.attr('value', typed)
						newtitle_hidden.attr('id', 'title')
						newtitle_hidden.attr('style', 'display:none;')
						$('#hidden_form').append(newtitle_hidden)
						$('#divfortitle').append(newdiv)
						$('#input2').val("")
					}
					else {
						$('#input2').val("")
						alert('You may only have one title.')
					}
				}
			}
		})
		$('#input').keyup(function(event){
			if($('.li').length < 12){
				if(event.keyCode == 13){
					if($('#input').val() != ""){
					typed = $('#input').val()
						var newli = $(document.createElement('li'));
						var newinput = $(document.createElement('input'));
						newinput.attr('style', "display:none;")
						newinput.attr('name', 'task');
						newinput.attr('value', typed)
						newinput.attr('class', 'a'+counter+' deletethis')
						$('#hidden_form').append(newinput)
						newli.attr('class', 'a'+counter);
						var newdiv = $(document.createElement('div'))
							var newdel = $(document.createElement('button'))
						newdel.attr('class', 'a'+counter)
						newdel.text('x')
						newdel.click(function(){
							var classy = newdel.attr('class')
							$('.'+classy).remove()
						});
						counter++
						newdiv.attr('class', 'user_typed')
						var newspan = $(document.createElement('span')) ;
						newspan.attr('class', 'user_words')
						newspan.append(typed)
						newdiv.append(newspan)
						newdiv.append(newdel)
					newli.addClass('li')
					newli.append(newdiv);
					$("#ol").append(newli);
					$('#input').val("")
					}
		    	}
			}
		})
		$('#deleteall').click(function(){
			$('.li').remove()
			$('.deletethis').remove()
		})
		$('#cleartitle').click(function(){

			$('#title').remove()
			$('#displaytitle').remove()
		})

$("#save").click(function(){
	var title = $("#title").val()
	var elements = $(".user_words");
	console.log(elements);
	var tasks = [];
	for(var i = 0; i < elements.length; i ++){
		tasks.push($(elements[i]).text());
	}
	console.log(tasks);
	chrome.storage.local.set({title: title, tasks: tasks});
})

$("#LOAD").click(function(){
	chrome.storage.local.get('title', function(title){
		var newdiv = $(document.createElement('div')) ;
		newdiv.append(title)
		newdiv.attr('id', 'displaytitle')
		var newtitle_hidden = $(document.createElement('input'))
			newtitle_hidden.attr('value', typed) ;
			newtitle_hidden.attr('id', 'title') ;
			newtitle_hidden.attr('style', 'display:none;') ;
			$('#hidden_form').append(newtitle_hidden) ;
			$('#divfortitle').append(newdiv) ;
	})
	chrome.storage.local.get(null, function(data){
		var counter = 0
		console.log(data.tasks);

		var title = document.createElement('h2');
		$(title).text(data.title);
		$("#divfortitle").append(title);

		for(var i = 0; i < data.tasks.length ; i ++){
			console.log(data.tasks[i]);
			var text = data.tasks[i];
			var newli = document.createElement('li');
			$(newli).text(text);
			$(newli).attr('class', 'a'+ Number(counter).toString());
			$(newli).attr('style', 'font-size:30px;')

			var newdel = $(document.createElement('button'))

			newdel.attr('class', 'a'+ Number(counter).toString());
			newdel.text('x')
			var c = Number(counter).toString();
			newdel.click(function(){
				var classy = newdel.attr('class')
				$('.'+ 'a' + c).remove()
			});

			$(newli).append(newdel);
			$("#ol").append(newli);

			counter++;
			/*
			var newinput = $(document.createElement('input')); //
				newinput.attr('style', "display:none;") //
				newinput.attr('name', 'task'); //
				newinput.attr('value', text) //
				newinput.attr('class', 'a'+i+' deletethis') //
				$('#hidden_form').append(newinput)//
			newli.attr('class', 'a'+i); //
			var newdiv = $(document.createElement('div'))
			var newdel = $(document.createElement('button'))
			newdel.attr('class', 'a'+i)
			newdel.text('x')
			newdel.click(function(){
				var classy = newdel.attr('class')
				$('.'+classy).remove()
			});
			newdiv.attr('class', 'user_typed')
			var newspan = $(document.createElement('span')) ;
			newspan.attr('class', 'user_words')
			newspan.text(text)
			newdiv.append(newspan)
			newdiv.append(newdel)
			newli.addClass('li')
			newli.append(newdiv); //
			newli.text(text);
			$("#ol").append(newli); //changed from t
			*/
		}
		/*
		for (t in data.tasks) {
			/*
				typed = $(t).text()
				var newli = $(document.createElement('li'));
				var newinput = $(document.createElement('input'));
				newinput.attr('style', "display:none;")
				newinput.attr('name', 'task');
				newinput.attr('value', typed)
				newinput.attr('class', 'a'+counter+' deletethis')
				$('#hidden_form').append(newinput)
				newli.attr('class', 'a'+counter);
				var newdiv = $(document.createElement('div'))
					var newdel = $(document.createElement('button'))
				newdel.attr('class', 'a'+counter)
				newdel.text('x')
				newdel.click(function(){
					var classy = newdel.attr('class')
					$('.'+classy).remove()
				});
				counter++
				newdiv.attr('class', 'user_typed')
				var newspan = $(document.createElement('span')) ;
				newspan.attr('class', 'user_words')
				newspan.append(typed)
				newdiv.append(newspan)
				newdiv.append(newdel)
			newli.addClass('li')
			newli.append(newdiv);
			
			console.log(t);
			$("#ol").append(t);
		}*/
		})
	})