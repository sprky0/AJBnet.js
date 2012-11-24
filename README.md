AJBnet.js
=========

AJBnet.js is a javascript framework!  It is intended to provide require.js type autoloading of dependencies,
provide a way to define classes inside of namespaces for logical grouping, while supporting declaring classes
with standard JS prototypical inheretance.


Done
	- Core functions to shortcut missing strict comparisons, eg: isArray, isNull etc.
	- Loading dependencies

In Progress:
	- Handle loading remote libraries and libraries that don't use the same framework for declarations
	- Tests

Bugs:
	- A same-named class and package can not exist in the same level, eg:
		/Name1/Name2/Name3 and /Name1/Name2/Name3/Name4
		to declare a class Name3 and a class Name4 that lives in an associated package
		is impossible.  Need to work out a modified storage scheme to resolve.  *doh  (if needed - maybe skip)

	- It is possible to declare a circular dependency that loads forever.  Should be handled by caching loaded classes.
		Should just check for the first level.  A -> A is no good, but I think A -> B -> A should be fine.

Notes:

	Example dependency handling:

		Classes:

			C1 depends C2
			C2 depends C3
			C2 depends C4
			C2 depends C6
			C5 depends C1
			C4 depends C6

		Tree constructed:

			C5 -> C1 -> C2	-> C4 -> C6
							-> C3
							-> C6

		Execution order:

			C6, C4(), (C6 is ok), C4(), C2(), C1(), C5()

	Example Node:

		{
			"class/path" : {
				callback : function() {},
				callbackRun : false,
				srcLoaded : false,

				parent : null,
				dependencies : [], // array of pointers to other

				depth : 0  ????
			}
		}

	- Not sure about traversal for this, it might be easier to have flat map?  Eg make these all siblings and just loop
			nutil its all done?
	
	- Ok here is the deal:
		- make a map
		- on each load complete, check dependencies on that node, and mark the lib as completed in the stack
		- check for dependency matches for loaded libraries and remove those from the stack for each object
		- when the number of remaining dependencies is 0 for a library, trigger the callback
