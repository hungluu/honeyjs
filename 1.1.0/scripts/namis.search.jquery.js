(function($){
	function SAgent(e, classList){
		e = $(e);
		this.e = e;
		this.s = e.find('.search').get(0);
		this.list = e.find(classList.map(function(e){ return '.' + e; }).join(','));

		var that = this;

		function keyEvent(input, caller){
			function ev(){
				if(input.value === ''){
					caller.end();
				}
				else{
					caller.search(input.value.toLowerCase());
				}
			}

			$(input).on('input', ev);
			$(input).keyup(function(e) {
				if (e.keyCode == 8 || e.keyCode == 46) { //backspace and delete key
					ev();
				}
			});
		}

		keyEvent(this.s, this);
	}

	SAgent.prototype.search = function(value){
		this.list.each(function(i, e){
			var contents = e.innerHTML || e.value;
			contents = contents.toLowerCase();
			if(contents.indexOf(value) === -1){
				$(e).hide();
			}
			else{
				$(e).show();
			}
		});
	};

	SAgent.prototype.end = function(){
		this.list.each(function(i, e){
			$(e).show();
		});
	};

	$.fn.search = function(classList){
		return new SAgent(this, classList);
	};

})(jQuery);