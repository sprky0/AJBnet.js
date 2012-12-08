/**
 * Image Gallery
 *
 * Define a gallery that will be populated with many images (ImageProxy)
 */
AJBnet.define("Gallery/Gallery",["Gallery/ImageProxy","JQuery"],function(){

	var Gallery = function(options) {

		AJBnet.extend(this,options);

		$(this.container).css({overflow : "hidden"});

		this.loadSet();

		return this;
	}

	Gallery.prototype.buffer = 1; // 1 before and after current
	Gallery.prototype.infinite = true;
	Gallery.prototype.images = [];
	Gallery.prototype.objects = [];
	Gallery.prototype.current = 0;
	Gallery.prototype.container = "body";

	/**
	 * Initialize the gallery and preload stuff
	 */
	Gallery.prototype.loadSet = function(){

		this.current = 0;

		for(var i = 0; i < this.objects.length; i++)
			this.objects[i].unload();

		this.objects = [];

		for(var i = 0; i < this.images.length; i++)
			this.objects.push( AJBnet.new("Gallery/ImageProxy",{container:this.container,src:this.images[i],delay:true}) );

		this.load();

	}

	Gallery.prototype.load = function(){

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
	Gallery.prototype.getByOffset = function(offset) {

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
	Gallery.prototype.getNext = function() {
	
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
	Gallery.prototype.getPrevious = function() {
	
		if (!this.objects[this.current - 1] && this.infinite !== true)
			return null; // no exist
		else if (!this.objects[this.current - 1] && this.infinite === true)
			return this.objects[this.current.length - 1]; // loop to last
		else
			return this.objects[this.current - 1]; // previous

	}
	
	Gallery.prototype.next = function(){
		if (!this.getNext())
			return;
		this.objects[this.current].hide();
		
		if (!this.objects[this.current + 1])
			this.current = 0;
		else
			this.current++;

		this.load();
	}
	
	Gallery.prototype.previous = function(){
		if (!this.objects[this.current - 1] && this.infinite !== true)
			return;
		this.objects[this.current].hide();

		if (!this.objects[this.current - 1])
			this.current = this.objects.length - 1;
		else
			this.current--;

		this.load();
	}

	Gallery.prototype.unload = function(){
		
		for(var i = 0; i < this.objects.length; i++)
			this.objects[i].unload();

		delete(this);

	}

	return Gallery;

});