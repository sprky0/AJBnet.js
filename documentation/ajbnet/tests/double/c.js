AJBnet.define("Tests/Double/C",['Tests/Double/D'],function(){

	var C = function(){};
		C.prototype.getD = function(){
			return AJBnet.construct("Tests/Double/D");	
		}

	return C;

});