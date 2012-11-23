<?php

class Application_Model_Filemanager
{
	protected $_documentRoot;

	public function __construct()
	{
		 $this->_documentRoot = realpath($_SERVER['DOCUMENT_ROOT']);
	}
	
	/**
	 * Javascript library is asking if it can change directories.
	 * 
	 * @param string $directory
	 * @throws Zend_Json_Server_Exception
	 */
	public function cd($directory)
	{
		$directory = $this->_getAbsolutePath($directory);
		
		if (!is_dir($directory)) {
			throw new Zend_Json_Server_Exception("Not a directory", -32000);
		} elseif (!is_readable($directory)) {
			throw new Zend_Json_Server_Exception("Access denied", -32000);
		}
		
		// The response returns a little info about the directory
		// For example, we could disable uploads if it is not writable ;)
		$result = array(
			'readable'	=> true, /* If it was not so an error would have been sent earlier */
			'writable'	=> is_writable($directory)
		);
		
		// Tell the library a little about this directory
		return $result;
	}
	
	/**
	 * List directory contents.
	 * 
	 * @param string $directory
	 */
	public function ls($directory)
	{
		$directory = $this->_getAbsolutePath($directory);
		
		if (!is_dir($directory)) {
			throw new Zend_Json_Server_Exception("Not a directory", -32000);
		} elseif (!is_readable($directory)) {
			throw new Zend_Json_Server_Exception("Access denied", -32000);
		}
		
		$result = array(
			'folders'	=> array(),
			'files'		=> array()
		);
		
		$dir = new DirectoryIterator($directory);
		foreach($dir as $file) {
			if (!$file->isDot()) {
				if ($file->isDir()) {
					$result['folders'][] = array(
						'filename'	=> $file->getFilename()
					);
				} elseif($file->isFile()) {
					$result['files'][] = array(
						'filename'	=> $file->getFilename(),
						'extension'	=> $file->getExtension()
					);
				}
			}
		}
		
		// close handles
		unset($file);
		unset($dir);
		
		// return the results
		return $result;
	}

	/**
	 * Get the absolute path to a file or folder.
	 * 
	 * The javascript library should be sending absolute paths
	 * for what it knows, but not absolute paths for the server.
	 * 
	 * @param unknown_type $pathname
	 */
	protected function _getAbsolutePath($pathname)
	{
		if (is_string($this->_documentRoot)) {
			if (strlen($this->_documentRoot) > 0) {	
				$absolute_path = @realpath($this->_documentRoot . $pathname);
				if ($absolute_path !== false) {
					if (strlen($absolute_path) >= strlen($this->_documentRoot)) {
						if (strcasecmp(substr($absolute_path, 0, strlen($this->_documentRoot)), $this->_documentRoot) === 0) {
							return $absolute_path;
						}
					}
				}
			}
		}
		
		throw new Zend_Json_Server_Exception("Access denied " . $absolute_path, -32000);
	}
}