AJBnet.define("Tests/Private",["Tests/Core","Tests/PublicPrivate"],function(){
	
	var tests = AJBnet.new("Tests/Core",{container:"#results",type:""});

	var p = AJBnet.new("Tests/PublicPrivate");

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