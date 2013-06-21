chrome.app.runtime.onLaunched.addListener(function(launchData)
{
	chrome.app.window.create('public/index.html', 
		{
			'width': 400,
			'height': 500
		},
		function(win) {
			win.contentWindow.launchData = launchData;
			win.maximize();
			win.show();
	});
});