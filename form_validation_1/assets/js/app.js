import Validator from '../js/validator.js';


Validator('#form-1', {
    onSubmit: function(data) {
        console.log(data);
    }
});