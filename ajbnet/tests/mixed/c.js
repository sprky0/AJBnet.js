// this works :(
AJBnet.define("Tests/Mixed/C",function(){
// This fails:
// AJBnet.define("Tests/Mixed/C",["Tests/Mixed/A"],function(){

	var C = function() {};

		C.prototype.test = function() {
			return "C";
		}

		C.prototype.getA = function() {
			return AJBnet.new("Tests/Mixed/A");
		}

	AJBnet.libs.Tests.Mixed.C = C;

});