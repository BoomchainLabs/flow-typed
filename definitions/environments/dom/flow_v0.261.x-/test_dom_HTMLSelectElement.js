// @flow

var select = document.createElement('select')

// properties
var autocomplete: string = select.autocomplete // valid
var autofocus: boolean = select.autofocus // valid
var disabled: boolean = select.disabled // valid

var form = select.form
// $FlowExpectedError[incompatible-use]
form.action // invalid
if (form) form.action // valid

var required: boolean = select.required // valid
var index: number = select.selectedIndex // valid

// methods
var item = select.item(0)
// $FlowExpectedError[incompatible-use]
item.value // invalid
if (item) item.value // valid
item = select.namedItem('hi')
// $FlowExpectedError[incompatible-use]
item.value // invalid
if (item) item.value // valid

select.setCustomValidity('oh noes') // valid
