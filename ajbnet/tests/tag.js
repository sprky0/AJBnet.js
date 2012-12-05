/**
 * Test findind the originating script tag to pull the config etc
 */
AJBnet.define("Tests/Tag",["Tests/Core"],function(){

	$("#results").empty();

	var origin = this.getOrigin();
	var tests = this.new("Tests/Core",{container:"#results"});

	tests.addTest(origin,
		function(test_origin) {
			return false === AJBnet.isNull(test_origin);
		},true, "Not null");

	tests.addTest(origin,
		function(test_origin) {
			return test_origin.toString();
		},"[object HTMLScriptElement]", "Is correct object type?");

	console.log( tests );

	tests.run();

});