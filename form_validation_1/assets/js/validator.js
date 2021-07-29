//Validator
function Validator(selector, options) {
    var formRules = {};

    if (!options) {
        options = {};
    }

    var validatorRules = {
        required: function(value) {
            return value ? undefined : 'This feild is required';
        },
        email: function(value) {
            var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            return regex.test(value) ? undefined : 'Please enter a valid Email address';
        },
        min: function(min) {
            return function(value) {
                return value.length >= min ? undefined : `Please enter at least ${min} characters`;
            }
        },
        max: function(max) {
            return function(value) {
                return value.length <= min ? undefined : `Please enter up to ${max} characters`;
            }
        },
        confirm: function(confirm) {
            return function(value) {
                var confirmValue = document.querySelector(confirm).value;
                return value === confirmValue ? undefined : 'This password confirmation does not match';
            }
        }
    }

    //find form-element with selector variable
    var formElement = document.querySelector(selector);
    
    if (formElement) {
        var inputs = formElement.querySelectorAll('[name][rule]');

        //set event: blur, input, change...
        for (var input of inputs) {
            var rules = input.getAttribute('rule').split('|');

            for (var rule of rules) {
                var ruleFunc = validatorRules[rule];

                if (rule.includes(':')) {
                    var ruleInfo = rule.split(':');

                    rule = ruleInfo[0];
                    ruleFunc = validatorRules[rule](ruleInfo[1]);
                }

                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc);
                }
                else {
                    formRules[input.name] = [ruleFunc];
                }
            }

            input.onblur = handleValidate;
            input.oninput = handleClearError;
        }

        //submit behavior
        formElement.onsubmit = function(e) {
            e.preventDefault();

            var isValid = true;

            var inputs = formElement.querySelectorAll('[name][rule]');

            for (var input of inputs) {
                var rules = input.getAttribute('rule').split('|');
    
                for (var rule of rules) {
                    var ruleFunc = validatorRules[rule];
    
                    if (rule.includes(':')) {
                        var ruleInfo = rule.split(':');
    
                        rule = ruleInfo[0];
                        ruleFunc = validatorRules[rule](ruleInfo[1]);
                    }
    
                    if (Array.isArray(formRules[input.name])) {
                        formRules[input.name].push(ruleFunc);
                    }
                    else {
                        formRules[input.name] = [ruleFunc];
                    }
                }
    
                if (handleValidate({ target: input })) {
                    isValid = false;
                }
            }

            if (isValid) {
                if (typeof options.onSubmit === 'function') {

                    var inputs = formElement.querySelectorAll('[name]');
                    var formValues = Array.from(inputs).reduce(function(values, input) {
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
                else {
                    formElement.submit();
                }
            }
        }
    }

    function handleValidate(e) {
        var input = e.target;
        var name = input.name;
        var value;

        switch (input.type) {
            case 'radio':
                var radio = formElement.querySelector(`[name=${name}]:checked`);
                if (radio) {
                    value = radio.value;
                }
                else {
                    value ='';
                }
                break;

            case 'checkbox':
                var checkboxes = formElement.querySelectorAll(`[name=${name}]:checked`);

                if (Array.from(checkboxes)[0]) {
                    value = Array.from(checkboxes)[0].value;
                }
                else {
                    value = '';
                }
                
                break;

            default:
                value = input.value;
        }

        var rules = formRules[name];

        var errorMessage = rules.reduce(function(mess, rule) {
            return mess || rule(value);
        }, undefined)

        if (errorMessage) {
            var formGroup = getParent(input, '.form-group');
            if (formGroup) {
                formGroup.classList.add('invalid');
                
                var formMessage = formGroup.querySelector('.form-message');
                formMessage.innerText = errorMessage;
            }
        }
        
        return errorMessage;
    }

    function handleClearError(e) {
        var formGroup = getParent(e.target, '.form-group');
        if (formGroup) {
            formGroup.classList.remove('invalid');
            
            var formMessage = formGroup.querySelector('.form-message');
            formMessage.innerText = '';
        }
    }

    function getParent(input, selector) {
        while (input.parentElement) {
            if (input.parentElement.matches(selector)) {
                return input.parentElement;
            }

            input = input.parentElement;
        }
    }
}

export default Validator;