const express = require('express');
const http = require('http');

var cors = require('cors');
const bodyParser = require('body-parser');

const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerCf = require('./routes/swagger.js');
const router = require('./routes/router.js');

const { connectToDatabase } = require('./helpers/database/database.helper');
const socketsHelper = require('./helpers/sockets/sockets.helper');
// const bulkHelper = require('./helpers/database/bulk.helper.js');

const apiPort = process.env.API_PORT || 4000;

(async() => {
    const server = express();

	const corsOptions = {
		origin: [process.env.API_URL, process.env.CLIENT_URL],
		optionsSuccessStatus: 200,
		methods: ["GET", "PATCH", "POST", "DELETE"]
	};

    server.use(cors(corsOptions));

	server.use(bodyParser.urlencoded({
		limit: "50mb",
		extended: false
	}));
	server.use(bodyParser.json({ limit: "50mb" }));

    const specs = swaggerJsDoc(swaggerCf);
    server.use("/swagger", swaggerUI.serve, swaggerUI.setup(specs));

	// setInterval(async() => await mongoBackup(), parseInt(process.env.MONGO_BACKUP_MS_DELAY))

    server.use(router);
	await connectToDatabase();

	const httpServer = http.createServer(server);
	socketsHelper.init(httpServer, corsOptions);

	// require('./helpers/database/watch.user.helper');

	// server.get('/test', async(req, res) => {
	// 	res.status(200);
	// })


	await httpServer.listen(apiPort, () => console.info(`[API] Status: UP  on PORT: ${apiPort}`));
})();
