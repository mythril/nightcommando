/*jslint devel: true, browser: true, unparam: true, white: true, nomen: true, maxerr: 50, indent: 4 */

/*global $*/

(function () {
	"use strict";

function NavBar(el, nc, history) {
	el = $(el);
	var backBtn = $('<div class="back"></div>').appendTo(el),
		forwardBtn = $('<div class="forward"></div>').appendTo(el),
		upBtn = $('<div class="ascend"></div>').appendTo(el),
		stopBtn = $('<div class="stop"></div>').appendTo(el),
		reloadBtn = $('<div class="reload"></div>').appendTo(el),
		homeBtn = $('<div class="home"></div>').appendTo(el);
	
	backBtn.addClass('disabled');
	forwardBtn.addClass('disabled');
	upBtn.addClass('disabled');
	stopBtn.addClass('disabled');
	
	function updateButtons() {
		if (history.hasHistory()) {
			backBtn.removeClass('disabled');
		} else {
			backBtn.addClass('disabled');
		}
		
		if (history.hasFuture()) {
			forwardBtn.removeClass('disabled');
		} else {
			forwardBtn.addClass('disabled');
		}
		
		if (nc.get()) {
			upBtn.removeClass('disabled');
		} else {
			upBtn.addClass('disabled');
		}
	}
	
	nc.bind('loadingstopped loadinginterrupted loadingcompleted', function () {
		stopBtn.addClass('disabled');
	});
	
	nc.bind('loadingstarted', function () {
		stopBtn.removeClass('disabled');
	});
	
	nc.bind('change ascend descend', updateButtons);
	
	function disabledHandler(handler) {
		return function (e) {
			if ($(e.target).hasClass('disabled')) {
				return;
			}
			handler();
			updateButtons();
		};
	}
	
	backBtn.click(disabledHandler(history.back));
	
	forwardBtn.click(disabledHandler(history.forward));
	
	upBtn.click(disabledHandler(nc.ascend));
	
	stopBtn.click(disabledHandler(nc.cancel));
	
	reloadBtn.click(disabledHandler(history.reload));
	
	homeBtn.click(disabledHandler(nc.openRoot));
}

	NIGHTCOMMANDO.views.NavBar = NavBar;
}());

