import mongoose from 'mongoose';

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sk0069954:sk069954@hrms-cluster.xq6bhcp.mongodb.net/expenses?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
    addSampleData();
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Expense schema
const expenseSchema = new mongoose.Schema({
  category: { type: String, required: true },
  month: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
}, { collection: 'expenses' });

const Expense = mongoose.model('Expense', expenseSchema);

// Branch schema
const branchSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
});
const Branch = mongoose.model('Branch', branchSchema);

// Branch Entry schema
const branchEntrySchema = new mongoose.Schema({
  branch: { type: String, required: true },
  date: { type: Date, required: true },
  customer: { type: String, required: true },
  place: { type: String, required: true },
  mobile: { type: String, required: true },
  loan: { type: Number, required: true },
  interest: { type: Number, required: true },
  emi: { type: Number, required: true }
});
const BranchEntry = mongoose.model('BranchEntry', branchEntrySchema);

async function addSampleData() {
  try {
    // Clear existing data
    await Expense.deleteMany({});
    await Branch.deleteMany({});
    await BranchEntry.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Add sample expenses
    const sampleExpenses = [
      { category: 'Petrol', month: 'April', amount: 5000, description: 'Vehicle fuel', date: new Date('2024-04-15') },
      { category: 'Petrol', month: 'April', amount: 3500, description: 'Vehicle fuel', date: new Date('2024-04-20') },
      { category: 'Office Exp.', month: 'April', amount: 12000, description: 'Office supplies', date: new Date('2024-04-10') },
      { category: 'Office Exp.', month: 'April', amount: 8000, description: 'Stationery', date: new Date('2024-04-25') },
      { category: 'Salary', month: 'April', amount: 50000, description: 'Staff salaries', date: new Date('2024-04-01') },
      { category: 'Office Rent', month: 'April', amount: 25000, description: 'Monthly rent', date: new Date('2024-04-01') },
      { category: 'Telephone Exp.', month: 'April', amount: 2000, description: 'Phone bills', date: new Date('2024-04-15') },
      { category: 'Bank', month: 'April', amount: 1500, description: 'Bank charges', date: new Date('2024-04-05') },
      
      { category: 'Petrol', month: 'May', amount: 6000, description: 'Vehicle fuel', date: new Date('2024-05-12') },
      { category: 'Office Exp.', month: 'May', amount: 10000, description: 'Office supplies', date: new Date('2024-05-08') },
      { category: 'Salary', month: 'May', amount: 50000, description: 'Staff salaries', date: new Date('2024-05-01') },
      { category: 'Office Rent', month: 'May', amount: 25000, description: 'Monthly rent', date: new Date('2024-05-01') },
    ];

    await Expense.insertMany(sampleExpenses);
    console.log(`✅ Added ${sampleExpenses.length} sample expenses`);

    // Add sample branches
    const sampleBranches = [
      { name: 'Mumbai Branch' },
      { name: 'Delhi Branch' },
      { name: 'Bangalore Branch' }
    ];

    await Branch.insertMany(sampleBranches);
    console.log(`✅ Added ${sampleBranches.length} branches`);

    // Add sample branch entries
    const sampleBranchEntries = [
      {
        branch: 'Mumbai Branch',
        date: new Date('2024-04-15'),
        customer: 'Rajesh Kumar',
        place: 'Andheri',
        mobile: '9876543210',
        loan: 100000,
        interest: 12,
        emi: 9000
      },
      {
        branch: 'Mumbai Branch',
        date: new Date('2024-04-20'),
        customer: 'Priya Sharma',
        place: 'Bandra',
        mobile: '9876543211',
        loan: 150000,
        interest: 10,
        emi: 13000
      },
      {
        branch: 'Delhi Branch',
        date: new Date('2024-04-18'),
        customer: 'Amit Patel',
        place: 'Connaught Place',
        mobile: '9876543212',
        loan: 200000,
        interest: 11,
        emi: 18000
      }
    ];

    await BranchEntry.insertMany(sampleBranchEntries);
    console.log(`✅ Added ${sampleBranchEntries.length} branch entries`);

    console.log('\n🎉 Sample data added successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Expenses: ${sampleExpenses.length}`);
    console.log(`   - Branches: ${sampleBranches.length}`);
    console.log(`   - Branch Entries: ${sampleBranchEntries.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding sample data:', error);
    process.exit(1);
  }
}

