const express = require('express');
const apiRouter = express.Router();

const authRouter = require('./api/auth.router');
const usersRouter = require('./api/users.router');

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
