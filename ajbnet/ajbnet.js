/**
 * AJBnet Javascript Library
 * 
 * @version 0.0
 * @author sprky0
 */
var AJBnet = {

	config : {
		debug : false,
		initRun : false,
		srcBasePath : ""
	},

	// how do we handle dependencies on libraries like this?
	// same way?  (path to vendor == 'namespace' but they are assuemd to have no dependencies?)
	// 		<script type="text/javascript" src="js/jquery-1.7.1.min.js"></script>

	/**
	 * Libraries
	 *
	 * @var object Libraries the available loaded libraries
	 */
	libs : {},
	closureHolder : null,
	readyStack : [],

	/**
	 * keycode shortcuts
	 */
	key : {
		LEFT : 37,
		RIGHT : 39
	},

	/**
	 * this is called automatically as soon as the object is in memory
	 */
	init : function(options,force) {

		if (this.config.initRun === true && force !== true)
			throw "Init already run!";

		for(i in options||{}){
			switch(i){
				case "debug":
					this.config.debug = options[i];
					break;
			}
		}

		// do better and more automaticy than this -- find out from the <head><script> tag that loads ajbnet core
		this.config.srcBasePath = "ajbnet/";

		// If the document is not ready yet, initialize the ready loop which
		// will wait to execute the readyStack
		if (!this.isReady())
			this.readyLoop();

		this.config.initRun = true;

		return this;

	},

	/**
	 * I guarentee there is a better way to handle these args
	 * 
	 * @param string classname Which class to instantiate
	 * @args // do something with args here, how do i jsdoc this puppy
	 * @throws exception
	 */
	new : function(classpath,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z) {

		// var path = (classpath.split(/AJBnet[.|\/]/)[1]||classpath).split(/[\.|\/]/);
		var path = (classpath.split("AJBnet/")[1]||classpath).split("/");

		var classname = path.shift();
		// start here, in case we are at the top level
		var token = classname;
		var pointer = this.libs;

		// Traverse the tree of loaded classes until we reach the last
		while (path.length > 0) {
			token = path.shift();
			pointer = pointer[token];
		}

		if (!pointer || !token)
			throw "Classpath '" + classpath + "' could not be traversed!  Incorrect naming or nesting in declaration?";

		if (!this.isFunction(pointer[classname]))
			throw "Class '" + classpath + "' not loaded yet!";

		return new pointer[classname](a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z);
	},

	/**
	 * Execute a closure when the document is ready.
	 */
	ready : function(closure) {

		if (this.isReady())
			this.execute(closure);
		else
			this.readyStack.push(closure);

		return this;
	},

	/**
	 * Loop is called continuously until the document is ready for interaction
	 *
	 * There must be a better way to do this
	 */
	readyLoop : function() {

		if (!this.isReady()) {

			setTimeout(function() { AJBnet.readyLoop(); }, 1);

		} else {

			for(var i in this.readyStack)
				this.execute(this.readyStack[i]);

		}

		return this;
	},

	/**
	 * Explicitly require a single library
	 */
	require : function(lib, postLoadCallback) {

		// do something	

		// if (this.libs[lib] && !this.isObject( this.libs[lib] ))
		//	throw "Unavailable Library!";

		// replace this with traversal
		// if (this.libs[lib])
		//	return true;

		// future remote load thing
		// if (!lib.match(/^http/)

		var src = this.config.srcBasePath + (lib+"").toLowerCase() + ".js";

		this.load(src,postLoadCallback);

		return this;
	},

	/**
	 * Declare a dependency
	 */	
	depend : function(libs, postLoadCallback) {

		if (!this.isArray(libs))
			libs = [libs];

		// try to load dependencies.  Loaded thingies will exist on this already so we're all set
		for(var i in libs)
			this.require(libs[i]); // ,postLoadCallback);
		// if there is more than one, this will be called multiple times.  that is dumb

		// sticking this here for now
		this.execute(postLoadCallback);

		return this;
	},

	/**
	 * Define a class under the window[AJBnet] namespace
	 *
	 * @param string classpath A namespace "path" to a class, eg: Package/SubPackage/Class
	 * @param array dependencies
	 * @param object closure to be executed after dependency load that defines the class
	 */
	define : function(classpath, dependencies, object) {

		// Honey Badger don't care.  Only problem here is that this sucks for using AJBnet to build other libs though.  Everyone is automatically namespaced to AJBnet

		var path = (classpath.split("AJBnet/")[1]||classpath).split("/");

		this.log(path);

		var pointer = this.libs;

		while(path.length != 0) {
			var token = path.shift();
			if (!pointer[token])
				pointer[token] = {};
			pointer = pointer[token]
		}

		console.log( pointer );

		if (this.isNull(dependencies) || this.isArray(dependencies) && dependencies.length == 0)
			this.execute(object);
		else
			this.depend(dependencies,object);

	},

	load : function(src,postLoadCallback) {

		AJBnet.log("Going to load " + src);

		var _callback = postLoadCallback;
		var element = document.createElement("script");
			element.setAttribute("type","text/javascript");
			element.setAttribute("src", src);
			element.onload = function() {

				AJBnet.log("Running callback for " + src);
				AJBnet.execute(_callback);
			
			};

		document.getElementsByTagName("head")[0].appendChild( element );

		return this;

	},

	/**
	 * execute a closure, in the context of the framework
	 * this will allow you to use the 'this' keyword to access AJBnet functions
	 *
	 * @param function closure
	 * @return mixed
	 */
	execute : function(closure) {
	
		if (this.isFunction(closure)) {

			this.closureHolder = closure;
			var result = this.closureHolder();
			delete(this.closureHolder);
			this.closureHolder = null;
			return result;

		}

		return null;

	},
	
	/**
	 * Extend object2 to object1 - basic overwrite
	 *
	 * @todo Clone ref objects ?
	 * @param object obj1
	 * @param object obj2
	 * @return object
	 */
	extend : function(obj1,obj2) {

		for(i in obj2||{})
			obj1[i] = obj2[i];

		return obj1;

	},

	/**
	 * @param mixed Object to test
	 * @return boolean
	 */
	isNumber : function(number) {
		return typeof number == "number";
	},

	/**
	 * @param mixed Object to test
	 * @return boolean
	 */
	isFloat : function(float) {
		return typeof float == "number" && (parseInt(float) !== float);
	},
	
	/**
	 * @param mixed Object to test
	 * @return boolean
	 */
	isInteger : function(integer) {
		return typeof integer == "number" && (parseInt(integer) === integer);
	},
	
	/**
	 * @param mixed Object to test
	 * @return boolean
	 */
	isUndefined : function(value) {
		return value === undefined;	
	},
	
	/**
	 * @param mixed Object to test
	 * @return boolean
	 */
	isNull : function(value) {
		return value === null;
	},
	
	/**
	 * @param mixed Object to test
	 * @return boolean
	 */	
	isString : function(string) {
		return typeof string == "string";
	},
	
	/**
	 * @param mixed Object to test
	 * @return boolean
	 */
	isFunction : function(closure){
		// return typeof closure === "function";
		return Object.prototype.toString.call( closure ) === "[object Function]";
	},
	
	/**
	 * @param mixed Object to test
	 * @return boolean
	 */
	isObject : function(object) {
		return Object.prototype.toString.call( object ) === "[object Object]"
	},
	
	/**
	 * Is the object an Array
	 *
	 * @param mixed Object to test
	 * @return boolean
	 */
	isArray : function(object) {
		return Object.prototype.toString.call( object ) === "[object Array]";
	},

	/**
	 * Is the HTML document available to be interacted with?
	 *
	 * @return boolean
	 */
	isReady : function() {
		return (document && document.getElementsByTagName("body")[0]);
	},

	/**
	 * console.log wrap
	 *
	 * @return object AJBnet
	 */
	log : function(obj) {

		if(!this.config.debug === true)
			return this;

		console.log(obj);
		return this;

	}

};