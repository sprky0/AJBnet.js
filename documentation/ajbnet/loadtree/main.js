AJBnet.define("LoadTree/Main",["vendor/jquery-1.8.3.min.js"],function(){

	$("#loadtree_form").bind("submit",function(e){

		e.preventDefault();

		var value_json = $("input[name='data-init']",this).val();
			value_object = AJBnet.parseJSON(value_json)

		AJBnet.init(value_object, true);

	});

});