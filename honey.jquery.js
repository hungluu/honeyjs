/*
|--------------------------------------------------------------------------
| An open source Javascript Honey Pot implementation - JQuery Plugin Edition
|--------------------------------------------------------------------------
|
| @version 1.0.5 - Supporting google reCaptcha
| @author Zudd ( Hung Luu )
| @url https://github.com/zudd/honeyjs
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
 * jQuery HoneyJS Extended functions
 * @external "jQuery"
 * @see {@link http://learn.jquery.com/|jQuery}
 */
/**
 * jQuery HoneyJS Plugin
 * @external "jQuery.fn"
 * @see {@link http://learn.jquery.com/plugins/|jQuery Plugins}
 */
(function($) {
/** @ignore */
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
	 */
	input : function(name){
		return $('<input/>', {
			name : name
		}).css({
			display : 'none',
			visibility : 'hidden'
		});
	},
	/**
	 * A dummy function to detect integer for config time(seconds)
	 * @param {mixed} value
	 * @return {boolean}
	 */
	isInt : function(value){
		if(isNaN(value))
			return false;
		var x = parseFloat(value);
		return (x | 0) === x;
	},
	/**
	 * Honey Pot object
	 *
	 * Managing securities on a Form
	 *
	 * @constructor
	 * @param {Element} Form jQuery, current secured form
	 * @ignore
	 */
	Pot : function(Form){
		/**
		 * Current secured form
		 * @type {Element}
		 */
		this.form = Form;
		/**
		 * A place holder to render all HoneyJS componenents into one place inside form
		 * If an element with class 'honeyjs' can not be found inside form, components will be rendered into form directly
		 * @since 1.0.5
		 * @type {HTMLElement}
		 */
		this.holder = Form;
		var findHolders = Form.children('.honeyjs');
		if(findHolders.length > 0)
			this.holder = $(findHolders[0]);
		/**
		 * An input Form to prevent auto-filling bots with default name is 'name'
		 * *TO BE checked on server side lately ( optional - in case attacker has disabled javascript )
		 * @private
		 * @type {Element}
		 */
		this.input = Honey.input('name').appendTo(this.holder);
		/**
		 * An input with name '_time'
		 * *TO BE checked on server side lately ( optional - in case attacker has disabled javascript )
		 * @private
		 * @type {HTMLInputElement}
		 */
		this.time = Honey.input('_time').appendTo(this.holder);
		/**
		 * Unix timestamp presents form's starting time ( created time )
		 * @private
		 * @type {integer}
		 */
		this.createTime = $.now();
		// Install secured submit functionality on Form
		var that = this;
		Form.submit(function(event){
			if(that.check())
				return true;
			event.preventDefault();
			return false;
		});

		/**
		 * An acceptable amount of time from create time to submitting time
		 * @type {integer}
		 */
		this.acceptableTime = 5;


		/**
		 * reCaptcha component
		 * @type {Honey.ReCaptcha}
		 * @since 1.0.4
		 */
		this.captcha = new Honey.ReCaptcha();
	},
	/**
	 * Honey.Pot 's reCaptcha component
	 * @since 1.0.4
	 * @constructor
	 * @ignore
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
		 * @type {Element}
		 */
		this.holder = null;

		/**
		 * type render options
		 * @see https://developers.google.com/recaptcha/docs/display#render_param
		 * @type {string}
		 */
		this.type = 'image';

		/**
		 * type render options
		 * @see https://developers.google.com/recaptcha/docs/display#render_param
		 * @type {string}
		 */
		this.size = 'normal';

		/**
		 * type render options
		 * @see https://developers.google.com/recaptcha/docs/display#render_param
		 * @type {string}
		 */
		this.theme = 'light';

		/**
		 * Holder for user response
		 * @see https://developers.google.com/recaptcha/docs/display#js_api
		 * @private
		 * @type {string}
		 */
		this.response = null;

		/**
		 * widget id
		 * @private
		 * @type {int}
		 */
		this.id = 0;
	},
	/**
	 * Honey Pot Factory : secure given form
	 * @param {Element} Form
	 * @return Honey.Pot
	 */
	secure : function(Form){
		return new this.Pot(Form);
	},
	/**
	 * Automatically secure all forms inside current document
	 * @return {Honey.Pot[]}
	 */
	all : function(){
		var collection = [];

		$('form').each(function(ind, el) {
			collection.push(Honey.secure($(el)));	
		});

		return collection;
	},
	/**
	 * Automatically secure all included forms
	 * @param {jQuery} included A jQuery collection of included forms
	 * @return {Honey.Pot[]}
	 */
	only : function(included){
		var collection = [];

		included.each(function(ind, el) {
			collection.push(Honey.secure($(el)));
		});

		return collection;
	},
	/**
	 * Automatically secure all forms inside current document except excluded ones
	 * @param {jQuery} excluded A jQuery collection of excluded forms
	 * @return {Honey.Pot[]}
	 */
	except : function(excluded){
		var collection = [],
			// convert Collection to Array
			arrayofExcluded = excluded.toArray();

		$('form').filter(function() {
			return $.inArray(this, arrayofExcluded);
		}).each(function(ind, el) {
			collection.push(Honey.secure($(el)));
		});

		return collection;
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

		return this.gkey;
	},
	/**
	 * Automatically secure a form or a collection of forms included with google reCaptcha
	 * @since 1.0.4
	 * @param {Honey.Pot|Honey.Pot[]} pots
	 * @param {string} key optional key to by-pass global reCaptcha key
	 * @return {Honey.Pot|Honey.Pot[]}
	 */
	captcha : function(pots, key){
		if(pots instanceof Honey.Pot)
			// Hold a google reCaptcha key
			pots.captcha.key(key || Honey.key());
		else $.each(pots, function(ind, pot){
			pot.captcha.key(key || Honey.key());
		});

		return pots;
	}
};
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
		var currentTime = $.now(), captcha = this.captcha;
		if(this.input.val() === '' && !this.fast(currentTime) && captcha.check()) // no more than 5 seconds
		{
			this.time.val(currentTime);
			return true;
		}

		// @since 1.0.4
		// Add a hook to load reCaptcha widget on first fail submiting
		// @see https://developers.google.com/recaptcha/docs/display#render_param
		if(captcha.key() && !captcha.holder){
			captcha.holder = $('<div/>').appendTo(this.holder);
			captcha.id = grecaptcha.render(captcha.holder.get(0), {
				sitekey : captcha.gkey,
				theme : captcha.theme,
				type : captcha.type,
				size : captcha.size,
				callback : function(response){
					captcha.save(response);
				},
				"expired-callback" : function(){
					captcha.reset();
				}
			});
		}

		return false;
	},
	/**
	 * Get or set main input's name
	 * @param string name
	 */
	name : function(name){
		if(typeof name === 'string')
			this.input.name = name;

		return this.input.name;
	},
	/**
	 * Get or set acceptable time
	 * @since 1.0.4
	 * @param int time
	 */
	accept : function(time){
		if(Honey.isInt(time))
			this.acceptableTime = time;

		return this.acceptableTime;
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

		return this.createTime;
	},
	/**
	 * Check if form is submited too fast
	 * @param {integer} now optional, provide submiting time
	 * @return {boolean}
	 */
	fast : function(now){
		now = now || $.now();
		return (now - this.createTime) <= this.acceptableTime;
	}
};
/*
|----------------------------
| Honey Pot ReCaptcha methods
|----------------------------
| @since 1.0.4
*/
Honey.ReCaptcha.prototype = {
	/**
	 * Set current key
	 * <u>before reCaptcha widget rendered</u>
	 * or get current key
	 * @param {string} sitekey optional
	 * @return {string}
	 */
	key : function(sitekey){
		if(sitekey)
			this.gkey = sitekey;

		return this.gkey;
	},
	/**
	 * Save user response
	 * @param {string} response
	 */
	save : function(response){
		this.response = response;
	},
	/**
	 * Check if reCaptcha response is not empty
	 * Only when reCaptcha is used over Honey Pot
	 */
	check : function(){
		if(this.gkey)
			return this.response !== null;
		else
			return true;
	},
	/**
	 * Reset when reCaptcha expired
	 */
	reset : function(){
		if(this.gkey)
			grecaptcha.reset(this.id);
	}
};

