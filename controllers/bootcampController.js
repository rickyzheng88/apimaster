// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamp
// @access  Public
exports.getBootcamps = (req, res, next) => {
    res.status(200);
    res.json({ 
        success: true,
        msg: "Getting Bootcamp api"
    });
}

// @desc    Get a specific bootcamp
// @route   GET /api/v1/bootcamp/:id
// @access  Public
exports.getBootcamp = (req, res, next) => {
    let id = req.params.id;

    res.status(200);
    res.json({ 
        success: true,
        msg: `Getting Bootcamp api id: ${id}`
    });
}

// @desc    Create a new bootcamp
// @route   POST /api/v1/bootcamp
// @access  Public
exports.createBootcamp = (req, res, next) => {
    res.status(201);
    res.json({ 
        success: true,
        msg: "Posting Bootcamp api, new data created"
    });
}

// @desc    Update a bootcamp
// @route   UPDATE /api/v1/bootcamp/:id
// @access  Public
exports.updateBootcamp = (req, res, next) => {
    let id = req.params.id;

    res.status(200);
    res.json({ 
        success: true,
        msg: `updating bootcamp api data, data: ${id}`
    });
}

// @desc    delete a bootcamp
// @route   DELETE /api/v1/bootcamp
// @access  Public
exports.deleteBootcamp = (req, res, next) => {
    res.status(200);
    res.json({ 
        success: true,
        msg: "Deleting bootcamp api data"
    });
}