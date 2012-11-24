/**
 * Test - same named class under a different namespace
 */
AJBnet.define("Tests/Nested/Constructor",function(){ // ,["Tests/Constructor/Constructor"]

	var Constructor = function(options) {
		return this;
	};

		Constructor.prototype.message = "This class is under the namespace Tests/Nested/Constructor";

		Constructor.prototype.test = function() {
			return this.message;
		}

	console.log( Constructor );

	AJBnet.libs.Tests.Constructor = Constructor;

});