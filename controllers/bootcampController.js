const bootcampModel = require('../models/bootcampModel');
const modelError = require('../utils/errors/modelError');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamp
// @access  Public
exports.getBootcamps = async(req, res, next) => {
    try{
        const bootcamps = await bootcampModel.find();

        res.status(200);
        res.json({ 
            success: true,
            count: bootcamps.length,
            data: bootcamps
        });
    } catch (err) {
        next(new modelError("RESOURCE_NOT_RETRIEVED", err));
    }
    
}

// @desc    Get a specific bootcamp
// @route   GET /api/v1/bootcamp/:id
// @access  Public
exports.getBootcamp = async(req, res, next) => {
    try{
        const bootcamp = await bootcampModel.findById(req.params.id);

        if (!bootcamp) {
            return next(new modelError("RESOURCE_NOT_FOUND", { name: "NotFoundError" }));
        }

        res.status(200);
        res.json({ 
            success: true,
            data: bootcamp
        });
    } catch (err) {
        next(new modelError("RESOURCE_NOT_RETRIEVED", err));
    }

}

// @desc    Create a new bootcamp
// @route   POST /api/v1/bootcamp
// @access  Public
exports.createBootcamp = async(req, res, next) => {
    try{
        let result = await bootcampModel.create(req.body);

        res.status(201);
        res.json({ 
            success: true,
            data: result
        });
    } catch (err) {
        console.log(err);
        next(new modelError("RESOURCE_NOT_CREATED", err));
    }
    
}

// @desc    Update a bootcamp
// @route   UPDATE /api/v1/bootcamp/:id
// @access  Public
exports.updateBootcamp = async(req, res, next) => {
    try{
        let bootcamp = await bootcampModel.findByIdAndUpdate(req.body.id, req.body.update, {
            new: true,
            runValidators: true
        });

        if (!bootcamp) {
            return next(new modelError("RESOURCE_NOT_FOUND", { name: "NotFoundError" }));
        }

        res.status(200);
        res.json({
            success: true,
            data: bootcamp
        });
    } catch (err) {next(new modelError("RESOURCE_NOT_UPDATED", err));
    }
}

// @desc    delete a bootcamp
// @route   DELETE /api/v1/bootcamp
// @access  Public
exports.deleteBootcamp = async(req, res, next) => {
    try{
        const bootcamp = await bootcampModel.findByIdAndDelete(req.body.id);

        if (!bootcamp) {
            return next(new modelError("RESOURCE_NOT_FOUND", { name: "NotFoundError" }));
        }

        res.status(200);
        res.json({ 
            success: true,
            data: `${req.body.id} deleted`
        });
    } catch (err) {
        next(new modelError("RESOURCE_NOT_DELETED", err));
    }
}