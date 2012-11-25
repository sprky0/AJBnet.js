// this works :(
AJBnet.define("Tests/Mixed/C",function(){
// This fails:
// AJBnet.define("Tests/Mixed/C",["Tests/Mixed/A"],function(){

	var C = function() {};

	C.prototype.test = function() {
		var A = AJBnet.new("Tests/Mixed/A");
		AJBnet.log("C has made A which is a " + A.prototype.classname);
	}
	
	AJBnet.libs.Tests.Mixed.C = C;

});