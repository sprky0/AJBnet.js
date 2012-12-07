AJBnet.define("Tests/Circular",["Tests/Core","Tests/Mixed/A"],function(){

	AJBnet.log("This test will try to create a circular dependency.  A -> B -> C -> A");

	var tests = AJBnet.new("Tests/Core",{type:"Circular Dependency Test",container:"#results"});

	tests.addTest(true,function(){

		var A = AJBnet.new("Tests/Mixed/A");
		var B = A.getB();
		var C = B.getC();
		var A2 = C.getA();

		if ( A.test() == "A" && B.test() == "B" && C.test() == "C" & A2.test() == "A" )
			return true;

		return false;

	},true,"tacos");

	tests.run();

});