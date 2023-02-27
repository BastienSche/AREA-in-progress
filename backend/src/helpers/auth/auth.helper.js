const { UserModel, RolesModel } = require("../database/database.helper");
const { Unauthorized } = require("../error/error.helper");

module.exports = {
    loginUserWithEmail: async(email, password) => {
        const user = await UserModel.findOne({'emails.address': email})
                                    .select({_id: 1, password: 1, role: 1, perms: 1});

        if (!user || !(await user.comparePassword(password)))
            throw new Unauthorized('Your password doesn\'t match');

        const { accessToken, refreshToken } = await user.createToken();
        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
            _id: user._id
        }
    },

    userHavePermission: async(userId, type, target, value) => {
        var entity = null;
        const doc = await RolesModel.findOne({user: userId}).lean();
        switch(type) {
            case 'FACILITY':
                entity = doc.facilities.find(facility => facility._id.toString() == target);
                break;
            case 'COMPANY':
                entity = doc.companies.find(company => company._id.toString() == target);
                break;
            default:
                throw new Error("Invalid permission type");
        }

        return entity && entity.role.permissions.includes(value) ? true : false;
    }
}