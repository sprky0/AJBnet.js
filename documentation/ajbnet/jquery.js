/**
 * jquery loader wrap
 *
 * Abstract the loading of a 3rd party library to make things like upgrades easier across a large codebase.
 * I would say it's silly to load one extra file in the middle, but on a very large scale, this could save time!
 */
AJBnet.define("JQuery",["vendor/jquery-1.8.3.min.js"],function(){

/*

Ok, so this function does not really need to exist since jQuery will be defined as $ in window scope.
This is really just a placeholder for the relationship between the class "JQuery" which has a dependency
on a particular version of JQuery, thus ensuring that by the time class "JQuery" is loaded, and allows it's
dependent classes to execute their callbacks that jquery is defined.

If you ran into a situation where you needed to keep jquery out of window scope, you could do something like
the following, which I would classify as approaching 'batshit insane':

AJBnet.define("FirstJQuery",["vendor/jquery-at-a-particular-version.js"],function(){

	return function instance_of_jquery() {
		if (!AJBnet.global('jquery-at-this-particular-version')) {
			AJBnet.global('jquery-at-this-particular-version', window['$'] );
			delete(window['$']);
		}
		return AJBnet.global('jquery-at-this-particular-version');
	}

});

AJBnet.define("SecondJQuery",["vendor/jquery-at-another-particular-version.js"],function(){

	return function instance_of_jquery() {
		if (!AJBnet.global('jquery-at-another-particular-version')) {
			AJBnet.global('jquery-at-another-particular-version', window['$'] );
			delete(window['$']);
		}
		return AJBnet.global('jquery-at-another-particular-version');
	}

});

This would grab a copy of jquery at that particular version when they are loaded, then you would have to manually
load with the following:

var $1 = AJBnet.new("FirstJQuery");
var $2 = AJBnet.new("SecondJQuery");

Let me say that this is a bad bad idea and no one should ever do this ever.  But if you absolutely needed
to use two different versions of jquery concurrently, there's how.

*/

});