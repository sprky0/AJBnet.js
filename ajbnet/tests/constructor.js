/**
 * Test - Constructor via AJBnet.new
 * 
 * Create a class named "Constructor" in the Tests namespace by returning the object's constructor
 */
AJBnet.define("Tests/Constructor",["Tests/Nested/Constructor"],function(){

	var a = AJBnet.new("Tests/Nested/Constructor");
	// this will not return anything b/c it's just a code block in AJBnet object scope, not an object constructor

});