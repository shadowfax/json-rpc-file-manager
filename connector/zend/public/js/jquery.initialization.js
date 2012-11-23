$(document).ready(function() {
	
	$.jsonRPC.setup({
		endPoint: "/js/tiny_mce/plugins/imagemanager/connector/zend/public/filemanager/service"
	});
	
	$("#refresh").live('click', function(event) {
		event.preventDefault();
		
		// Call 'ls' on the current working directory
		FileSystem.ls(null, {
			success: function(result) {
				// ToDo: display the results!!!
			},
			error: function(result) {
				alert(result.error.message);
			}
		});
		return false;
	});
	
	$("#create-folder").live('click', function(event) {
		event.preventDefault();
		alert("Call mkdir");
		return false;
	});
	
	$("#upload-file").live('click', function(event) {
		event.preventDefault();
		alert("Call upload");
		return false;
	});
	
	/**
	 * Finally call 'ls' on the root path to populate the file and directory tree!
	 */
	FileSystem.ls('/', {
		success: function(result) {
			// ToDo: display the results!!!
		},
		error: function(result) {
			alert(result.error.message);
		}
	});
});