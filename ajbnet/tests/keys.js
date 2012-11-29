AJBnet.define("Tests/Keys",['vendor/jquery-1.8.3.min.js'],function(){

	this.ready(function(){

		$(document).bind("keyup",function(e){

			var $thing = $("<span>"+e.keyCode+"</span>")
					.css({
						display:"inline-block",
						padding:"5px", margin:"5px",
						border : "1px solid #fa0",
						"background-color" : "#d80",
						color : "#fff"
					})
					.appendTo("BODY");

			setTimeout(function(){

				$thing.fadeOut("fast",function(){
					$(this).remove();
				});

			}, 1000);

		});

	});

});