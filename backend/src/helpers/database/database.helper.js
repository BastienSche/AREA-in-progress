// const { exec } = require('child_process');
const mongoose = require('mongoose');
const conn = mongoose.connection; 
var connError = 0;

// async function mongoBackup() {
//     await new Promise((resolve, reject) => {
//         console.log('[MONGO-BACK] Start');
        
//         console.log('[MONGO-BACK] End Success');
//     });
// }

async function connectToDatabase() {
    const mongoURI = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_HOST}`;    
    console.log("================================", mongoURI);

    await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 2000,
        ssl: false,
        useNewUrlParser: true,
        dbName: process.env.MONGO_INITDB_DATABASE,
        directConnection: true
    }).catch(async(err) => {
        connError += 1;
        if (connError >= 10)
            throw err
        console.error('Waiting 10 secondes and retry to connect');
        await new Promise(resolve => setTimeout(resolve, 10 * 1000));
        return await connectToDatabase();
    });
}

conn.once('open', function () {
    console.log("Database successfully connected");
});

conn.on('error', console.error.bind(console, 'Failed to connect on the database')); 

module.exports = {
    connectToDatabase: async() => await connectToDatabase(),

    // mongoBackup: async() => await mongoBackup(),

    ObjectId: (id) => new mongoose.Types.ObjectId(id),

    UserModel: require('../../models/user.model'),

    TokenModel: require('../../models/token.model'),
};