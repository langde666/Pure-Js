//Validator
function Validator(options) {

    //list rule.test of rule.selector
    //{ rule.selector1 : [rule.test1, rule.test2, ...], ...}
    //stack of rule.test
    var selectorRules = {};
    
    //find form which has rules
    var formElement = document.querySelector(options.form);

    if (formElement) {

        //submit behavior
        formElement.onsubmit = function(e) {

            var isFormValid = true;
            
            //prevent default behavior
            e.preventDefault();
            
            //loop to validate
            options.rules.forEach(function(rule) {

                //add rule test to list rules of selector || construct
                //stack of rule.test
                if (Array.isArray(selectorRules[rule.selector])) {
                    selectorRules[rule.selector].push(rule.test)
                }
                else {
                    selectorRules[rule.selector] = [rule.test];
                }
    
                //find input which has rule
                var inputElement = formElement.querySelector(rule.selector);   
                
                if (inputElement) {

                    //validate
                    var isInvalid = validate(inputElement, rule);

                    if (isInvalid) {
                        isFormValid = false;
                    }
                }
            })      

            if (isFormValid) {
                //submit with javascript
                if (typeof options.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]');
                    var formValues = Array.from(enableInputs).reduce(function(values, input) {
                        switch (input.type) {
                            case 'radio':
                                if (!values[input.name]) {
                                    values[input.name] ='';
                                }

                                if (input.matches(':checked')) {
                                    values[input.name] = input.value;
                                }

                                break;

                            case 'checkbox':
                                if (!values[input.name]) {
                                    values[input.name] = [];
                                }

                                if (input.matches(':checked')) {
                                    values[input.name].push(input.value);
                                }
                                
                                break;

                            case 'file':
                                values[input.name] = input.files;
                                break;

                            default:
                                values[input.name] = input.value;
                        }

                        return values;
                    }, {});

                    options.onSubmit(formValues);
                }
                //submit default
                else {
                    formElement.submit();
                }
            }
        }

        //blur behavior
        //loop to validate
        options.rules.forEach(function(rule) {

            //add rule test to list rules of selector || construct
            //stack of rule.test
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            }
            else {
                selectorRules[rule.selector] = [rule.test];
            }

            //find input which has rule
            var inputElements = formElement.querySelectorAll(rule.selector);

            if (inputElements) {

                Array.from(inputElements).forEach(function(inputElement) {
                    
                    //blur behavior
                    inputElement.onblur = function() {

                        //validate
                        validate(inputElement, rule);
                    }

                    //change behavior
                    inputElement.onchange = function() {

                        //validate
                        validate(inputElement, rule);
                    }

                    inputElement.oninput = function() {

                        //remove message
                        removeMessage(inputElement);
                    }
                });

                
            }
        })
    }

    //validatefunction
    function validate(inputElement, rule) {
        
        //message
        var errorMessage;

        //find stack of rules of this rule
        var rules = selectorRules[rule.selector];

        //do fisrt validate with stack, get first message not undifined
        for (var i=0; i<rules.length; i++) {
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    var value = formElement.querySelector(rule.selector + ':checked') ?
                            formElement.querySelector(rule.selector + ':checked').value :
                            '';
                    errorMessage = rules[i](value);
                    break;
                default:
                    errorMessage = rules[i](inputElement.value);
            }
          
            if (errorMessage) {
                break;
            }
        }

        if (errorMessage) {

            //send message
            sendMessage(inputElement, errorMessage);
        }
        else {

            //remove message
            removeMessage(inputElement);
        }

        return !!errorMessage;
    }

    //remove message function
    function sendMessage(inputElement, errorMessage) {
        var groupElement = getParent(inputElement, options.formGroupSelector);
        var errorElement = groupElement.querySelector(options.errorSelector);

        groupElement.classList.add(options.invalidClassName);
        errorElement.innerText = errorMessage;

    }

    //remove message function
    function removeMessage(inputElement) {
        var groupElement = getParent(inputElement, options.formGroupSelector);
        var errorElement = groupElement.querySelector(options.errorSelector);

        groupElement.classList.remove(options.invalidClassName);
        errorElement.innerText = '';
    }

    function getParent(inputElement, selector) {
        while (inputElement.parentElement) {
            if (inputElement.parentElement.matches(selector)) {
                return inputElement.parentElement;
            }

            inputElement = inputElement.parentElement;
        }
    }
}

// Required rules
Validator.isRequired = function(selector, message) {
    message = message ? message : 'This feild is required';

    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : message;
        }
    }
}


// Email rules
Validator.isEmail = function(selector, message) {
    message = message ? message : 'Please enter a valid Email address';

    return {
        selector: selector,
        test: function (value) {
            var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            return regex.test(value) ? undefined : message;
        }
    }
}


Validator.minLength = function(selector, min, message) {
    message = message ? message : `Please enter at least ${min} characters`;

    return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined : message;
         }
    }
}

Validator.maxLength = function(selector, max, message) {
    message = message ? message : `Please enter up to ${max} characters`;

    return {
        selector: selector,
        test: function(value) {
            return value.length <= min ? undefined : message;
         }
    }
}

Validator.isConfirmed = function(selector, getConfirmValue, message) {
    message = message ? message : 'This password confirmation does not match';

    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message;
        }
    }
}


export default Validator;