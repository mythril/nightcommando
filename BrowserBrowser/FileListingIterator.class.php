<?php

require_once __DIR__ . '/Path.class.php';

class FileListingIterator implements Iterator{
	protected $dir;
	protected $current = false;
	protected $key = false;
	protected $path;
	protected $constrainedTo;
	protected $opts;
	const FILTER_SPECIAL_DIRS = 1;
	const FILTER_DOTNAMES = 2;
	const DEFAULTS = 3; //FILTER_DOTNAMES|FILTER_SPECIAL_DIRS
	const NONE = 0;
	
	public function __construct($path, $constrainedTo, $opts=self::DEFAULTS) {
		$this->dir = false;
		$this->path = realpath($path) . "/";
		$this->constrainedTo = $constrainedTo;
		$this->opts = $opts;
		
		if (Path::isDescendantOf($constrainedTo, $path)) {
			$this->dir = opendir($this->path);
		} else {
			throw new PathConstraintViolatedException(
				'Path provided was not a traversable sub directory'
			);
		}
		
	}
	
	public function __destruct() {
		closedir($this->dir);
	}
	
	private function filterCheck() {
		if (($this->opts & self::FILTER_SPECIAL_DIRS) === self::FILTER_SPECIAL_DIRS) {
			if ($this->key === '.' || $this->key === '..') {
				$this->next();
			}
		}
		if (($this->opts & self::FILTER_DOTNAMES) === self::FILTER_DOTNAMES){
			if (substr($this->key, 0, 1) === '.') {
				$this->next();
			}
		}
	}
	
	public function current () {
		$this->filterCheck();
		return $this->current;
	}
	
	public function key () {
		$this->filterCheck();
		return $this->path . $this->key;
	}
	
	public function next () {
		$this->key = readdir($this->dir);
		$this->current = $this->key();
	}
	
	public function rewind () {
		rewinddir($this->dir);
		$this->next();
	}
	
	public function valid () {
		return $this->key !== false;
	}
}

