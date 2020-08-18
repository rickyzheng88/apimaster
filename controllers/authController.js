const userModel = require('../models/userModel');
const modelError = require('../utils/errors/modelError');
const userError = require('../utils/errors/userError');
const cookieParse = require('cookie-parse');

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

        sendTokenResponse(user, 200, res);
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

        sendTokenResponse(user, 200, res);
    } catch (err) {
        console.log(err);
        next(new modelError('RESOURCE_NOT_RETRIEVED'));
    }
};

// @desc    Get logged in User
// @route   GET /api/v1/auth/user
// @access  Private
exports.getUser = async(req, res, next) => {
    try {
        const user = await userModel.findById(req.user.id);

        res.json({
            success: true,
            data: user
        });
    } catch (err) {
        return next(new userError("INVALID_CREDENTIALS"));
    }
};

// Get token from model, create cookie then send to browser
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignJwtToken();

    const option = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    res
        .status(statusCode)
        .cookie('token', token, option)
        .json({
            success: true,
            token
        });
};