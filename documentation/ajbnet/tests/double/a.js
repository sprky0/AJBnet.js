AJBnet.define("Tests/Double/A",['Tests/Double/D'],function(){

	var A = function(){};
		A.prototype.getD = function(){
			return AJBnet.construct("Tests/Double/D");	
		}
	
	return A;

});