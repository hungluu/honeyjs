/*
|--------------------------------------------------------------------------
| An open source Javascript Honey Pot implementation - JQuery Plugin Edition
|--------------------------------------------------------------------------
|
| @version : 1.0.2
| @author  : Zudd
| @url     : https://github.com/zudd/honeyjs,
| @copyright : Hung Luu 2015
| @license : MIT license
|
| THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
| IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
| FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
| AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
| LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
| OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
| SOFTWARE.
*/
(function($) {
var Honey = {
	// a dummy function to detect integer for config time(seconds)
	isInt : function(value){
		var x;
		if (isNaN(value)) {
			return false;
		}
		x = parseFloat(value);
		return (x | 0) === x;
	},
	/*
	|--------------------------------------------------------------------------
	| A Honey Pot for a form
	|--------------------------------------------------------------------------
	|
	| @param : jQuery Object Form
	*/
	Pot : function(Form){
		/**
		 * @var JQuery object
		 *
		 * Current secured form
		 */
		this.form = Form;
		/**
		 * @var JQuery object
		 *
		 * An input element to prevent auto-filling bots
		 * with default name is 'name'
		 * *TO BE checked on server side lately ( optional - in case attacker has disabled javascript )
		 */
		this.input = $('<input/>',{
			name : 'name'
		}).css({
			display : 'none',
			visibility : 'hidden'
		});
		Form.append(this.input);
		/**
		 * @var JQuery object
		 *
		 * an input with name '_time'
		 * *TO BE checked on server side lately ( optional - in case attacker has disabled javascript )
		 */
		this.timeChecker = $('<input/>',{
			name : '_time'
		}).css({
			display : 'none',
			visibility : 'hidden'
		});
		Form.append(this.timeChecker);
		/**
		 * @var int time
		 *
		 * Unix timestamp presents form's starting time ( created time )
		 */
		this.createTime = $.now();
		// install submit functionality
		var that = this;
		Form.submit(function(e){
			if(that.submit())
				return true;
			e.preventDefault();
			return false
		});

		/**
		 * @var int
		 *
		 * An acceptable amount of time
		 * from create time to submitting time */
		this.acceptableTime = 5
	},
	// Honey Pot Factory : secure given form
	// @param : jQuery Object Form
	// @return : Honey.Pot
	secure : function(Form){
		return new this.Pot(Form)
	},
	// automatically secure all forms inside current document
	all : function(){
		var collection = [];

		$('form').each(function(index, el) {
			collection.push(Honey.secure($(el)));	
		});

		return collection
	},
	// Automatically secure all included forms
	// @param : JQuery object included - a jQuery collection of included HTMLFormElement
	// @return : array - a collection of Honey.Pot
	only : function(included){
		var collection = [];

		included.each(function(index, el) {
			collection.push(Honey.secure($(el)));
		});

		return collection
	},
	// Automatically secure all forms inside current document except excluded ones
	// @param : JQuery object excluded - a jQuery collection of excluded HTMLFormElement
	// @return : array - a collection of Honey.Pot
	except : function(excluded){
		var collection = [],
			// convert Collection to Array
			excluded = excluded.toArray();

		$('form').filter(function(index) {
			return $.inArray(this, excluded);
		}).each(function(index, el) {
			collection.push(Honey.secure($(el)));
		});

		return collection
	}
}
/*
|--------------------------
| Honey Pot methods
|--------------------------
|
| @param : HTMLFormElement Form
*/
Honey.Pot.prototype = {
	// allow form to be submitted or not
	submit : function(){
		var currentTime = $.now();
		if(this.input.val() === '' && !this.toofast(currentTime)) // no more than 5 seconds
		{
			this.timeChecker.val(currentTime);
			return true
		}

		return false
	},
	// get or set main input's name
	// @param string name
	name : function(name){
		if(typeof name === 'string')
			this.input.attr('name', name);

		return this.input.name
	},
	// get or set acceptable time
	// @param int time
	time : function(time){
		if(Honey.isInt(time))
			this.acceptableTime = time;

		return this.acceptableTime
	},
	// not acceptable timing
	// bot is too fast
	toofast : function(now){
		now = now || $.now();
		return (now - this.createTime) <= this.acceptableTime
	}
}

// Extends jQuery object
// secure forms in collection
$.fn.secure = function(){
	if(this.length > 0)
		return this.length === 1 ? Honey.secure($(this[0])) : Honey.only($(this));
}
$.secureAll = function(){
	return Honey.all()
}
$.secureOnly = function(selector){
	return Honey.only($(selector))
}
$.secureExcept = function(selector){
	return Honey.except($(selector))
}
})(jQuery);