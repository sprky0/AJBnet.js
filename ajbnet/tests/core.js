// @todo require jquery
AJBnet.define("Tests/Core",['vendor/jquery-1.7.1.min.js'],function(){

	var Core = function(options){
		AJBnet.extend(this,options); // same as forloop overwrite
		return this;
	}

	Core.prototype.container = "body";
	Core.prototype.table = null;
	Core.prototype.tests = [];

	/**
	 * Add a core function test!
	 */
	Core.prototype.addTest = function(value, test, expected, name){

		if ( AJBnet.isFunction(test) ) {
			
			this.tests.push({
				type : "closure",
				test : test,
				name : name,
				test_value : value,
				expected_result : expected
			});

		} else {

			this.tests.push({
				type : "core",
				test : test,
				name : name || test,
				test_value : value,
				expected_result : expected
			});

		}

		return this;
	};

	/**
	 * Format the results nicely!
	 */
	Core.prototype.showResult = function(funct,param,expected,received,success,message) {

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

	Core.prototype.run = function() {

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

			switch( this.tests[i].type ) {

				default:
				case "core":				

					var result, success, message;

					try {

						if ( typeof AJBnet[this.tests[i].test] != "function" )
							throw "AJBnet core doesn't have a function '" + this.tests[i].test + "'";

						result = AJBnet[this.tests[i].test](this.tests[i].test_value);
						success = result === this.tests[i].expected_result;
						message = "Response was ";

						if (true == success)
							message += " as expected.";
						else
							message += " not as expected!";

					} catch(e) {
						
						success = "false";
						message = "<strong>Exception:</strong> " + e;

					}

					this.showResult(
						this.tests[i].name,
						this.tests[i].test_value,
						this.tests[i].expected_result,
						result,
						success,
						message
					);
					
					break;
					
				case "closure":

					if ( typeof this.tests[i].test != "function" )
						throw "Closure (" + ") to test is not a valid function!";
		
					try {

						var result = AJBnet[this.tests[i].test](this.tests[i].test_value);
						var success = result === this.tests[i].expected_result;
						var message = "Response was ";

						if (true == success)
							message += " as expected.";
						else
							message += " not as expected!";

					} catch(e) {
						
						success = "false";
						message = "<strong>Exception:</strong> " + e;

					}

					this.showResult(
						this.tests[i].name,
						this.tests[i].test_value,
						this.tests[i].expected_result,
						result,
						success,
						message
					);

					break;

			}

		}

	}

	AJBnet.libs.Tests.Core = Core;

});