/*jslint devel: true, browser: true, unparam: true, white: true, nomen: true, maxerr: 50, indent: 4 */

/*global _*/

(function () {
	"use strict";

function PathHistory(path) {
	"use strict";
	
	var self = {},
		history = [],
		future = [];
	
	path.bind('change ascend descend', function (e) {
		if (e.data.path !== history[history.length - 1]) {
			history.push(e.data.path);
		}
		future = [];
	});
	
	function back() {
		var h = history.pop(),
			loc = history[history.length - 1] || "";
		if (h !== undefined) {
			if (h !== future[future.length - 1]) {
				future.push(h);
			}
		}
		path.set(loc, true);
	}
	
	function forward() {
		var f = future.pop(),
			loc;
		
		if (f !== undefined && history[history.length - 1] !== f) {
			history.push(f);
		}
		
		loc = f || "";
		path.set(loc, true);
	}
	
	function reload() {
		var loc = history[history.length - 1] || "";
		path.set(loc, true);
	}
	
	function hasHistory() {
		while (history[0] === "") {
			history.shift();
		}
		
		return history.length > 0;
	}
	
	function hasFuture() {
		return future.length > 0;
	}
	
	self.hasHistory = hasHistory;
	self.hasFuture = hasFuture;
	self.reload = reload;
	self.back = back;
	self.forward = forward;
	
	return self;
}

	NIGHTCOMMANDO.lib.PathHistory = PathHistory;
}());

