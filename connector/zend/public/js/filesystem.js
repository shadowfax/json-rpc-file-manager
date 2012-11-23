var FileSystem = {
	/**
	 * Helpers
	 */
	_helper: {
		/**
		 * Current working directory
		 */
		cwd: '/',
		/**
		 * Common parameters for every request
		 */
		commonParameters : {},
		/**
		 * Options (or configuration) received from init method
		 */
		options : null,
		/**
		 * Forge the absolute url using the current working directory.
		 * If the path name starts with "/" we consider it is an
		 * absolute path already.
		 */
		getAbsolutePath: function(pathname) {
			if (pathname.match("^\/")) return pathname;
			if (!this.cwd.match("\/$")) this.cwd += '/';
			return this.cwd + pathname;
		},
		/**
		 * Send a request to the server
		 */
		request: function(method, params, callbacks) {
			var requestParams = this.commonParameters;
			
			for (var property in params) {
		        if (params.hasOwnProperty(property)) {
		            requestParams[property] = params[property];
		        }
		    }
			
			$.jsonRPC.request(method, {
				params: requestParams,
				success: function( response ) {
					//if (typeof(callbacks) !== 'undefined') {
						if (typeof(callbacks.success) === 'function') {
							callbacks.success( response );
						}
					//}
				},
				error: function( response ) {
					if (typeof(callbacks.error) === 'function') {
						if (typeof(response.error.message) !== 'undefined') {
							callbacks.error( response );
						} else {
							response.error = {
								code: -32000,
								message: response.error
							};
							callbacks.error( response );
						}
					}
				}
			});
		}
	},

	/**
	 * Set common parameters to all requests.
	 * For example, if this is used with TinyMCE we may want to track
	 * what opened this file manager ('image', 'file', 'media') and
	 * pass it to the server.
	 */
	setCommonParameters : function(parameters) {
		// This is like jQuery prototype $.extend
		for (var property in parameters) {
	        if (parameters.hasOwnProperty(property)) {
	            this._helper.commonParameters[property] = parameters[property];
	        }
	    }
	},
	/**
	 * Retrieve the current working directory
	 */
	getCWD : function() {
		if (this._helper.cwd.match("\/$")) return this._helper.cwd;
		return this._helper.cwd + '/';
	},
	/**
	 * Get an option from the options (Configuration) received from the server
	 */
	getOption : function( option ) {
		if (this._helper.options === null) {
			// ToDo: Send init request as it should be an empty array
			return null;
		} else if (typeof(this._helper.options[option]) !== 'undefined') {
			return this._helper.options[option];
		} else {
			return null;
		}
	},
	/*******************************
	 * JSON RPC METHODS START HERE *
	 *******************************/
	/**
	 * This method simply tells the server we are initializing the JavaScript library.
	 * It is _NOT_ manadatory to issue this request, however it is the way to get
	 * some configuration back from the server. 
	 * 
	 * For example, if I need to get the url to a page serving thumbnail images or 
	 * file extension images, this is the right place.
	 */
	init : function(callbacks) {
		this._helper.request('init', null, {
			success : function( result ) {
				FileSystem._helper.options = result.result;
				if (typeof(callbacks.success) === 'function') {
					callbacks.success( result );
				}
			},
			error : function( result ) {
				if (typeof(callbacks.error) === 'function') {
					callbacks.error( result );
				}
			}
		});
		return false;
	},
	/**
	 * Change current working directory
	 */
	cd : function(directory, callbacks) {
		directory = this._helper.getAbsolutePath(directory);
		this._helper.request('cd', {directory: directory}, {
			success: function( response ) {
				// Set the new current working directory
				FileSystem._helper.cwd = directory;
				
				if (typeof(callbacks.success) === 'function') {
					callbacks.success( response );
				}
			},
			error: function( result ) {
				if (typeof(callbacks.error) === 'function') {
					callbacks.error( response );
				}
			}
		});
	},
	/**
	 * List directory contents
	 */
	ls : function(directory, callbacks) {
		// if no directory use current working directory
		if (directory == null) directory = this._helper.cwd;
		else if (directory.lenght == 0) directory = this._helper.cwd;
		
		directory = this._helper.getAbsolutePath(directory);
		this._helper.request('ls', {directory: directory}, callbacks);
	},
	/**
	 * Create a new directory
	 */
	mkdir : function(directory, callback) {
		directory = this._helper.getAbsolutePath(directory);
		alert("mkdir " + directory);
	},
	/**
	 * Move a file or a directory.
	 * Also rename...
	 */
	mv : function(oldpathname, newpathname, callback) {
		oldpathname = this._helper.getAbsolutePath(oldpathname);
		newpathname = this._helper.getAbsolutePath(newpathname);
		alert("mv " + oldpathname + " " + newpathname);
	},
	/**
	 * Remove (Delete) a file
	 */
	rm : function(file, callback) {
		file = this._helper.getAbsolutePath(file);
		alert("rm " + file);
	},
	/**
	 * Remove (Delete) a directory
	 */
	rmdir : function(directory, callback) {
		directory = this._helper.getAbsolutePath(directory);
		alert("rmdir " + directory);
	}
	
	
};