/**
 * Secure a jQuery Element or Collection
 * @function external:"jQuery.fn".secure
 */
$.fn.secure = function(){
	if(this.length > 0)
		return this.length === 1 ? Honey.secure($(this[0])) : Honey.only($(this));
};

/**
 * Add a reCaptcha security layer to existing HoneyPots
 * @function external:"jQuery".captcha
 * @param {Honey.Pot|Honey.Pot[]} included honey pot to be secured by reCaptcha
 * @param {string} key optional key to by-pass global reCaptcha key
 * @return {Honey.Pot|Honey.Pot[]}
 */
$.captcha = function(included, key){
	return Honey.captcha(included, key);
};
/**
 * Set or get global reCaptcha sitekey
 * @function external:"jQuery".captchaKey
 * @return {integer}
 */
$.captchaKey = function(sitekey){
	return Honey.key(sitekey);
};
/**
 * Automatically secure all forms inside current document
 * @function external:"jQuery".secureAll
 * @return {Honey.Pot[]}
 */
$.secureAll = function(){
	return Honey.all();
};
/**
 * Automatically secure all included forms
 * @function external:"jQuery".secureOnly
 * @param {jQuery} included A jQuery collection of included forms
 * @return {Honey.Pot[]}
 */
$.secureOnly = function(selector){
	return Honey.only($(selector));
};
/**
 * Automatically secure all forms inside current document except excluded ones
 * @function external:"jQuery".secureExcept
 * @param {jQuery} excluded A jQuery collection of excluded forms
 * @return {Honey.Pot[]}
 */
$.secureExcept = function(selector){
	return Honey.except($(selector));
};
})(jQuery);