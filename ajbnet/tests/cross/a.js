AJBnet.define("Tests/Cross/A",["Tests/Cross/B"],function(){

	var A = function() {};

		A.prototype.test = function() {
			return "A";
		}

		A.prototype.getB = function() {
			return AJBnet.new("Tests/Cross/B");
		}

	AJBnet.libs.Tests.Cross.A = A;

});