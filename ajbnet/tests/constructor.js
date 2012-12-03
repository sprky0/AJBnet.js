/**
 * Test - Constructor via AJBnet.new
 * 
 * Create a class named "Constructor" in the Tests namespace by returning the object's constructor
 */
AJBnet.define("Tests/Constructor",["Tests/Nested/Constructor"],function(){

	/*
	var Constructor = function(options) {
		return this;
	};

		Constructor.prototype.message = "This class is under the namespace Tests/Constructor";

		Constructor.prototype.test = function() {
			return this.message;
		}

	// now dis automatic
	// AJBnet.libs.Tests.Constructor = Constructor;
	return Constructor;
	*/

	// alert("Shit");
	
	var a = AJBnet.new("Tests/Nested/Constructor");
	// alert( a.test() );

	// this will not return anything b/c it's just a code block

});