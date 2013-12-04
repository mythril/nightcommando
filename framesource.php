<?php

require_once __DIR__ . '/BrowserBrowser/FileIteratorFactory.class.php';
require_once __DIR__ . '/BrowserBrowser/FileListingIterator.class.php';
require_once __DIR__ . '/BrowserBrowser/ChunkedListing.class.php';

$provider = isset($_GET['provider']) ? $_GET['provider'] : 'FileMetaIterator';
$showHidden = (bool)@$_GET['showHidden'];
$showSpecialDirs = (bool)@$_GET['showSpecialDirs'];

try {
	$fileList = FileIteratorFactory::build(
		$provider,
		'/home/user/' . @$_GET['dir'],
		'/home/user/'
	);
} catch (PathConstraintViolatedException $e) {
	//TODO Better logging
	trigger_error('User attempted to access directory above their root.');
	die();
}

ChunkedListing::documentOutput($fileList, 0.001);


