AJBnet.define("Tests/Cross/B",["Tests/Cross/A"],function(){

	var B = function() {};
	
		B.prototype.test = function() {
			return "B";
		}

		B.prototype.getA = function() {
			return AJBnet.new("Tests/Cross/A");
		}

	AJBnet.libs.Tests.Cross.B = B;

});