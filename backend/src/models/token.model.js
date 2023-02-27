const idValidator = require('mongoose-id-validator');
const randtoken = require('rand-token');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenModel = new Schema({
	refreshToken: {
		type: String,
		required: true
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: 'User is required'
	},
	createdAt: { 
		type: Date,
		expires: '3d',
		default: Date.now
	}
}, {
	collection: 'tokens',
	timestamps: true 
});

tokenModel.statics.createModel = async function(object) {
	const refreshToken = await randtoken.uid(255);
	const token = new Token({
		owner: object._id,
		refreshToken: refreshToken
	});
	return await token.save();
};

tokenModel.statics.decode = async function(token) {
	return await new Promise((resolve, reject) => {
		jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
			if (err)
			reject(err);
			resolve(decoded);
		});
	});
};

tokenModel.methods.sign = async function() {
	const token = this;
	return jwt.sign(token.owner._doc, process.env.SESSION_SECRET, { expiresIn: "1d" });
};

tokenModel.plugin(idValidator);
const Token = mongoose.model('Token', tokenModel);

module.exports = Token;