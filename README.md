AJBnet.js
=========

AJBnet.js is a javascript framework!

Done
	- Make something similar to the PHP is_array / is_null family of functions

In Progress:
	- Handling dependencies, something similar to require.js

Future:
	- Handle loading remote libraries and libraries that don't use the same framework for declarations



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
		- when the number of loaded libs matches the total number of libs, time to run callbacks!
		- traverse the map and push closures and names to the stack by depth, trigger load

	