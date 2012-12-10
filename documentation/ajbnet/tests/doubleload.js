/**
 * This is a funny one -- still sometimes fails, some sort of load delay edge case.
 * Might be solved by setting a timeout on the loaded() optional loop?
 * (but I would love to avoid that)
 */
AJBnet.define("Tests/Doubleload",["JQuery","Tests/Core","Tests/Double/A","Tests/Double/B","Tests/Double/C"],function(){

	this.log("This test will try to load classes A B and C, which all require class D.", this.logs.application);

	var a = this.new("Tests/Double/A"),
		b = this.new("Tests/Double/B"),
		c = this.new("Tests/Double/C"),
		tests = this.new("Tests/Core",{type:"Double Load",container:"#results"});

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