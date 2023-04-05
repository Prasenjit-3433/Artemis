const mongoose = require('mongoose');

const MONGO_URL = 'mongodb+srv://nasa-api:CrLV1crtndpuvnOg@nasacluster.gr6skww.mongodb.net/nasa-api-db?retryWrites=true&w=majority';

mongoose.connection.once('open', () => {
    console.log('MongoDB connection is ready!');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
});

async function mongoConnect() {
    await mongoose.disconnect();
    await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnect,
};