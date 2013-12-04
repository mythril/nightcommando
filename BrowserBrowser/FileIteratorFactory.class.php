<?php

require_once __DIR__ . '/Path.class.php';

class FileIteratorFactory {
	
	public static function depend($type) {
		$type = basename($type);
		require_once __DIR__ . '/' . $type . '.class.php';
	}
	
	public static function build($type, $path, $constrainedTo, $opts=null) {
		self::depend($type);
		if ($opts !== null) {
			return new $type($path, $constrainedTo, $opts);
		} else {
			return new $type($path, $constrainedTo);
		}
	}
}


