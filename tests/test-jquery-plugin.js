(function($){
	$(document).ready(function(){
		$.captchaKey('6LewvA8TAAAAANSyW98_cLJJ1C3vJQqKhhgvx74_');

		var pot1 = $("#1").secure();

		var pots = $(".pots").secure();

		if(typeof QUnit !== "undefined"){
			QUnit.test("Test installing honey pot on Form #1", function(assert){
				var form = $("#1"),
					searchMainInput = form.children("input[name=name]"),
					searchTimeInput = form.children("input[name=_time]");
				assert.ok(searchMainInput.length > 0, "set honeyPot main input");
				assert.ok(searchTimeInput.length > 0, "set honeyPot time input");
				assert.ok(pot1.accept(), "set honeyPot starting time is " + pot1.createTime);
				assert.notOk(searchMainInput.is(":visible") || searchTimeInput.is(":visible"), "check inputs' visibility");
			});

			QUnit.test("Test submit function on Form #1", function(assert){
				assert.ok(!pot1.fast(), "No bot detected. Submit function is okay");
			});

			QUnit.test("Test preventing auto-filling bot on Form #1", function(assert){
				var form = $("#1"),
					searchMainInput = form.children("input[name=name]");
				// try to change main input's value
				searchMainInput[0].value = 'haha';
				assert.notOk(pot1.check(), "Simulate bot auto-filling. Done preventing auto-filling bot");
			});

			QUnit.test("Test setting minimum acceptable amount of time for completing Form #1", function(assert){
				pot1.accept(10 * 60); // set minimum time to 10 minutes
				assert.ok(pot1.fast(), "Try setting minimum time to 10 minutes, form submitting disabled.");
			})

			QUnit.test("Test honey pots on other forms when use global secure function", function(assert){
				for(var i = 0, length = pots.length; i < length; i++){
					var form = $(pots[i].form),
						identifier = " on Form #" + (i + 2),
						searchMainInput = form.children("input[name=name]"),
						searchTimeInput = form.children("input[name=_time]");
					assert.ok(searchMainInput.length > 0, "set honeyPot main input" + identifier);
					assert.ok(searchTimeInput.length > 0, "set honeyPot time input" + identifier);
					assert.ok(pots[i].createTime, "set honeyPot" + identifier + " starting time is " + pots[i].createTime);
					assert.notOk(searchMainInput.is(":visible") || searchTimeInput.is(":visible"), "check inputs' visibility" + identifier);
					// try to change main input's value
					searchMainInput[0].value = 'haha';
					assert.notOk(pots[i].check(), "Simulate bot auto-filling. Done preventing auto-filling bot" + identifier);
				}
			});

			QUnit.test("Test triggering reCaptcha render on Form #1", function(assert){
				pot1 = $.captcha(pot1);
				// trigger reCaptcha security layer
				pot1.check();

				var done = assert.async();

				setTimeout(function() {
				    assert.ok( pot1.captcha.innerHTML !== '', "reCaptcha rendered on Form #1" );
				    done();
				}, 500);
			});

			QUnit.test("Test reCaptcha on Form #1", function(assert){
				// reseting tests before
				$("#1").children('[name=name]')[0].value = "";

				assert.notOk(pot1.check(), "Test using reCaptcha to prevent bots");
			});


			QUnit.test("Test reCaptcha on other Forms", function(assert){
				pots = $.captcha(pots);

				for(var i = 0, length = pots.length; i < length; i++){
					var identifier = " on Form #" + (i + 2);
					// trigger reCaptcha security layer
					pots[i].check();
					// reseting tests before
					$(pots[i].form).children("input[name=name]")[0].value = "";

					assert.notOk(pots[i].check(), "Test using reCaptcha to prevent bots " + identifier);
				}
			});
		}
	});
})(jQuery);