const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const idValidator = require('mongoose-id-validator');
const TokenModel = require('./token.model');

require('mongoose-type-email');
mongoose.SchemaTypes.Email.defaults.message = 'Email address is invalid';

const userSchema = new Schema({
	name: {
		firstName: {
			type: String,
			required: 'First name is required',
			trim: true,
			minLength: [3, 'First name is too short !'],
			maxLength: [15, 'First name is too long !'],
			match: [/^[a-zA-Z]+$/, 'First name as invalid syntax']
		},
		lastName: {
			type: String,
			required: 'Last name is required',
			trim: true,
			minLength: [3, 'Last name is too short !'],
			maxLength: [25, 'Last name is too long !'],
			match: [/^[a-zA-Z ]+$/, 'Last name as invalid syntax']
		}
	},
	emails: [{
		address: {
			type: mongoose.SchemaTypes.Email,
			trim: true,
			lowercase: true,
			unique: true,
			required: 'Email address is required',
		},
		isVerified: {
			type: Boolean,
			default: false
		}
	}],
	address: {
		type: String,
		require: false,
	},
	phone: {
		type: String,
		required: false,
		trim: true,
		match: [/^[0-9]+$/, 'Phone as invalid syntax'],
		default: ''
	},
	password: {
		type: String,
		required: 'Password is required'
	},
	role: {
		type: String,
		enum : ['COMPANY_ADMIN','ADMIN', 'EMPLOYEE'],
		default: 'COMPANY_ADMIN'
	},
	logo: {
		type: Schema.Types.ObjectId,
		ref: 'Picture',
		required: false
	}
}, {
	collection: 'users',
	timestamps: true 
});

userSchema.pre("save", async function (next) {
	const user = this;
	try {
		if (this.isModified("password") || this.isNew)
			await new Promise((resolve, reject) => {
				bcrypt.genSalt(10, function (saltError, salt) {
					if (saltError)
						reject(saltError);
					bcrypt.hash(user.password, salt, function(hashError, hash) {
						if (hashError)
							reject(hashError);
						user.password = hash
						resolve();
					})
				});
			});

		if (this.isModified("name") || this.isNew) {
			user.name.firstName = user.name.firstName.charAt(0).toUpperCase() + user.name.firstName.slice(1);
			user.name.lastName = user.name.lastName.charAt(0).toUpperCase() + user.name.lastName.slice(1);
		} 

		next();
	} catch(err) {
		next(err);
	}
})

userSchema.statics.createModel = async function(object) {
	var user = new User({
		name: {
			firstName: object.firstName,
			lastName: object.lastName
		},
		emails: [{ address: object.email, isValidate: false }],
		password: object.password,
		role: object.role,
		companies: object.companies || []
	});
	await user.save();
	return await user.save();
}

userSchema.methods.getFullName = function() {
  return this.name.firstName + ' ' + this.name.lastName
}

userSchema.methods.getEmail = function() {
	return this.emails[0].address;
}

userSchema.methods.comparePassword = async function(password) {
	const actualPass = this.password;
	return await new Promise(function(resolve, reject) {
		bcrypt.compare(password, actualPass, function(error, isMatch) {
			if (error)
				reject(error)
			resolve(isMatch)
		})
	});
}

userSchema.methods.createToken = async function() {
	const token = await TokenModel.createModel({_id: this._id})
	await token.populate({path: 'owner', select: {_id: 1, role: 1, perms: 1}});
	
	const accessToken = await token.sign();
	return {
		accessToken: accessToken,
		refreshToken: token.refreshToken
	}
}

userSchema.methods.jsonEmployeeInfo = function(role) {
	const user = this;
	return {
		_id: user._id,
		name: user.getFullName(),
		email: user.getEmail(),
		role: role
	}
}

userSchema.plugin(idValidator);
const User = mongoose.model('User', userSchema);

module.exports = User;