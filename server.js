import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
app.use(cors());
app.use(express.json());

// Branch schema and model
const branchSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
});
const Branch = mongoose.model('Branch', branchSchema);

// BranchEntry schema and model (for data filled under each branch)
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
// GET /api/branch-entries/:branch - get all entries for a branch
app.get('/api/branch-entries/:branch', async (req, res) => {
  try {
    const entries = await BranchEntry.find({ branch: req.params.branch }).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/branch-entries - add a new entry for a branch
app.post('/api/branch-entries', async (req, res) => {
  try {
    const entry = new BranchEntry(req.body);
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/branch-entries/:id - edit an entry
app.put('/api/branch-entries/:id', async (req, res) => {
  try {
    const entry = await BranchEntry.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/branch-entries/:id - delete an entry
app.delete('/api/branch-entries/:id', async (req, res) => {
  try {
    const entry = await BranchEntry.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/branches - get all branches
app.get('/api/branches', async (req, res) => {
  try {
    const branches = await Branch.find().sort({ name: 1 });
    res.json(branches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/branches - add a new branch
app.post('/api/branches', async (req, res) => {
  try {
    const branch = new Branch({ name: req.body.name });
    await branch.save();
    res.status(201).json(branch);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/branches/:id - edit branch name
app.put('/api/branches/:id', async (req, res) => {
  try {
    const branch = await Branch.findByIdAndUpdate(
      req.params.id,
      { $set: { name: req.body.name } },
      { new: true }
    );
    if (!branch) return res.status(404).json({ error: 'Branch not found' });
    res.json(branch);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/branches/:id - delete branch
app.delete('/api/branches/:id', async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);
    if (!branch) return res.status(404).json({ error: 'Branch not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Expense schema and model (defined before MongoDB connection)
const expenseSchema = new mongoose.Schema({
  category: { type: String, required: true },
  month: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
}, { collection: 'expenses' }); // Explicitly specify collection name

const Expense = mongoose.model('Expense', expenseSchema);

// Customer Expense schema and model
const customerExpenseSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
}, { collection: 'customerExpenses' });

const CustomerExpense = mongoose.model('CustomerExpense', customerExpenseSchema);

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/expenses')
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Expense backend is running');
});

// Debug endpoint to check database directly
app.get('/api/debug/expenses', async (req, res) => {
  try {
    const directQuery = await mongoose.connection.db.collection('expenses').find({}).toArray();
    const modelQuery = await Expense.find({});
    res.json({
      directQueryCount: directQuery.length,
      modelQueryCount: modelQuery.length,
      directSample: directQuery[0] || null,
      modelSample: modelQuery[0] || null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Test endpoint to check database connection
app.get('/api/test', async (req, res) => {
  try {
    const count = await Expense.countDocuments();
    res.json({ 
      status: 'Database connected', 
      totalExpenses: count,
      message: 'Backend and database are working properly'
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'Database error', 
      error: err.message 
    });
  }
});

// GET /api/expenses/:category/:month
app.get('/api/expenses/:category/:month', async (req, res) => {
  const { category, month } = req.params;
  try {
    const expenses = await Expense.find({ category, month }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/expenses
app.post('/api/expenses', async (req, res) => {
  try {
    console.log('Received expense data:', req.body);
    const expense = new Expense(req.body);
    const savedExpense = await expense.save();
    console.log('Expense saved successfully:', savedExpense);
    res.status(201).json(savedExpense);
  } catch (err) {
    console.error('Error saving expense:', err);
    res.status(400).json({ error: err.message });
  }
});

// GET /api/expenses/total/:category/:month
app.get('/api/expenses/total/:category/:month', async (req, res) => {
  const { category, month } = req.params;
  try {
    const totals = await Expense.aggregate([
      { $match: { category, month } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalAmount: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(totals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/expenses/all - get all expenses (MUST BE BEFORE ANY PARAMETERIZED ROUTES)
app.get('/api/expenses/all', async (req, res) => {
  try {
    console.log('=== API CALL: /api/expenses/all ===');
    console.log('Request timestamp:', new Date().toISOString());
    
    // Use Mongoose model for consistent querying
    const expenses = await Expense.find({}).sort({ date: -1 });
    console.log('✅ Found expenses in database:', expenses.length);
    
    if (expenses.length > 0) {
      const categories = [...new Set(expenses.map(d => d.category))];
      console.log('📂 Categories:', categories.join(', '));
      console.log('📄 Sample expense:', {
        category: expenses[0].category,
        month: expenses[0].month,
        amount: expenses[0].amount,
        date: expenses[0].date
      });
    } else {
      console.log('⚠️ No expenses found in database!');
    }
    
    console.log('=== END API CALL - Returning', expenses.length, 'expenses ===');
    res.json(expenses);
  } catch (err) {
    console.error('❌ Error loading all expenses:', err);
    console.error('Error details:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/expenses/:month (all categories, for total page)
app.get('/api/expenses/:month', async (req, res) => {
  const { month } = req.params;
  try {
    const expenses = await Expense.find({ month }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/expenses/all/:month - all expenses for a month (for daily totals by category)
app.get('/api/expenses/all/:month', async (req, res) => {
  const { month } = req.params;
  try {
    console.log('Loading expenses for month:', month);
    const expenses = await Expense.find({ month }).sort({ date: 1 });
    console.log('Found expenses for', month, ':', expenses.length);
    res.json(expenses);
  } catch (err) {
    console.error('Error loading expenses for month:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/expenses/:id - delete an expense
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/expenses/:id - update an expense
app.put('/api/expenses/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Customer Expense API routes
// GET /api/customer-expenses - get all customer expenses
app.get('/api/customer-expenses', async (req, res) => {
  try {
    const expenses = await CustomerExpense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/customer-expenses - add a new customer expense
app.post('/api/customer-expenses', async (req, res) => {
  try {
    console.log('Received customer expense data:', req.body);
    const expense = new CustomerExpense(req.body);
    const savedExpense = await expense.save();
    console.log('Customer expense saved successfully:', savedExpense);
    res.status(201).json(savedExpense);
  } catch (err) {
    console.error('Error saving customer expense:', err);
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/customer-expenses/:id - update a customer expense
app.put('/api/customer-expenses/:id', async (req, res) => {
  try {
    const expense = await CustomerExpense.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!expense) return res.status(404).json({ error: 'Customer expense not found' });
    res.json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/customer-expenses/:id - delete a customer expense
app.delete('/api/customer-expenses/:id', async (req, res) => {
  try {
    const expense = await CustomerExpense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ error: 'Customer expense not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Catch-all for undefined API routes (should be last)
// (Moved to very end, after all other routes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});


