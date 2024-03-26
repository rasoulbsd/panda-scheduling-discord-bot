const { MongoClient } = require('mongodb');

require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function connectToDB() {
	const client = new MongoClient(uri);

	try {
		return await client.connect();
		// console.log('Connected to MongoDB');
	}
	catch (err) {
		console.error('Error connecting to MongoDB:', err);
		client.close();
		throw 'Error connecting to MongoDB';
	}
}

// async function getOrCreateChannelInDB(dbo){
//     try {
//         const channels = db.collection('channels');
//         const query = { name: 'general' };
//         const options = { upsert: true };
//         const channel = await channels.findOneAndUpdate(query, options);
//         return channel;
//     } catch (err) {
//         console.error('Error getting or creating channel in MongoDB:', err);
//         throw 'Error getting or creating channel in MongoDB';
//     }
// }

// function findBigIntPropertiesRecursive(obj, depth = 0, maxDepth = 10) {
// 	if (depth > maxDepth) {
// 	  console.log("Max depth exceeded. Terminating recursion.");
// 	  return;
// 	}

// 	for (const prop in obj) {
// 	  if (typeof obj[prop] === 'bigint') {
// 		console.log(`Property "${prop}" is a BigInt with value: ${obj[prop]}`);
// 	  } else if (typeof obj[prop] === 'object' && obj[prop] !== null) {
// 		findBigIntPropertiesRecursive(obj[prop], depth + 1, maxDepth);
// 	  }
// 	}
//   }

async function saveRoutine(dbo, server, channel, { name, date, role, scheduler, threadContent, discord }) {
	try {
		server = server.replace(' ', '-');
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
				const result = await db_col.findOne({ 'date.day': day, 'date.year': year, 'date.time': hour });
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
// const db = client.db('myDatabase'); // Replace 'myDatabase' with your database name
// const collection = db.collection('myCollection'); // Replace 'myCollection' with your collection name

// // Insert a document
// const document = { name: 'John', age: 30 };
// const result = await collection.insertOne(document);

// // Find documents
// const foundDocuments = await collection.find({ name: 'John' }).toArray();

// // Update documents
// const updatedDocument = await collection.updateOne({ name: 'John' }, { $set: { age: 31 } });

// // Delete documents
// const deletedDocument = await collection.deleteOne({ name: 'John' });

module.exports = { connectToDB, saveRoutine, getRoutines };