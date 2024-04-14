const { MongoClient } = require('mongodb');
const { getFriendlyRoutineName } = require('../utils/format');

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

async function saveRoutine(dbo, server, channel, scheduler, routine, time, timezone, role, threadContent) {
	const db = dbo.db(`${server}`.toLowerCase());
	const existing_routines = await db.collection('routines').countDocuments({ 'channel': channel });
	const composite_id = existing_routines + 1;
	const query = {
		composite_id,
		'channel': channel,
		scheduler,
		'created_at': (new Date()).toUTCString(),
		'routine_datails': {
			routine,
			time,
			timezone,
			role,
			threadContent,
		},
	};

	const serializedQuery = JSON.stringify(query);
	const parsedQuery = JSON.parse(serializedQuery);

	await db.collection('routines').insertOne(parsedQuery);
	return composite_id;
}

async function saveRoutineSlot(dbo, server, channel, { routine_id, name, date, role, scheduler, threadContent, discord }) {
	const db = dbo.db(`${server}`.toLowerCase());

	try {
		const routines = db.collection(channel);
		const query = {
			routine_id,
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

async function getRoutinesByChannel(dbo, server, channel) {
	const db = dbo.db(`${server}`.toLowerCase());
	const query = {
		'channel': channel,
	};

	try {
		// Use .find() with projection to only include the 'composite_id' field
		const routinesCursor = db.collection('routines').find(query, { projection: { composite_id: 1, routine_datails: 1, _id: 0 } });
		const routinesArray = await routinesCursor.toArray();

		// Map the array to create a formatted summary of each routine
		const routineSummaries = routinesArray.map(routine => {
			const details = routine.routine_datails;
			const routineName = getFriendlyRoutineName(details.routine);
			const time = `${details.time}:00`;
			return `ID: ${routine.composite_id}\n${time} at ${routineName} for ${details.role}\n-------------------------`;
		});

		return routineSummaries.join('\n');
	}
	catch (err) {
		console.error('Error retrieving routines by channel:', err);
		throw new Error('Failed to retrieve routines by channel');
	}
}

async function deleteRoutine(dbo, server, channel, routine_id) {
	try {
		const db = dbo.db(`${server}`.toLowerCase());
		const routineSlots = db.collection(channel);
		const query = { routine_id };
		await routineSlots.deleteMany(query);

		const routine = db.collection('routines');
		const query2 = { composite_id: routine_id };
		return (await routine.deleteOne(query2)).deletedCount > 0;
	}
	catch (err) {
		console.error('Error deleting routine in MongoDB:', err);
		throw 'Error deleting routine in MongoDB';
	}
}

async function updateRoutine(dbo, server, channel, routine_id, newRole, newThreadContent) {
	try {
		server = server.replaceAll(' ', '-');
		const db = dbo.db(`${server}`.toLowerCase());
		const routines = db.collection(channel);
		const query = { _id: routine_id };
		const update = { $set: { role: newRole, threadContent: newThreadContent } };
		return (await routines.updateOne(query, update));
	}
	catch (err) {
		console.error('Error updating routine in MongoDB:', err);
		throw 'Error updating routine in MongoDB';
	}
}

module.exports = { connectToDB, saveRoutine, saveRoutineSlot, getRoutines, getRoutinesByChannel, deleteRoutine, updateRoutine };