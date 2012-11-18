/**
 * AJBnet Javascript Library
 * 
 * @version 0.0
 * @author sprky0
 */
var AJBnet = {

	// how do we handle dependencies on libraries like this?  same way?  (path to vendor == 'namespace' but they are assuemd to have no dependencies?)
	// 		<script type="text/javascript" src="js/jquery-1.7.1.min.js"></script>

	/**
	 * Libraries
	 *
	 * @var object Libraries the available loaded libraries
	 */
	libs : {},
	srcBasePath : "",
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
	init : function(force) {

		if (this.initRun === true && force !== true)
			throw "Init already run!";

		// do better and more automaticy than this -- find out from the <head><script> tag that loads ajbnet core
		this.srcBasePath = "ajbnet/";

		// If the document is not ready yet, initialize the ready loop which
		// will wait to execute the readyStack
		if (!this.isReady())
			this.readyLoop();

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
		var token = path.shift();
		var pointer = this.libs;

		// Traverse the tree of loaded classes until we reach the last
		while (token != null) {
			token = path.shift();
			pointer = pointer[token];
		}

		if (!pointer || !token)
			throw "Classpath '" + classpath + "' could not be traversed!  Incorrect naming or nesting in declaration?";

		var top_namespace = pointer;

		if (!this.isFunction(top_namespace[classname]))
			throw "Class '" + classpath + "' not loaded yet!";

		return new top_namespace[classname](a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z);
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
	 * Explicitly require a library
	 */
	require : function(lib, postLoadCallback) {
		// do something	

		// if (this.libs[lib] && !this.isObject( this.libs[lib] ))
		//	throw "Unavailable Library!";

		// replace this with traversal
		if (this.libs[lib])
			return true;

		this.load(lib,postLoadCallback);

		return this;
	},

	/**
	 * Declare a dependency
	 */	
	depend : function(libs, postLoadCallback) {

		if (typeof libs == "string")
			libs = [libs];

		// try to load dependencies.  Loaded thingies will exist on this already so we're all set
		for(var i in libs)
			this.require(libs[i],postLoadCallback);

		// this.execute(postLoadCallback);

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
		}

		this.depend(dependencies,object);

	},

	load : function(script,postLoadCallback) {

		var _callback = postLoadCallback;
		var element = document.createElement("script");
			element.setAttribute("type","text/javascript");
			element.setAttribute("src", this.srcBasePath + (script+"").toLowerCase() + ".js");
			element.onload = function() {AJBnet.execute(_callback);};

		document.getElementsByTagName("head")[0].appendChild( element );

		return this;

	},

	/**
	 * execute a closure, in the context of the framework
	 * this will allow you to use the 'this' keyword to access AJBnet functions
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
	 * @todo Clone objects
	 */
	extend : function(obj1,obj2) {

		for(i in obj2||{})
			obj1[i] = obj2[i];
		
		return obj1;

	},

	/**
	 * these are cool
	 */
	isNumber : function(number) {
		return typeof number == "number";
	},
	isFloat : function(float) {
		return typeof float == "number" && (parseInt(float) !== float);
	},
	isInteger : function(integer) {
		return typeof integer == "number" && (parseInt(integer) === integer);
	},
	isUndefined : function(value) {
		return value === undefined;	
	},
	isNull : function(value) {
		return value === null;
	},	
	isString : function(string) {
		return typeof string == "string";
	},
	isFunction : function(closure){
		return typeof closure === "function";
	},
	isObject : function(object) {
		return Object.prototype.toString.call( object ) === "[object Object]"
	},
	isArray : function(object) {
		return Object.prototype.toString.call( object ) === "[object Array]";
	},

	/**
	 * document is ready?
	 */
	isReady : function() {
		return (document && document.getElementsByTagName("body")[0]);
	},

	/**
	 * console.log wrap
	 */
	log : function(obj) {

		// check against debug state or something

		console.log(obj);
		return this;

	}

};