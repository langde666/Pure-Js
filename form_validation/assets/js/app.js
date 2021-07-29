import Validator from '../js/validator.js';


Validator({
    form: '#form-1',
    formGroupSelector: '.form-group',
    errorSelector: '.form-message',
    invalidClassName: 'invalid',
    rules: [
        Validator.isRequired('#fullname'),
        Validator.isRequired('#email'),
        Validator.isRequired('#password'),
        Validator.isRequired('#password_confirmation'),
        Validator.isRequired('#avatar'),
        Validator.isRequired('#local'),
        Validator.isRequired('input[name="gender"]'),
        Validator.isRequired('input[name="attention"]'),
        Validator.isEmail('#email'),
        Validator.minLength('#password', 6),
        Validator.isConfirmed('#password_confirmation', function() {
            return document.querySelector('#form-1 #password').value;
        })
    ],
    onSubmit: function(data) {
        console.log(data);
    }
});
