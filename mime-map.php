<?php

function showIcon($iconFile, $svg) {
	$ext = ($svg ? '.svg' : '.png');
	$iconFile .= $ext;
	
	$full = __DIR__ . '/icons/' . $iconFile;
	if (file_exists($full . '.processed')) {
		if ($svg) {
			header('Content-Type: image/svg+xml');
		} else {
			header('Content-Type: image/png');
		}
		readfile($full . '.processed');
	} else if (file_exists($full) && $svg) {
		header('Content-Type: image/svg+xml');
		$svg = DOMDocument::load($full);
		$xpath = new DOMXPath($svg);
		$result = $xpath->evaluate('/*/./@width');
		$width = intval($result->item(0)->nodeValue);
		$result = $xpath->evaluate('/*/./@height');
		$height = intval($result->item(0)->nodeValue);
		
		$viewBox = $svg->createAttribute(
			'viewBox'
		);
		
		$viewBox->value = "0 0 $width $height";
		
		$svg->getElementsByTagName('svg')
			->item(0)
			->appendChild($viewBox);
		//echo $width, $height;
		$save = $svg->saveXML();
		echo $save;
		file_put_contents($full . '.processed', $save);
	} else if (file_exists($full)) {
		header('Content-Type: image/png');
		readfile($full);
	} else {
		header("Status: 404 Not Found");
	}
	exit(0);
}

$mime = trim($_GET['mimetype']);

$overrides = array(
	'directory' => 'folder',
	'application/pdf' => 'gnome-mime-application-pdf',
	'application/x-shockwave-flash' => 'gnome-mime-application-x-shockwave-flash',
	'application/x-gzip' => 'archive-x-generic',
	'text/html' => 'text-html',
);

$patterns = array(
	'#^image/.*$#' => 'image-x-generic',
	'#^video/.*$#' => 'video-x-generic',
	'#^audo/.*$#' => 'audio-x-generic',
	'#^text/.*$#' => 'text-x-generic',
	'#^.*$#' => 'text-x-generic-template',
);

$svg = (@$_GET['noSVG'] == 1) ? false : true;

foreach($overrides as $type => $icon) {
	if ($mime == $type) {
		showIcon($icon, $svg);
	}
}

foreach($patterns as $pattern => $icon) {
	if (preg_match($pattern, $mime)) {
		showIcon($icon, $svg);
	}
}




