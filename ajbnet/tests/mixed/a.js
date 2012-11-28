AJBnet.define("Tests/Mixed/A",["Tests/Mixed/B"],function(){

	var A = function() {};
	
		A.prototype.test = function() {
			return "A";
		}

		A.prototype.getB = function() {
			return AJBnet.new("Tests/Mixed/B");
		}

	AJBnet.libs.Tests.Mixed.A = A;

});