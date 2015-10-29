# HoneyJS
[![Build Status](https://travis-ci.org/zudd/HoneyJS.svg?branch=master)](https://travis-ci.org/zudd/HoneyJS) [![Code Climate](https://codeclimate.com/github/zudd/HoneyJS/badges/gpa.svg)](https://codeclimate.com/github/zudd/HoneyJS) [![Test Coverage](https://codeclimate.com/github/zudd/HoneyJS/badges/coverage.svg)](https://codeclimate.com/github/zudd/HoneyJS/coverage)

An open source Javascript Honey Pot implementation, release under MIT license.

**Links : **
 - [HoneyJS on Github](//github.com/zudd/HoneyJS/)
 - [HoneyJS on Npm Registry](//npmjs.com/package/honeyjs)
 - [HoneyJS document](//zudd.github.com/HoneyJS/)
 - **[Live Demo](//zudd.github.com/examples/live.html)**

**Version 1.0.4** : Now accepts Google reCaptcha component as an **additional** security layer. API functions have been changed a lot. Please check our [document](//zudd.github.io/HoneyJS/) for more information. Please check version [1.0.3](//github.com/zudd/HoneyJS/releases/tag/1.0.3) for old api functions

**HoneyJS is available on npm! Install :**

```
npm install honeyjs
```

**Need help?** Leave your issues  [HERE](https://github.com/zudd/HoneyJS/issues)

### Table of contents

 1. [How to use](#how-to-use)
 2. [Configuration](#configuration)
 3. [jQuery plugin](#jquery)
 4. [Google reCaptcha](#google-recaptcha)
 5. [Changelog](#changelog)
 6. [Contribution](#contribution)

## **How to use**

This library makes honey pot implementation so easy with some lines of javascript code.

The simple way

```javascript
var form = document.getElementById('secured');

// secure a single form
Honey.secure(form);
```

Automatically secure all your forms

```javascript
Honey.all();

// secure all but exclude some forms
Honey.except([form1, form2]);

// secure only forms from list
Honey.only([form3, form4]);
```

## **Configuration**

You will need to get an instance of Honey.Pot to configure over this object

```javascript
var pot = Honey.secure(form);

// set acceptable minimum amount of time for form completion
pot.accept(10);

// set a name of empty-required input field
pot.name('empty');
```

## **jQuery**

HoneyJS also supports [jQuery](//jquery.com/) as well. HoneyJS jQuery plugin edition is fully integrated with jQuery functionality.

You can use HoneyJS jQuery plugin like this

```javascript
// secure a form
$('#form').secure();

// secure all forms with class 'secured'
$('.secured').secure();
// or
$.secureOnly('.secured');
```
There a 3 extended jQuery functions

```javascript
$.secureAll(); // same as Honey.all()

$.secureOnly(selector);

$.secureExcept(selector);
```

## **Google reCaptcha**

Since ***1.0.4***, HoneyJS started supporting reCaptcha. You need to load Google reCaptcha api script before HoneyJS, like this :

```html
<script src="//www.google.com/recaptcha/api.js?render=explicit"></script>
<script src="honey.js"></script>
```

How to use

```javascript
// with jQuery
$.captcha($('.secured').secure());

// without jQuery
Honey.captcha(Honey.secure(form));
```
Set an optional global reCaptcha _sitekey_ for reusing

```javascript
// with jQuery
$.captchaKey(sitekey);

// without jQuery
Honey.key(sitekey);
```

Configure over reCaptcha Widget

```javascript
// since 1.0.4 , every Honey.Pot object will have a property name 'captcha' to hold reCaptcha component
// @see https://developers.google.com/recaptcha/docs/display#render_param

// get a Honey.Pot instance with covered by reCaptcha component
pot = Honey.captcha(Honey.secure(form));
// change theme color
pot.captcha.theme = 'dark';
// change size
pot.captcha.size = 'normal';
```
## **Changelog**
1.0.5
 - Fix issue with $.captcha
 - Now HoneyJS will try to render components into a place if possible
1.0.4
 - Update syntax
 - Support reCaptcha
 
[1.0.3](//github.com/zudd/HoneyJS/releases/tag/1.0.3)
 - Support jquery
 - Fixed many issues
 - First stable version

## **Contribution**
Contribution is wellcome :)


Enjoy.