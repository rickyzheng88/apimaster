class UserError extends Error {
    constructor(status, error = { name: null }) {
        super();
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UserError);
        }

        const errorStorage = this.createUserErrorStorage();
        const errorRegister = errorStorage.get(status);
        
        this.name = "UserError";
        this.status = status;
        this.code = errorRegister.code;
        this.message = errorRegister.message;
    }

    createUserErrorStorage() {
        const errorStorage = new Map();
            errorStorage.set("INVALID_CREDENTIALS", { 
                code: 401, 
                message: "sended data are invalid, please try again"
            });
    
        return errorStorage;
    }
};

module.exports = UserError;