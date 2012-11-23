function parseDirectoryResults( result )
{
	// Clear files
	$('#filelist').html('');
	
	// Load the files
	for(var i in result.result.files)
	{
		$('#filelist').append('<a href="#" class="' + result.result.files[i]['extension'] + ' file thumbnail"><div class="preview"><img src="images/ajax-thumbnail-loader.gif" alt="Loading..." /></div><span class="filename">' + result.result.files[i]['filename'] + '</span></a>');
	}
}

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
				parseDirectoryResults(result);
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
			parseDirectoryResults(result);
		},
		error: function(result) {
			alert(result.error.message);
		}
	});
});