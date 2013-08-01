
/*
 * GET home page.
 */

exports.index = function(req, res){
	var hunts = [
		{
			name: "San Francisco",
			link: "/show?tid=san+francisco",
			thumbnail: "/images/hunts/GoldenGateBridge.jpg"
		},
		{
			name: "CSSI 2013",
			link: "/show?tid=CSSI",
			thumbnail: "/images/hunts/google.jpg"
		},
		{
			name: "Disney",
			link: "/show?tid=disney",
			thumbnail: "/images/hunts/disney.jpg"
		},
		{
			name: "Zoo",
			link: "/show?tid=zoo",
			thumbnail: "/images/hunts/zoo.jpg"
		},
		{
			name: "The Neighbourhood",
			link: "/show?tid=town",
			thumbnail: "/images/hunts/hood.jpg"
		},
		{
			name: "Create Your Own!",
			link: "/create",
			thumbnail: "/images/hunts/create.jpg"
		}
	];
	res.render('index', { hunts: hunts , data: process.env});
};

exports.progress = function(req, res){
	res.render('progressPage');
};
