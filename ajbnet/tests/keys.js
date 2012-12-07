AJBnet.define("Tests/Keys",['vendor/jquery-1.8.3.min.js'],function(){

	this.ready(function(){

		$keytest_wrap = $("<article>").prependTo("#results");

		$("<h1>").append("Test Keys").appendTo($keytest_wrap);
		$("<h2>").append("Focus on window, and type to see keycodes and which are supported").appendTo($keytest_wrap);

		$keytest = $("<section>").addClass("keytest").appendTo($keytest_wrap);

		$(document).bind("keyup",function(e){

			var note = null;
			var css = {
				border : "1px solid #0a0",
				display:"inline-block",
				padding:"5px",
				margin:"5px",
				"background-color" : "#efe",
				color : "#0a0"
			};

			for( var i in AJBnet.key ) {
				
				if (AJBnet.key[i] == e.keyCode) {
					note = "AJBnet.key." + i;
					continue;
				}
				
			}

			if (AJBnet.isNull(note)) {
				css.border = "1px solid #f00";
				css.color = "#f00";
				css["background-color"] = "#edd";
				note = "not in AJBnet.key"
			}

			var $note = $("<span>"+e.keyCode+"<br/><em>" + note + "</em></span>")
					.css(css)
					.appendTo($keytest);

			setTimeout(function(){

				$note.fadeOut("fast",function(){
					$(this).remove();
				});

			}, 1000);

		});

	});

});