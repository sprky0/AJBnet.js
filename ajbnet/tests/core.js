// @todo require jquery
AJBnet.define("Tests/Core",function(){

	AJBnet.libs.Tests.Core = function(options){
		AJBnet.extend(this,options); // same as forloop overwrite
		return this;
	}

	AJBnet.libs.Tests.Core.prototype.container = "body";
	AJBnet.libs.Tests.Core.prototype.table = null;
	AJBnet.libs.Tests.Core.prototype.tests = [];

	/**
	 * Add a core function test!
	 */
	AJBnet.libs.Tests.Core.prototype.addTest = function(value, function_name, expected){
		this.tests.push({
			core_function : function_name,
			test_value : value,
			expected_result : expected
		});
		return this;
	};

	/**
	 * Format the results nicely!
	 */
	AJBnet.libs.Tests.Core.prototype.showResult = function(funct,param,expected,received,success,message) {

		if (success == true) {
			received = "<span style='color:#0a0'>"+received+"</span>";
			var row_type = "<tr>";
		} else {
			received = "<span style='color:#a00'>"+received+"</span>";
			var row_type = "<tr style='background-color:#f00'>";
		}

		var row = row_type + "<td>" + funct + "</td><td>" + param + "</td><td>" + expected + "</td><td>" + received + "</td><td>" + message + "</td></tr>";

		$(this.table).append(row);

	}

	AJBnet.libs.Tests.Core.prototype.run = function() {

		$(this.container).empty().append("<h1>Test Results</h1>");

		this.table = $("<table>")
			.attr("cellpadding",5)
			.attr("cellspacing",1)
			.attr("border",0)
			.appendTo( this.container );

		var row = $("<tr>").appendTo(this.table);
		
			$("<th>Function</th>").appendTo(row);
			$("<th>Test Value</th>").appendTo(row);
			$("<th>Expected Result</th>").appendTo(row);
			$("<th>Result</th>").appendTo(row);
			$("<th>Notes</th>").appendTo(row);

		for(i in this.tests) {

			if ( typeof AJBnet[this.tests[i].core_function] != "function" )
				throw "AJBnet core doesn't have a function '" + this.tests[i].function_name + "'";

			var result = AJBnet[this.tests[i].core_function](this.tests[i].test_value);
			var success = result === this.tests[i].expected_result;
			var message = "Response was ";

			if (true == success)
				message += " as expected.";
			else
				message += " not as expected!";

			this.showResult(
				this.tests[i].core_function,
				this.tests[i].test_value,
				this.tests[i].expected_result,
				result,
				success,
				message
			);

		}

	}

});