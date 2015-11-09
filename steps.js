var Steps = function(){
	this.current = 0;
	this.list = [];
}
Steps.prototype = {
	next : function(element){
		if(this.current >= this.list.length)
			return false;
		else{
			this.list[this.current](element);
			this.current++;
			return true;
		}
	},
	bindTo : function(element){
		var that = this;
		element.click(function(){
			that.next($(this));
		});
	},
	add : function(callback){
		this.list.push(callback);
	}
}