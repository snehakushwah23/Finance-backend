import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();
app.use(cors());
app.use(express.json());

// Swagger setup
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Backend API',
      version: '1.0.0',
      description: 'Interactive API documentation for branches, entries, expenses, and employees.'
    },
    servers: [
      { url: '/'}
    ],
    components: {
      schemas: {
        Branch: {
          type: 'object',
          properties: { _id: { type: 'string' }, name: { type: 'string' } }
        },
        BranchEntry: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            branch: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
            customer: { type: 'string' },
            place: { type: 'string' },
            mobile: { type: 'string' },
            loan: { type: 'number' },
            interest: { type: 'number' },
            emi: { type: 'number' }
          }
        },
        Expense: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            category: { type: 'string' },
            month: { type: 'string' },
            amount: { type: 'number' },
            description: { type: 'string' },
            date: { type: 'string', format: 'date-time' }
          }
        },
        CustomerExpense: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            customerName: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
            amount: { type: 'number' },
            category: { type: 'string' },
            description: { type: 'string' }
          }
        },
        Employee: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            mobile: { type: 'string' },
            designation: { type: 'string' },
            department: { type: 'string' },
            joiningDate: { type: 'string', format: 'date-time' },
            salary: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    paths: {
      '/api/branch-entries': {
        get: { summary: 'Get all branch entries', responses: { 200: { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/BranchEntry' } } } } } } },
        post: { summary: 'Create branch entry', responses: { 201: { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/BranchEntry' } } } } } }
      },
      '/api/branch-entries/{branch}': {
        get: { summary: 'Get entries by branch', parameters: [{ name: 'branch', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/BranchEntry' } } } } } } }
      },
      '/api/branch-entries/{id}': {
        put: { summary: 'Update entry', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { summary: 'Delete entry', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } }
      },
      '/api/branches': {
        get: { summary: 'Get all branches', responses: { 200: { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Branch' } } } } } } },
        post: { summary: 'Create branch', responses: { 201: { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Branch' } } } } } }
      },
      '/api/branches/{id}': {
        put: { summary: 'Update branch', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { summary: 'Delete branch', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } }
      },
      '/api/expenses/{category}/{month}': {
        get: { summary: 'Get expenses by category and month', parameters: [{ name: 'category', in: 'path', required: true, schema: { type: 'string' } }, { name: 'month', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } }
      },
      '/api/expenses': {
        post: { summary: 'Create expense', responses: { 201: { description: 'Created' } } }
      },
      '/api/expenses/total/{category}/{month}': {
        get: { summary: 'Get expense totals by day', parameters: [{ name: 'category', in: 'path', required: true, schema: { type: 'string' } }, { name: 'month', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } }
      },
      '/api/expenses/{month}': {
        get: { summary: 'Get expenses by month', parameters: [{ name: 'month', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } }
      },
      '/api/expenses/all/{month}': {
        get: { summary: 'Get all expenses of a month', parameters: [{ name: 'month', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } }
      },
      '/api/customer-expenses': {
        get: { summary: 'Get all customer expenses', responses: { 200: { description: 'OK' } } },
        post: { summary: 'Create customer expense', responses: { 201: { description: 'Created' } } }
      },
      '/api/customer-expenses/{id}': {
        put: { summary: 'Update customer expense', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { summary: 'Delete customer expense', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } }
      },
      '/api/employees': {
        get: { summary: 'Get all employees', responses: { 200: { description: 'OK' } } },
        post: { summary: 'Create employee', responses: { 201: { description: 'Created' } } }
      },
      '/api/employees/{id}': {
        put: { summary: 'Update employee', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { summary: 'Delete employee', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } }
      }
    }
  },
  apis: []
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

// Seed sample data for quick testing in frontend and docs
app.post('/api/seed', async (req, res) => {
  try {
    const branchesCount = await Branch.countDocuments();
    if (branchesCount === 0) {
      await Branch.insertMany([
        { name: 'mumbai' },
        { name: 'delhi' }
      ]);
    }

    const entriesCount = await BranchEntry.countDocuments();
    if (entriesCount === 0) {
      const today = new Date();
      const days = (d) => new Date(today.getTime() - d * 86400000);
      await BranchEntry.insertMany([
        { branch: 'mumbai', date: days(1), customer: 'Rohit Sharma', place: 'Andheri', mobile: '9000000001', loan: 30000, interest: 43, emi: 43 },
        { branch: 'mumbai', date: days(0), customer: 'Rohit Sharma', place: 'Payment', mobile: '9000000001', loan: 5000, interest: 0, emi: 0 },
        { branch: 'delhi', date: days(7), customer: 'Anita Verma', place: 'Dwarka', mobile: '9000000002', loan: 6554, interest: 25, emi: 23 },
        { branch: 'delhi', date: days(2), customer: 'Anita Verma', place: 'Payment', mobile: '9000000002', loan: 1000, interest: 0, emi: 0 }
      ]);
    }

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
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


