/**
 * This test will run all the internal comparison methods and make sure they do what they should
 */
AJBnet.define("Tests/Comparison",['Tests/Core'],function(){

	/**
	 * Possible variable types we will use in the tests
	 */
	var number = 1,
		integer = 2,
		float = 1.1,
		string = "this is a string",
		array = [number,integer],
		object = {string:number},
		null_value = null,
		false_value = false,
		undefined_value = undefined;

	var tests = this.construct("Tests/Core",{type:"Comparison Function Tests",container:"#results"});

	// number
	tests.addTest(integer,"isNumber",true);
	tests.addTest(float,"isNumber",true);
	tests.addTest(string,"isNumber",false);
	tests.addTest(false_value,"isNumber",false);

	// integer
	tests.addTest(integer,"isInteger",true);
	tests.addTest(float,"isInteger",false);
	tests.addTest(string,"isInteger",false);
	tests.addTest(false_value,"isInteger",false);

	// floating point
	tests.addTest(float,"isFloat",true);
	tests.addTest(integer,"isFloat",false);
	tests.addTest(string,"isFloat",false);
	tests.addTest(false_value,"isFloat",false);

	// string
	tests.addTest(string,"isString",true);
	tests.addTest(integer,"isString",false);
	tests.addTest(float,"isString",false);
	tests.addTest(false_value,"isString",false);

	// array
	tests.addTest(array,"isArray",true);
	tests.addTest(object,"isArray",false);
	tests.addTest(string,"isArray",false);
	tests.addTest(false_value,"isArray",false);

	// object
	tests.addTest(object,"isObject",true);
	tests.addTest(array,"isObject",false);
	tests.addTest(string,"isObject",false);
	tests.addTest(false_value,"isObject",false);

	tests.run();

});