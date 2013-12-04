/*jslint devel: true, browser: true, unparam: true, white: true, nomen: true, maxerr: 50, indent: 4 */

/*global $*/

(function () {
	"use strict";

function AddressBar(el, nc, options) {
	el = $('<div class="nightcommando-address-bar-view"></div>').appendTo(el);
	
	nc.bind('change ascend descend', function (e) {
		el.text('/' + e.data.path);
	});
	
	el.text('/' + nc.get());
}

	NIGHTCOMMANDO.views.AddressBar = AddressBar;
}());

