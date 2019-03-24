const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateLoginUser(data) {
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';


    if (!validator.isEmail(data.email)) {
        errors.email = 'Please enter a valid email';
    }
    if (validator.isEmpty(data.email)) {
        errors.email = 'Email is required';
    }

    if (validator.isEmpty(data.password)) {
        errors.password = 'Password is required';
    }
    if (!validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = 'Password is Incorrect';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};