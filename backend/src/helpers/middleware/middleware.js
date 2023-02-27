const { Unauthorized, APIResponseError } = require('../error/error.helper');
const { TokenModel } = require('../database/database.helper');
const { userHavePermission } = require('../auth/auth.helper');
const { MongoServerError } = require('mongodb');

module.exports = {

    requestLogger: async(req, res, next) => {
        console.debug('[API]', req.method, req.url.toString(), req.body);
        return next();
    },


    errorHandler: async(err, req, res, next) => {
        var response = { error: true, name: err.name, code: 500, message: err.message };
    
        switch (true) {
            case err instanceof APIResponseError:
                err.debug();
                response.code = err.code;
                break;
            case err instanceof MongoServerError:
                console.error("ERROR [Database Error] (500)", err);
                response.name = 'Database Error';
                break;
            default:
                console.error("ERROR [Unknown Error] (500)", err);
                response.name = "Unknown Error";
                break;
        }
        return res.status(200).json(response);
    },


    verifyToken: async(req, res, next) => {
        let token = req.headers['x-access-token'] || req.headers['authorization'];

        try {
            if (!!token && token.startsWith('Bearer '))
                token = token.slice(7, token.length);

            if (!token)
                throw new Error();

            const decoded = await TokenModel.decode(token);
            if (!decoded)
                throw new Error();
            req.decoded = decoded;
            return next();
        } catch(err) {
            console.log(err, token)
            if (err.message == "jwt expired")
                return next(new Unauthorized('Your token has expired'));
            return next(new Unauthorized('Your token his invalide'));
        }
    },


    onlyAdminAccess: (errorMessage) => {
        return (req, res, next) => {
            if (req.decoded.role !== 'ADMIN')
                return next(new Unauthorized(errorMessage));
            return next();
        }
    },


    verifyPermission: (type, value) => {
        return async(req, res, next) => {
            try {
                const { id } = req.params;
                if (!(await userHavePermission(req.decoded._id, type, id, value)))
                    throw new Unauthorized('Your don\'t have permission to perform ' + value + ' on ' + type + ' ' + req.params.id);
                return next();
            } catch(err) {
                return next(new Unauthorized(err.message));
            }
        }
    }

}