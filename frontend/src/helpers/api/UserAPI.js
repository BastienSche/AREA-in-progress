import { fetchAPI } from "./RequestAPI";

export class Session {
    constructor(session) {
        this.accessToken = session.accessToken
        this.refreshToken = session.refreshToken
        this._id = session._id
    }

    toJSON ()  {
        return {
            accessToken: this.accessToken,
            refreshToken: this.refreshToken,
            _id: this._id
        }
    }
}

export class PublicUser {
    constructor(user) {
        this._id = user._id
        this.role = user.role;
        this.name = {
            firstName: user.name.firstName,
            lastName: user.name.lastName
        }
        this.emails = user.emails;
        this.phone = user.phone;
        this.perms = user.perms;
    }

    toJSON ()  {
        return {
            _id: this._id,
            role: this.role,
            name: this.name,
            emails: this.emails,
            phone: this.phone,
            perms: this.perms,
        }
    }
}

class UserAPI {

    static async getAll(session) {
        const json = await fetchAPI('users', 'GET', session.accessToken);
        return json.users.map(user => new PublicUser(user));
    }

    static async login(email, password, admin) {
        const json = await fetchAPI('auth/login', 'POST', '', {
            provider: admin ? 'admin' : 'email',
            email: email,
            password: password
        });
        return new Session(json.session).toJSON();
    }

    static async refreshToken(refreshToken) {
        const json = await fetchAPI('auth/refreshToken', 'POST', '', {
            refreshToken: refreshToken
        });
        return new Session(json.session).toJSON();
    }
    
    static async resetPassword(token, newPassword) {
        await fetchAPI('auth/resetPassword', 'POST', '', {
            token: token,
            password: newPassword
        })
    }

    static async forgetPassword(email) {
        await fetchAPI('auth/forgetPassword', 'POST', '', {
            email: email
        })
    }

    static async register(firstName, lastName, email, password) {
        await fetchAPI('users', 'POST', '', {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        })
    }

    static async get(id, session) {
        const json = await fetchAPI(`users/${id}`, 'GET', session.accessToken);
        return new PublicUser(json.user);
    }
}

export default UserAPI
