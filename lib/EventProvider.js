/*jslint devel: true, browser: true, unparam: true, white: true, nomen: true, maxerr: 50, indent: 4 */

/*global _, NIGHTCOMMANDO*/

(function () {
	"use strict";

function EventProvider(options) {
	options = options || {};
	
	var self = {},
		events = {},
		whiteList = !!options.eventsAsWhiteList;
	
	function prepEvent(eventDef) {
		events[eventDef.name] = eventDef;
		events[eventDef.name].listeners = eventDef.listeners || [];
		events[eventDef.name].defaultListeners = eventDef.defaultListeners || [];
	}
	
	_.forEach(options.events, function (eventDef) {
		prepEvent(eventDef);
	});
	
	function addEvent(eventDef) {
		if (whiteList) {
			throw new Error("Event " + event + " could not be created as this event provider is configured as whitelist-only.");
		}
		
		if (events.hasOwnProperty(eventDef.name)) {
			throw new Error("Event '" + eventDef.name + "' already defined.");
		}
		
		prepEvent(eventDef);
		//console.log(events);
		return self;
	}
	
	function addListener(eventList, listener) {
		eventList = eventList.split(' ');
		_.forEach(eventList, function (event) {
			if (whiteList && !events.hasOwnProperty(event)) {
				throw new Error("Listener for event '" + event + "' could not be added as it is not in the whitelist.");
			}
		
			events[event].listeners.push(listener);
		});
		return self;
	}
	
	function removeListener(eventList, listener) {
		eventList = eventList.split(' ');
		_.every(eventList, function (event) {
			if (!events.hasOwnProperty(event)) {
				throw new Error("Listener for event '" + event + "' could not be removed as it is not a registered event.");
			}
			
			if (!listener) {
				events[event].listeners = [];
				return null;
			}
			
			events[event].listeners = _(events[event].listeners).without(listener);
			
			return true;
		});
		return self;
	}
	
	function fireListener(eventList, data) {
		eventList = eventList.split(' ');
		_.forEach(eventList, function (event) {
			if (!events.hasOwnProperty(event)) {
				throw new Error("Listener for event '" + event + "' could not be fired as it is not a registered event.");
			}
		
			var ii,
				stopImmediatePropagation = false,
				preventDefault = false,
				e = {
					eventType: event,
					data: data,
					stopImmediatePropagation: function () {
						stopImmediatePropagation = true;
					},
					preventDefault: function () {
						preventDefault = true;
					}
				};
		
			for (ii = 0; ii < events[event].listeners.length; ii += 1) {
				events[event].listeners[ii].call(self, e);
				if (stopImmediatePropagation) {
					break;
				}
			}
		
			stopImmediatePropagation = false;
		
			for (ii = 0; ii < events[event].defaultListeners.length; ii += 1) {
				if (stopImmediatePropagation || preventDefault) {
					break;
				}
				events[event].defaultListeners[ii].call(self, e);
			}
		});
	}
	
	function fireDefaultListeners(eventList, data) {
		eventList = eventList.split(' ');
		_.forEach(eventList, function (event) {
			if (!events.hasOwnProperty(event)) {
				throw new Error("Listener for event '" + event + "' could not be fired as it is not a registered event.");
			}
		
			var ii,
				stopImmediatePropagation = false,
				preventDefault = false,
				e = {
					data: data,
					stopImmediatePropagation: function () {
						stopImmediatePropagation = true;
					},
					preventDefault: function () {
						preventDefault = true;
					}
				};
		
			for (ii = 0; ii < events[event].defaultListeners.length; ii += 1) {
				if (stopImmediatePropagation || preventDefault) {
					break;
				}
				events[event].defaultListeners[ii].call(self, e);
			}
		});
	}
	
	function countListeners(eventList) {
		eventList = eventList.split(' ');
		var cc = 0;
		
		_.forEach(eventList, function (event) {
			cc += events[event].defaultListeners.length;
			cc += events[event].listeners.length;
		});
		
		return cc;
	}
	
	function countDefaultListeners(eventList) {
		eventList = eventList.split(' ');
		var cc = 0;
		
		_.forEach(eventList, function (event) {
			cc += events[event].listeners.length;
		});
		
		return cc;
	}
	
	function destroyListeners () {
		_.each(events, function (v, key) {
			events[key].listeners = [];
			events[key].defaultListeners = [];
		});
	}
	
	self.unbindAll = destroyListeners;
	self.bind = addListener;
	self.countBound = countListeners;
	self.trigger = fireListener;
	self.triggerDefaults = fireDefaultListeners;
	self.countBoundDefaults = countDefaultListeners;
	self.unbind = removeListener;
	self.createEvent = addEvent;
	
	return self;
}

	NIGHTCOMMANDO.lib.EventProvider = EventProvider;
}());


