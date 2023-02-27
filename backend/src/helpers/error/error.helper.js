const APIResponseType = {
    Succes: {
        code: 200,
        name: 'Success'
    },
    BadRequest: {
        code: 400,
        name: 'Bad Request'
    },
    Unauthorized: {
        code: 401,
        name: 'Unauthorized'
    },
    NotFound: {
        code: 404,
        name: 'Not Found'
    },
    Forbidden: {
        code: 403,
        name: 'Forbidden'
    },
}

class APIResponseError extends Error {
    constructor(name, code, message) {
        super(message);
        this.name = name;
        this.code = code;
    }

    debug() {
        console.log("ERROR ["+this.name+"]", "("+this.code+")", this.message);
    }
}

class Unauthorized extends APIResponseError {
    constructor(message) {
        const {name, code} = APIResponseType.Unauthorized;
        super(name, code, message);
    }
}

class BadRequest extends APIResponseError {
    constructor(message) {
        const {name, code} = APIResponseType.BadRequest;
        super(name, code, message);
    }
}

class NotFound extends APIResponseError {
    constructor(message) {
        const {name, code} = APIResponseType.NotFound;
        super(name, code, message);
    }
}

class Forbidden extends APIResponseError {
    constructor() {
        const {name, code} = APIResponseType.Forbidden;
        super(name, code, 'You don\'t have access on this resource');
    }
}

module.exports = { APIResponseType, APIResponseError, Unauthorized, BadRequest, NotFound, Forbidden };