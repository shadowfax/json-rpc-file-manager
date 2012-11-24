<?php

class FilemanagerController extends Zend_Controller_Action
{
	protected $_documentRoot;
	protected $_extensionsFolder = "/js/tiny_mce/plugins/imagemanager/connector/zend/public/images/fileextensions";
	
	
	public function init()
	{
		$this->_documentRoot = realpath($_SERVER['DOCUMENT_ROOT']);
	}
	
	public function indexAction()
	{
	
	}
	
	public function serviceAction()
	{
		// Disable view renderer as we return JSON RPC Data
		$this->_helper->viewRenderer->setNoRender(true);

		// Create the array of params for the setup
		$front = Zend_Controller_Front::getInstance();
		$router = $front->getRouter();
		
		$setup = array(
			'thumbnails_uri'	=> $router->assemble(array('module' => $this->getRequest()->getModuleName(), 'controller' => $this->getRequest()->getControllerName(), 'action' => 'thumbnail'), $router->getCurrentRouteName(), true, false) 
		);
		
		// Start JSON RPC
		$server = new Zend_Json_Server();
		$server->setClass('Application_Model_Filemanager',null, null, $setup);
		
		// handle the request
		$server->handle();
	}
	
	public function thumbnailAction()
	{
		// Disable view renderer as we return an image file
		$this->_helper->viewRenderer->setNoRender(true);
		
		
		$filepath = $this->getRequest()->getParam('file', null);
		
		$extension = explode(".", $filepath);
		$extension = strtolower(end($extension));

		// For extension images
		$filepath = $this->_documentRoot . $this->_extensionsFolder . "/thumbnail/";
		if (file_exists($filepath . $extension . ".png")) {
			$filepath .= $extension . ".png";
		} else {
			$filepath .= "unknown.file.png";
		}
		
		$response = $this->getResponse();
		$response->setHeader('Content-type', 'image/png');
		$response->setBody(file_get_contents($filepath));
		$response->sendResponse();
	}
	
	public function preDispatch()
	{
		// No layout for filemanager
		$layout = Zend_Layout::getMvcInstance();
		if ($layout !== null) {
			$this->_helper->layout()->disableLayout();
		} 
	}
}