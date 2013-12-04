<?php

require_once __DIR__ . '/Path.class.php';
require_once __DIR__ . '/FileListingIterator.class.php';

class DirIterator extends FileListingIterator{
	public function __construct($path, $constrainedTo, $opts=parent::DEFAULTS) {
		parent::__construct($path, $constrainedTo, $opts);
	}
	
	public function __destruct() {
		parent::__destruct();
	}
	
	public function next() {
		do {
			parent::next();
		} while((!is_dir($this->key())) && $this->valid());
		
		$this->current = Path::hideAncestors($this->constrainedTo, $this->key());
	}
}


