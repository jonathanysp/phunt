var show = function(id) {
 document.getElementById(id).style.visibility = "visible";
}

var hide = function(id) {
 document.getElementById(id).style.visibility = "hidden";
}

$("#p1").mouseover(function(){
	show("top1");
})

$("#p1").mouseleave(function(){
	hide("top1");
})

$("#p2").mouseover(function(){
	show("top2");
})

$("#p2").mouseleave(function(){
	hide("top2");
})

$("#p3").mouseover(function(){
	show("top3");
})

$("#p3").mouseleave(function(){
	hide("top3");
})

$("#p4").mouseover(function(){
	show("top4");
})

$("#p4").mouseleave(function(){
	hide("top4");
})

$("#p5").mouseover(function(){
	show("top5");
})

$("#p5").mouseleave(function(){
	hide("top5");
})

$("#p6").mouseover(function(){
	show("top6");
})

$("#p6").mouseleave(function(){
	hide("top6");
})