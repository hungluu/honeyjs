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
		var pot = $("#secured").secure();

		// install reCaptcha
		pot = $.captcha(pot, '6LewvA8TAAAAANSyW98_cLJJ1C3vJQqKhhgvx74_');

		var tut = new Steps();
		tut.bindTo($("#button"));
		tut.add(function(button){
			$("#secured").find("input").each(function(ind, el){
				if(el.type === "email")
					el.value = randomEmail();
				else
					el.value = randomString();
			});

			button.removeClass('btn-warning').addClass('btn-primary').html('Try to submit <br/> (reCaptcha will be triggered)');
		});
		tut.add(function(button){
			button.attr("type", "submit");
			button.removeClass('btn-primary').addClass('btn-success').html('Can not submit.<br/> Simulate real human input');
		});
		tut.add(function(button){
			button.attr("type", "button");
			var inputs = $("#secured").find("input");
			inputs[2].value = "";
			inputs[3].value= $.now();
			inputs[0].value = "batman@gmail.com";
			button.removeClass('btn-success').addClass('btn-primary').html('Try to submit again<br/>without solve reCaptcha');
		});
		tut.add(function(button){
			button.attr("type", "submit");
			button.removeClass('btn-primary').addClass('btn-danger').html('We have to solve<br/>above reCaptcha.<br/>When reCaptcha solved,<br/>Try to submit again');
		});

		//console.log(pot);
	});
})(jQuery);