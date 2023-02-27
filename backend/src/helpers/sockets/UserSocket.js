const sessionEvents = require('./session.events');

class UserSocket {
	constructor(socket) {
		this.socket = socket;
        this.accessToken = socket.handshake.auth.token;
        this._id;
	}

    async connect(id) {
        try {
            this._id = id;
            await this.socket.join(this._id);
            await this.emit('set_user_data', await sessionEvents.getUserData(id));
        } catch(err) {
            console.log("UserSocket Error", err.message);
            await this.socket.emit('remove_session');
            this.disconnect();
        }
    }

	async emit(event, data) {
        try {
            console.log("[SOCKET EVENT]", event);
            await this.socket.emit(event, data);
        } catch(err) {
            console.log("UserSocket emit Error:", err.message);
            this.disconnect();
        }
	}

    async join(room) {
        try {
            await this.socket.join(room);
        } catch(err) {
            console.log('UserSocket join Error:', err.message);
            this.disconnect();
        }
    }

    async disconnect() {
		await this.socket.disconnect();
	}
}

module.exports = UserSocket;