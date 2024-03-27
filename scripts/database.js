const { MongoClient } = require('mongodb');

require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function connectToDB() {
	const client = new MongoClient(uri);

	try {
		return await client.connect();
	}
	catch (err) {
		console.error('Error connecting to MongoDB:', err);
		client.close();
		throw 'Error connecting to MongoDB';
	}
}


async function saveRoutine(dbo, server, channel, { name, date, role, scheduler, threadContent, discord }) {
	try {
		server = server.replaceAll(' ', '-');
		const db = dbo.db(`${server}`.toLowerCase());
		const routines = db.collection(channel);
		const query = {
			name,
			date,
			role,
			scheduler,
			threadContent,
			discord,
			created_at: new Date(),
			isActive: true,
		};

		const serializedQuery = JSON.stringify(query);
		const parsedQuery = JSON.parse(serializedQuery);

		return (await routines.insertOne(parsedQuery));
	}
	catch (err) {
		if (err.message.toLowerCase().includes('duplicate')) {
			throw 'Duplicated pair of time and day!';
		}
		else {
			console.error('Error creating routine in MongoDB:', err);
			throw 'Error creating routine in MongoDB';
		}
	}
}

async function getRoutines(dbo, day, year, hour) {
	const valid_channels_data = [];
	try {
		const adminDb = await dbo.db('admin');
		const databaseList = await adminDb.admin().listDatabases();
		for (const dbInfo of databaseList.databases) {
			if (dbInfo.name === 'admin' || dbInfo.name === 'local') {
				continue;
			}
			const db = await dbo.db(dbInfo.name);
			const collections = await db.listCollections().toArray();
			for (const collection of collections) {
				const db_col = await db.collection(collection.name);
				const result = await db_col.findOne({ 'date.day': day, 'date.year': year, 'date.hour': hour });
				// console.log(result);
				if (result) {
					valid_channels_data.push(result);
				}
			}
		}
	}
	catch (err) {
		throw 'Error in getting routines pairs from MongoDB:\n' + err.message + '\n';
	}
	return valid_channels_data;
}

module.exports = { connectToDB, saveRoutine, getRoutines };