AJBnet.define("Tests/Private",["Tests/Core","Tests/PublicPrivate"],function(){

	// actually (member properties/methods vs local properties/methods)

	var tests = AJBnet.construct("Tests/Core",{type:"Test Public vs 'Private' variable concept",container:"#results"});

	var p = AJBnet.construct("Tests/PublicPrivate");

	p.public();
	p.callPrivate();

	var exists = typeof Private;

	tests.addTest(exists, function(ex) {
		return typeof Private;
	}, 'undefined', "Can't access private function from outer scope.");

	tests.addTest(p.callPrivate(), null, 'private', "Test var Private = function(){}");
	tests.addTest(p.callPrivate2(), null, 'private2', "Test function Private2(){}");

	tests.run();

});