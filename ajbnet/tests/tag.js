/**
 * Test findind the originating script tag to pull the config etc
 */
AJBnet.define("Tests/Tag",function(){

	var scripts = document.getElementsByTagName("script");

	for (var i in scripts ) {

		var test = scripts[i].src + "", origin;

		if (test.match( this.regex.origin )) {
			origin = scripts[i];
		}

	}

	console.log( origin );

});