AJBnet.define("Tests/Mixed/A",["Tests/Mixed/B"],function(){

	var A = function() {};
	
	A.prototype.test = function() {
		var B = AJBnet.new("Tests/Mixed/B");
		AJBnet.log("A has made B which is a " + B.prototype.classname);
	}

	AJBnet.libs.Tests.Mixed.A = A;

});