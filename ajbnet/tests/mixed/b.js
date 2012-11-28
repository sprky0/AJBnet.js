AJBnet.define("Tests/Mixed/B",["Tests/Mixed/C"],function(){

	var B = function() {}
	
		B.prototype.test = function() {
			return "B";
		}

		B.prototype.getC = function() {
			return AJBnet.new("Tests/Mixed/C");
		}

	AJBnet.libs.Tests.Mixed.B = B;

});