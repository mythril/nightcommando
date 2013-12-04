/*jslint devel: true, browser: true, unparam: true, white: true, nomen: true, maxerr: 50, indent: 4 */

/*global $*/

(function () {
	"use strict";
	//var interval = new Interval(50);
	var interval = new NIGHTCOMMANDO.lib.Interval(200);
	
	NIGHTCOMMANDO.lib.DataStream = function (from) {
		var src = $('<iframe src="' + from + '" frameborder="0"></iframe>')
				.css({
					width: '1px',
					height: '1px',
					position: 'absolute',
					left: '-100px',
					top: '-100px',
					visibility: 'hidden'
				}),
			dynamicallyCall = {},
			self = new NIGHTCOMMANDO.lib.EventProvider({
				events: {
					data: {
						'name': 'data'
					},
					canceled: {
						'name': 'canceled'
					},
					end: {
						'name': 'end'
					}
				}
			});
		
		function gather() {
			var contents = src.contents(),
				chunks = $('.chunk', contents.get(0).body);
				
			$.each(chunks, function (ii, value) {
				$.each(($.parseJSON($(value).html())), function (jj, atom) {
					self.trigger('data', atom);
				});
				
				$(value).remove();
			});
		}
		
		function sourceHasEndMarker() {
			return !!$('#end:first-child', src.contents().get(0).body).get(0);
		}
		
		function scan() {
			gather();
			
			if (sourceHasEndMarker()) {
				self.trigger('end', from);
				dynamicallyCall.cleanUp();
			}
		}
		
		function cleanUp() {
			interval.unbind('tick', scan);
			src.remove();
			self.unbindAll();
		}
		
		dynamicallyCall.cleanUp = cleanUp;
		
		function cancel() {
			self.trigger('canceled', from);
			cleanUp();
		}
		
		function start() {
			src.appendTo(document.body);
			interval.bind('tick', scan);
		}
		
		self.start = start;
		self.cancel = cancel;
		self.scan = scan;
		
		return self;
	};
}());


