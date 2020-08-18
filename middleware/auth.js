const jwt = require('jsonwebtoken');
const userError = require('../utils/errors/userError');
const user = require('../models/userModel');

exports.protect = async(req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } 
    
    if (!token) {
        return next(new userError('INVALID_CREDENTIALS'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await user.findById(decoded.id);
        next();
    } catch (err) {
        return next(new userError('INVALID_CREDENTIALS'));
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new userError("INVALID_CREDENTIALS"));
        }

        next();
    }
}