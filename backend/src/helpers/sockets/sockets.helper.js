const socket = require('socket.io');
const UserSocket = require('./UserSocket');
const { ObjectId, UserModel } = require('../database/database.helper');
const bulkHelper = require('../database/bulk.helper')
const middleware = require('./socket.middleware');

let io;

const users = new Map();

async function emitOnRoom(room, event, data) {
	const roomSocket = io.sockets.adapter.rooms.get(room);
	if (roomSocket) {
		console.log("[SOCKET EVENT]", event, room)
		io.to(room).emit(event, data);
	} else {
		console.log("[SOCKET EVENT] ROOM NOT FOUND", room)
	}
}

module.exports = {	
	init: (httpServer, corsOptions) => {
		io = socket(httpServer, {
			cors: corsOptions
		});
		
		io.use(middleware.verifyToken);

		io.on('connection', async(socket) => {
			
			socket.on('authenticate', async() => {
				if (!socket.decoded)
					return
				const newSocket = new UserSocket(socket);
				users.set(socket.id, newSocket);
				await users.get(socket.id).connect(socket.decoded._id);
			})
			
			socket.on('disconnect', async() => {
				const userSocket = users.get(socket.id);
				if (userSocket) {
					await userSocket.disconnect();
					users.delete(socket.id);
				}
			});

			socket.on('join_room', async(data) => {
				const userSocket = users.get(socket.id);
				if (userSocket)
					userSocket.join(data.id);
			});
			
			socket.on('update_user_data', async(data) => {
				const bulkArray = [];
				switch(data.type) {
					case 'field':
						bulkArray.push(
							bulkHelper.setField({ _id: ObjectId(data.target)}, data.update)
						);
						break;
					case 'array':
						break;
					default:
						throw new Error('Bad arguments type')
				}
				
				await UserModel.bulkWrite(bulkArray);
				// console.log("SOCKET EVENT", {
				// 	action: 'update',
				// 	...data,
				// 	update: data.update[`${data.field}`]
				// })
				// emitOnRoom(data.target, 'update_user_data', {
				// 	action: 'update',
				// 	...data,
				// 	update: data.update[`${data.field}`]
				// })
			});

		});
	},

	broadcast: (event, data) => {
		console.log(`SOCKET BROADCAST ${event}`);
		io.sockets.emit(event, data);
	},

	emit: async(room, event, data) => {
		await emitOnRoom(room, event, data)
	}
}