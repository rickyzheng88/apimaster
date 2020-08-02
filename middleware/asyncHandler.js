const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        if (!err.name === "modelError") {
            console.log(err);
        } else {
            next(err);
        }
    });
}

module.exports = asyncHandler;