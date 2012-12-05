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

	},true,"Distinct objects constructed (test assigning integers, 1)?");


	tests.addTest(null,function(){

		var a = AJBnet.new("Tests/Nested/Constructor");
		a.test1 = 3;

		var b = AJBnet.new("Tests/Nested/Constructor");
		b.test1 = 4;

		AJBnet.log( [a.test1, b.test1], AJBnet.logs.application );

		return a.test1 !== b.test1;

	},true,"Distinct objects constructed (test assigning integers, 2)?");

	tests.addTest(null,function(){

		var a = AJBnet.new("Tests/Nested/Constructor");
		var b = AJBnet.new("Tests/Nested/Constructor");

		a.test1 = {tacos:1};
		b.test1 = {tacos:2};

		AJBnet.log( [a.test1, b.test1], AJBnet.logs.application );

		return a.test1 !== b.test1;

	},true,"Distinct objects constructed (test assigning objects, 2)?");

	tests.addTest(null,function(){

		var a = AJBnet.new("Tests/Nested/Constructor");
		var b = AJBnet.new("Tests/Nested/Constructor");

		a.test_array.push(1);
		b.test_array.push("tacos");

		AJBnet.log( [a.test1, b.test1], AJBnet.logs.application );

		return a.test1[0] !== b.test1[0];

	},true,"Distinct objects constructed (test assigning objects, 2)?");


	tests.run();
	// this will not return anything b/c it's just a code block in AJBnet object scope, not an object constructor

});