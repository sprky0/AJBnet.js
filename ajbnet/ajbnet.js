/**
 * AJBnet Javascript Library
 * 
 * @version 0.0
 * @author sprky0
 */
var AJBnet = {

	/**
	 * AJBnet Configuration parameters - where to try to load things, state, debug, etc.
	 * 
	 * @var object
	 */
	config : {
		debug : false,
		initRun : false,
		srcBasePath : "",
		main : null
	},

	// how do we handle dependencies on libraries like this?
	// same way?  (path to vendor == 'namespace' but they are assuemd to have no dependencies?)
	// <script type="text/javascript" src="js/jquery-1.7.1.min.js"></script>

	/**
	 * Libraries
	 *
	 * This is where libraries are stored, arranged by namespace
	 *
	 * @var object
	 */
	libs : {},
	map : {},

	closureHolder : null,
	readyStack : [],

	/**
	 * keycode shortcuts
	 */
	key : {

		// ROMAN ALPHA
		A : 65, B : 66, C : 67, D : 68,
		E : 69, F : 70, G : 71, H : 72,
		I : 73, J : 74, K : 75, L : 76,
		M : 77, N : 78, O : 79, P : 80,
		Q : 81, R : 82, S : 83, T : 84,
		U : 85, V : 86, W : 87, X : 88,
		Y : 89, Z : 90,

		// OTHER
		TAB : 9,
		SHIFT : 16,
		RETURN : 13, ENTER : 13,
		ALT : 18, OPTION : 18,

		// ARROW KEYS
		LEFT : 37,
		UP : 38,
		RIGHT : 39,
		DOWN : 40,

		//  NUMERALS
		ZERO : 48,
		ONE : 49,
		TWO : 50,
		THREE : 51,
		FOUR : 52,
		FIVE : 53,
		SIX : 54,
		SEVEN : 55,
		EIGHT : 56,
		NINE : 57

	},

	/**
	 * this is called automatically as soon as the object is in memory
	 */
	init : function(options,force) {

		if (this.config.initRun === true && force !== true)
			throw "Init already run!";

		for(i in options||{}){
			switch(i){
				default:
					throw "Unknown option '" + i + "' passed to AJBnet.init";
					break;
				case "debug":
					this.config.debug = options[i];
					break;
				case "app":
					this.config.main = options[i];
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

		if (!this.isNull( this.config.main ))
			this.require( this.config.main );

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
	require : function(classpath) { // , postLoadCallback) {

		// do something	

		// if (this.libs[lib] && !this.isObject( this.libs[lib] ))
		//	throw "Unavailable Library!";

		// replace this with traversal
		// if (this.libs[lib])
		//	return true;

		// future remote load thing
		// if (!lib.match(/^http/)

		var src = this.config.srcBasePath + (classpath+"").toLowerCase() + ".js";

		// something with this callback should be diff
		this.load(src,classpath); // ,postLoadCallback

		return this;
	},

	/**
	 * Define a class under the window[AJBnet] namespace
	 *
	 * @param string classpath A namespace "path" to a class, eg: Package/SubPackage/Class
	 * @param array dependencies
	 * @param object closure to be executed after dependency load that defines the class
	 */
	define : function(classpath, dependencies, closure) {

		var path = classpath.split("/"),
			dependencies = dependencies || [],
			pointer = this.libs;

		while(path.length != 0) {
			var token = path.shift();
			if (!pointer[token])
				pointer[token] = {};
			pointer = pointer[token]
		}

		this.map[classpath] = {
			dependencies : dependencies || [],
			callback : closure,
			loaded : false
		};

		if (dependencies.length == 0) {
			//this.log(classpath + " has no dependencies, so the closure is called immediately!");
			//this.map[classpath].loaded = true;
			//this.execute(this.map["closure"]);
		} else {
			
			for(var i = 0; i < dependencies.length; i++)
				this.require(dependencies[i]); // classpath,
		}

		return this;

	},

	load : function(src,classpath,postLoadCallback) {

		AJBnet.log("Going to load " + src);

		var _callback = postLoadCallback;
		var _classpath = classpath;
		var element = document.createElement("script");
			element.setAttribute("type","text/javascript");
			element.setAttribute("src", src);
			element.onload = function() {

				AJBnet.log(classpath + " at " + src + " has loaded.");
				AJBnet.loaded(classpath);

			};

		document.getElementsByTagName("head")[0].appendChild( element );

		return this;

	},

	loaded : function(classpath) {

		if (!this.map[classpath])
			throw "Can't find " + classpath + " in the map.";

		this.map[classpath].loaded = true;

		for (i in this.map) {
			this.log("Testing " + i + " - " + this.map[i].dependencies.length + " dependencies");
			for (var j = 0; j < this.map[i].dependencies.length; j++) {
				this.log("Testing dependencies for " + i);
				if (this.map[i].dependencies[j].loaded == true) {
					this.log("Removing dependency " + j);
					delete(this.map[i].dependencies[j]);
				}
			}
		}

		for (i in this.map) {
			if (this.map[i].dependencies.length == 0) {
				this.log("Executing the callback for " + i);
				this.execute(this.map[i].callback);
			}
		}

		console.log( this.map[classpath] );

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