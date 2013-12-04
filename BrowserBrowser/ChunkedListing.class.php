<?php

class ChunkedListing {
	
	public static function documentOutput($iterator, $flushAfterSeconds=0.1) {
		header( 'Expires: Sat, 26 Jul 1997 05:00:00 GMT' ); 
		header( 'Last-Modified: ' . gmdate( 'D, d M Y H:i:s' ) . ' GMT' ); 
		header( 'Cache-Control: no-store, no-cache, must-revalidate' ); 
		header( 'Cache-Control: post-check=0, pre-check=0', false ); 
		header( 'Pragma: no-cache' ); 
		header("Content-Encoding: chunked");
		$lastFlush = microtime(true);
		
		ob_start('ob_gzhandler');
		set_time_limit(0);
		?>
		<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
		<html lang="en">
		<head>
			<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
			<title>iframe</title>
		</head>
		<body>
		<?php
		$chunk = array();
		$ii = 0;
		foreach($iterator as $data) {
			//usleep(100000);
			$chunk[] = $data;
			if ((microtime(true) - $lastFlush) >= $flushAfterSeconds) {
				?>
				<div id="chunk-<?= $ii; ?>" class="chunk" type="application/json"><?= preg_replace('#([[,])#', "\$1\n", json_encode($chunk)); ?></div>
				<?
				ob_flush();
				$lastFlush = microtime(true);
				$chunk = array();
				$ii += 1;
			}
		}
		if (!empty($chunk)) {
			?>
			<div id="chunk-<?= $ii; ?>" class="chunk" ><?= json_encode($chunk); ?></div>
			<?
		}
		?>
			<div id="end"></div>
		</body>
		</html>

		<?php
		ob_flush();
		ob_end_flush();
	}
}


