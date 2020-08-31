const crypto = require('crypto');
const userModel = require('../models/userModel');
const modelError = require('../utils/errors/modelError');
const userError = require('../utils/errors/userError');
const sendEmail = require('../utils/sendEmail');
const customError = require('../utils/errors/customError');

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

// @desc    Forgot Password
// @route   PUT /api/v1/auth/forgotPassword
// @access  Private
exports.forgotPassword = async(req, res, next) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });

        if (!user) {
            return next(new modelError("RESOURCE_NOT_FOUND"));
        }

        const resetToken = user.getResetPasswordToken();

        await user.save();

        // Create Reset URL
        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

        const message = `You receiving this email to request the reset of password. ${resetUrl}`;

        try {
            await sendEmail({
                email: req.body.email,
                subject: 'Password Reset Token',
                message
            });

            res.status(200).json({
                success: true,
                data: 'email have been send'
            });
        } catch (err) {
            console.log(err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });

            return next(new customError("EMAIL_NOT_SEND", 500, "Email have not been send"));
        }
    } catch (err) {
        return next(new userError("INVALID_CREDENTIALS"));
    }
};

// @desc    Reset Password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async(req, res, next) => {
    // Get the hashed Token
    const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

    const user = await userModel.findOne({ 
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new customError("INVALID_TOKEN", 403, "Please send a valid reset password token"));
    }

    // Save new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
};

// @desc    Update user details
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
exports.updateDetails = async(req, res, next) => {
    try {
        // Delete Password and role field to avoid user updating those fields with this route
        delete req.body.password;
        delete req.body.role;

        const fieldsToUpdate = { ...req.body };

        const user = await userModel.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        res.json({
            success: true,
            data: user
        });
    } catch (err) {
        return next(new modelError("RESOURCE_NOT_UPDATED"));
    }
};

// @desc    Update user Password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
exports.updatePassword = async(req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await userModel.findById(req.user.id).select('+password');

        // Check current password
        const isMatch = await user.matchPassword(currentPassword);

        if (!isMatch) {
            return next(new userError("INVALID_CREDENTIALS"));
        }

        user.password = newPassword;
        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (err) {
        return next(new modelError("RESOURCE_NOT_UPDATED"));
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

// @desc    Log out
// @route   GET /api/v1/auth/logout
// @access  Public
exports.logout = async(req, res, next) => {
    try {
        res.cookie('token', '0000', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true,
        });

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        console.log(err);
        next(new modelError("RESOURCE_NOT_CREATED"));
    }
};