AJBnet.define("Tests/Function",function(){

	var runs = AJBnet.global("runs") || [];

	runs.push( new Date().getTime() );

	AJBnet.global("runs", runs);

});