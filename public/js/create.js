$('input.title').blur(function(){
	if($('input.title').val() === ''){
		$('span.title').text('Untitled Hunt');
	} else {
		$('span.title').text($('input.title').val());
	}
	$('h2.title').show(function(){
		$('h2.title').tooltip('show');
	});
	$('input.title').hide();
});

$('h2.title').click(function(){
	$('h2.title').hide();
	$('input.title').show().focus();
});

$('h2.title').tooltip({
	title: "Click to change",
	trigger: "hover",
	placement: 'left'
});

$("input.task").keypress(function(e) {
	if(e.which == 13) {
		$('p.help').hide();
		var li = document.createElement('li');
		var button = document.createElement('button');
		var span = document.createElement('span');
		var input = document.createElement('input');
		$(button).addClass('icon-remove btn btn-danger btn-small delete');
		input.name = 'task';
		input.hidden = true;
		$(span).text($("input.task").val());
		$(input).val($("input.task").val());
		$(li).append(button);
		$(li).append(span);
		$(li).append(input);
		$("ol").append(li);
		$("input.task").val('');
	}
});

$('ol.list').on('click', 'button.delete', function(e){
	$(e.target).parents('li').remove();
});