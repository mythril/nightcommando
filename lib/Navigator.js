/*jslint devel: true, browser: true, unparam: true, white: true, nomen: true, maxerr: 50, indent: 4 */

/*global _*/

(function () {
	"use strict";

function Navigator(baseUrl, options) {
	"use strict";
	
	var openDir = function () {
			//console.log('this should never be bound');
			throw new Error('openDir called prematurely');
		},
		model = {},
		provider = options && options.provider,
		self = new NIGHTCOMMANDO.lib.Path(
			[
				function (e) {
					//console.log('path', e.data.path);
					var url = baseUrl + '?dir=' + encodeURIComponent(e.data.path);
					if (provider) {
						url += '&provider=' + encodeURIComponent(provider);
					}
					openDir(url);
				}
			]
		),
		dataSource = null;
		
	self.createEvent({'name': 'loadingstarted'});
	self.createEvent({'name': 'loadingstopped'});
	self.createEvent({'name': 'filedata'});
	self.createEvent({'name': 'loadinginterrupted'});
	self.createEvent({'name': 'loadingcompleted'});
	
	openDir = function(url) {
		if (dataSource) {
			self.trigger('loadinginterrupted');
			dataSource.cancel();
			dataSource = null;
		}
		
		dataSource = new NIGHTCOMMANDO.lib.DataStream(url);
		
		self.trigger('loadingstarted', {path: url});
		model = {};
		
		dataSource.bind('data', function (e) {
			var file = e.data,
				opts = _(options).clone();
			
			model[file.basename] = file;
			
			self.trigger('filedata', {
				file: file,
				options: opts
			});
		});
		
		dataSource.bind('end', function (e) {
			self.trigger('loadingcompleted');
		});
		
		dataSource.bind('canceled', function (e) {
			self.trigger('loadingstopped');
		});
		
		dataSource.start();
	};
	
	self.openRoot = function () {
		self.set('');
	};
	
	_.defer(function () {
		var url = baseUrl + '?dir=';
		if (provider) {
			url += '&provider=' + encodeURIComponent(provider);
		}
		openDir(url);
	});
	
	self.cancel = function () {
		if (dataSource) {
			dataSource.cancel();
		}
	};
	
	return self;
}

	NIGHTCOMMANDO.lib.Navigator = Navigator;
}());

