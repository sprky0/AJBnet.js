AJBnet.js
=========

AJBnet.js is a javascript framework!  It is intended to provide require.js style loading of dependencies,
provide a way to define classes inside of namespaces for logical grouping, while supporting declaring classes
with standard JS prototypical inheritance.


Done:

	- Loading dependencies
	- Handle loading remote libraries and libraries that don't use the same framework for their declaration
	- Core functions to shortcut missing strict comparisons, eg: isArray, isNull etc.

In Progress:

	- Handle circular / cross dependencies
	- Moar tests

Bugs:

	- A same-named class and package can not exist in the same level, eg:
		/Name1/Name2/Name3 and /Name1/Name2/Name3/Name4
		to declare a class Name3 and a class Name4 that lives in an associated package
		is impossible.  Need to work out a modified storage scheme to resolve.  *doh  (if needed - maybe skip)

	- A circular dependency will not load forever, but does not trigger the callback on the parent module

To Improve:

	- Constructors are redefined each time, by re-running their respective closure.  This fixes a problem with
		prototyped arrays etc, but it breaks JS's instanceof function

Confirmed Browser Support:

	Safari	- 5.1.7
	Chrome	- 23.0.1271.95
	Firefox	- 16.0.2