AJBnet.define('Gallery/Main',['JQuery','Gallery/Gallery'],function(){

	this.ready(function(){

		$("body").append("<div class='gallery_view' id='gallery_viewer'/>");
		$("body")
			.append("<div class='gallery_background'/>")
			.bind("click",function(e){
				$('.gallery_background').remove();
				$('.gallery_view').remove();
				AJBnet.global('gallery').unload();
				$(document).unbind("keyup");
			});

		$.ajax({
			url : "test_lib/meta.php",
			data : {},
			complete : function(obj,text) {},
			error : function(obj,text) {},
			success : run_gallery,
			dataType : "json",
			type : "GET"
		});
		
		/**
		 * Subroutine to create a gallery from an array of image URLs
		 */
		function run_gallery(image_array){

			AJBnet.global('gallery', AJBnet.new("Gallery/Gallery",{container : "#gallery_viewer",images : image_array}));

			$(document)
				.bind("keyup",function(e){

					switch(e.keyCode){

						default:
						// unknown key
						AJBnet.log(e,AJBnet.logs.application);
						break;
	
						case AJBnet.key.LEFT:
						AJBnet.global('gallery').previous();
						break;
	
						case AJBnet.key.RIGHT:
						AJBnet.global('gallery').next();
						break;

					}
	
				});

		};

	});

});