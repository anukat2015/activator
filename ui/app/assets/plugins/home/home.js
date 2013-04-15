define(['text!./home.html', 'core/pluginapi' ], function(template, api){

	var ko = api.ko;

	var HomePage = api.Widget({
		id: 'home-page-screen',
		template: template,
		appVersion: window.serverAppModel.appVersion,
		init: function(config) {
			var self = this;
			self.newsHtml = ko.observable('<div></div>');
			self.loadNews();
		},
		loadNews: function() {
			var areq = {
					url: "http://downloads.typesafe.com/typesafe-builder/" + window.serverAppModel.appVersion + "/news.js",
					type: 'GET',
					// this is hardcoded for now since our server is just static files
					// so can't respect a ?callback= query param.
					jsonpCallback: 'setNewsJson',
					dataType: 'jsonp' // return type
				};
				console.log("sending ajax news request ", areq)
				return $.ajax(areq);
		},
		setNewsJson: function(json) {
			console.log("setting news json to ", json);
			if ('html' in json) {
				this.newsHtml(json.html);
			} else {
				console.error("json does not have an html field");
			}
		}
	});

	var homePage = new HomePage();


	window.setNewsJson = homePage.setNewsJson.bind(homePage);

	return api.Plugin({
		id: 'home',
		name: "Home",
		icon: "",
		url: "#",
		routes: {
			'home': function(url) {
				api.setActiveWidget(homePage);
			}
		},
		widgets: [homePage]
	});
});
