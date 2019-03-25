const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateRegisterUser(data) {
    let errors = {};
    data.name.firstName = !isEmpty(data.name.firstName) ? data.name.firstName : '';
    data.name.lastName= !isEmpty(data.name.lastName) ? data.name.lastName : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.rePassword = !isEmpty(data.rePassword) ? data.rePassword : '';
    if (!validator.isLength(data.name.firstName, { min: 3, max: 30 })) {
        errors.firstName = 'Name must be between 3 and 30 characters';
    }
    if (validator.isEmpty(data.name.firstName)) {
        errors.firstName = 'Name is required';
    }
    if (validator.isEmpty(data.email)) {
        errors.email = 'Email is required';
    }
    if (!validator.isEmail(data.email)) {
        errors.email = 'Please enter a valid email';
    }
    if (validator.isEmpty(data.password)) {
        errors.password = 'Password is required';
    }
    if (validator.isEmpty(data.rePassword)) {
        errors.rePassword = 'Confirm password is required';
    }
    if (!validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = 'Password must be between 6 and 30 characters';
    }
    if (!validator.equals(data.password, data.rePassword)) {
        errors.rePassword = 'Passwords must match';
    }
    if(!validator.isMobilePhone(data.phone,'en-IN') &&!isEmpty(data.phone) ){
        errors.phone= 'Phone number is not valid';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};