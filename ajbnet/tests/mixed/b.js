AJBnet.define("Tests/Mixed/B",["Tests/Mixed/C"],function(){

	var B = function() {}
	
	B.prototype.test = function() {
		var C = AJBnet.new("Tests/Mixed/C");
		AJBnet.log("B has made C which is a " + C.prototype.classname);
	}
	
	AJBnet.libs.Tests.Mixed.B = B;

});