const userModel = require('../models/userModel');
const modelError = require('../utils/errors/modelError');

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