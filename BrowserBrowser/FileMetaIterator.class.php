<?php

require_once __DIR__ . '/Path.class.php';
require_once __DIR__ . '/FileListingIterator.class.php';

class FileMetaIterator extends FileListingIterator{
	protected $finfo;
	
	public function __construct($path, $constrainedTo, $opts=parent::DEFAULTS){
		parent::__construct($path, $constrainedTo, $opts);
		$this->finfo = finfo_open(FILEINFO_PRESERVE_ATIME);
	}
	
	public function __destruct() {
		parent::__destruct();
		finfo_close($this->finfo);
	}
	
	public function next () {
		parent::next();
		
		$keys = array(
			'size',
			'atime',
			'mtime',
			'ctime',
			'filename',
			'extension',
			'basename',
		);
		
		$fileData = array();
		
		$stat = @stat($this->key());
		$info = pathinfo($this->key());
		
		foreach($keys as $key) {
			if (isset($stat[$key])) {
				$fileData[$key] = $stat[$key];
			}
			
			if (isset($info[$key])) {
				$fileData[$key] = $info[$key];
			}
		}
		
		$fileData = array_merge($fileData, array(
			'dirname' => Path::hideAncestors($this->constrainedTo, $this->path),
			'mimetype' => finfo_file(
				$this->finfo,
				$this->key(),
				FILEINFO_MIME_TYPE
			),
			'mimeenc' => finfo_file(
				$this->finfo,
				$this->key(),
				FILEINFO_MIME_ENCODING
			),
			'is_dir' => is_dir($this->key()),
		));
		
		$this->current = $fileData;
	}
}


