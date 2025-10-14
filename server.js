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

// GET /api/branch-entries - get all entries from all branches
app.get('/api/branch-entries', async (req, res) => {
  try {
    const entries = await BranchEntry.find().sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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

// MongoDB connection (use env on Render/production)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sk0069954:sk069954@hrms-cluster.xq6bhcp.mongodb.net/expenses?retryWrites=true&w=majority';
console.log('MONGODB_URI:', MONGODB_URI ? 'Set' : 'Not set');
console.log('Environment check:', process.env.NODE_ENV);
console.log('Using URI:', MONGODB_URI.substring(0, 20) + '...');

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Expense backend is running');
});

// Frontend connectivity test endpoint
app.get('/api/test', (req, res) => {
  res.json({ status: 'Database connected' });
});

const expenseSchema = new mongoose.Schema({
  category: { type: String, required: true },
  month: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
});

const Expense = mongoose.model('Expense', expenseSchema);

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
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
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
    const expenses = await Expense.find({ month }).sort({ date: 1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------
// Customer/Employee Expenses (separate collection)
// ---------------------------------------------

const customerExpenseSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String }
});

const CustomerExpense = mongoose.model('CustomerExpense', customerExpenseSchema);

// GET all customer/employee expenses
app.get('/api/customer-expenses', async (req, res) => {
  try {
    const expenses = await CustomerExpense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add a new expense
app.post('/api/customer-expenses', async (req, res) => {
  try {
    const expense = new CustomerExpense(req.body);
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update an expense
app.put('/api/customer-expenses/:id', async (req, res) => {
  try {
    const expense = await CustomerExpense.findByIdAndUpdate(
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

// DELETE an expense
app.delete('/api/customer-expenses/:id', async (req, res) => {
  try {
    const expense = await CustomerExpense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------
// Employee Master (separate collection)
// ---------------------------------------------

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String },
  designation: { type: String },
  department: { type: String },
  joiningDate: { type: Date },
  salary: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

const Employee = mongoose.model('Employee', employeeSchema);

// GET all employees
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find().sort({ name: 1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add a new employee
app.post('/api/employees', async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update an employee
app.put('/api/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE an employee
app.delete('/api/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Catch-all for undefined API routes (should be last)
// (Moved to very end, after all other routes)

const PORT = process.env.PORT || 5000;

// Connect to MongoDB first, then start the server
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000
}).then(() => {
  console.log('MongoDB connected successfully');
  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});


