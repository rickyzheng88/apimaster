class modelError extends Error {
    constructor(status, error = { name: null }) {
        super();
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, modelError)
        }

        const errorStorage = createErrorStorage();
        const errorRegister = errorStorage.get(status);
        
        this.name = "modelError";
        this.status = status;
        this.code = errorRegister.code;
        this.message = errorRegister.message;
        this.errorReason = extractErrorReason(error);
        
    }
}

const createErrorStorage = () => {
    const errorStorage = new Map();
        errorStorage.set("RESOURCE_NOT_RETRIEVED", { 
            code: 400, 
            message: "Could not retrieve any resource, something went wrong with params format or database connection"
        });
        errorStorage.set("RESOURCE_NOT_FOUND", {
            code: 404,
            message: "Could not found any resource with given params"
        });
        errorStorage.set("RESOURCE_NOT_CREATED", {
            code: 400,
            message: "Could not create resource, something went wrong with params format or database connection"
        });
        errorStorage.set("RESOURCE_NOT_UPDATED", {
            code: 400,
            message: "Could not update resource, something went wrong with params format or database connection"
        });
        errorStorage.set("RESOURCE_NOT_DELETED", {
            code: 400,
            message: "Could not delete resource, something went wrong with params format or database connection"
        });

    return errorStorage;
}

const extractErrorReason = (error) => {
    const reasonStatus = new Map();
    reasonStatus.set("CastError", "CAST_VALUE_FAILED");
    reasonStatus.set("MongoError", "DUPLICATED_KEY");
    reasonStatus.set("ValidationError", "VALIDATION_FAILED");

    let errorReason = {
        reason: error.name ? reasonStatus.get(error.name) : null,
        value: error.value || error.keyValue,
        path_kind: pathKindObj(error)
    }
    
    return errorReason;
}

const pathKindObj = (error) => {
    let obj = {};

    if (error.errors) {
        Object.values(error.errors).forEach((value) => {
            obj[value.path] = value.kind;
        });
    } else {
        obj[error.path] = error.kind;
    }
    
    return obj;
}

module.exports = modelError;