<?php

class Application_Model_Filemanager
{
	protected $_documentRoot;
	protected $_thumbnailsUri;

	public function __construct($arguments)
	{
		if (is_array($arguments)) {
			if (isset($arguments['thumbnails_uri'])) {
				$this->_thumbnailsUri = $arguments['thumbnails_uri'];
			}
		}
		$this->_documentRoot = realpath($_SERVER['DOCUMENT_ROOT']);
	}
	
	/**
	 * JavaScript library is telling us it is initializing.
	 * Serve any appropiate configuration back to the library.
	 */
	public function init()
	{
		$result = array();
		
		// What file extension have thumbnails?
		$result['thumbnails_for'] = implode(",", array("jpg", "png", "gif"));
		$result['thumbnails_uri'] = $this->_thumbnailsUri;
		#TODO: I need to know what URL to call in order to get the thumbnails.
		
		return $result;
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
	public function ls($directory, $flags = null)
	{
		$directory = $this->_getAbsolutePath($directory);
		if ($flags === null) $flags = "";
		
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
				$filename = $file->getFilename();

				// Hide all files starting with "." except if "a" is present in flags
				if ((substr($filename, 0, 1) !== '.') || (strpos($flags, 'a') !== false)) {
					if ($file->isDir()) {
						$result['folders'][] = array(
							'filename'	=> $filename
						);
					} elseif($file->isFile()) {
						$result['files'][] = array(
							'filename'	=> $filename,
							'extension'	=> strtolower($file->getExtension())	/* always lower to avoid errors */
						);
					}
				}
			}
		}
		
		// close handles
		unset($file);
		unset($dir);
		
		#TODO: would be nice to send the response, close the connection, and process the directory for changes too create thumbnails. Should be possible but I guess I should modify the Server :/
		
		// return the results
		return $result;
	}

	/**
	 * Get the absolute path to a file or folder.
	 * 
	 * The javascript library should be sending absolute paths
	 * for what it knows, but not absolute paths for the server.
	 * 
	 * @param string $pathname
	 */
	protected function _getAbsolutePath($pathname)
	{
		$document_root = $this->_getDocumentRoot();
		if (strlen($document_root) > 0) {	
			$absolute_path = @realpath($document_root . $pathname);
			if ($absolute_path !== false) {
				$document_root_len = strlen($document_root);
				$absolute_path_len = strlen($absolute_path);
				// Note: /var/www, /var/www2, ...
				if ($absolute_path_len === $document_root_len) {
					if (strcasecmp(substr($absolute_path, 0, $document_root_len), $document_root) === 0) {
						return $absolute_path;
					}
				} elseif ($absolute_path_len > $document_root_len) {
					if (strcasecmp(substr($absolute_path, 0, $document_root_len + 1), $document_root . DIRECTORY_SEPARATOR) === 0) {
						return $absolute_path;
					}
				}
			}
		}
		
		throw new Zend_Json_Server_Exception("Access denied " . $absolute_path, -32000);
	}
	
	/**
	 * Get the document root path
	 * 
	 * @return string
	 */
	protected function _getDocumentRoot()
	{
		if (null === $this->_documentRoot) {
			if (is_set($_SERVER['DOCUMENT_ROOT'])) {
				$this->_documentRoot = @realpath($_SERVER['DOCUMENT_ROOT']);
				if (empty($this->_documentRoot)) {
					$this->_documentRoot = null;
				}	
			}
			
			if (null === $this->_documentRoot) {
				throw new Zend_Json_Server_Exception("Unable to determine the location of document root", -32000);
			}
		}
		
		return $this->_documentRoot;
	}
}