# HoneyJS

[![Build Status](https://travis-ci.org/zudd/honeyjs.svg?branch=master)](https://travis-ci.org/zudd/honeyjs)
[![Code Climate](https://codeclimate.com/github/zudd/HoneyJS/badges/gpa.svg)](https://codeclimate.com/github/zudd/HoneyJS)
[![Coverage Status](https://coveralls.io/repos/zudd/honeyjs/badge.svg?branch=dev&service=github)](https://coveralls.io/github/zudd/honeyjs?branch=dev)

An open source Javascript HoneyPot library, release under MIT license.

**Links :** [Github](//github.com/zudd/honeyjs/) - [NPM](//npmjs.com/package/honeyjs) - [Document](//zudd.github.io/honeyjs/1.1.0) - **[Live Demo](//zudd.github.io/honeyjs/)**

![honeyjs image](http://zudd.github.io/honeyjs/favicon.png)

**Version 1.1.x is here!**
- Remake API to be more simple and effective
- Sandbox dependencies for more security
- Add a ForceCaptcha option to make your forms automatically acquire Google reCaptcha on creation
- Well tested 256 specs with [mocha](https://mochajs.org/), [blanket](http://blanketjs.org/) and [istanbul](https://github.com/gotwarlost/istanbul)

**Supports :** [Google reCaptcha](https://www.google.com/recaptcha/intro/index.html) - [jQuery](https://jquery.com/)

Thank to [jsDelivr](https://www.jsdelivr.com/)'s awsomeness, honeyjs can be deliveried from the cloud to your site in miliseconds ( only 1.97KB gzipped ), use this :

```javascript
<script src="https://cdn.jsdelivr.net/honeyjs/1.1.0/honey.min.js"></script>
```

Or bundle with jQuery for convenient DOM selector string and plugin stuff

```javascript
<script src="https://cdn.jsdelivr.net/g/jquery@1.11.3,honeyjs@1.1.0"></script>
```

**Install :**

```bash
npm install honeyjs

// or using bower
brower install honeyjs
```

**Need help?** Please leave your issues [HERE](https://github.com/zudd/honeyjs/issues)

## Table of contents

 1. [How to use](#how-to-use)
 2. [Configuration](#configuration)
 3. [Google reCaptcha](#google-recaptcha)
 4. [Changelog](#changelog)
 5. [Contributors](#contributors)
 6. [Contribution](#contribution)

## **How to use**

This library makes honey pot implementation so easy with some lines of javascript code.

The simple javascript way

```javascript
var form = document.getElementById('#1');

honey(form);
```

Or jQuery style

```javascript
$('#1').honey();

// or
honey('#1');
```

Check [honey](//zudd.github.io/honeyjs/1.1.0/module-honey.html) and [jQuery plugin](//zudd.github.io/honeyjs/1.1.0/external-_jQuery.fn_.html#.honey) on or document for more information.

Automatically secure all your forms

```javascript
honey.all();
```

## **Configuration**

Global configurations

```javascript
honey.config({
	theme : 'dark', // reCaptcha theme
	size  : 'normal' // reCaptcha size
});

// retrive global options
var captchaTheme = honey.config('theme');
```

View our [document](//zudd.github.io/honeyjs/1.1.0/Options.html) for more information

For individually config honeypot(s), you will need to get an instance of [Pot](//zudd.github.io/honeyjs/1.1.0/Pot.html) or [Pots](//zudd.github.io/honeyjs/1.1.0/Pots.html) to configure over these objects

```javascript
var pots = honey(forms);

// set acceptable minimum amount of time for form completion
pots.config({ time : 10 });

// set a name of empty-required input field
pots.name('empty');
```

## **Google reCaptcha**

Since **1.0.4**, honeyjs started supporting reCaptcha. You need to load Google reCaptcha api script before honeyjs, like this :

```html
<script src="//www.google.com/recaptcha/api.js?render=explicit"></script>
<script src="honey.js"></script>
```

How to use

```javascript
honey(forms).captcha('your-site-key');

// with jQuery
$(forms).honey('your-site-key');
```
Check out [captcha](//zudd.github.io/honeyjs/1.1.0/Pot.html#captcha) for more information

Set an optional global reCaptcha _sitekey_ for reusing
```javascript
honey.requireRecaptcha('your-site-key');

// init recaptcha on a form, you don't need to provide a sitekey again
honey(form).captcha();
```

Force all forms to use reCaptcha

```javascript
honey.forceRecaptcha('your-site-key');

// reCaptcha will be acquired automatically without calling .captcha()
honey(form);
```

## **Changelog**

Please view [HISTORY.md](https://github.com/zudd/honeyjs/blob/master/HISTORY.md) file

## **Contributors**

See [contributors](https://github.com/zudd/honeyjs/network)

## **Contribution**

Everyone is welcome :)

Here is some steps :

 1. Make sure you have a [Github](https://github.com/) account and have installed [npm](https://npmjs.com/)
 2. Fork this [repo](https://github.com/zudd/honeyjs), then clone with git@github.com:your-user-name/honeyjs.git
 3. Run ```npm install``` to install all dependencies
 4. Run ```npm test``` to be sure everything is working
 5. Make your changes ( optional write an additional test file if you'are adding somethings and the old test files cannot cover )
 6. Run ```npm test``` again to make sure everything is working, then check ```coverage/lcov-report/index.html``` to make sure coverage is above 95% ( This is a security library and we need it to be as much secure as possible )
 7. Create a [pull request](https://github.com/zudd/honeyjs/compare/) and write a good commit message.

-----

This project is actively maintained. Please feel free to contact me if you need any further assistance.

Enjoy :beers: