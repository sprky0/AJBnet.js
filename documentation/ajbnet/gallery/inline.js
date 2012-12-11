AJBnet.define("Gallery/Inline",["Gallery/Gallery"],function(){
	
	this.ready(function(){

		// maintain reference to AJBnet
		var that = this,
			container = "#gallery_inline_target",
			$view = $("<div class='gallery_inline_view' id='gallery_inline_viewer'/>").appendTo(container),
			$previous = $("<button>").append("previous").appendTo(container),
			$next = $("<button>").append("next").appendTo(container);

		$(container).show();

		$("button",$(container).parent()).remove();

		// $("#gallery_inline_target").parent().find("button").attr("disabled",1);

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

			var g = AJBnet.new("Gallery/Gallery",{container : "#gallery_inline_viewer",images : image_array});

			$view.bind("click",function(){g.next();});
			$next.bind("click",function(){g.next();});
			$previous.bind("click",function(){g.previous();});

		};

	});

});