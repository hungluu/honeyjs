(function($){
	$(document).ready(function(){
		var form = Honey.id("1");

		var honeyPot1 = Honey.secure(form);

		var honeyPots = Honey.except([form, Honey.id("not-secured")]);

		if(typeof QUnit !== "undefined"){
			QUnit.test("Install honey pot on Form #1", function(assert){
				var form = $("#1"),
					searchMainInput = form.children("input[name=name]"),
					searchTimeInput = form.children("input[name=_time]");
				assert.ok(searchMainInput.length > 0, "set honeyPot main input");
				assert.ok(searchTimeInput.length > 0, "set honeyPot time input");
				assert.ok(honeyPot1.time(), "set honeyPot starting time is " + honeyPot1.createTime);
				assert.notOk(searchMainInput.is(":visible") || searchTimeInput.is(":visible"), "check inputs' visibility");
			});

			QUnit.test("Test submit function on Form #1", function(assert){
				var form = $("#1"),
					searchMainInput = form.children("input[name=name]"),
					searchTimeInput = form.children("input[name=_time]");
				// try to change main input's value
				assert.ok(!honeyPot1.toofast(Honey.now()) && honeyPot1.submit(), "No bots detected. Submit function is okay");
				searchMainInput[0].value = 'haha';
				assert.notOk(honeyPot1.submit(), "Simulate bot auto-filling. Done preventing auto-filling bot");
			});

			QUnit.test("Test honey pots on other forms when use global secure function", function(assert){
				for(var i = 0, length = honeyPots.length; i < length; i++){
					var form = $(honeyPots[i].form),
						identifier = " on Form #" + (i + 2),
						searchMainInput = form.children("input[name=name]"),
						searchTimeInput = form.children("input[name=_time]");
					assert.ok(searchMainInput.length > 0, "set honeyPot main input" + identifier);
					assert.ok(searchTimeInput.length > 0, "set honeyPot time input" + identifier);
					assert.ok(honeyPots[i].createTime, "set honeyPot" + identifier + " starting time is " + honeyPots[i].createTime);
					assert.notOk(searchMainInput.is(":visible") || searchTimeInput.is(":visible"), "check inputs' visibility" + identifier);
					// try to change main input's value
					searchMainInput[0].value = 'haha';
					assert.notOk(honeyPots[i].submit(), "Simulate bot auto-filling. Done preventing auto-filling bot" + identifier);
				}
			});
		}
	});
})(jQuery);
