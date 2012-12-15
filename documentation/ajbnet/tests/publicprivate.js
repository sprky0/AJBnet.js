AJBnet.define("Tests/PublicPrivate",function(){
	
	var PublicPrivate = function(){
		return this;
	}
		PublicPrivate.prototype.public = function() {
			return 'public';
		}

		PublicPrivate.prototype.callPrivate = function() {
			return Private();
		}

		PublicPrivate.prototype.callPrivate2 = function() {
			return Private2();
		}


	var Private = function() {
		return 'private';
	}

	function Private2() {
		return 'private2';
	}

	return PublicPrivate;

});