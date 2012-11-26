/**
 * This test declares a function and hopefully it will show up in the parent!
 */
AJBnet.define("Tests/Function",function(){

	// hi - this closure is empty because this .define() doesn't do anything really besides set up the name

});

/*
This would work to use MyFunction downstream as it would be declared in the outermost scope
But ... i think it is unclean

function MyFunction(){
	AJBnet.log("This function exists!");
	return true;
}
*/