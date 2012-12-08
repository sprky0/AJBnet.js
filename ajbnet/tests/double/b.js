AJBnet.define("Tests/Double/B",['Tests/Double/D'],function(){

	var B = function(){};
		B.prototype.getD = function(){
			return AJBnet.new("Tests/Double/D");	
		}

	return B;

});