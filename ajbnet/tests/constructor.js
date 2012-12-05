/**
 * Test - Constructor via AJBnet.new
 * 
 * Create a class named "Constructor" in the Tests namespace by returning the object's constructor
 */
AJBnet.define("Tests/Constructor",["Tests/Core","Tests/Nested/Constructor"],function(){

	var tests = this.new("Tests/Core",{container:"#results"});
	
	tests.addTest(null,function(){

		var a = AJBnet.new("Tests/Nested/Constructor");
		var b = AJBnet.new("Tests/Nested/Constructor");
		
		a.test1 = 1;
		b.test1 = 2;

		AJBnet.log( [a.test1, b.test1], AJBnet.logs.application );
		
		return a.test1 !== b.test1;

	},true,"Distinct objects constructed? (test assigning integers, 1/2)");


	tests.addTest(null,function(){

		var a = AJBnet.new("Tests/Nested/Constructor");
		a.test1 = 3;

		var b = AJBnet.new("Tests/Nested/Constructor");
		b.test1 = 4;

		AJBnet.log( [a.test1, b.test1], AJBnet.logs.application );

		return a.test1 !== b.test1;

	},true,"Distinct objects constructed? (test assigning integers, 2/2)");

	tests.addTest(null,function(){

		var a = AJBnet.new("Tests/Nested/Constructor");
		var b = AJBnet.new("Tests/Nested/Constructor");

		a.test1 = {tacos:1};
		b.test1 = {tacos:2};

		AJBnet.log( [a.test1, b.test1], AJBnet.logs.application );

		return a.test1 !== b.test1;

	},true,"Assign objects");

	tests.addTest(null,function(){

		var a = AJBnet.new("Tests/Nested/Constructor");
		a.test_array.push(1);
		
		var b = AJBnet.new("Tests/Nested/Constructor");
		b.test_array.push(2);

		AJBnet.log( [a.test_array, b.test_array], AJBnet.logs.application );

		return a.test_array[0] !== b.test_array[0];

	},true,"Distinct Array.push on prototyped array");


	tests.run();
	// this will not return anything b/c it's just a code block in AJBnet object scope, not an object constructor

});