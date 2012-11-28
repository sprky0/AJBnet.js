AJBnet.define("Tests/Crossed",["Tests/Core","Tests/Cross/A"],function(){

	this.log('Running the closure for Tests/Crossed!');

	var C = this.new("Tests/Core");
	
	C.addTest(null,function(){
		
		alert("tacos!");
		
	},true,"Load two classes that depend on each other.");

});