/*jslint white: true, maxerr: 50, indent: 4 */
/*global $, NIGHTCOMMANDO*/

var exposed;

function Selectable(el, matcher, opts) {
	"use strict";
	
	el = $(el);
	
	var options = opts || {},
		selectionBox,
		startX = 0,
		startY = 0,
		op = el.offsetParent(),
		self = NIGHTCOMMANDO.lib.EventProvider({
			events: {
				selectionChange: {
					'name': 'selectionChange'
				},
				selectionStart: {
					'name': 'selectionStart'
				},
				selecting: {
					'name': 'selecting'
				},
				selectingEnd: {
					'name': 'selectingEnd'
				}
			}
		});
	
	options.distance = options.distance || 0;
	
	function localPos(e) {
		var dim = el.offset();
		dim.width = el.width();
		dim.height = el.height();
		
		dim.x = e.pageX - dim.left;
		dim.y = e.pageY - dim.top - el.scrollTop();
		
		return dim;
	}
	
	function selectionChange(e) {
		var lp = localPos(e);
		
		if (lp.x < 0) {
			return;
		}
		
		if (lp.x > lp.width) {
			return;
		}
		
		if (lp.y < 0) {
			//scroll up?
			return;
		}
		
		if (lp.y > lp.height) {
			//scroll down?
			return;
		}
		
		selectionBox.css({
			left: Math.min(startX, lp.x),
			top: Math.min(startY, lp.y),
			width: Math.abs(startX - lp.x),
			height: Math.abs(startY - lp.y)
		});
		
	}
	
	function distance(srcEvent, mousemove) {
		var travelled = 0,
			lastLoc = localPos(srcEvent);
		return function named(e) {
			var lp = localPos(e);
			
			travelled += Math.abs(lastLoc.x - lp.x);
			travelled += Math.abs(lastLoc.y - lp.y);
			lastLoc = lp;
			console.log(lp);
			
			if (travelled > options.distance) {
				selectionBox = $('<div id="nc-selection-box"></div>')
					.css({
						position: 'absolute',
						left: e.offsetX,
						top: e.offsetY
					})
					.appendTo(el);
				
				startX = srcEvent.offsetX;
				startY = srcEvent.offsetY;
				console.log('initial', startX, startY);
				
				//el.unbind('mousemove', distance);
				
				$(document.body).bind('mouseup', function bodymouseup() {
					el.unbind('mousemove', mousemove);
					
					if (selectionBox) {
						selectionBox.remove();
						selectionBox = null;
					}
					
					console.log('done');
					//console.log('b', bodymouseup);
					$(document.body).unbind('mouseup', bodymouseup);
					el.bind('mousedown', selectionStart);
				});
				
				el.bind('mousemove', mousemove);
				el.unbind('mousemove', named);
				mousemove(e);
			}
			
		};
	}
	
	function selectionStart(e) {
		e.stopPropagation();
		console.log('mousedown');
		if (el.is(e.srcElement)) {
			var bound = distance(e, selectionChange);
			el.bind('mousemove', bound);
			el.bind('mouseup', function () {
				el.unbind('mousemove', bound);
			});
			el.unbind('mousedown', selectionStart);
		}
	}
	
	el.bind('mousedown', selectionStart);
	
}
