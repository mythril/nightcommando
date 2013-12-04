function Selectable(el, matcher, opts) {
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
	
	function selectionChange(e) {
		var x2 = e.offsetX,
			y2 = e.offsetY;
	
		console.log(x2, y2);
	
		selectionBox.css({
			left: Math.min(startX, x2),
			top: Math.min(startY, y2),
			right: el.outerWidth() - Math.max(startX, x2),
			bottom: el.outerHeight() - Math.max(startY, y2)
		});
	}
	
	function distance(srcEvent, mousemove) {
		var travelled = 0,
			lastLoc = srcEvent;
		return function named(e) {
			travelled += Math.abs(lastLoc.clientX - e.clientX);
			travelled += Math.abs(lastLoc.clientY - e.clientY);
			lastLoc = e;
			
			if (travelled > options.distance) {
				selectionBox = $('<div id="nc-selection-box"></div>')
					.css({
						position: 'absolute',
						right: el.outerWidth() - e.offsetX,
						bottom: el.outerHeight() - e.offsetY,
						left: e.offsetX,
						top: e.offsetY
					})
					.appendTo(el);
				
				startX = srcEvent.offsetX;
				startY = srcEvent.offsetY;
				
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
