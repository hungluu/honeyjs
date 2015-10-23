# HoneyJS
An open source Javascript Honey Pot implementation

## How to use

This library make honey pot implementation so easy

The simplest way

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
// secure all forms from list
Honey.only([form3, form4]);
```

## Configuration

You will need to get an instance of Honey.Pot to configure over this single object

```javascript
var pot = Honey.secure(form);

// set acceptable minimum amout of time for form completion
pot.time(10);

// set a name of empty-required input field
pot.name('empty-field');
```