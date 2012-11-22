/**
 * Test 
 */
AJBnet.define("Tests/Constructor",function(){

	var Constructor = function(options) {
		alert("Constructor called!")
		return this;
	};

		Constructor.prototype.value = 1;

		Constructor.prototype.test = function() {
			return 1 == this.value;
		}

	AJBnet.libs.Tests.Constructor = Constructor;

});