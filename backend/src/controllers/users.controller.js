const { BadRequest, NotFound } = require('../helpers/error/error.helper');
const { UserModel, TokenModel } = require('../helpers/database/database.helper');
const bulkHelper = require('../helpers/database/bulk.helper');
// const mailerHelper = require('../helpers/mailer/mailer.helper');

/**
 * @swagger
 *  tags:
 *    name: UsersAPI
 *    description: API for Users
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       tag: UsersAPI
 *       required:
 *         - _id
 *         - name
 *         - emails
 *         - phone
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           format: byte
 *           description: The auto-generated id
 *           example: 6273c1b8e5c24ed497587a93
 *         name:
 *           type: object
 *           required:
 *             - firstName
 *             - lastName
 *           properties:
 *             firstName:
 *               type: string
 *               description: First name
 *               example: John
 *             lastName:
 *               type: string
 *               description: Last name
 *               example: Doe
 *         emails:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - email
 *               - isVerified
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address
 *                 example: john.doe@gmail.com
 *               isVerified:
 *                 type: boolean
 *                 description: Verified email
 *         phone:
 *           type: string
 *           description: Phone number
 *           example: +33612372765
 *         password:
 *           type: string
 *           format: password
 *           description: Encrypted password
 *     Users:
 *       type: array
 *       tag: UsersAPI
 *       items:
 *          $ref: '#/components/schemas/User'
 *     CreateUserRequest:
 *       type: object
 *       tag: UsersAPI
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *       properties:
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@gmail.com
 *         password:
 *           type: string
 */

module.exports = {
    getAll: async function (req, res, next) {
        try {
            const users = await UserModel.find({}).select({__v: 0, updatedAt: 0, password: 0}).lean();
            res.status(200).json({
                error: false,
                status: 200,
                users: users
            });
        } catch(err) {
            return next(err);
        }
    },

    create: async function (req, res, next) {
        try {
            const user = await UserModel.createModel(req.body);
            // await mailerHelper.sendCfEmail(user);
            res.status(201).json({
                error: false,
                status: 201
            });
        } catch(err) {
            return next(err);
        }
    },

    get: async function (req, res, next) {
        const { id } = req.params;
        try {
            if (!id)
                throw new BadRequest('id parameter is require');

            const user = await UserModel.findById(id)
                                        .select({__v: 0, updatedAt: 0, password: 0})
                                        .populate({path: 'widgets', select: {__v: 0, updatedAt: 0}})
                                        .lean();
            if (!user)
                throw new NotFound(`User ${id} not exist`);

            res.status(200).json({
                error: false,
                status: 200,
                user: user
            });
        } catch(err) {
            return next(err);
        }
    },

    delete: async function (req, res, next) {
        const { id } = req.params;
        try {
            if (!id)
                throw new BadRequest('id parameter is require');

            await UserModel.deleteOne({_id: id});
            res.status(200).json({
                error: false,
                status: 200
            });
        } catch(err) {
            return next(err);
        }
    },

    confirmEmail: async function (req, res, next) {
        const { id } = req.params;
        const { email } = req.query;
        try {
            const user = await UserModel.findById(id)
                                        .select({_id: 1, emails: 1})
                                        .lean();

            if (!user.emails.find(emailObj => emailObj.address == email && emailObj.isVerified == false))
                throw new NotFound(`User email ${email} not found or already activated..`);
            
            UserModel.bulkWrite([
                bulkHelper.setAllObjectInArray({
                    user: user._id,
                    'emails.address': email
                }, {
                    'emails.$[email].isVerified': true
                }, [{
                    "email.address": email,
                    "email.isVerified": false
                }])
            ])

            res.redirect(process.env.CLIENT_URL+'/profile')
        } catch(err) {
            return next(err);
        }
    }
}