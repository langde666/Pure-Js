import Validator from '../js/validator.js';


var registerForm = new Validator('#form-1');

registerForm.onSubmit = function(formData) {
    console.log(formData);
};