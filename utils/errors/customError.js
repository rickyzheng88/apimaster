class customError extends Error {
    constructor(status, code, message, error = { name: null }) {
        super(message);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, customError)
        }

        this.name = error.name || "customError";
        this.status = status;
        this.code = code;
        this.message = message;
    }
}

module.exports = customError;