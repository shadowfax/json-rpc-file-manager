//var tinyMCEPopup = null;

function parseDirectoryResults( result )
{
	// Clear files
	$('#filelist').html('');
	
	// Load folders
	for(var i in result.result.folders)
	{
		var folderName = result.result.folders[i]['filename'];
		$('#filelist').append('<a href="' + folderName + '" class="folder" title="' + folderName + '"><div class="preview"><img src="images/folder-thumbnail.png" alt="' + folderName + '" /></div><span class="filename">' + folderName + '</span></a>');
	}
	
	// Load the files
	var cwd = FileSystem.getCWD();
	for(var i in result.result.files)
	{
		var fileName = result.result.files[i]['filename'];
		$('#filelist').append('<a href="' + cwd + fileName + '" class="' + result.result.files[i]['extension'] + ' file thumbnail" title="' + fileName + '"><div class="preview"><img src="images/ajax-thumbnail-loader.gif" class="lazy" data-original="' + cwd + fileName + '" width="94" height="94" alt="Loading..." /></div><span class="filename">' + fileName + '</span></a>');
	}
	
	// Enable lazy loading
	$("img.lazy").lazyload({
		container: '#filelist',
		effect: 'fadeIn'
	});
}

$(document).ready(function() {
	
	//if (typeof(window.tinyMCEPopup) !== 'undefined') {
	//	tinyMCEPopup = window.tinyMCEPopup;
	//}
	
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
	
	// Capture click on folders
	$("a.folder").live('click', function(event) {
		event.preventDefault();
		return false;
	});
	$("a.folder").live('dblclick', function(event) {
		event.preventDefault();
		
		FileSystem.cd($(this).attr('href'), {
			success: function( result ) {
				// We changed directories successfully
				// so retrieve the contents
				FileSystem.ls(null, {
					success: function(result) {
						// ToDo: display the results!!!
						parseDirectoryResults(result);
					},
					error: function(result) {
						alert(result.error.message);
					}
				});
			},
			error: function( result ) {
				alert( result.error.message );
			}
		});
		
		return false;
	});
	
	// Capture click on files
	$("a.file").live('click', function(event) {
		event.preventDefault();
		
		return false;
	});
	$("a.file").live('dblclick', function(event) {
		event.preventDefault();
		
		// ToDo: Return the selected file to the file manager
		var URL = $(this).attr('href');
		var win = window.tinyMCEPopup.getWindowArg("window");

        // insert information now
        win.document.getElementById(tinyMCEPopup.getWindowArg("input")).value = URL;

        // are we an image browser
        if (typeof(win.ImageDialog) != "undefined") {
            // we are, so update image dimensions...
            if (win.ImageDialog.getImageData)
                win.ImageDialog.getImageData();

            // ... and preview if necessary
            if (win.ImageDialog.showPreviewImage)
                win.ImageDialog.showPreviewImage(URL);
        }
        
        // close popup window
        tinyMCEPopup.close();
        
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