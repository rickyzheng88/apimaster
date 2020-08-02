const bootcampModel = require('../models/bootcampModel');
const modelError = require('../utils/errors/modelError');
const geocoder = require('../utils/geocoder');
const colors = require('colors');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamp
// @access  Public
exports.getBootcamps = async(req, res, next) => {
    try{
        let query;

        let reqQuery = { ...req.query };
        const removeFields = ['select', 'sort', 'page', 'limit'];

        // Removing Select field
        removeFields.forEach(field => delete reqQuery[field]);

        // parsing advance filter
        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        // set database find function with params to query
        query = bootcampModel.find(JSON.parse(queryStr)).populate('courses');

        // check for advance field select
        if (req.query.select) {
            const fields = req.query.select.split(",").join(" ");
            query = query.select(fields);
        }

        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            console.log(sortBy);
            query = query.sort(sortBy);
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 25;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await bootcampModel.countDocuments();
        
        query = query.skip(startIndex).limit(limit);

        // searching for bootcamps
        const bootcamps = await query;

        if (!bootcamps) {
            next(new modelError("RESOURCE_NOT_FOUND", { name: "NotFoundError" }));
        }

        // Setting pagination info to response
        const pagination = {};

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            }
        } else if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            }
        }

        res.status(200);
        res.json({ 
            success: true,
            count: bootcamps.length,
            pagination,
            data: bootcamps
        });
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
}

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
}