/**
 * Test findind the originating script tag to pull the config etc
 */
AJBnet.define("Tests/Tag",["Tests/Core"],function(){

	AJBnet.log("Finding origin.", AJBnet.logs.application);

	var origin = AJBnet.getOrigin(),
		tests = AJBnet.construct("Tests/Core",{type:"Find Source &lt;script&gt; Tag",container:"#results"});

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