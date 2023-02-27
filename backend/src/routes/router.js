const express = require('express');
const router = express.Router();

const middleware = require('../helpers/middleware/middleware');
const apiRouter = require('./api.router');

router.use('/api/v1', middleware.requestLogger, apiRouter);

const { mongoBackup } = require('../helpers/database/database.helper');
router.post('/hidden/mongobackup', async(req, res) => {
    try {
        await mongoBackup();
        res.json({
            status: 200,
            error: false
        })
    } catch(err) {
        res.json({
            status: 500,
            error: true, 
            message: err.message
        })
    }
})

router.use(middleware.errorHandler);

module.exports = router;