/*!
 * AJBnet Javascript Library
 * 
 * @version 0.9.7
 * @author sprky0
 * @link http://js.ajbnet.com
 */
(function(d,b){function c(){var f=function(o,q){var p,n;if(typeof Object.create==="function"){p=Object.create(o.prototype)}else{if({}.__proto__){p={};p.__proto__=o.prototype;if(p.__proto__===o.prototype){}else{p=m()}}else{p=m()}}p.constructor=o;n=o.apply(p,q);if(n!==null&&(typeof n==="object"||typeof n==="function")){p=n}return p;function m(){function r(){}r.prototype=o.prototype;return new r()}},e=function(){g.log("AJBnet.getOrigin()",g.logs.core);var m=document.getElementsByTagName("script"),n,o;for(n in m){o=m[n].src+"";if(o.match(k.origin)){return m[n]}}return null},j=[],i={main:null,shorthand:null,debug:false,initRun:false,src:null,logsEnabled:{core:false,application:false,loading:false,execution:false,construct:false,notice:false,warning:false,error:false}},h=function(){if(!g.isReady()){setTimeout(h,10)}else{for(var m in j){g.execute(j[m])}}},l=l||{stringify:function(m){throw"Not supported yet."},parse:function(m){return m}},k={namespaced_class:/^[A-Za-z0-9\-\.\/]+$/,external_library:/^[A-Za-z0-9\-\.\/]+\.js$/,origin:/ajbnet(-min)?(\.\d\.\d\.\d)?.js/,srcPath:/\/$/},g={libs:{},map:{},closure:null,globals:{},key:{A:65,B:66,C:67,D:68,E:69,F:70,G:71,H:72,I:73,J:74,K:75,L:76,M:77,N:78,O:79,P:80,Q:81,R:82,S:83,T:84,U:85,V:86,W:87,X:88,Y:89,Z:90,TAB:9,SHIFT:16,ESCAPE:27,RETURN:13,ENTER:13,ALT:18,OPTION:18,COMMAND:224,CONTROL:17,DELETE:8,SPACE:32,LEFT:37,UP:38,RIGHT:39,DOWN:40,ZERO:48,ONE:49,TWO:50,THREE:51,FOUR:52,FIVE:53,SIX:54,SEVEN:55,EIGHT:56,NINE:57},logs:{core:"core",application:"application",loading:"loading",execution:"execution",construct:"construct",notice:"notice",warning:"warning",error:"error"},init:function(m,o){this.log("AJBnet.init()",g.logs.core);if(i.initRun===true&&o!==true){throw"Init already run!"}for(var n in m||{}){switch(n){default:throw"Unknown option '"+n+"' passed to AJBnet.init";break;case"src":i.src=m[n];break;case"shorthand":if(window[m[n]]){throw"Requested shorthand '"+m[n]+"' already in use in window scope."}i.shorthand=m[n];break;case"debug":i.debug=m[n];break;case"main":case"app":i.main=m[n];break}}if(this.isNull(i.src)){i.src="ajbnet/"}if(!this.isNull(i.shorthand)){if(window[i.shorthand]){throw"Shorthand "+i.shorthand+" has already been declared, before AJBnet.init()!"}window[i.shorthand]=this}if(!this.isReady()){h()}i.initRun=true;if(!this.isNull(i.main)){if(this.isArray(i.main)){for(n in i.main){this.run(i.main[n])}}else{this.run(i.main)}}return this},autoInit:function(){var n=e(),o,m;if(this.isNull(n)){return false}o=n.getAttribute("data-init");if(!this.isNull(o)){m=this.JSON.parse(o);if(!this.isObject(m)){this.log("AJBnet.autoInit() did not find a valid object for init",g.logs.core);return this}this.init(m)}return this},run:function(m){if(!this.isLoaded(m)){this.require(m)}else{this.execute(this.map[m].callback)}return this},construct:function(){var m=arguments[0],p=[],o,r,n,s,q;if(arguments.length>1){for(o=1;o<arguments.length;o++){p.push(arguments[o])}}r=m.split("/");q=r.pop();n=q;s=this.libs;this.log("AJBnet.construct() -> Trying to make "+q+" ("+m+")",g.logs.construct);while(r.length>0){n=r.shift();s=s[n]}if(!s){throw"Classpath '"+m+"' could not be traversed!  Incorrect naming or nesting in declaration?"}if(!this.isFunction(s[q])){throw"Class '"+m+"' not loaded yet!"}return f(s[q](),p)},ready:function(m){if(this.isReady()){this.execute(m)}else{j.push(m)}return this},require:function(m){if(!this.isString(m)){throw"Invalid value for classpath, should be a String."}if(this.map[m]&&(this.map[m].loading==true||this.map[m].loaded==true)){return true}var o,n=this;if(!this.map[m]){this.map[m]={dependencies:[],loading:true,loaded:false,running:false,run:false}}if(m.match(k.external_library)){o=i.src+m;this.load(o,m,function(){n.define(m,function(){})},true)}else{if(m.match(k.namespaced_class)){o=i.src+(m+"").toLowerCase()+".js";this.load(o,m)}else{throw m+" doesn't seem to be properly named, or AJBnet doesn't know how to parse it."}}return this},define:function(m,p,t){if(this.isFunction(p)){t=p;q=null}else{q=p}var r=m.split("/"),q=q||[],s=this.libs,o,n;while(r.length!=0){o=r.shift();if(!s[o]){s[o]={}}s=s[o]}this.map[m]={dependencies:q||[],callback:t,loaded:false,loading:false,running:false,run:false};if(q.length>0){for(n=0;n<q.length;n++){this.require(q[n])}}return this},register:function(m,o){this.log("AJBnet.register() - Running for "+m,g.logs.construct);var q=m.split("/"),p=q.pop(),n=p,r=this.libs;while(q.length>0){n=q.shift();r=r[n]}if(!this.isObject(r)){throw"Classpath '"+m+"' could not be traversed!  Incorrect naming or nesting in declaration?"}if(!this.isFunction(o)){throw"Closure was not passed for "+m}this.log("AJBnet.register() - Running closure  for "+m,g.logs.construct);this.map[m].running=true;this.execute(o);r[p]=o;this.map[m].run=true;this.map[m].running=false},load:function(q,m,r,o){this.log("AJBnet.load() -> "+q,g.logs.core);o=o||false;var n=document.createElement("script"),p=this;n.setAttribute("type","text/javascript");n.setAttribute("src",q);n.onload=n.onreadystatechange=function(){p.log("onload callback for "+m+" at "+q+" called.",g.logs.loading);if(p.isFunction(r)){r()}p.loaded(m,o)};document.getElementsByTagName("head")[0].appendChild(n);return this},loaded:function(p,m){var n=p?" (triggered by "+p+")":"",t=m||false,u=[],o=[],s,r,q;this.log("AJBnet.loaded() START"+n,g.logs.loading);if(p){this.log(p+" loaded, testing dependencies.",g.logs.loading);this.map[p].loaded=true;this.map[p].loading=false;if(this.isArray(this.map[p].dependencies)){o=[];u=[];for(s in this.map[p].dependencies){if(this.map[this.map[p].dependencies[s]]&&this.map[this.map[p].dependencies[s]].run==true){u.push(s)}}for(q=0;q<this.map[p].dependencies.length;q++){if(!this.inArray(q,u)){o.push(this.map[p].dependencies[q])}}this.map[p].dependencies=o}}for(s in this.map){if(this.map[s]&&this.map[s].loading==true){continue}for(r=0;r<this.map[s].dependencies.length;r++){if(this.map[this.map[s].dependencies[r]]&&this.map[this.map[s].dependencies[r]].run==true){o=[];for(q=0;q<this.map[s].dependencies.length;q++){if(q==r){continue}else{o.push(this.map[s].dependencies[q])}}this.map[s].dependencies=o}}}for(s in this.map){if(this.map[s]&&this.map[s].loading==true){continue}if(this.map[s].dependencies.length==0&&this.map[s].run===false&&this.map[s].running===false){this.map[s].running=true;this.log("Registering "+s,g.logs.loading);this.register(s,this.map[s].callback);t=true}else{}}this.log("AJBnet.loaded() END"+n,g.logs.loading);if(t==true){this.log("AJBnet.loaded() triggering LOOP"+n,g.logs.loading);this.loaded()}return this},execute:function(n){if(this.isFunction(n)){this.closure=n;var m=this.closure();delete (this.closure);return m}else{throw"Closure passed to execute is not a function!"}return null},extend:function(o,n){for(var m in n||{}){o[m]=n[m]}return o},global:function(n,m){if(!this.isUndefined(m)){this.globals[n]=m}else{if(this.globals[n]){return this.globals[n]}else{this.log("Trying to access undefined property '"+n+"'",g.logs.core);return null}}return this},isNumber:function(m){return typeof m=="number"},isFloat:function(m){return typeof m=="number"&&(parseInt(m)!==m)},isInteger:function(m){return typeof m=="number"&&(parseInt(m)===m)},isUndefined:function(m){return m===undefined},isNull:function(m){return m===null},isString:function(m){return typeof m==="string"},isFunction:function(m){return Object.prototype.toString.call(m)==="[object Function]"},isObject:function(m){return Object.prototype.toString.call(m)==="[object Object]"},isArray:function(m){return Object.prototype.toString.call(m)==="[object Array]"},isReady:function(){return(document&&document.getElementsByTagName("body")[0])},isLoaded:function(m){return(this.map[m]&&this.map[m].loaded==true)},inArray:function(p,m){if(this.isArray(p)||this.isObject(p)){throw"Test value should be scalar"}for(var n in m){if(m[n]==p){return true}}return false},log:function(n,m){if(i.debug===true&&i.logsEnabled[m]===true){this.logFunction(n)}return this},logFunction:function(m){return this},getConfig:function(){return i},getRegex:function(){return k},getOrigin:function(){return e()},JSON:{stringify:function(m){return l.stringify(m)},parse:function(m){return l.parse(m)}}};return g}var a=c();d[b]=a;a.autoInit()})(window,"AJBnet");