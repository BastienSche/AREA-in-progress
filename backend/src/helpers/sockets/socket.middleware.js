const { userHavePermission } = require('../auth/auth.helper');
const { TokenModel } = require('../database/database.helper');

function objectContainFields(object, fieldArray) {
    for (var i = 0; i < fieldArray.length; i++) {
        if (!Object.keys(object).includes(fieldArray[i]))
            continue;
        return true;
    }
    return false;
}


module.exports = {

    verifyToken: async function(socket, next) {
        try {
            const token = socket.handshake.auth.token;
            if (!token)
                return socket.disconnect();
            socket.decoded = await TokenModel.decode(token);
        } catch(err) {
            socket.decoded = null;
            socket.emit('remove_session');
        }
        return next();
    },

    verifyCompanyUpdate: async function (socket, data) {
        const type = 'COMPANY';

        if (objectContainFields(data.update, ['name', 'email', 'siren']) 
            && !(await userHavePermission(socket.decoded._id, type, data.company, 'UPDATE_INFORMATION')))
                throw new Error('You don\'t have permission to edit informations associated to the company ' + data.company);

        else if (objectContainFields(data.update, ['address']) 
            && !(await userHavePermission(socket.decoded._id, type, data.company, 'UPDATE_LOCATION')))
                throw new Error('You don\'t have permission to edit the location associated to the company ' + data.company);

        else if (objectContainFields(data.update, ['signatory']) 
            && !(await userHavePermission(socket.decoded._id, type, data.company, 'UPDATE_SIGNATORY')))
                throw new Error('You don\'t have permission to edit the signaotry associated to the company ' + data.company);
    }
}