AJBnet.define('Gallery/Main',['JQuery','Gallery/Gallery'],function(){

	this.ready(function(){

		// maintain reference to AJBnet
		var that = this;

		var $view = $("<div class='gallery_view' id='gallery_viewer'/>").appendTo("body"),
			$background = $("<div class='gallery_background'/>")
				.appendTo("body")
				.bind("click",function(e){
					$background.remove();
					$view.remove();
					that.global('gallery').unload();
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