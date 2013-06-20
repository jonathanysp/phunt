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
	$("#HOME").fadeIn() ;
	$("#p7").fadeOut() ;
})