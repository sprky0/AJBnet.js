/**
 * Test findind the originating script tag to pull the config etc
 */
AJBnet.define("Tests/Tag",["Tests/Core"],function(){

	this.log("Finding origin.", this.logs.application);

	var origin = this.getOrigin(),
		tests = this.new("Tests/Core",{type:"Find Source &lt;script&gt; Tag",container:"#results"});

	tests.addTest(null,
		function() {
			return null !== "ajbnet-min.1.2.3.js?v=123456789".match(AJBnet.regex.origin);
		},true, "Test match src ajbnet-min.1.2.3.js?v=123456789");

	tests.addTest(null,
		function() {
			return null !== "ajbnet-min.1.2.3.js".match(AJBnet.regex.origin);
		},true, "Test match src ajbnet-min.1.2.3.js");

	tests.addTest(null,
		function() {
			return null !== "ajbnet-min.js".match(AJBnet.regex.origin);
		},true, "Test match src ajbnet-min.js");

	tests.addTest(null,
		function() {
			return null !== "ajbnet.js".match(AJBnet.regex.origin);
		},true, "Test match src ajbnet.js");

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