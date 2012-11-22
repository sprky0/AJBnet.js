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

		// go man, go!
		$.get(
			"test_lib/meta.json",
			run_gallery,
			"json"
		);

	});

});