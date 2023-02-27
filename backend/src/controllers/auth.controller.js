const { Unauthorized, BadRequest, NotFound } = require('../helpers/error/error.helper');
const { TokenModel, UserModel } = require('../helpers/database/database.helper');
const authHelper = require('../helpers/auth/auth.helper');
// const mailerHelper = require('../helpers/mailer/mailer.helper');
const bulkHelper = require('../helpers/database/bulk.helper');
const bcrypt = require('bcryptjs');


 /**
 * @swagger
 *  tags:
 *    name: AuthAPI
 *    description: API for Authentification
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

 /**
 * @swagger
 * components:
 *   schemas:
 *     Session:
 *       type: object
 *       tag: AuthAPI
 *       required:
 *         - accessToken
 *         - refreshToken
 *         - _id
 *       properties:
 *         accessToken:
 *           type: string
 *           format: byte
 *           description: JTW token
 *         refreshToken:
 *           type: string
 *           format: byte
 *           description: Refresh token
 *         _id:
 *           type: string
 *           format: byte
 *           description: User id
 *     LoginRequest:
 *       type: object
 *       tag: AuthAPI
 *       required:
 *         - provider
 *         - email
 *         - password
 *       properties:
 *         provider:
 *           type: string
 *           example: email
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@gmail.com
 *         password:
 *           type: string
 */

module.exports = {
    login: async function (req, res, next) {
        try {
            const { provider, email, password } = req.body;
            var session = null;
            if (!provider)
                throw new BadRequest('provider parameter is require');
            switch(provider) {
                case 'email':
                    session = await authHelper.loginUserWithEmail(email, password);
                    break;
                // case 'google':
                    // break;
                // case 'apple':
                    // break;
                default:
                    throw new Unauthorized('Invalid provider');
            }
            res.status(200).json({
                error: false,
                status: 200,
                session: session
            })
        } catch(err) {
            return next(err);
        }
    },

    refreshToken: async(req, res, next) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken)
                throw new BadRequest('refreshToken parameter is missing');
            
            var token = await TokenModel.findOne({refreshToken: refreshToken})
                                        .select({owner: 1, refreshToken: 1})
                                        .populate({path: 'owner', select: {_id: 1, role: 1, perms: 1}});
            
            if (!token)
                throw new Unauthorized('Refresh token was invalid or expired');

            return res.status(200).json({
                status: 200,
                error: false,
                session: {
                    accessToken: await token.sign(),
                    refreshToken: token.refreshToken,
                    _id: token.owner._id
                }
            });
        } catch(err) {
            return next(err);
        }
    },
    

    forgetPassword: async (req, res, next) => {
        const { email } = req.body;
        try {

            const user = await UserModel.findOne({'emails.address': email})
                                    .select({_id: 1, emails: 1})
                                    .lean();
            if (!user)
                throw new NotFound(`Any user was found with ${email} address`);
            
            // const token = await TokenModel.createModel({_id: user._id});
            // await mailerHelper.sendCfReset(email, token.refreshToken);

            res.json({
                state: 200,
                error: false 
            })
        } catch(err) {
            return next(err);
        }
    },

    resetPassword: async (req, res, next) => {
        const { token , password } = req.body;
        try {
            const userToken = await TokenModel.findOne({refreshToken: token})
                                    .select({_id: 1, owner: 1})
                                    .lean();
            if (!userToken)
                throw new NotFound('This token are invalide or expired..')

            const user = await UserModel.findById(userToken.owner);
            if (!user)
                throw new NotFound(`User ${userToken.owner} not found`);

            const hashedPassword = await new Promise((resolve, reject) => {
                bcrypt.genSalt(10, function (saltError, salt) {
                    if (saltError)
                        reject(saltError);
                    bcrypt.hash(password, salt, function(hashError, hash) {
                        if (hashError)
                            reject(hashError);
                        resolve(hash);
                    })
                });
            });

            await Promise.all([
                UserModel.bulkWrite([
                    bulkHelper.setField({
                        _id: userToken.owner
                    }, {
                        password: hashedPassword
                    })
                ]),
                TokenModel.deleteOne({_id: userToken._id})
            ])

            res.json({
                state: 200,
                error: false
            })
        } catch(err) {
            return next(err);
        }
    },

    loginSpotify: async (req, res, next) => {
        let scopes = "user-modify-playback-state " +
                    "user-read-playback-position " +
                    "user-library-modify " +
                    "user-read-email " +
                    "playlist-modify-private " +
                    "user-top-read " +
                    "ugc-image-upload " +
                    "user-follow-modify " +
                    "user-read-currently-playing " +
                    "user-library-read " +
                    "user-read-private " +
                    "playlist-modify-public " +
                    "playlist-read-private " +
                    "playlist-read-collaborative " +
                    "user-follow-read " +
                    "user-read-playback-state " +
                    "user-read-recently-played"
        res.redirect('https://accounts.spotify.com/authorize?' +
            querystring.stringify({
                response_type: 'code',
                client_id: 'feb77d10c473403dadc8677f481317cc',
                scope: scopes,
                redirect_uri: 'http://localhost:3000/auth/login/oauth/spotify/callback'
        }));
        console.log("OKOK");
    },

    loginSpotifyCallback: async (req, res, next) => {
        var code = req.query.code || null;
      
          var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
              code: code,
              redirect_uri: 'http://localhost:3000/auth/login/oauth/spotify/callback',
              grant_type: 'authorization_code'
            },
            headers: {
              'Authorization': 'Basic ' + (new Buffer('feb77d10c473403dadc8677f481317cc' + ':' + 'cab7439af83b4586950bbb4d43bf802d').toString('base64'))
            },
            json: true
          };
      
          request.post(authOptions, function(error, response, body) {
            var tokenaccess = "Bearer " + body.access_token;
                console.log("TOKEN : " + body.access_token);
                console.log("REFRESH : " + body.refresh_token);
              var access_token = body.access_token,
                  refresh_token = body.refresh_token;
      
              var options = {
                url: 'https://api.spotify.com/v1/me',
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
              };
      
              // use the access token to access the Spotify Web API
              request.get(options, function(error, response, body) {
                console.log(body);
              });
      
              // we can also pass the token to the browser to make requests from there
          });
        res.redirect("/dashboard");
      }
}