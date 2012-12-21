AJBnet.define("Tests/Cross/B",["Tests/Cross/A"],function(){

	var B = function() {};
	
		B.prototype.test = function() {
			return "B";
		}

		B.prototype.getA = function() {
			return AJBnet.construct("Tests/Cross/A");
		}

	return B;

});