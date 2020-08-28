const userModel = require('../models/userModel');
const modelError = require('../utils/errors/modelError');
const userError = require('../utils/errors/userError');
const sendEmail = require('../utils/sendEmail');
const customError = require('../utils/errors/customError');

// @desc    Get all users
// @route   GET /api/v1/auth/users
// @access  Private/admin
exports.getUsers = (req, res, next) => {
    try {
        res.status(200)
        .json(res.advancedResults);
    } catch (err) {
        next(new modelError("RESOURCE_NOT_RETRIEVED"));
    }
}

// @desc    Get single user
// @route   GET /api/v1/auth/users/:id
// @access  Private/admin
exports.getSingleUser = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.params.id);

        if (!user) {
            return next(new modelError("RESOURCE_NOT_FOUND"));
        }

        res.status(200)
        .json({
            success: true,
            data: user
        });
    } catch (err) {
        next(new modelError("RESOURCE_NOT_RETRIEVED"));
    }
}

// @desc    Create user
// @route   POST /api/v1/auth/users
// @access  Private/admin
exports.createUser = async (req, res, next) => {
    try {
        const user = await userModel.create(req.body);

        res.status(200)
        .json({
            success: true,
            data: user
        });
    } catch (err) {
        next(new modelError("RESOURCE_NOT_RETRIEVED"));
    }
}

// @desc    update user info
// @route   PUT /api/v1/auth/users/:id
// @access  Private/admin
exports.updateUser = async (req, res, next) => {
    try {
        let user = {};

        if (req.body.password) {
            user = await userModel.findById(req.params.id).select('+password');
            user.password = req.body.password;
            await user.save();
        } else {
            user = await userModel.findByIdAndUpdate(req.params.id, req.body, {
                runValidators: true,
                new: true
            });
        }
        
        res.status(200)
        .json({
            success: true,
            data: user
        })
    } catch (err) {
        console.log(err);
        next(new modelError("RESOURCE_NOT_UPDATED"));
    }
}

// @desc    delete user
// @route   DELETE /api/v1/auth/users/:id
// @access  Private/admin
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await userModel.findByIdAndDelete(req.params.id);

        res.status(200)
        .json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(new modelError("RESOURCE_NOT_RETRIEVED"));
    }
}