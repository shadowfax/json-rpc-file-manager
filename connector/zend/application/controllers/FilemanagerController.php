<?php

class FilemanagerController extends Zend_Controller_Action
{
	
	public function indexAction()
	{
	
	}
	
	public function serviceAction()
	{
		// Disable view renderer as we return JSON RPC Data
		$this->_helper->viewRenderer->setNoRender(true);
		
		// Start JSON RPC
		$server = new Zend_Json_Server();
		$server->setClass('Application_Model_Filemanager');
		
		// handle the request
		$server->handle();
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