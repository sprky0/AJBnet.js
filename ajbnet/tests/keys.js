AJBnet.define("Tests/Keys",['vendor/jquery-1.8.3.min.js'],function(){

	this.ready(function(){

		$(document).bind("keyup",function(e){

			var note = null;

			for( var i in AJBnet.key ) {
				
				if (AJBnet.key[i] == e.keyCode) {
					
					note = "AJBnet.key." + i;
					continue;
				}
				
			}

			if (AJBnet.isNull(note))
				note = "not in AJBnet.key"

			var $thing = $("<span>"+e.keyCode+"<br/><em>" + note + "</em></span>")
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