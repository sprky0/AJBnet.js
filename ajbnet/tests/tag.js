/**
 * Test findind the originating script tag to pull the config etc
 */
AJBnet.define("Tests/Tag",["Tests/Core"],function(){

	this.log("Finding origin.", this.logs.application);

	var origin = this.getOrigin();
	var tests = this.new("Tests/Core",{type:"Find Source &lt;script&gt; Tag",container:"#results"});

	tests.addTest(origin,
		function(test_origin) {
			return false === AJBnet.isNull(test_origin);
		},true, "Not null");

	tests.addTest(origin,
		function(test_origin) {
			return test_origin.toString();
		},"[object HTMLScriptElement]", "Is correct object type?");

	tests.run();

});