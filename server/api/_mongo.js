const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI || 'mongodb+srv://luyang2022:<db_password>@cluster0.urlceac.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }
  if (!cachedClient) {
    cachedClient = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    await cachedClient.connect();
  }
  cachedDb = cachedClient.db('qiandao');
  return cachedDb;
}

module.exports = connectToDatabase; 