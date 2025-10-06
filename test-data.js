import mongoose from 'mongoose';

async function testData() {
  try {
    await mongoose.connect('mongodb://localhost:27017/expenses');
    console.log('Connected to MongoDB');
    
    // Get data from expenses collection
    const data = await mongoose.connection.db.collection('expenses').find({}).toArray();
    console.log('Total documents in expenses collection:', data.length);
    
    if (data.length > 0) {
      console.log('Sample document:', data[0]);
      console.log('Categories:', [...new Set(data.map(d => d.category))]);
    }
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

testData();
