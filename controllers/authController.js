const userModel = require('../models/userModel');
const modelError = require('../utils/errors/modelError');
const userError = require('../utils/errors/userError');

// @desc    Register a User
// @route   GET /api/v1/auth/register
// @access  Public
exports.register = async(req, res, next) => {
    try {
        const { name, email, role, password } = req.body;

        // create User
        const user = await userModel.create({
            name,
            email,
            role, 
            password 
        });

        const token = user.getSignJwtToken()

        res.status(200).json({
            success: true,
            token
        });
    } catch (err) {
        console.log(err);
        next(new modelError("RESOURCE_NOT_CREATED"));
    }
};

// @desc    Login User
// @route   GET /api/v1/auth/login
// @access  Public
exports.login = async(req, res, next) => {
    try {
        const { email, password } = req.body;

        // validate email and password
        if (!email || !password) {
            return next(new userError('INVALID_CREDENTIALS'));
        }

        //check for user
        const user = await userModel.findOne({ email }).select('+password');

        if (!user) {
            return next(new userError('INVALID_CREDENTIALS'));
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return next(new userError('INVALID_CREDENTIALS'));
        }

        const token = user.getSignJwtToken()

        res.status(200).json({
            success: true,
            token
        });
    } catch (err) {
        console.log(err);
        next(new modelError('RESOURCE_NOT_RETRIEVED'));
    }
};