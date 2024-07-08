db = db.getSiblingDB('admin');

db.createUser({
	'user': 'AskCongress',//process.env.MONGO_USER,
	'pwd': 'CHANGEME', //process.env.MONGO_PASSWORD,
	'roles': [{
		'role': 'readWrite',
		'db': process.env.MONGODB_INITDB_DATABASE
	}]
});

db = db.getSiblingDB(process.env.MONGODB_INITDB_DATABASE);

db.createCollection('Users');
db.createCollection('Threads');
db.createCollection('Comments');

const threads = db.getCollection('Threads');
threads.createIndex({ title: 'text', body: 'text' });