import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://saurabh:EvKJuuNxtsxWGxd0@cluster0.e8d2pel.mongodb.net/Blockly?retryWrites=true&w=majority';
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'Blockly';

/**
 * Global MongoDB client connection
 */
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

/**
 * Connect to MongoDB
 */
export async function connectToMongoDB() {
  // If we have cached connections, use those
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Check if we have the MongoDB URI
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  // Create a new MongoDB client
  const client = new MongoClient(MONGODB_URI);
  
  try {
    // Connect to the MongoDB server
    await client.connect();
    const db = client.db(MONGODB_DB_NAME);
    
    // Cache the client and db connections
    cachedClient = client;
    cachedDb = db;
    
    return { client, db };
  } catch (error) {
    // Close the client connection on error
    await client.close();
    throw error;
  }
}