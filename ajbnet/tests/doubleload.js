AJBnet.define("Tests/Doubleload",["Tests/Mixed/A"],function(){

	AJBnet.log("This test will try to create a circular dependency.  A -> B -> C -> A");
	// alert('fuck');
	var a = AJBnet.new("Tests/Mixed/A");

	// AJBnet.log("I was able to load " + a.prototype.classname);

});