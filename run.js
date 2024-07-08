const path = require('path');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const crypto = require('crypto');
dotenv.config();

const server = require(path.join(__dirname, 'webServer.js'));

// connect to database
async function connectDB() {
	const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_ADDRESS}:${process.env.MONGO_PORT}/?authSource=admin`;
	const client = new MongoClient(url);
	console.log(`Attempting to connect to database at: ${process.env.MONGO_ADDRESS}`);
	await client.connect();
	const db = client.db(process.env.DB_NAME);
	console.log('Connected successfully to server');
	return db;
}

// once connected, start web server
connectDB().then((dbClient) => {
	server.start(dbClient, crypto.randomBytes(32));
});
