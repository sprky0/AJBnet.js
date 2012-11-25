/**
 * Test - Constructor via AJBnet.new
 */
AJBnet.define("Tests/Constructor",function(){

	var Constructor = function(options) {
		return this;
	};

		Constructor.prototype.message = "This class is under the namespace Tests/Constructor";

		Constructor.prototype.test = function() {
			return this.message;
		}

	AJBnet.libs.Tests.Constructor = Constructor;

});