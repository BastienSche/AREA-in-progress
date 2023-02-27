const { UserModel } = require('../database/database.helper')


module.exports = {

    getUserData: async function (id) {
        const user = await UserModel.findById(id)
                                    .select({__v: 0, updatedAt: 0, password: 0})
                                    .populate({path: 'widgets', select: {__v: 0, updatedAt: 0}})
                                    .lean()
        if (!user)
            throw new Error(`getUserData: User ${id} not found..`);
        return user;
    }
}