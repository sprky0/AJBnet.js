/**
 * ImageProxy
 *
 * @todo require jquery
 */
AJBnet.define("Gallery/ImageProxy",function(){

	var ImageProxy = function(options) {

		var that = this;
		this.image = new Image();
		this.image.onload = function(){
			that._loadCallback();
		}

		AJBnet.extend(this,options);

		$(this.image)
			.css("display","none")
			.appendTo(this.container);
	
		this.width = $(this.container).width();
		this.height = $(this.container).height();

		if (this.delay === false)
			this.load();
	
		return this;
	}

	ImageProxy.prototype.autoshow = false;
	ImageProxy.prototype.delay = false;
	ImageProxy.prototype.x = 0;
	ImageProxy.prototype.y = 0;
	ImageProxy.prototype.width = 640;
	ImageProxy.prototype.height = 480;
	ImageProxy.prototype.image = null;
	ImageProxy.prototype.src = null;
	ImageProxy.prototype.container = "body";
	ImageProxy.prototype.loaded = false;
	ImageProxy.prototype.scale = "boxed"; // boxed

	/**
	 * Callback - Image Has Loaded
	 */
	ImageProxy.prototype._loadCallback = function(){
		this.loaded = true;
		this.scaleToContainer();
		this.loadCallback();
	}

	/**
	 * Callback - Image Is About To Be Told To Load
	 */
	ImageProxy.prototype._preloadCallback = function(){
		this.preloadCallback();
	}

	/**
	 * Scale Callback
	 */
	ImageProxy.prototype._scaleCallback = function(){
		this.scaleCallback();
	}

	/**
	 * Prescale Callback
	 */
	ImageProxy.prototype._prescaleCallback = function(){
		this.prescaleCallback();
	}

	/**
	 * Callback Placeholders
	 */
	ImageProxy.prototype.preloadCallback = function(){};
	ImageProxy.prototype.loadCallback = function(){};
	ImageProxy.prototype.prescaleCallback = function(){};
	ImageProxy.prototype.scaleCallback = function(){};

	/**
	 * Trigger Load
	 */
	ImageProxy.prototype.load = function(show){

		if (false === this.loaded) {
	
			$(this.image).css('display','none');
	
			this._preloadCallback();
		
			if (true === show)
				this.autoshow = true;

			this.image.src = this.src;

		} else if (true === this.loaded && true === show) {
			this.show();
		}

		return this;
	}

	/**
	 * Trigger Unload
	 */
	ImageProxy.prototype.unload = function(){
		/*var that = this;
		$(this.image).fadeOut('fast',function(){
			that.image.src = null;
		});
		*/
	}

	ImageProxy.prototype.show = function(){
		$(this.image).fadeIn();	
	}

	ImageProxy.prototype.hide = function(){
		$(this.image).fadeOut();	
	}

	/**
	 * 
	 */
	ImageProxy.prototype.scaleToContainer = function(){

		this.prescaleCallback();

		// boxed
		switch(this.scale) {

			/**
			 * Hard resize the image to the container scale, ignoring aspect ratio
			 */
			default:
			case "force":
				$(this.image)
					.css({
						position:"absolute",
						top: this.x + "px",
						left: this.y + "px"
					})
					.width(this.width)
					.height(this.height);
			break;

			/**
			 * Scale the image maintaining the aspect ratio to fit within the container
			 */
			case "aspect":

				var image_aspect = this.image.naturalHeight / this.image.naturalWidth;
				var container_aspect = this.height / this.width;

				// equal
				if (image_aspect == container_aspect) {

					var width = this.width;
					var height = this.height;

				// "lanscape"
				} else if (image_aspect > container_aspect) {

					var diff_aspect = image_aspect - container_aspect;
					var width = this.width - (this.width * diff_aspect);
					var height = this.height;

					this.x = Math.abs(this.width - width) / 2;
					this.y = 0;

				// "portrait"
				} else {
					
					var diff_aspect = 1 - image_aspect - container_aspect;
					var width = this.width;
					var height = this.height - (this.height * diff_aspect);

					this.x = 0;
					this.y = 0; // (this.height + height) / 2;

				}

				$(this.image)
					.css({
						position:"absolute",
						top: this.y + "px",
						left: this.x + "px"
					})
					.width(width)
					.height(height);
			break;

		}

		if (this.autoshow === true)
			this.show();

		this.scaleCallback();

		return this;
	}
	
	return ImageProxy;

});