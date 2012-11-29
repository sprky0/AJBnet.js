AJBnet.define("Tests/Doubleload",["Tests/Core","Tests/Double/A","Tests/Double/B","Tests/Double/C"],function(){

	AJBnet.log("This test will try to load classes A B and C, which all require class D.");

	var a = AJBnet.new("Tests/Double/A");
	var b = AJBnet.new("Tests/Double/B");
	var c = AJBnet.new("Tests/Double/C");

});