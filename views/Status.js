/*jslint devel: true, browser: true, unparam: true, white: true, nomen: true, maxerr: 50, indent: 4 */

/*global $*/

(function () {
	"use strict";

function Status(el, nc, options) {
	el = $('<div class="nightcommando-status-view"></div>').appendTo(el);
	
	nc.bind('loadingstarted', function () {
		el.text('Loading...');
	});
	
	nc.bind('loadingcompleted', function () {
		el.text('Done.');
	});
	
	nc.bind('loadingstopped', function () {
		el.text('Cancelled.');
	});
}

	NIGHTCOMMANDO.views.Status = Status;
}());

