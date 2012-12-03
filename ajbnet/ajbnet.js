/**
 * AJBnet Javascript Library
 * 
 * @version 0.3
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
		debugLevel : 100,
		initRun : false,
		srcBasePath : null,

		/**
		 * @var string|array Classpaths to try and run automatically
		 */
		main : null,
	
		/**
		 * Which logs should be enabled for logging in the log?  LOGS
		 *
		 * @var object logsEnabled
		 */
		logsEnabled : {
			core : true,
			application : true,
			loading : true,
			execution : true,
			constructor : true,
			notice : true,
			warning : true,
			error : true
		}

	},

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
		TAB : 9, SHIFT : 16, ESCAPE : 27,
		RETURN : 13, ENTER : 13,
		ALT : 18, OPTION : 18,
		COMMAND : 224, CONTROL : 17,

		// ARROW KEYS
		LEFT : 37, UP : 38,
		RIGHT : 39, DOWN : 40,

		//  NUMERALS
		ZERO : 48, ONE : 49, TWO : 50,
		THREE : 51, FOUR : 52, FIVE : 53,
		SIX : 54, SEVEN : 55, EIGHT : 56,
		NINE : 57

	},

	regex : {
		classpath : /^[A-Za-z0-9\-\.\/]+$/,
		static : /^[A-Za-z0-9\-\.\/]+\.js$/,
		origin : /ajbnet.js/,
		srcPath : /\/$/
	},

	logs : {
		core : "core",
		application : "application",
		loading : "loading",
		execution : "execution",
		constructor : "constructor",
		notice : "notice",
		warning : "warning",
		error : "error"
	},

	/**
	 * this is called automatically as soon as the object is in memory
	 */
	init : function(options,force) {

		this.log("AJBnet.init()", this.logs.core);

		if (this.config.initRun === true && force !== true)
			throw "Init already run!";

		for(i in options||{}){
			switch(i){

				default:
					throw "Unknown option '" + i + "' passed to AJBnet.init";
					break;

				case "srcBasePath":
					var path = options[i];
					if (!path.match(this.srcPath)) {
						// maybe it might eventually be "/loader.script?lib="
						throw "Invalid src path, must end in trailing slash.";
					}
					this.config.srcBasePath = path;
					break;

				case "debug":
					this.config.debug = options[i];
					break;

				case "app":
					this.config.main = options[i];
					break;
			}
		}

		if (this.isNull(this.config.srcBasePath))
			this.config.srcBasePath = "ajbnet/";

		// If the document is not ready yet, initialize the ready loop which
		// will wait to execute readyStack array of closures
		if (!this.isReady())
			this.readyLoop();

		this.config.initRun = true;

		// run one or many main 'scripts'
		if (!this.isNull( this.config.main )) {
			if (this.isArray(this.config.main))
				for(i in this.config.main)
					this.run(this.config.main[i]);
			else
				this.run(this.config.main);
		}

		return this;

	},

	/**
	 * This guy tries to figure out init from a data-init property of the originating script tag.
	 */
	autoInit : function() {

		this.log("AJBnet.autoInit()", this.logs.core);

		var scripts = document.getElementsByTagName("script"), origin = null;
	
		for (var i in scripts ) {
			var test = scripts[i].src + "";
			if ( test.match( AJBnet.regex.origin ) ) {
				var origin = scripts[i];
				break;
			}
		}

		var init_json = origin.getAttribute("data-init"), init_object;

		if (!this.isNull(init_json)){
			// THIS IS THE _BAD_ WAY TO PARSE JSON, DON'T DO THIS KIDS!
			eval("init_object="+init_json);
			
			if (!this.isObject(init_object)) {
				this.log("AJBnet.autoInit() did not find a valid object for init", this.logs.core);
				return this;
			}
			
			this.init(init_object);
		}

	},

	/**
	 * Run a code block in a particular namespace, minding dependencies etc.
	 * 
	 * @note As is, this will only work the first time.  Need a way to force re-running the closure.
	 * @todo Force re-run of the closure
	 * @param string classpath
	 */
	run : function(classpath) {
		this.require( classpath );
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
		// var path = (classpath.split("AJBnet/")[1]||classpath).split("/");
		var path = classpath.split("/");
		var classname = path.pop();

		this.log(classname, this.logs.constructor);

		// start here, in case we are at the top level
		var token = classname;
		var pointer = this.libs;

		// Traverse the tree of loaded classes until we reach the last
		while (path.length > 0) {
			token = path.shift();
			pointer = pointer[token];
		}

		if (!pointer) // || !token) (token is done now)
			throw "Classpath '" + classpath + "' could not be traversed!  Incorrect naming or nesting in declaration?";

		if (!this.isFunction(pointer[classname]))
			throw "Class '" + classpath + "' not loaded yet!";

		// this is possible as well, not particularly better though
		//	with(AJBnet.libs.Package.Sub)
		//		var x = new Constructor(x,y,z);

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

		// be strict!
		if (!this.isString(classpath))
			throw "Invalid value for classpath, should be a String.";

		// dont' double load!
		if (this.map[classpath] && (this.map[classpath].loading == true || this.map[classpath].loaded == true))
			return true;

		// set the state if it exists
		if (!this.map[classpath]) {
			this.map[classpath] = {
				loading : true,
				loaded : false,
				run : false
			}
		};

		if (classpath.match(this.regex.static)) {

			// this.log( classpath + " seems to be a static library");

			var src = this.config.srcBasePath + classpath;
			this.load(src,classpath,function(){
				// Do all the setup for this before we call "loaded()" and start fidgeting with dependencies
				AJBnet.define(classpath,function(){});
			});

		} else if (classpath.match(this.regex.classpath)) {

			// this.log( classpath + " seems to be a namespaced class");

			var src = this.config.srcBasePath + (classpath+"").toLowerCase() + ".js";
			this.load(src,classpath);

		} else {

			throw classpath + " doesn't seem to be properly named.";

		}

		return this;
	},

	/**
	 * Define a class under the window[AJBnet] namespace
	 *
	 * @param string classpath A namespace "path" to a class, eg: Package/SubPackage/Class
	 * @param array|function dependencies_or_closure Either an array of dependencies, or the closure
	 * @param function Closure to be executed after dependency load that defines the class
	 */
	define : function(classpath, dependencies_or_closure, closure) {

		// Test to figure out which param is which (can exclude dependencies if you don't have any)
		if (this.isFunction(dependencies_or_closure)) {
			closure = dependencies_or_closure;
			dependencies = null;
		} else {
			dependencies = dependencies_or_closure;
		}

		var path = classpath.split("/"),
			dependencies = dependencies || [],
			pointer = this.libs;

		/**
		 * This will create a placeholder internally for this class.  eg: AJBnet.libs.package.sub.class = function(){}
		 * 
		 * For using the AJBnet.new(/package/class) method, the declaration much match this path as projected
		 * Will figure out a more convenient shorthand for this in the future to make the class definitions easier.
		 */
		while(path.length != 0) {
			var token = path.shift();
			if (!pointer[token])
				pointer[token] = {};
			pointer = pointer[token]
		}

		this.map[classpath] = {
			dependencies : dependencies || [],
			callback : closure,
			loaded : false,
			loading : false,
			run : false
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

	load : function(src,classpath,callback) {

		AJBnet.log("AJBnet.load() -> " + src);

		// var _classpath = classpath, _callback = callback;
		var element = document.createElement("script");
			element.setAttribute("type","text/javascript");
			element.setAttribute("src", src);
			element.onload = function() {

				AJBnet.log("onload callback for " + classpath + " at " + src + " called.");

				if (AJBnet.isFunction(callback))
					callback();

				AJBnet.loaded(classpath);

			};

		document.getElementsByTagName("head")[0].appendChild( element );

		return this;

	},

	/**
	 * This is called when a library has loaded or run, and checks the depdendency map for more work to do
	 */
	loaded : function(classpath) {

		var details = classpath ? " (triggered by " + classpath + ")" : "";

		this.log("AJBnet.loaded() START" + details);

		if (classpath) {
			this.map[classpath].loaded = true;
		}

		for (i in this.map) {

			// not even ready to check yet
			if (this.map[i] && this.map[i].loading == true)
				continue;

			this.log("Testing " + i + " - " + this.map[i].dependencies.length + " dependencies");
			for (var j = 0; j < this.map[i].dependencies.length; j++) {
				this.log("Testing dependencies for " + i);
				if (this.map[ this.map[i].dependencies[j] ] && this.map[ this.map[i].dependencies[j] ].run == true) {
					this.log("Dependency satisfied!  Removing dependency " + j);
					var replacement_array = [];
					for(var k = 0; k < this.map[i].dependencies.length; k++) {
						if (k == j)
							continue;
						else
							replacement_array.push( this.map[i].dependencies[k] );
					}

					this.map[i].dependencies = replacement_array;
				}
			}
		}

		var loop = false;

		for (i in this.map) {

			// console.log( this.map, i );
			// not even ready to check yet
			if (this.map[i] && this.map[i].loading == true)
				continue;

			if (this.map[i].dependencies.length == 0 && this.map[i].run === false) {
				
				this.log("Executing the callback for " + i);

				// console.log( this.map[i] );

				this.execute(this.map[i].callback);

				// console.log( this.map[i] );

				this.map[i].run = true;

				loop = true;

			} else {

				// trying to figure out cross dependencies / overlapping dependencies problems :(  *doh
				// this.log( i + " still has " + this.map[i].dependencies.length + "!" );
				// this.log( i + " thinks that it " + ( this.map[i].run !== false ? " been run " : " not been run ") );
				
			}
		}

		this.log("AJBnet.loaded() END" + details);

		// When a library has been loaded + run, it may have satisfied others, so we loop once
		if (loop == true) {
			this.loaded();
		}

		return this;
	},

	/**
	 * execute a closure, in the context of the framework
	 * this will allow you to use the 'this' keyword to access AJBnet functions
	 *
	 * @note only use this if you don't need to execute in the same scope as the framework
	 * @param function closure
	 * @return mixed
	 */
	execute : function(closure) {

		if (this.isFunction(closure)) {

			this.closureHolder = closure;
			var result = this.closureHolder();

			// delete(this.closureHolder);
			// this.closureHolder = null;

			return result;

		} else {

			throw "Closure passed to execute is not a function!";	

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
		return typeof string === "string";
	},
	
	/**
	 * @param mixed Object to test
	 * @return boolean
	 */
	isFunction : function(closure){
		return Object.prototype.toString.call( closure ) === "[object Function]";
	},
	
	/**
	 * @param mixed Object to test
	 * @return boolean
	 */
	isObject : function(object) {
		return Object.prototype.toString.call(object) === "[object Object]"
	},
	
	/**
	 * Is the object an Array
	 *
	 * @param mixed Object to test
	 * @return boolean
	 */
	isArray : function(object) {
		return Object.prototype.toString.call(object) === "[object Array]";
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
	 * logging
	 *
	 * @return object AJBnet
	 */
	log : function(obj, type) {

		if(this.config.debug === true || this.config.logsEnabled[type] === true)
			this.logFunction(obj);

		return this;

	},
	
	/**
	 * console.log wrap, which can be overriden for custom logging
	 *
	 * @return object AJBnet
	 */
	logFunction : function(obj) {
		console.log(obj);
		return this;
	}

};
AJBnet.autoInit();