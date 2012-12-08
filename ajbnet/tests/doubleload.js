AJBnet.define("Tests/Doubleload",["JQuery","Tests/Core","Tests/Double/A","Tests/Double/B","Tests/Double/C"],function(){

	this.log("This test will try to load classes A B and C, which all require class D.", this.logs.application);

	var a = this.new("Tests/Double/A");
	var b = this.new("Tests/Double/B");
	var c = this.new("Tests/Double/C");

	var tests = this.new("Tests/Core",{type:"Double Load",container:""});

	tests.addTest(a,function(mr_object){
		alert( mr_object.getD() );
	},true,"Get D from A");

});