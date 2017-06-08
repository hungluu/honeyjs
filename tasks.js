function randomEmail(){
	return "king@bots.com";
};
function randomString(){
	return "dafnsjdbfkjdsbf";
}
function toggleCode(){
	jQuery("#secured").toggle();
	jQuery("#code").toggle();
}
(function($){
	$(document).ready(function(){
		// secure sign-in form
		$("#secured").honey('6LeyoyQUAAAAACc4glrm9Vl7dxT2Zi3HFHEPye0p');

		var tut = new Steps();
		tut.bindTo($("#button"));
		tut.add(function(button){
			$("#secured").find("input").each(function(ind, el){
				if(el.type === "email")
					el.value = randomEmail();
				else
					el.value = randomString();
			});

			button.addClass('next').html('Try to submit <br/> (reCaptcha will be triggered)');
		});
		tut.add(function(button){
			button.attr("type", "submit");
			button.removeClass('next').html('Can not submit.<br/> Simulate real human input');
		});
		tut.add(function(button){
			button.attr("type", "button");
			var inputs = $("#secured").find("input");
			inputs[2].value = "";
			inputs[3].value= $.now();
			inputs[0].value = "batman@gmail.com";
			button.addClass('next').html('Try to submit again<br/>without solve reCaptcha');
		});
		tut.add(function(button){
			button.attr("type", "submit");
			button.removeClass('next').html('We have to solve<br/>above reCaptcha.<br/>When reCaptcha solved,<br/>Try to submit again');
		});

		//console.log(pot);
	});
})(jQuery);
