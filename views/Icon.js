/*jslint devel: true, browser: true, unparam: true, white: true, nomen: true, maxerr: 50, indent: 4 */

/*global $, NIGHTCOMMANDO*/

(function () {
	"use strict";

function Icon(el, nc, options) {
	
	//TODO bail out if nc's provider doesn't supply mimetype, or use extension matching
	
	el = $('<div class="nightcommando-icon-view"></div>').appendTo(el);
	/*
	el.selectable({
		filter: '.nc-icon'
	});
	Selectable(
		el,
		function (element) {
			return $(element).hasClass('nc-icon');
		},
		{
			distance: 15
		}
	);
	*/
	var supportsSVG = false;//!!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGRect;
	
	function addIcon(el, file) {
		var $icon = $('<div class="nc-icon ui-widget-content"></div>'),
			$image = $([
				'<img src="mime-map.php?mimetype=',
				file.mimetype,
				(!supportsSVG) ? '&noSVG=1' : '',
				'" alt="',
				file.dirname,
				'/',
				file.basename,
				'" />'
			].join(''));
		
		if (file.is_dir) {
			$icon.bind('dblclick', function (e) {
				nc.descend(file.basename);
			});
		}
		
		$icon.append($image);
		$icon.append('<div class="nc-fname">' + file.basename + '</div>');
		el.append($icon);
		//el.selectable('refresh');
	}
	
	
	nc.bind('loadingstarted', function () {
		$('.nc-icon', el).remove();
	});
	
	nc.bind('filedata', function (e) {
		addIcon(el, e.data.file);
	});
	
}

	NIGHTCOMMANDO.views.Icon = Icon;
}());

