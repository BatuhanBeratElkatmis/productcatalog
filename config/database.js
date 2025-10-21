const { MongoClient } = require('mongodb');

let db = null;
let client = null;

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/product-catalog';
    const dbName = process.env.DB_NAME || 'product-catalog';
    
    client = new MongoClient(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    await client.connect();
    db = client.db(dbName);
    
    console.log(`✅ MongoDB'ye bağlanıldı: ${dbName}`);
    return db;
  } catch (error) {
    console.error('❌ MongoDB bağlantı hatası:', error);
    throw error;
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('Database bağlantısı kurulmamış. Önce connectDB() fonksiyonunu çağırın.');
  }
  return db;
};

const closeDB = async () => {
  if (client) {
    await client.close();
    console.log('📪 MongoDB bağlantısı kapatıldı');
  }
};

// Temel veritabanı işlemleri için helper fonksiyonlar
const dbHelpers = {
  // Koleksiyon getirme
  getCollection: (collectionName) => {
    return getDB().collection(collectionName);
  },
  
  // ID'ye göre bulma
  findById: async (collectionName, id) => {
    const collection = getDB().collection(collectionName);
    return await collection.findOne({ _id: id });
  },
  
  // Tümünü getirme
  findAll: async (collectionName, query = {}, options = {}) => {
    const collection = getDB().collection(collectionName);
    return await collection.find(query, options).toArray();
  },
  
  // Ekleme
  insertOne: async (collectionName, document) => {
    const collection = getDB().collection(collectionName);
    const result = await collection.insertOne(document);
    return result.insertedId;
  },
  
  // Güncelleme
  updateOne: async (collectionName, id, updates) => {
    const collection = getDB().collection(collectionName);
    const result = await collection.updateOne(
      { _id: id }, 
      { $set: updates }
    );
    return result.modifiedCount;
  },
  
  // Silme
  deleteOne: async (collectionName, id) => {
    const collection = getDB().collection(collectionName);
    const result = await collection.deleteOne({ _id: id });
    return result.deletedCount;
  }
};

module.exports = {
  connectDB,
  getDB,
  closeDB,
  ...dbHelpers
};