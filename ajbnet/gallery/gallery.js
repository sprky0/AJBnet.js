/**
 * Image Gallery
 */
AJBnet.define("Gallery/Gallery",["Gallery/Image"],function(){

	/**
	 * Gallery with many images
	 */
	AJBnet.libs.Gallery.Gallery = function(options) {

		AJBnet.extend(this,options);

		$(this.container).css({overflow : "hidden"});

		this.loadSet();

		return this;
	}

	AJBnet.libs.Gallery.Gallery.prototype.buffer = 1; // 1 before and after current
	AJBnet.libs.Gallery.Gallery.prototype.infinite = true;
	AJBnet.libs.Gallery.Gallery.prototype.images = [];
	AJBnet.libs.Gallery.Gallery.prototype.objects = [];
	AJBnet.libs.Gallery.Gallery.prototype.current = 0;
	AJBnet.libs.Gallery.Gallery.prototype.container = "body";

	/**
	 * Initialize the gallery and preload stuff
	 */
	AJBnet.libs.Gallery.Gallery.prototype.loadSet = function(){

		this.current = 0;

		for(var i = 0; i < this.objects.length; i++)
			this.objects[i].unload();

		this.objects = [];

		for(var i = 0; i < this.images.length; i++)
			this.objects.push( AJBnet.new("Gallery/Image",{container:this.container,src:this.images[i],delay:true}) );

		this.load();

	}

	AJBnet.libs.Gallery.Gallery.prototype.load = function(){

		if (!AJBnet.isObject(this.objects[this.current]))
			throw "Couldn't trigger load() on Image at index " + this.current;

		this.objects[this.current].load( true );

		var next = this.getNext(), previous = this.getPrevious();

		if (next && next.loaded != true)
			next.load();

		if (previous && previous.loaded != true)
			prev.load();

	}

	/**
	 * Get an item by its offset from the current item
	 */	
	AJBnet.libs.Gallery.Gallery.prototype.getByOffset = function(offset) {

/*
		if (!this.objects[this.current + offset] && this.infinite !== true)
			return null; // no exist
		else if (!this.objects[this.current + 1] && this.infinite === true)
			return this.objects[0]; // loop to first
		else
			return this.objects[this.current + 1]; // next
*/
		return null;

	}

	/**
	 * Get the next Img object
	 */	
	AJBnet.libs.Gallery.Gallery.prototype.getNext = function() {
	
		if (!this.objects[this.current + 1] && this.infinite !== true)
			return null; // no exist
		else if (!this.objects[this.current + 1] && this.infinite === true)
			return this.objects[0]; // loop to first
		else
			return this.objects[this.current + 1]; // next

	}

	/**
	 * Get the previous Img object
	 */	
	AJBnet.libs.Gallery.Gallery.prototype.getPrevious = function() {
	
		if (!this.objects[this.current - 1] && this.infinite !== true)
			return null; // no exist
		else if (!this.objects[this.current - 1] && this.infinite === true)
			return this.objects[this.current.length - 1]; // loop to last
		else
			return this.objects[this.current - 1]; // previous

	}
	
	AJBnet.libs.Gallery.Gallery.prototype.next = function(){
		if (!this.getNext())
			return;
		this.objects[this.current].hide();
		
		if (!this.objects[this.current + 1])
			this.current = 0;
		else
			this.current++;

		this.load();
	}
	
	AJBnet.libs.Gallery.Gallery.prototype.previous = function(){
		if (!this.objects[this.current - 1] && this.infinite !== true)
			return;
		this.objects[this.current].hide();

		if (!this.objects[this.current - 1])
			this.current = this.objects.length - 1;
		else
			this.current--;

		this.load();
	}

});