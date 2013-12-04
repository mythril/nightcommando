/*jslint devel: true, browser: true, unparam: true, white: true, nomen: true, maxerr: 50, indent: 4 */

/*global _, setInterval, NIGHTCOMMANDO*/

(function () {
	"use strict";

function Interval(ms) {
	
	var interval = null,
		self = new NIGHTCOMMANDO.lib.EventProvider({
			events: {
				tick: {
					'name': 'tick'
				},
				stopped: {
					'name': 'stopped'
				},
				started: {
					'name': 'started'
				}
			}
		}),
		bindStandin = self.bind,
		unbindStandin = self.unbind;
	
	function tick() {
		self.trigger('tick');
	}
	
	function start() {
		if (self.countBound('tick') > 0 && !interval) {
			interval = setInterval(tick, ms);
			self.trigger('started');
		}
	}
	
	function stop() {
		if (self.countBound('tick') <= 0 && interval) {
			clearInterval(interval);
			interval = null;
			self.trigger('stopped');
		}
	}
	
	function bind() {
		bindStandin.apply(self, _(arguments).toArray());
		start();
	}
	
	self.bind = bind;
	
	function unbind() {
		unbindStandin.apply(self, _(arguments).toArray());
		stop();
	}
	
	self.unbind = unbind;
	
	return self;
}

	NIGHTCOMMANDO.lib.Interval = Interval;
}());

/*
(function testInterval() {
	var i = new NIGHTCOMMANDO.lib.Interval(500);
	
	i.bind('tick', function () {
		console.log('tick', +new Date());
	});
}());
*/

