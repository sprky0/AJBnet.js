AJBnet.define("Tests/Circular",["Tests/Core","Tests/Mixed/A"],function(){

	AJBnet.log("This test will try to create a circular dependency.  A -> B -> C -> A");

	var tests = AJBnet.new("Tests/Core",{container:"#results"});

	tests.addTest(true,function(){alert('dix');return false;},false,"tacos");

	tests.run();

});