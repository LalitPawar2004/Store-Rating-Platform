const { body } = require('express-validator');

exports.name = body('name').isLength({min:20, max:60}).withMessage('Name must be 20-60 chars');
exports.address = body('address').optional().isLength({max:400}).withMessage('Address max 400 chars');
exports.email = body('email').isEmail().withMessage('Invalid email');
exports.password = body('password').isLength({min:8, max:16}).matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/).withMessage('Password 8-16 chars, 1 uppercase, 1 special');

exports.signup = [exports.name, exports.email, exports.address, exports.password];
exports.userCreate = [exports.name, exports.email, exports.address, exports.password, body('role').isIn(['admin','user','owner'])];
