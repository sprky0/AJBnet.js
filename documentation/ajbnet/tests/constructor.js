/**
 * Test - Constructor via AJBnet.new
 * 
 * Create a class named "Constructor" in the Tests namespace by returning the object's constructor
 */
AJBnet.define("Tests/Constructor",["Tests/Core","Tests/Nested/Constructor"],function(){

	var tests = AJBnet.construct("Tests/Core",{container:"#results"});

	/*
	Can't have cake + eat cake :(  (!instanceof if we run the constructor factory for each construct)

	tests.addTest(null,function(){

		var a = AJBnet.construct("Tests/Nested/Constructor");

		// var newconstructor = AJBnet.libs.Tests.Nested.Constructor();
		// var b = new newconstructor();
		// console.log( b instanceof newconstructor );

		return a instanceof AJBnet.libs.Tests.Nested.Constructor;

	},true,"constructed object instanceof constructor?");
	*/

	tests.addTest(null,function(){

		var a = AJBnet.construct("Tests/Nested/Constructor");
		var b = AJBnet.construct("Tests/Nested/Constructor");
		
		a.test1 = 1;
		b.test1 = 2;

		return a.test1 !== b.test1;

	},true,"Distinct objects constructed? (test assigning integers, 1/2)");


	tests.addTest(null,function(){

		var a = AJBnet.construct("Tests/Nested/Constructor");
		a.test1 = 3;

		var b = AJBnet.construct("Tests/Nested/Constructor");
		b.test1 = 4;

		return a.test1 !== b.test1;

	},true,"Distinct objects constructed? (test assigning integers, 2/2)");

	tests.addTest(null,function(){

		var a = AJBnet.construct("Tests/Nested/Constructor");
		var b = AJBnet.construct("Tests/Nested/Constructor");

		a.test1 = {tacos:1};
		b.test1 = {tacos:2};

		return a.test1 !== b.test1;

	},true,"Assign objects");

	tests.addTest(null,function(){

		var a = AJBnet.construct("Tests/Nested/Constructor");
		a.test_array.push(1);
		
		var b = AJBnet.construct("Tests/Nested/Constructor");
		b.test_array.push(2);

		return a.test_array[0] !== b.test_array[0];

	},true,"Distinct Array.push on prototyped array");


	tests.run();

});