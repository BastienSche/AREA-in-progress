const express = require('express');
const usersRouter = express.Router();

const usersController = require('../../controllers/users.controller');
const middleware = require('../../helpers/middleware/middleware');

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns list of all Users
 *     tags: [UsersAPI]
 *     security:
 *       - bearerAuth: []
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
 *                 users:
 *                   $ref: '#/components/schemas/Users'
 */
usersRouter.get('/', middleware.verifyToken, middleware.onlyAdminAccess('You don\'t have permission to access to this ressource'), usersController.getAll);


/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create new User
 *     tags: [UsersAPI]
 *     requestBody:
 *       description: User fields
 *       required: true      
 *       content: 
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 error:
 *                   type: boolean
 *                   example: false
 */ 
usersRouter.post('/', usersController.create);


/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Return finded User
 *     tags: [UsersAPI]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: byte
 *         required: true
 *         description: User id
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
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */
usersRouter.get('/:id', middleware.verifyToken, usersController.get);


/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete User
 *     tags: [UsersAPI]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: byte
 *         required: true
 *         description: User id
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
 */
usersRouter.delete('/:id', middleware.verifyToken, middleware.onlyAdminAccess('You don\'t have permission to access to this ressource'), usersController.delete);

usersRouter.get('/:id/confirmEmail', usersController.confirmEmail);

module.exports = usersRouter;