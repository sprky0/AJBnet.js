var AJBnet=(function(){var core={config:{main:null,shorthand:null,debug:false,initRun:false,srcBasePath:null,logsEnabled:{core:false,application:false,loading:false,execution:false,construct:false,notice:false,warning:false,error:false}},libs:{},map:{},closureHolder:null,readyStack:[],globals:{},key:{A:65,B:66,C:67,D:68,E:69,F:70,G:71,H:72,I:73,J:74,K:75,L:76,M:77,N:78,O:79,P:80,Q:81,R:82,S:83,T:84,U:85,V:86,W:87,X:88,Y:89,Z:90,TAB:9,SHIFT:16,ESCAPE:27,RETURN:13,ENTER:13,ALT:18,OPTION:18,COMMAND:224,CONTROL:17,DELETE:8,SPACE:32,LEFT:37,UP:38,RIGHT:39,DOWN:40,ZERO:48,ONE:49,TWO:50,THREE:51,FOUR:52,FIVE:53,SIX:54,SEVEN:55,EIGHT:56,NINE:57},regex:{namespaced_class:/^[A-Za-z0-9\-\.\/]+$/,external_library:/^[A-Za-z0-9\-\.\/]+\.js$/,origin:/ajbnet(-min)?(\.\d\.\d\.\d)?.js/,srcPath:/\/$/},logs:{core:"core",application:"application",loading:"loading",execution:"execution",construct:"construct",notice:"notice",warning:"warning",error:"error"},init:function(options,force){this.log("AJBnet.init()",this.logs.core);var i,path;if(this.config.initRun===true&&force!==true){throw"Init already run!"}for(i in options||{}){switch(i){default:throw"Unknown option '"+i+"' passed to AJBnet.init";break;case"srcBasePath":path=options[i];if(!path.match(this.srcPath)){throw"Invalid src path, must end in trailing slash."}this.config.srcBasePath=path;break;case"debug":this.config.debug=options[i];break;case"main":case"app":this.config.main=options[i];break}}if(this.isNull(this.config.srcBasePath)){this.config.srcBasePath="ajbnet/"}if(!this.isNull(this.config.shorthand)){if(window[this.config.shorthand]){throw"Shorthand "+this.config.shorthand+" has already been declared, before AJBnet.init()!"}window[this.config.shorthand]=this}if(!this.isReady()){this.readyLoop()}this.config.initRun=true;if(!this.isNull(this.config.main)){if(this.isArray(this.config.main)){for(i in this.config.main){this.run(this.config.main[i])}}else{this.run(this.config.main)}}return this},autoInit:function(){var origin=this.getOrigin(),init_json,init_object;if(this.isNull(origin)){return false}init_json=origin.getAttribute("data-init");if(!this.isNull(init_json)){eval("init_object="+init_json);if(!this.isObject(init_object)){this.log("AJBnet.autoInit() did not find a valid object for init",this.logs.core);return this}this.init(init_object)}return this},getOrigin:function(){this.log("AJBnet.getOrigin()",this.logs.core);var scripts=document.getElementsByTagName("script"),i,test;for(i in scripts){test=scripts[i].src+"";if(test.match(this.regex.origin)){return scripts[i]}}return null},run:function(classpath){if(!this.isLoaded(classpath)){this.require(classpath)}else{this.execute(this.map[classpath].callback)}return this},"new":function(){var classpath=arguments[0],new_arguments=[],i,path,token,pointer;if(arguments.length>1){for(i=1;i<arguments.length;i++){new_arguments.push(arguments[i])}}path=classpath.split("/");classname=path.pop();token=classname;pointer=this.libs;this.log("AJBnet.new() -> Trying to make "+classname+" ("+classpath+")",this.logs.construct);while(path.length>0){token=path.shift();pointer=pointer[token]}if(!pointer){throw"Classpath '"+classpath+"' could not be traversed!  Incorrect naming or nesting in declaration?"}if(!this.isFunction(pointer[classname])){throw"Class '"+classpath+"' not loaded yet!"}return this.construct(pointer[classname](),new_arguments)},ready:function(closure){if(this.isReady()){this.execute(closure)}else{this.readyStack.push(closure)}return this},readyLoop:function(){if(!this.isReady()){this.readyLoop()}else{for(var i in this.readyStack){this.execute(this.readyStack[i])}}return this},require:function(classpath){if(!this.isString(classpath)){throw"Invalid value for classpath, should be a String."}if(this.map[classpath]&&(this.map[classpath].loading==true||this.map[classpath].loaded==true)){return true}var src,that=this;if(!this.map[classpath]){this.map[classpath]={loading:true,loaded:false,running:false,run:false}}if(classpath.match(this.regex.external_library)){src=this.config.srcBasePath+classpath;this.load(src,classpath,function(){that.define(classpath,function(){})},true)}else{if(classpath.match(this.regex.namespaced_class)){src=this.config.srcBasePath+(classpath+"").toLowerCase()+".js";this.load(src,classpath)}else{throw classpath+" doesn't seem to be properly named, or AJBnet doesn't know how to parse it."}}return this},define:function(classpath,dependencies_or_closure,closure){if(this.isFunction(dependencies_or_closure)){closure=dependencies_or_closure;dependencies=null}else{dependencies=dependencies_or_closure}var path=classpath.split("/"),dependencies=dependencies||[],pointer=this.libs,token,i;while(path.length!=0){token=path.shift();if(!pointer[token]){pointer[token]={}}pointer=pointer[token]}this.map[classpath]={dependencies:dependencies||[],callback:closure,loaded:false,loading:false,running:false,run:false};if(dependencies.length>0){for(i=0;i<dependencies.length;i++){this.require(dependencies[i])}}return this},register:function(classpath,definition_closure){this.log("AJBnet.register() - Running for "+classpath,this.logs.construct);var path=classpath.split("/"),classname=path.pop(),token=classname,pointer=this.libs;while(path.length>0){token=path.shift();pointer=pointer[token]}if(!this.isObject(pointer)){throw"Classpath '"+classpath+"' could not be traversed!  Incorrect naming or nesting in declaration?"}if(!this.isFunction(definition_closure)){throw"Closure was not passed for "+classpath}this.log("AJBnet.register() - Running closure  for "+classpath,this.logs.construct);this.execute(definition_closure);pointer[classname]=definition_closure;this.map[classpath].run=true},load:function(src,classpath,callback,forceloop){this.log("AJBnet.load() -> "+src,this.logs.core);forceloop=forceloop||false;var element=document.createElement("script"),that=this;element.setAttribute("type","text/javascript");element.setAttribute("src",src);element.onload=function(){that.log("onload callback for "+classpath+" at "+src+" called.",AJBnet.logs.loading);if(that.isFunction(callback)){callback()}that.loaded(classpath,forceloop)};document.getElementsByTagName("head")[0].appendChild(element);return this},loaded:function(classpath,forceloop){var details=classpath?" (triggered by "+classpath+")":"",loop=forceloop||false,replacement_array=[],i,j,k;this.log("AJBnet.loaded() START"+details,this.logs.loading);if(classpath){this.map[classpath].loaded=true}for(i in this.map){if(this.map[i]&&this.map[i].loading==true){continue}for(j=0;j<this.map[i].dependencies.length;j++){if(this.map[this.map[i].dependencies[j]]&&this.map[this.map[i].dependencies[j]].run==true){replacement_array=[];for(k=0;k<this.map[i].dependencies.length;k++){if(k==j){continue}else{replacement_array.push(this.map[i].dependencies[k])}}this.map[i].dependencies=replacement_array}}}for(i in this.map){if(this.map[i]&&this.map[i].loading==true){continue}if(this.map[i].dependencies.length==0&&this.map[i].run===false&&this.map[i].running===false){this.map[i].running=true;this.register(i,this.map[i].callback);loop=true}else{}}this.log("AJBnet.loaded() END"+details,this.logs.loading);if(loop==true){this.log("AJBnet.loaded() triggering LOOP"+details,this.logs.loading);this.loaded()}return this},execute:function(closure){if(this.isFunction(closure)){this.closureHolder=closure;var result=this.closureHolder();delete (this.closureHolder);return result}else{throw"Closure passed to execute is not a function!"}return null},extend:function(obj1,obj2){for(i in obj2||{}){obj1[i]=obj2[i]}return obj1},construct:function(ctor,params){var obj,newobj;if(typeof Object.create==="function"){obj=Object.create(ctor.prototype);this.log("Used Object.create",this.logs.construct)}else{if({}.__proto__){obj={};obj.__proto__=ctor.prototype;if(obj.__proto__===ctor.prototype){this.log("Used __proto__",this.logs.construct)}else{this.log("__proto__ failed, used fake constructor",this.logs.construct);obj=makeObjectWithFakeCtor()}}else{this.log("Used fake constructor",this.logs.construct);obj=makeObjectWithFakeCtor()}}obj.constructor=ctor;newobj=ctor.apply(obj,params);if(newobj!==null&&(typeof newobj==="object"||typeof newobj==="function")){obj=newobj}return obj;function makeObjectWithFakeCtor(){function fakeCtor(){}fakeCtor.prototype=ctor.prototype;return new fakeCtor()}},global:function(key,new_value){if(!this.isUndefined(new_value)){this.globals[key]=new_value}else{if(this.globals[key]){return this.globals[key]}else{this.log("Trying to access undefined property '"+key+"'",this.logs.core);return null}}return this},isNumber:function(number){return typeof number=="number"},isFloat:function(float_to_test){return typeof float_to_test=="number"&&(parseInt(float_to_test)!==float_to_test)},isInteger:function(integer){return typeof integer=="number"&&(parseInt(integer)===integer)},isUndefined:function(value){return value===undefined},isNull:function(value){return value===null},isString:function(string){return typeof string==="string"},isFunction:function(closure){return Object.prototype.toString.call(closure)==="[object Function]"},isObject:function(object){return Object.prototype.toString.call(object)==="[object Object]"},isArray:function(object){return Object.prototype.toString.call(object)==="[object Array]"},isReady:function(){return(document&&document.getElementsByTagName("body")[0])},isLoaded:function(classpath){return(this.map[classpath]&&this.map[classpath].loaded==true)},log:function(obj,type){if(this.config.debug===true&&this.config.logsEnabled[type]===true){this.logFunction(obj)}return this},logFunction:function(obj){console.log(obj);return this}};core.autoInit();return core})();