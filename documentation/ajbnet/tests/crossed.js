AJBnet.define("Tests/Crossed",["Tests/Core","Tests/Cross/A"],function(){

	this.log("Testing cross dependencies!", this.logs.application);

	var tests = this.new("Tests/Core");
		tests.addTest(null,function(){ alert("tacos!"); return true; },true,"Load two classes that depend on each other.");
		tests.run();

});