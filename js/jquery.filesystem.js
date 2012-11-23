/**
 * JSON RPC Filesystem
 * 
 * Makes calls to a JSON RPC v2.0 service to control a file system.
 * 
 * 
 * Requirements:
 * 		jQuery
 * 			http://jquery.com/
 * 		jquery.jsonrpc.js
 * 			https://github.com/datagraph/jquery-jsonrpc
 * 		json2.js
 * 			https://github.com/douglascrockford/JSON-js
 * 
 * 
 * @author Juan Pedro Gonzalez Gutierrez
 */
(function( $ ){

	/**
	 * Global variables
	 */
	var generic = {
			/* Current Working Directory */
			'cwd':	'/',
			/* TinyMCE file manager type */
			'type': null
	};
	
	/**
	 * Private helper methods
	 */
	var helper = {
		// Sends a request to the JSON RPC service
		request : function(method, params, callback) {
			// Merge the common parameters
			var requestParams = null;
			if (typeof(params) === 'undefined') {
				requestParams = generic;
			} else if (params == null) {
				requestParams = generic;
			} else {
				requestParams = $.extend(generic, params);
			}
			
			$.jsonRPC.request(method, {
				params: requestParams,
				success: function(response) {
					if (typeof(callback) !== 'undefined') {
						if (typeof(callback.success) !== 'undefined' && typeof(callback.success) === 'function') {
							callback.success(response);
						}
					}
				},
				error: function(response) {
					var hasErrorCallback = false;
					
					if (typeof(callback) !== 'undefined') {
						if (typeof(callback.error) !== 'undefined' && typeof(callback.error) === 'function') {
							callback.error(response);
							hasErrorCallback = true;
						}
					}
					
					// Enforce error response
					if (hasErrorCallback === false) {
						alert(response.error.message);
					}
				}
			});
			
			return true;
		},
		// get the absolute path of a file or directory
		getAbsolutePathname : function(pathname) {
			if (generic.cwd === null) {
				// Set the current working directory to root
				generic.cwd = '/';
			}
			
			// Now for the supplied pathname
			if (pathname !== null) {
				// if path starts with '/' we consider it is an absolute path
				if (path.match('^\/')) {
					return path;
				} else if (generic.cwd.match('\/$')) {
					return generic.cwd + path;
				} else {
					return generic.cwd + '/' + path;
				}
			}
			
			// By default return the current working directory
			return generic.cwd;
		}
	};
	
	/**
	 * Public methods for this class
	 */
	var methods = {
		setup : function( options ) { 
			// Setup jquery.jsonrpc
			$.jsonRpc.setup({
				'endPoint': options.endPoint,
				'namespace': options.namespace
			});
			
			return this;
		},
		/**
		 * Change the current working directory
		 */
		cd : function(directory, callback) {
			directory = helpers.getAbsolutePathname.apply(directory);
			
			// the request will only check if the directory is valid
			helper.request.apply('cd', {'directory': directory}, {
				success: function(result) {
					// set the new working directory
					generic.cwd = directory;
					if (typeof(callback) !== 'undefined') {
						if (typeof(callback.success) !== 'undefined' && typeof(callback.success) === 'function') {
							callback.success(response);
						}
					}
				},
				error: function(response) {
					if (typeof(callback) !== 'undefined') {
						if (typeof(callback.error) !== 'undefined' && typeof(callback.error) === 'function') {
							callback.error(response);
						}
					}
				}
			});
		},
		/**
		 * list directory contents
		 * NOTE: Directory can be null
		 *       A null directory makes reference to the current directory
		 */
		ls : function (directory, callback) {
			directory = helpers.getAbsolutePathname.apply(directory);
			
			return helper.request.apply('ls', {'directory': directory), callback);
		},
		/**
		 * Remove/Delete a file
		 */
		rm : function(filename, callback) {
			filename = helpers.getAbsolutePathname.apply(filename);
			
			return helper.request.apply('rm', {'filename': filename}, callback);
		},
		/**
		 * Delete a directory
		 */
		rmdir : function(directory, callback) {
			directory = helpers.getAbsolutePathname.apply(directory);
			return helper.request.apply('rmdir', {'directory': directory}, callback);
		},
		/**
		 * Create a new directory
		 */
		mkdir : function(directory, callback) {
			directory = helpers.getAbsolutePathname.apply(directory);
			return helper.request.apply('mkdir', {'directory': directory}, callback);
		},
		/**
		 * Move or rename a file 
		 */
		mv : function (oldname, newname, callback) {
			oldname = helpers.getAbsolutePathname.apply(oldname);
			newname = helpers.getAbsolutePathname.apply(newname);
			return helper.request.apply('rename', {'oldname': oldname, 'newname': newname}, callback);
		},
		/**
		 * Get upload configuration for plupload (or any other upload mechanism)
		 * May only return the upload url, or whatever you want.
		 */
		upload : function(callback) {
			return helper.request.apply('uploadSetup', null, callback);
		}		
	};
	
	/**
	 * Entry point
	 */
	$.fn.filesystem = function( method ) {
		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			/* ToDo: probably this is of no use for this plugin. Find a use or delete it */
			return methods.setup.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.filesystem' );
		}    
	};

})( jQuery );