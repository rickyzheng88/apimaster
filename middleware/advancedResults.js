const advancedResults = (model, populate) => async (req, res, next) => {
    let query;

    let reqQuery = { ...req.query };
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Removing Select field
    removeFields.forEach(field => delete reqQuery[field]);

    // parsing advance filter
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // set database find function with params to query
    query = model.find(JSON.parse(queryStr));

    // check for advance field select
    if (req.query.select) {
        const fields = req.query.select.split(",").join(" ");
        query = query.select(fields);
    }

    if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();
    
    query = query.skip(startIndex).limit(limit);

    // populating query
    if (populate) {
        query = query.populate(populate);
    }

    // searching for bootcamps
    const results = await query;

    if (!results) {
        next(new modelError("RESOURCE_NOT_FOUND", { name: "NotFoundError" }));
    }

    // Setting pagination info to response
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    } 
    
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results
    }

    next();
};

module.exports = advancedResults;