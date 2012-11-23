AJBnet.define('Gallery/Main',['Gallery/Gallery'],function(){
 
	AJBnet.ready(function(){

		function run_gallery(image_array){

			var g = AJBnet.new("Gallery/Gallery",{
				container : "body",
				images : image_array
			});

			$(document).bind("keyup",function(e){

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
			url : "test_lib/meta.txt",
			data : {},
			complete : function(a,b,c,d) {
				console.log(a,b,c,d);
			},
			error : function(a,b,c,d) {
				console.log(a,b,c,d);
			},
			type : "json"
		});

	});

});
