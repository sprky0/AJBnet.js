AJBnet.define("Gallery/Inline",["Gallery/Gallery"],function(){
	
	this.ready(function(){

		// maintain reference to AJBnet
		var that = this,
			container = "#gallery_inline_target",
			$view = $("<div class='gallery_inline_view' id='gallery_inline_viewer'/>").appendTo(container),
			$previous = $("<button>").addClass("gallery_inline_view-previous").append("&laquo;").appendTo($view),
			$next = $("<button>").addClass("gallery_inline_view-next").append("&raquo;").appendTo($view);

		$(container).show();

		$("button[class='demo']",$(container).parent()).remove();

		// $("#gallery_inline_target").parent().find("button").attr("disabled",1);

		$.ajax({
			url : "images/test_lib/meta.php",
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

			var g = AJBnet.new("Gallery/Gallery",{container : "#gallery_inline_viewer",images : image_array});

			$view.bind("click",function(e){
				g.next();
			});
			$next.bind("click",function(e){
				e.stopPropagation();
				e.preventDefault();
				g.next();
			});
			$previous.bind("click",function(e){
				e.stopPropagation();
				e.preventDefault();
				g.previous();
			});

		};

	});

});