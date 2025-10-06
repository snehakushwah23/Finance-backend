import mongoose from 'mongoose';

async function checkCollections() {
  try {
    await mongoose.connect('mongodb://localhost:27017/expenses');
    console.log('Connected to MongoDB');
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Check each collection
    for (const collection of collections) {
      const count = await mongoose.connection.db.collection(collection.name).countDocuments();
      console.log(`Collection "${collection.name}" has ${count} documents`);
      
      if (count > 0) {
        const sample = await mongoose.connection.db.collection(collection.name).findOne();
        console.log(`Sample from "${collection.name}":`, sample);
      }
    }
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

checkCollections();
