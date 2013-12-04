/*jslint devel: true, browser: true, unparam: true, white: true, nomen: true, maxerr: 50, indent: 4 */

/*global _, $, YAHOO, NIGHTCOMMANDO*/

(function () {
	"use strict";

function Tree(el, nc, options) {
	
	el = $('<div class="nightcommando-tree-view"></div>').appendTo(el);
	
	var self = new NIGHTCOMMANDO.lib.EventProvider({
			events: {
				click: {
					'name': 'click'
				}
			}
		}),
		data = {},
		tree = new YAHOO.widget.TreeView(el.get(0)),
		current = "";
	
	nc.bind('descend ascend change', function (e) {
		current = e.data.path;
	});
	
	function putInTree(file, element) {
		var path = current.split('/'),
			cursor = data,
			tmp = null;
		
		path.push(file);
		
		while (path.length > 0) {
			tmp = path.shift();
			while (tmp === "") {
				tmp = path.shift();
			}
			
			if (!cursor[tmp]) {
				cursor[tmp] = {};
			}
			
			cursor = cursor[tmp];
			if (path.length === 0 && element) {
				cursor['element://?#'] = element;
			}
		}
	}
	
	function getLeafElement(fullPath) {
		var path = fullPath.split('/'),
			cursor = data,
			tmp = null;
		
		if (fullPath === "") {
			return tree.getRoot();
		}
		
		while (path.length > 0) {
			tmp = path.shift();
			cursor = cursor[tmp];
		}
		
		return cursor['element://?#'];
	}
	
	nc.bind('filedata', function (e) {
		var leaf = getLeafElement(current),
			file = e.data.file.split('/').pop(),
			node;
			
		node = new YAHOO.widget.TextNode(
			file,
			leaf,
			false
		);
		
		putInTree(file, node);
		tree.draw();
	});
	
	function getPath(node) {
		var path = [],
			root = tree.getRoot();
		
		while (node !== root) {
			path.push(node.label);
			node = node.parent;
		}
		
		return path.reverse().join('/');
	}
	
	tree.subscribe('clickEvent', function (e) {
		self.trigger('click', {path: getPath(e.node)});
	});
	
	tree.setDynamicLoad(function (node, complete) {
		var path = getPath(node),
			done;
		
		nc.set(path);
		
		done = function() {
			complete(); //allows for real-time drawing
			tree.locked = true; //prevents interaction until load completes
			nc.unbind('filedata loadingcompleted', done);
		}
		
		nc.bind('filedata loadingcompleted', done);
	});
	
	nc.bind('loadingcompleted', function () {
		_.defer(function () {
			//restores interaction after load completes and stack unwinds
			tree.locked = false;
		});
	});
	
	return self;
}

	NIGHTCOMMANDO.views.Tree = Tree;
}());

