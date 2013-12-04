/*jslint devel: true, browser: true, unparam: true, white: true, nomen: true, maxerr: 50, indent: 4 */

/*global _*/

(function () {
	"use strict";

function Path(privelegedListeners) {
	"use strict";
	
	var self = new NIGHTCOMMANDO.lib.EventProvider({
			events: {
				change: {
					'name': 'change',
					defaultListeners: privelegedListeners
				},
				ascend: {
					'name': 'ascend',
					defaultListeners: privelegedListeners
				},
				descend: {
					'name': 'descend',
					defaultListeners: privelegedListeners
				}
			}
		}),
		stack = [];
	
	function path() {
		return stack.join('/');
	}
	
	self.ascend = function () {
		stack.pop();
		self.trigger('ascend', {path: path()});
	};
	
	self.descend = function (dir) {
		stack.push(dir);
		self.trigger('descend', {path: path()});
	};
	
	self.set = function (newPath, suppress) {
		stack = newPath.split('/');
		if (suppress) {
			self.triggerDefaults('change', {path: path()});
		} else {
			self.trigger('change', {path: path()});
		}
	};
	
	self.get = function () {
		return stack.join('/');
	};
	
	return self;
}
	NIGHTCOMMANDO.lib.Path = Path;
}());

