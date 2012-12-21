/**
 * AJBnet Javascript Library
 * 
 * @version 0.9
 * @author sprky0
 * @link http://js.ajbnet.com
 */
var AJBnet = (function(){

	/**
	 * Dynamic constructor method, thanks to T.J. Crowder's answer on stack overflow for the insight
	 * 
	 * @link http://stackoverflow.com/questions/3871731/dynamic-object-construction-in-javascript
	 * @param object ctor constructor to use
	 * @param array params parameters to pass to the constructor
	 */
	function construct(ctor, params) {

		var obj, newobj;

		// Create the object with the desired prototype
		if (typeof Object.create === "function") {
			// ECMAScript 5 
			obj = Object.create(ctor.prototype);
			// this.log("Used Object.create", this.logs.construct);

		} else if ({}.__proto__) {

			// Non-standard __proto__, supported by some browsers
			obj = {};
			obj.__proto__ = ctor.prototype;

			if (obj.__proto__ === ctor.prototype) {
				// this.log("Used __proto__", this.logs.construct);
			} else {
				// Setting it didn't work
				// this.log("__proto__ failed, used fake constructor", this.logs.construct);
				obj = makeObjectWithFakeCtor();
			}

		} else {
			// Fallback
			// this.log("Used fake constructor", this.logs.construct);
			obj = makeObjectWithFakeCtor();
		}
		
		// Set the object's constructor
		obj.constructor = ctor;
		
		// Apply the constructor function
		newobj = ctor.apply(obj, params);
		
		// If a constructor function returns an object, that
		// becomes the return value of `new`, so we handle
		// that here.
		if (newobj !== null && (typeof newobj === "object" || typeof newobj === "function")) {
			obj = newobj;
		}
		
		// Done!
		return obj;

		// Subroutine for building objects with specific prototypes
		function makeObjectWithFakeCtor() {
			function fakeCtor() {}
			fakeCtor.prototype = ctor.prototype;
			return new fakeCtor();
		}

	};

	var core = {

		/**
		 * AJBnet Configuration parameters - where to try to load things, state, debug, etc.
		 * 
		 * @var object
		 */
		config : {

			/**
			 * @var string|array Classpath of the main function (will be run automatically on load)
			 */
			main : null,

			/**
			 * @var string shorthand Optional shorthand if you want to call AJBnet base object something else (eg: "MyBrand")
			 */ 
			shorthand : null,
	
			debug : false,
			initRun : false,
			srcBasePath : null,

			/**
			 * Which logs should be enabled for logging in the log?  LOGS
			 *
			 * @var object logsEnabled
			 */
			logsEnabled : {
				core : false,
				application : false,
				loading : false,
				execution : false,
				construct : false,
				notice : false,
				warning : false,
				error : false
			}
	
		},
	
		/**
		 * Libraries
		 *
		 * This is where libraries are stored, in nested objects, by namespace tokenized on "/"
		 *
		 * @var object
		 */
		libs : {},

		/**
		 * Library Map
		 *
		 * This is where library dependency loads are handled.  Key is the 'classpath' eg: Package/Sub/Class
		 *
		 * @var object
		 */
		map : {},

		/**
		 * All closures called by AJBnet.execute() are assigned here first
		 */
		closureHolder : null,
		
		/**
		 * Stack of closures to run on document ready
		 */
		readyStack : [],
	
		/**
		 * @var object globals Holder for any random data.
		 */
		globals : {},
	
		/**
		 * @var object key Shortcuts for commonly used keycodes.
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
			DELETE : 8, SPACE : 32,
	
			// ARROW KEYS
			LEFT : 37, UP : 38,
			RIGHT : 39, DOWN : 40,
	
			//  NUMERALS
			ZERO : 48, ONE : 49, TWO : 50,
			THREE : 51, FOUR : 52, FIVE : 53,
			SIX : 54, SEVEN : 55, EIGHT : 56,
			NINE : 57
	
		},

		/**
		 * regex
		 */
		regex : {
			namespaced_class : /^[A-Za-z0-9\-\.\/]+$/,
			external_library : /^[A-Za-z0-9\-\.\/]+\.js$/,
			origin : /ajbnet(-min)?(\.\d\.\d\.\d)?.js/,
			srcPath : /\/$/
		},

		logs : {
			core : "core",
			application : "application",
			loading : "loading",
			execution : "execution",
			construct : "construct",
			notice : "notice",
			warning : "warning",
			error : "error"
		},
	
		/**
		 * this is called automatically as soon as the object is in memory
		 */
		init : function(options,force) {

			this.log("AJBnet.init()", this.logs.core);
	
			var i, path;
	
			if (this.config.initRun === true && force !== true)
				throw "Init already run!";
	
			for(i in options||{}){
				switch(i){
	
					default:
						throw "Unknown option '" + i + "' passed to AJBnet.init";
						break;
	
					case "srcBasePath":
						path = options[i];
						if (!path.match(this.srcPath)) {
							// maybe it might eventually be "/loader.script?lib="
							throw "Invalid src path, must end in trailing slash.";
						}
						this.config.srcBasePath = path;
						break;
	
					case "debug":
						this.config.debug = options[i];
						break;
	
					case "main":
					case "app":
						this.config.main = options[i];
						break;
				}
			}
	
			if (this.isNull(this.config.srcBasePath))
				this.config.srcBasePath = "ajbnet/";
	
			if (!this.isNull(this.config.shorthand)) {
				if (window[this.config.shorthand])
					throw "Shorthand " + this.config.shorthand + " has already been declared, before AJBnet.init()!";
	
				window[this.config.shorthand] = this;
			}
	
			// If the document is not ready yet, initialize the ready loop which
			// will wait to execute readyStack array of closures
			if (!this.isReady())
				this.readyLoop();
	
			this.config.initRun = true;
	
			// run one or many main functions
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
		 * Try to get an init object from the optional data-init property of the originating script tag.
		 */
		autoInit : function() {
	
			var origin = this.getOrigin(),
				init_json,
				init_object;
			//	main_json,
			//	main_string;

			if (this.isNull(origin)) {
				// throw "Can't find script!  That's not particularly good.";
				return false;
			}

			// require.js behavior:
			/*
			main_json = origin.getAttribute("data-main"), main_classpath;
			if (!this.isNull(main_json)){
				// THIS IS THE _BAD_ WAY TO PARSE JSON, DON'T DO THIS KIDS!
				// @todo replace this
				eval("main_string="+main_json);
			});
			*/

			init_json = origin.getAttribute("data-init");
			if (!this.isNull(init_json)){
	
				// THIS IS THE _BAD_ WAY TO PARSE JSON, DON'T DO THIS KIDS!
				// @todo replace this
				eval("init_object="+init_json);
				
				if (!this.isObject(init_object)) {
					this.log("AJBnet.autoInit() did not find a valid object for init", this.logs.core);
					return this;
				}
				
				this.init(init_object);
			}

			return this;

		},
	
		/**
		 * Get a reference to the script tag that is believed to have originated the load for the framework
		 */	
		getOrigin : function() {
			
			this.log("AJBnet.getOrigin()", this.logs.core);
	
			var scripts = document.getElementsByTagName("script"), i, test;
	
			for (i in scripts ) {
				test = scripts[i].src + "";
				if ( test.match( this.regex.origin ) ) {
					return scripts[i];
				}
			}
			
			return null;
	
		},
	
		/**
		 * Run a code block in a particular namespace, minding dependencies etc.
		 * 
		 * @param string classpath
		 * @return object AJBnet
		 */
		run : function(classpath) {

			if (!this.isLoaded(classpath))
				this.require( classpath );
			else
				this.execute(this.map[classpath].callback);

			return this;
		},

		/**
		 * Sorry for quoting this puppy ... it's a reserved word
		 * 
		 * @param string classname Which class to instantiate
		 * @args // do something with args here, how do i jsdoc this puppy
		 * @throws exception
		 */
		construct : function() {
			// classpath,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z

			var classpath = arguments[0],
				new_arguments = [], i, path, token, pointer, classname;

			if (arguments.length > 1)
			 	for (i = 1; i < arguments.length; i++)
			 		new_arguments.push( arguments[i] );

			path = classpath.split("/");
			classname = path.pop();
			token = classname;
			pointer = this.libs;
	
			this.log("AJBnet.construct() -> Trying to make " + classname + " (" + classpath + ")", this.logs.construct);
	
			// Traverse the tree of loaded classes until we reach the last
			while (path.length > 0) {
				token = path.shift();
				pointer = pointer[token];
			}
	
			if (!pointer) // || !token) (token is done now)
				throw "Classpath '" + classpath + "' could not be traversed!  Incorrect naming or nesting in declaration?";
	
			if (!this.isFunction(pointer[classname]))
				throw "Class '" + classpath + "' not loaded yet!";
	
			// return this.construct(pointer[classname], new_arguments);
			// private method
			return construct(pointer[classname](), new_arguments);
			// return new pointer[classname](a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z);
	
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
	
				// i'm not sure which one of these is worse -- setting timeout might let the browser control things a bit better ?
				// var that = this;
				// setTimeout(function() { that.readyLoop(); }, 1);
				this.readyLoop();
	
			} else {
	
				for(var i in this.readyStack)
					this.execute(this.readyStack[i]);
	
			}
	
			return this;
		},
	
		/**
		 * Explicitly require a single library
		 */
		require : function(classpath) {

			// be strict!
			if (!this.isString(classpath))
				throw "Invalid value for classpath, should be a String.";
	
			// dont' double load!
			if (this.map[classpath] && (this.map[classpath].loading == true || this.map[classpath].loaded == true))
				return true;
	
			var src, that = this;
	
			// set the state if it exists
			if (!this.map[classpath]) {
				this.map[classpath] = {
					loading : true,
					loaded : false,
					running : false,
					run : false
				}
			};
	
			// seems to be a static library
			if (classpath.match(this.regex.external_library)) {
	
				src = this.config.srcBasePath + classpath;
				this.load(src,classpath,function(){
	
					// Do all the setup for this before we call "loaded()" and start fidgeting with dependencies
					that.define(classpath,function(){});
	
				},true);
	
			// seems to be a namespaced class
			} else if (classpath.match(this.regex.namespaced_class)) {
	
				src = this.config.srcBasePath + (classpath+"").toLowerCase() + ".js";
				this.load(src,classpath);
	
			// no good!
			} else {
				throw classpath + " doesn't seem to be properly named, or AJBnet doesn't know how to parse it.";
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
				pointer = this.libs,
				token, i;
	
			/**
			 * This will create a placeholder internally for this class.  eg: AJBnet.libs.package.sub.class = function(){}
			 * 
			 * For using the AJBnet.construct(/package/class) method, the declaration much match this path as projected
			 * Will figure out a more convenient shorthand for this in the future to make the class definitions easier.
			 */
			while(path.length != 0) {
				token = path.shift();
				if (!pointer[token])
					pointer[token] = {};
				pointer = pointer[token]
			}
	
			this.map[classpath] = {
				dependencies : dependencies || [],
				callback : closure,
				loaded : false,
				loading : false,
				running : false,
				run : false
			};
	
			if (dependencies.length > 0) {
	
				for(i = 0; i < dependencies.length; i++)
					this.require(dependencies[i]); // classpath,
	
			}
	
			return this;
	
		},
		
		register : function(classpath, definition_closure) {
	
			this.log("AJBnet.register() - Running for " + classpath, this.logs.construct);
	
			// classpath ->  [namespace/]...class
			// definition_closure - closure that either returns itself, or returns the constructor that is created in the closure
	
			var path = classpath.split("/"),
				classname = path.pop(),
				token = classname,
				pointer = this.libs;
	
			// Traverse the tree of loaded classes until we reach the last
			while (path.length > 0) {
				token = path.shift();
				pointer = pointer[token];
			}
	
			if (!this.isObject(pointer)) // || !token) (token is done now)
				throw "Classpath '" + classpath + "' could not be traversed!  Incorrect naming or nesting in declaration?";
	
			if (!this.isFunction(definition_closure))
				throw "Closure was not passed for " + classpath;
	
			this.log("AJBnet.register() - Running closure  for " + classpath, this.logs.construct);
	
			// this will catch the puppy if it is a code block and not returning a constructor (this is dumb.  fix this)
			// and hangs onto the function that makes the constructor each time.  unfortunately
			// creating the constructor via the closure as a factory instead of creating the instance breaks 'instanceof',
			// which would be a nice thing to have in many cases
			this.execute(definition_closure);
			pointer[classname] = definition_closure;
	
			// this will actually define the constructor and stick it in that space, but it breaks things like array
			// push by reference on the prototype.  sort of a rough tradeoff
			// pointer[classname] = this.execute(definition_closure);

			this.map[classpath].run = true;
	
		},
	
		load : function(src,classpath,callback,forceloop) {
	
			this.log("AJBnet.load() -> " + src, this.logs.core);
	
			forceloop = forceloop || false;
			
			var element = document.createElement("script"),
				that = this;
	
				element.setAttribute("type","text/javascript");
				element.setAttribute("src", src);
				
				// IE rules :(
				element.onload = element.onreadystatechange = function() {

/*
script.onreadystatechange = function() {
if ( !done && (!this.readyState ||
this.readyState === "loaded" || this.readyState === "complete") ) {
done = true;
// Handle memory leak in IE
script.onload = script.onreadystatechange = null;
if ( head && script.parentNode ) {
    head.removeChild( script );
}
*/

					that.log("onload callback for " + classpath + " at " + src + " called.", AJBnet.logs.loading);
	
					if (that.isFunction(callback))
						callback();
	
					that.loaded(classpath,forceloop);
	
				};
	
			document.getElementsByTagName("head")[0].appendChild( element );
	
			return this;
	
		},
	
		/**
		 * This is called when a library has loaded or run, and checks the depdendency map for more work to do
		 */
		loaded : function(classpath,forceloop) {
	
			var details = classpath ? " (triggered by " + classpath + ")" : "",
				loop = forceloop || false,
				replacement_array = [],
				i, j, k;
	
			this.log("AJBnet.loaded() START" + details, this.logs.loading);
	
			if (classpath) {
				this.map[classpath].loaded = true;
			}
	
			for (i in this.map) {
	
				// not even ready to check yet
				if (this.map[i] && this.map[i].loading == true)
					continue;
	
				for (j = 0; j < this.map[i].dependencies.length; j++) {
	
					if (this.map[ this.map[i].dependencies[j] ] && this.map[ this.map[i].dependencies[j] ].run == true) {
	
						replacement_array = [];
						for(k = 0; k < this.map[i].dependencies.length; k++) {
							if (k == j)
								continue;
							else
								replacement_array.push( this.map[i].dependencies[k] );
						}
	
						this.map[i].dependencies = replacement_array;
					}
				}
			}
	
			for (i in this.map) {
	
				// not even ready to check yet
				if (this.map[i] && this.map[i].loading == true)
					continue;
	
				if (this.map[i].dependencies.length == 0 && this.map[i].run === false && this.map[i].running === false) {
	
					this.map[i].running = true;
	
					// this.log("Registering " + i, this.logs.loading);
					this.register(i, this.map[i].callback);
					loop = true;
	
				} else {
	
					// trying to figure out cross dependencies / overlapping dependencies problems :(  *doh
					// this.log( i + " still has " + this.map[i].dependencies.length + "!" );
					// this.log( i + " thinks that it " + ( this.map[i].run !== false ? " been run " : " not been run ") );
					
				}
			}
	
			this.log("AJBnet.loaded() END" + details, this.logs.loading );
	
			// When a library has been loaded + run, it may have satisfied others, so we loop once
			if (loop == true) {
				this.log("AJBnet.loaded() triggering LOOP" + details, this.logs.loading );
				
				/*
				var that = this;
				setTimeout(function(){
					that.loaded();
				},500);
				*/
	
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
				
				delete(this.closureHolder);
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
		 * Set or load a global object
		 * 
		 * @return mixed Returns either the value of the object specified, null, or sets the new value and returns the object
		 */
		global : function(key,new_value) {
	
			if (!this.isUndefined(new_value)) {
				this.globals[key] = new_value;
			} else {
				if (this.globals[key]) {
					return this.globals[key];
				} else {
					this.log("Trying to access undefined property '" + key + "'", this.logs.core);
					return null; // throw "Trying to access undefined property '" + key + "'";
				}
			}
	
			return this;
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
		isFloat : function(float_to_test) {
			return typeof float_to_test == "number" && (parseInt(float_to_test) !== float_to_test);
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
		 * Is the provided parameter an Object?
		 * 
		 * @param mixed Object to test
		 * @return boolean
		 */
		isObject : function(object) {
			return Object.prototype.toString.call(object) === "[object Object]"
		},
		
		/**
		 * Is the object an Array?
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
		 * Is the specified classpath loaded yet?
		 * 
		 * @param string classpath A classpath to test.
		 * @return boolean
		 */
		isLoaded : function(classpath) {
			return (this.map[classpath] && this.map[classpath].loaded == true);
		},
	
		/**
		 * logging
		 *
		 * @return object AJBnet
		 */
		log : function(obj, type) {
	
			if(this.config.debug === true && this.config.logsEnabled[type] === true)
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

	/**
	 * AJBnet.autoInit looks for data-init object on the origin script tag,
	 * and uses this as a JSON object to use against the AJBnet.init method
	 */
	core.autoInit();

	// do whatever other internal crap needs to happen here if you want

	return core;

})();