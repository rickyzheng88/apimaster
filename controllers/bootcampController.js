const bootcampModel = require('../models/bootcampModel');
const modelError = require('../utils/errors/modelError');
const geocoder = require('../utils/geocoder');
const colors = require('colors');
const path = require('path');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamp
// @access  Public
exports.getBootcamps = async(req, res, next) => {
    try{
        res.status(200);
        res.json(res.advancedResults);
    } catch (err) {
        console.log(err, colors.red);
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
        const bootcamp = await bootcampModel.findById(req.body.id);

        if (!bootcamp) {
            return next(new modelError("RESOURCE_NOT_FOUND", { name: "NotFoundError" }));
        }

        bootcamp.remove();

        res.status(200);
        res.json({ 
            success: true,
            data: `${req.body.id} deleted`
        });
    } catch (err) {
        next(new modelError("RESOURCE_NOT_DELETED", err));
    }
};

// @desc    Get a Bootcamp within a Radius
// @route   UPDATE /api/v1/bootcamp/radius/:zipcode/:distance
// @access  Private
exports.getBootcampsInRadius = async(req, res, next) => {
    try{
        // get lat/lon from geocoder
        const { zipcode, distance } = req.params;

        const location = await geocoder.geocode(zipcode);
        let latitude = location[0].latitude;
        let longitude = location[0].longitude;

        // cal radius using radians
        // Divide dist by radius of Earth 
        // Earth Radius = 3.963mi / 6.378km
        const radius = distance / 3963;

        const bootcamps = await bootcampModel.find({
            location: {
                $geoWithin: { $centerSphere: [ [longitude, latitude], radius ] }
            }
        });

        if (!bootcamps) {
            next(new modelError("RESOURCE_NOT_FOUND", { name: "NotFoundError" }));
        }

        res.status(200).json({
            success: true,
            count: bootcamps.length,
            data: bootcamps
        });
    } catch (err) {
        console.log(err);
        next(new modelError("RESOURCE_NOT_RETRIEVED", err));
    }
};

// @desc    Upload photo for bootcamp
// @route   DELETE /api/v1/bootcamp/:id/photo
// @access  Public
exports.bootcampPhotoUpload = async(req, res, next) => {
    try{
        const bootcamp = await bootcampModel.findById(req.params.id);

        if (!bootcamp) {
            return next(new modelError("RESOURCE_NOT_FOUND"));
        }

        if ( !(req.files && req.files.file.mimetype.startsWith('image')) ) {
            return next(new modelError("RESOURCE_NOT_UPLOADED"));
        }

        const file = req.files.file;

        // create custom filename
        if (file.size > process.env.MAX_FILE_UPLOAD) {
            return next(new modelError("UPLOAD_FILE_EXCEED"));
        }

        file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

        file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
            if (err) {
                console.error(err);
                return next(new modelError("RESOURCE_NOT_UPLOADED"));
            }

            await bootcampModel.findByIdAndUpdate(req.params.id, { photo: file.name });

            res.status(200)
            .json({
                success: true,
                data: file.name
            });
        });        
    } catch (err) {
        next(new modelError("RESOURCE_NOT_UPLOADED"));
    }
};