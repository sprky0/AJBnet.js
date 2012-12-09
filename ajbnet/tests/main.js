/**
 * Handle bindings etc on the test.html page
 */
AJBnet.define("Tests/Main",function(){
	
	this.ready(function(){

		var tests = [];

		function runall(e){
			
			e.preventDefault();
			
			for(var i = 0; i < tests.length; i++)
				AJBnet.run(tests[i]);
		}

		/**
		 * Local click handler for the button actions
		 */
		function handleclick(){
			this.disabled = 1;
			AJBnet.run(this.id);
				// (this.id+"").replace("_","/")
		}

		var items = document.getElementsByClassName("test");

		for(var i = 0; i < items.length; i++) {
			tests.push( items[i].id );
			items[i].onclick = handleclick;
			// for obsessive refreshing behavior in Webkit :)
			items[i].disabled = null;
		}

		var items = document.getElementsByClassName("all-tests");

		for(var i = 0; i < items.length; i++) {
			items[i].onclick = runall;
		}

	});

});

