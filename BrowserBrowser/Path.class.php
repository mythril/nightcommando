<?php

class Path {
	/** Checks to see if a given <code>$path</code> is a subdirectory of <code>
	*	$constrainedTo</code>
	*/
	public static function isDescendantOf($ancestors, $path) {
		if (!is_dir($path)) {
			return false;
		}
		
		if (!is_dir($ancestors)) {
			return false;
		}
		
		if (strpos(
			realpath($path . '/') . '/',
			realpath($ancestors . '/') . '/'
		) !== 0) {
			return false;
		}
		
		return true;
	}
	
	/** Filter out system internal path information for end-user display
	*
	*/
	public static function hideAncestors($ancestors, $path) {
		if (self::isDescendantOf($ancestors, $path)) {
			return ltrim(
				substr(
					$path,
					strlen($ancestors)
				),
				'/'
			);
		} else {
			return false;
		}
	}
}

class PathConstraintViolatedException extends Exception{
	
}


