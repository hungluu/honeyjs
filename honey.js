/*
|--------------------------------------------------------------------------
| An open source Javascript Honey Pot implementation
|--------------------------------------------------------------------------
|
| @version 1.0.4 - Supporting google reCaptcha
| @author  Zudd ( Hung Luu )
| @url	 https://github.com/zudd/honeyjs
| @license The MIT License (MIT)
|
| Copyright (c) 2015 Hung Luu
|
| Permission is hereby granted, free of charge, to any person obtaining a copy
| of this software and associated documentation files (the "Software"), to deal
| in the Software without restriction, including without limitation the rights
| to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
| copies of the Software, and to permit persons to whom the Software is
| furnished to do so, subject to the following conditions:
|
| The above copyright notice and this permission notice shall be included in all
| copies or substantial portions of the Software.
|
| THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
| IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
| FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
| AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
| LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
| OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
*/
/**
 * HoneyJS 's global namespace
 * @namespace Honey
 */
var Honey = {
	/**
	 * Hold global Google reCaptcha key
	 * @private
	 * @type {string}
	 */
	gkey : '',
	/**
	 * Generate a new Honey Pot required input (hidden by style) field
	 * @param {string} name
	 * @return {HTMLInputElement}
	 * @private
	 */
	input : function(name){
		var newInput = document.createElement('input');
		// hide new input
		newInput.style.display = 'none';
		newInput.style.visibility = 'hidden';
		newInput.name = name;
		return newInput
	},
	/**
	 * Get current timestamp string
	 * @return {integer}
	 */
	now : function(){
		return (new Date()).getTime()
	},
	/**
	 * A dummy function to detect integer for config time(seconds)
	 * @param {mixed} value
	 * @return {boolean}
	 */
	isInt : function(value){
		var x;
		if (isNaN(value)) {
			return false;
		}
		x = parseFloat(value);
		return (x | 0) === x;
	},
	/**
	 * A dummy function to find an element's index inside array
	 * @param {mixed[]} arr array containing element
	 * @param {mixed} neddle element to be found
	 * @return {integer}
	 */
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
	/**
	 * A dummy function to check if array contains an element
	 * @param {mixed[]} arr array containing element
	 * @param {mixed} neddle element to be found
	 * @return {boolean}
	 */
	contains : function(arr, needle){
		return this.find(arr, needle) !== -1;
	},
	/**
	 * A dummy function to get all forms available
	 * @return {HTMLCollection}
	 */
	forms : function(){
		return document.getElementsByTagName('form');
	},
	/**
	 * An ultility function to disable and event from executing
	 * For disabling forms' submiting when bots found
	 * @param {SubmitEvent} event
	 * @private
	 */
	cancel : function(event){
		event = event || window.event;

		event.cancelBubble = true; // IE 7-
		event.returnValue = false;
		if(event.preventDefault){
			event.preventDefault();
		}

		return false;
	},
	/**
	 * Honey Pot object
	 *
	 * Managing securities on a Form
	 *
	 * @constructor
	 * @param {HTMLFormElement} Form current secured form
	 */
	Pot : function(Form){
		/**
		 * Current secured form
		 * @type {HTMLFormElement}
		 */
		this.form = Form;
		/**
		 * An input Form to prevent auto-filling bots with default name is 'name'
		 * *TO BE checked on server side lately ( optional - in case attacker has disabled javascript )
		 * @private
		 * @type {HTMLInputElement}
		 */
		this.input = Honey.input('name');
		// add to form
		Form.appendChild(this.input);
		/**
		 * An input with name '_time'
		 * *TO BE checked on server side lately ( optional - in case attacker has disabled javascript )
		 * @private
		 * @type {HTMLInputElement}
		 */
		this.time = Honey.input('_time');
		// add to form
		Form.appendChild(this.time);
		/**
		 * Unix timestamp presents form's starting time ( created time )
		 * @type {integer}
		 */
		this.createTime = Honey.now();
		// Install secured submit functionality on Form
		var that = this;
		if(Form.addEventListener)
			Form.addEventListener("submit", function(event){
				if(that.check())
					return true;
				else
					return Honey.cancel(event);
			}, true);
		else
			Form.attachEvent('onsubmit', function(event){
				if(that.check())
					return true;
				else
					return Honey.cancel(event);
			});

		/**
		 * An acceptable amount of time from create time to submitting time
		 * @type {integer}
		 * @private
		 */
		this.acceptableTime = 5;


		/**
		 * reCaptcha component
		 * @type {Honey.ReCaptcha}
		 * @since 1.0.4
		 */
		this.captcha = new Honey.ReCaptcha()
	},
	/**
	 * Honey.Pot 's reCaptcha component
	 * @since 1.0.4
	 * @constructor
	 */
	ReCaptcha : function(){
		/**
		 * Key holder
		 * @private
		 * @type {string}
		 */
		this.gkey = null;

		/**
		 * Div to render reCaptcha widget
		 * @private
		 * @type {HTMLDivElement}
		 */
		this.holder = null;

		/**
		 * type render options
		 * @see {@link https://developers.google.com/recaptcha/docs/display#render_param|reCaptcha render parameters}
		 * @type {string}
		 */
		this.type = 'image';

		/**
		 * type render options
		 * @see {@link https://developers.google.com/recaptcha/docs/display#render_param|reCaptcha render parameters}
		 * @type {string}
		 */
		this.size = 'normal';

		/**
		 * type render options
		 * @see {@link https://developers.google.com/recaptcha/docs/display#render_param|reCaptcha render parameters}
		 * @type {string}
		 */
		this.theme = 'light';

		/**
		 * Holder for user response
		 * @see {@link https://developers.google.com/recaptcha/docs/display#js_api|reCaptcha javascript api}
		 * @private
		 * @type {string}
		 */
		this.response = null;

		/**
		 * widget id
		 * @private
		 * @type {int}
		 */
		this.id = 0
	},
	/**
	 * Honey Pot Factory : secure given form
	 * @param {HTMLFormElement} Form
	 * @return Honey.Pot
	 */
	secure : function(Form){
		return new this.Pot(Form)
	},
	/**
	 * Automatically secure all forms inside current document
	 * @return {Honey.Pot[]}
	 */
	all : function(){
		var searchForms = this.forms(),
			collection = [];

		for(var i = 0, length = searchForms.length; i < length; i++){
			collection.push(this.secure(searchForms[i]))
		}

		return collection
	},
	/**
	 * Automatically secure all included forms
	 * @param {HTMLFormElement[]|HTMLCollection} included A collection of included HTMLFormElement
	 * @return {Honey.Pot[]}
	 */
	only : function(included){
		var searchForms = this.forms(),
			collection = [];

		included = included || [];

		if(included.length > 0)
			for(var i = 0, length = searchForms.length; i < length; i++){
				if(this.contains(included, searchForms[i]))
					collection.push(this.secure(searchForms[i]))
			}

		return collection
	},
	/**
	 * Automatically secure all forms inside current document except excluded ones
	 * @param {HTMLFormElement[]|HTMLCollection} excluded Optional, a collection of excluded HTMLFormElement
	 * @return {Honey.Pot[]}
	 */
	except : function(excluded){
		excluded = excluded || [];

		if(excluded.length > 0){
			var searchForms = this.forms(),
				collection = [];

			for(var i = 0, length = searchForms.length; i < length; i++){
				if(!this.contains(excluded, searchForms[i]))
					collection.push(this.secure(searchForms[i]))
			}

			return collection
		}
		else
			return this.all()
	},
	/*
	|--------------------------
	| Recaptcha methods
	|--------------------------
	| @since 1.0.4
	*/
	/**
	 * Get or set current global reCaptcha sitekey
	 * @param {string} sitekey optional, a reCaptcha sitekey
	 * @return {string}
	 */
	key : function(sitekey){
		if(sitekey)
			this.gkey = sitekey;

		return this.gkey
	},
	/**
	 * Add a reCaptcha security layer to existing HoneyPots
	 * @since 1.0.4
	 * @param {Honey.Pot|Honey.Pot[]} pots
	 * @param {string} key optional key to by-pass global reCaptcha key
	 * @return {Honey.Pot|Honey.Pot[]}
	 */
	captcha : function(pots, key){
		if(pots instanceof Honey.Pot){
			// Hold a google reCaptcha key
			pots.captcha.key(key || Honey.key());
		}
		else for(var i = 0, length = pots.length; i < length; i++){
			// Hold a google reCaptcha key
			pots[i].captcha.key(key || Honey.key());
		}

		return pots
	}
}
/*
|--------------------------
| Honey Pot methods
|--------------------------
*/
Honey.Pot.prototype = {
	/**
	 * Handling form submiting
	 * @return {boolean}
	 */
	check : function(){
		var currentTime = Honey.now(), captcha = this.captcha;
		if(this.input.value === '' && !this.fast(currentTime) && captcha.check()) // no more than 5 seconds
		{
			this.time.value = currentTime;
			return true
		}

		// @since 1.0.4
		// Add a hook to load reCaptcha widget on first fail submiting
		// @see {@link https://developers.google.com/recaptcha/docs/display#render_param|reCaptcha render parameters}
		if(captcha.key() && !captcha.holder){
			captcha.holder = document.createElement('div');
			this.form.appendChild(captcha.holder);
			captcha.id = grecaptcha.render(captcha.holder, {
				sitekey : captcha.gkey,
				theme : captcha.theme,
				type : captcha.type,
				size : captcha.size,
				callback : function(response){
					captcha.save(response)
				},
				"expired-callback" : function(){
					captcha.reset()
				}
			})
		}

		return false
	},
	/**
	 * Get or set main input's name
	 * @param {string} name
	 */
	name : function(name){
		if(typeof name === 'string')
			this.input.name = name;

		return this.input.name
	},
	/**
	 * Get or set acceptable time
	 * @since 1.0.4
	 * @param {integer} time
	 */
	accept : function(time){
		if(Honey.isInt(time))
			this.acceptableTime = time;

		return this.acceptableTime
	},
	/**
	 * Get form create time
	 * <b>or set form current time to _time input</b>
	 * @since 1.0.4
	 * @param {integer} timestamp optional, to be set to _time value
	 * @return {integer}
	 */
	time : function(timestamp){
		if(timestamp)
			this.time.value = timestamp;

		return this.createTime
	},
	/**
	 * Check if form is submited too fast
	 * @param {integer} now optional, provide submiting time
	 * @return {boolean}
	 */
	fast : function(now){
		now = now || Honey.now();
		return (now - this.createTime) <= this.acceptableTime
	}
}
/*
|----------------------------
| Honey Pot ReCaptcha methods
|----------------------------
| @since 1.0.4
*/
Honey.ReCaptcha.prototype = {
	/**
	 * Set current sitekey
	 * <u>before reCaptcha widget rendered</u>
	 * or get current sitekey
	 * @param {string} sitekey optional
	 * @return {string}
	 */
	key : function(sitekey){
		if(sitekey)
			this.gkey = sitekey;

		return this.gkey
	},
	/**
	 * Save user response
	 * @param {string} response
	 * @private
	 */
	save : function(response){
		this.response = response
	},
	/**
	 * Check if reCaptcha response is not empty
	 * Only when reCaptcha is used over Honey Pot
	 */
	check : function(){
		if(this.gkey)
			return this.response !== null;
		else
			return true
	},
	/**
	 * Reset when reCaptcha expired
	 * @private
	 */
	reset : function(){
		if(this.gkey)
			grecaptcha.reset(this.id);
	}
}