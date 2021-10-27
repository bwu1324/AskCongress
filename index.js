const { MongoClient } = require('mongodb');

const settings = require('./settings.json');

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

connectDB(settings.database).then((dbClient) => {
	// once connected, start web server
	const server = require('./server.js');
	server.start(dbClient, settings.secret);
});