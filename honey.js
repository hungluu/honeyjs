/*
|--------------------------------------------------------------------------
| An open source Javascript Honey Pot implementation
|--------------------------------------------------------------------------
|
| @version : 1.0.3
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
var Honey = {
	// generate a new Honey Pot required input (hidden) field
	// @return HTMLInputForm
	generateInput : function(){
		var newInput = document.createElement('input');
		// hide new input
		newInput.style['display'] = 'none';
		newInput.style['visibility'] = 'hidden';
		return newInput
	},
	// get current timestamp
	// @return int
	now : function(){
		return (new Date()).getTime()
	},
	// a dummy function to detect integer for config time(seconds)
	isInt : function(value){
		var x;
		if (isNaN(value)) {
			return false;
		}
		x = parseFloat(value);
		return (x | 0) === x;
	},
	// a dummy function to find Form's index inside array
	// @return int
	find : function(arr, needle){
		if(Array.prototype.indexOf){
			return arr.indexOf(needle)
		}
		else{
			for(var x = 0, length = arr.length; x < length; x++){
				if(arr[x] === needle)
					return x
			}

			return -1
		}
	},
	// a dummy function to check if an array contains an Form
	// @return bool
	contains : function(arr, needle){
		return this.find(arr, needle) !== -1;
	},
	/* DUMMY DOM SELECTORS */
	// a dummy function
	// return Form by id
	// @return HTMLForm
	id : function(FormId){
		return document.getElementsById(FormId);
	},
	// a dummy function
	// return Forms by tag name
	// @return array
	tag : function(tagName){
		return document.getElementsByTagName(tagName);
	},
	/*
	|--------------------------------------------------------------------------
	| A Honey Pot for a form
	|--------------------------------------------------------------------------
	|
	| @param : HTMLFormForm Form
	*/
	Pot : function(Form){
		/**
		 * @var HTMLFormForm form
		 *
		 * current secured form
		 */
		this.form = Form;
		/**
		 * @var HTMLInputForm input
		 *
		 * An input Form to prevent auto-filling bots
		 * with default name is 'name'
		 * *TO BE checked on server side lately ( optional - in case attacker has disabled javascript )
		 */
		this.input = Honey.generateInput();
		this.input.name = 'name';
		this.form.appendChild(this.input);
		/**
		 * @var HTMLInputForm input
		 *
		 * an input with name '_time'
		 * *TO BE checked on server side lately ( optional - in case attacker has disabled javascript )
		 */
		this.timeChecker = Honey.generateInput();
		this.timeChecker.name = '_time';
		this.form.appendChild(this.timeChecker);
		/**
		 * @var int time
		 *
		 * Unix timestamp presents form's starting time ( created time )
		 */
		this.createTime = Honey.now();
		// install submit functionality
		var that = this;
		if(Form.addEventListener)
		    Form.addEventListener("submit", function(e){
		    	if(that.submit())
		    		return true;
		    	e = e || window.event;
		        e.cancelBubble = true;
		        e.returnValue = false;
		        if(e.preventDefault){
		            e.preventDefault();
		        }
		        return false
		    }, true);
		else
		    Form.attachEvent('onsubmit', function(e){
		    	if(that.submit())
		    		return true;
		    	e = e || window.event;
		        e.cancelBubble = true;
		        e.returnValue = false;
		        if(e.preventDefault){
		            e.preventDefault();
		        }
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
	// @param : HTMLFormForm Form
	// @return : Honey.Pot
	secure : function(Form){
		return new this.Pot(Form)
	},
	// automatically secure all forms inside current document
	all : function(){
		var searchForms = this.tag('form'),
			collection = [];

		for(var i = 0, length = searchForms.length; i < length; i++){
			collection.push(this.secure(searchForms[i]))
		}

		return collection
	},
	// Automatically secure all included forms
	// @param : Array included - a collection of included HTMLFormForm
	// @return : array - a collection of Honey.Pot
	only : function(included){
		var searchForms = this.tag('form'),
			collection = [];

		included = included || [];

		if(included.length > 0)
			for(var i = 0, length = searchForms.length; i < length; i++){
				if(this.contains(included, searchForms[i]))
					collection.push(this.secure(searchForms[i]))
			}

		return collection
	},
	// Automatically secure all forms inside current document except excluded ones
	// @param : optional Array excluded - a collection of excluded HTMLFormForm
	// @return : array - a collection of Honey.Pot
	except : function(excluded){
		excluded = excluded || [];

		if(excluded.length > 0){
			var searchForms = this.tag('form'),
				collection = [];

			for(var i = 0, length = searchForms.length; i < length; i++){
				if(!this.contains(excluded, searchForms[i]))
					collection.push(this.secure(searchForms[i]))
			}

			return collection
		}
		else
			return this.all();
	}
}
/*
|--------------------------
| Honey Pot methods
|--------------------------
|
| @param : HTMLFormForm Form
*/
Honey.Pot.prototype = {
	// allow form to be submitted or not
	submit : function(){
		var currentTime = Honey.now();
		if(this.input.value == '' && !this.toofast(currentTime)) // no more than 5 seconds
		{
			this.timeChecker.value = currentTime;
			return true
		}

		return false
	},
	// get or set main input's name
	// @param string name
	name : function(name){
		if(typeof name === 'string')
			this.input.name = name;

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
		now = now || Honey.now();
		return (now - this.createTime) <= this.acceptableTime
	}
}