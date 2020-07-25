const errorHandler = (err, req, res, next) => {
    res.status(err.code || 500);
    res.json({ 
        success: false, 
        error: {
            name: err.name,
            status: err.status || "INTERNAL_ERROR",
            code: err.code || 500,
            message: err.message || "Server Internal Error",
            errorReason: err.errorReason
        }
        
    });
};

module.exports = errorHandler;