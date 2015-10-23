# HoneyJS

An open source Javascript Honey Pot implementation, release under MIT license.

[![Build Status](https://travis-ci.org/zudd/HoneyJS.svg?branch=master)](https://travis-ci.org/zudd/HoneyJS) [![Code Climate](https://codeclimate.com/github/zudd/HoneyJS/badges/gpa.svg)](https://codeclimate.com/github/zudd/HoneyJS) [![Test Coverage](https://codeclimate.com/github/zudd/HoneyJS/badges/coverage.svg)](https://codeclimate.com/github/zudd/HoneyJS/coverage)

## How to use

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

## Configuration

You will need to get an instance of Honey.Pot to configure over this object

```javascript
var pot = Honey.secure(form);

// set acceptable minimum amout of time for form completion
pot.time(10);

// set a name of empty-required input field
pot.name('empty-field');
```

Enjoy.