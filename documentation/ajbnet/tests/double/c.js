AJBnet.define("Tests/Double/C",['Tests/Double/D'],function(){

	var C = function(){};
		C.prototype.getD = function(){
			return AJBnet.new("Tests/Double/D");	
		}

	return C;

});