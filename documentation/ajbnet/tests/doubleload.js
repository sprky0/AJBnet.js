AJBnet.define("Tests/Doubleload",["JQuery","Tests/Core","Tests/Double/A","Tests/Double/B","Tests/Double/C"],function(){

	AJBnet.log("This test will try to load classes A B and C, which all require class D.", AJBnet.logs.application);

	var a = AJBnet.construct("Tests/Double/A"),
		b = AJBnet.construct("Tests/Double/B"),
		c = AJBnet.construct("Tests/Double/C"),
		tests = AJBnet.construct("Tests/Core",{type:"Double Load",container:"#results"});

	tests.addTest(a,function(mr_object){
		var d = mr_object.getD();
		return ( true === d.this_is_d );
	},true,"Get D from A");

	tests.addTest(b,function(mr_object){
		var d = mr_object.getD();
		return ( true === d.this_is_d );
	},true,"Get D from B");
	
	tests.addTest(c,function(mr_object){
		var d = mr_object.getD();
		return ( true === d.this_is_d );
	},true,"Get D from C");

	tests.run();

});