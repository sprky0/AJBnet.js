AJBnet.define("Tests/Mixed/C",["Tests/Mixed/A"],function(){

	var C = function() {};

		C.prototype.test = function() {
			return "C";
		}

		C.prototype.getA = function() {
			return AJBnet.construct("Tests/Mixed/A");
		}

	return C;

});