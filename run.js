const path = require('path');
const { MongoClient } = require('mongodb');

const server = require(path.join(__dirname, 'webServer.js'));

const settings = require(path.join(__dirname, 'settings.json'));

// connect to database
async function connectDB (auth) {
	const url = `mongodb://${auth.user}:${auth.password}@${auth.address}:${auth.port}/?authSource=admin`;
	const client = new MongoClient(url);
	console.log(`Attempting to connect to database at: ${auth.address}`);
	await client.connect();
	const db = client.db(auth.dbName);
	console.log('Connected successfully to server');
	return db;
}

// once connected, start web server
connectDB(settings.database).then((dbClient) => {
	server.start(dbClient, settings.secret);
});