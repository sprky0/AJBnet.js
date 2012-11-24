AJBnet.define('Gallery/Main',['Gallery/Gallery'],function(){

	AJBnet.ready(function(){

		$("body").empty();

		function run_gallery(image_array){

			var g = AJBnet.new("Gallery/Gallery",{
				container : "body",
				images : image_array
			});

			$(document)
				.bind("resize",function(){
				
					// do this eventually
					// g.recalculateScale();	
					
				})
				.bind("keyup",function(e){

					switch(e.keyCode){
	
						default:
						// unknown key
						AJBnet.log(e);
						break;
	
						case AJBnet.key.LEFT:
						g.previous();
						break;
	
						case AJBnet.key.RIGHT:
						g.next();
						break;
	
					}
	
				});

		};
		
		$.ajax({
			url : "test_lib/meta.php",
			data : {},
			complete : function(obj,text) {},
			error : function(obj,text) {},
			success : run_gallery,
			dataType : "json",
			type : "GET"
		});

	});

});