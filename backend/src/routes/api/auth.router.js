const express = require('express');
const authRouter = express.Router();



// const middleware = require('../../helpers/middleware/middleware');
const authController = require('../../controllers/auth.controller');

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Create User Session
 *     tags: [AuthAPI]
 *     requestBody:
 *       description: Login fields
 *       required: true      
 *       content: 
 *         application/json:
 *           schema:
 *             $ref:  '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 session:
 *                   $ref: '#/components/schemas/Session'
 */
authRouter.post('/login', authController.login);

/**
 * @swagger
 * /auth/refreshToken:
 *   post:
 *     summary: Refresh User Session
 *     tags: [AuthAPI]
 *     requestBody:
 *       description: Refresh Token
 *       required: true      
 *       content: 
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 format: byte
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 session:
 *                   $ref: '#/components/schemas/Session'
 */
authRouter.post('/refreshToken', authController.refreshToken);

authRouter.post('/forgetPassword', authController.forgetPassword);

authRouter.post('/resetPassword', authController.resetPassword);

//Spotify

authRouter.get('/login/oauth/spotify', authController.loginSpotify);


authRouter.get("/login/spotify/callback", authController.loginSpotifyCallback);

module.exports = authRouter;