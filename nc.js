/*jslint devel: true, browser: true, unparam: true, white: true, nomen: true, maxerr: 50, indent: 4 */

/*global _, $, EventProvider, Path, DataStream*/

var test1, nav1, tree1;
var test2, nav2, tree2;

$(function () {
	"use strict";
	
	var ico1,
		NCL = NIGHTCOMMANDO.lib,
		NCV = NIGHTCOMMANDO.views,
		status1,
		status2,
		address1,
		address2,
		ico2;
	
	test1 = new NCL.Navigator('framesource.php');
	test2 = new NCL.Navigator('framesource.php');
	
	ico1 = new NCV.Icon('#browser .right-pane', test1);
	ico2 = new NCV.Icon('#browser2 .right-pane', test2);
	
	nav1 = new NCV.NavBar($('.toolbar', '#browser'), test1, new NCL.PathHistory(test1));
	nav2 = new NCV.NavBar($('.toolbar', '#browser2'), test2, new NCL.PathHistory(test2));
	
	tree1 = new NCV.Tree('#browser .left-pane', new NCL.Navigator('framesource.php', {provider: 'DirIterator'}));
	tree2 = new NCV.Tree('#browser2 .left-pane', new NCL.Navigator('framesource.php', {provider: 'DirIterator'}));
	
	tree1.bind('click', function (e) {
		test1.set(e.data.path);
	});
	
	tree2.bind('click', function (e) {
		test2.set(e.path);
	});
	
	status1 = new NCV.Status('#browser .status-bar', test1);
	status2 = new NCV.Status('#browser2 .status-bar', test2);
	
	address1 = new NCV.AddressBar('#browser .address-bar', test1);
	address2 = new NCV.AddressBar('#browser2 .address-bar', test2);
	
});




