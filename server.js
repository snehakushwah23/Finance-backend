import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import open from 'open';

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
            branch: { type: 'string' },
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
        EmployeeExpense: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            branch: { type: 'string' },
            employeeName: { type: 'string' },
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
            branch: { type: 'string' },
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
      '/api/branch-expenses/{branch}': {
        get: { summary: 'Get indirect expenses for a branch', parameters: [{ name: 'branch', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } }
      },
      '/api/branch-expenses': {
        post: { summary: 'Create branch expense', responses: { 201: { description: 'Created' } } }
      },
      '/api/branch-expenses/{id}': {
        put: { summary: 'Update branch expense', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { summary: 'Delete branch expense', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } }
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
      '/api/employee-expenses/{branch}': {
        get: { summary: 'Get employee expenses for a branch', parameters: [{ name: 'branch', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/EmployeeExpense' } } } } } } }
      },
      '/api/employee-expenses': {
        post: { summary: 'Create employee expense', responses: { 201: { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/EmployeeExpense' } } } } } }
      },
      '/api/employee-expenses/{id}': {
        put: { summary: 'Update employee expense', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { summary: 'Delete employee expense', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } }
      },
      '/api/employees': {
        get: { summary: 'Get all employees', responses: { 200: { description: 'OK' } } },
        post: { summary: 'Create employee', responses: { 201: { description: 'Created' } } }
      },
      '/api/employees/{id}': {
        put: { summary: 'Update employee', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { summary: 'Delete employee', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } }
      },
      '/api/branch-employees/{branch}': {
        get: { summary: 'Get employees of a branch', parameters: [{ name: 'branch', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } }
      },
      '/api/branch-employees': {
        post: { summary: 'Create branch employee', responses: { 201: { description: 'Created' } } }
      },
      '/api/branch-employees/{id}': {
        put: { summary: 'Update branch employee', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
        delete: { summary: 'Delete branch employee', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } }
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

// API Index - single screen with all API links
const buildApiIndexHtml = (base) => `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Finance API Index</title>
    <style>
      body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; background:#f8fafc; color:#0f172a; margin:0; }
      .container { max-width: 960px; margin: 0 auto; padding: 24px; }
      h1 { margin: 0 0 16px; }
      .card { background:#fff; border:1px solid #e5e7eb; border-radius:12px; padding:16px 18px; margin:12px 0; }
      .section-title { font-size: 14px; font-weight: 700; color:#334155; text-transform: uppercase; letter-spacing:.04em; margin: 24px 0 8px; }
      ul { margin:0; padding:0 0 0 18px; }
      li { margin:6px 0; }
      a { color:#2563eb; text-decoration: none; }
      a:hover { text-decoration: underline; }
      code { background:#f1f5f9; padding:2px 6px; border-radius:6px; }
      .topbar { display:flex; align-items:center; justify-content:space-between; margin-bottom: 16px; }
      .btn { display:inline-block; background:#111827; color:#fff; padding:8px 12px; border-radius:8px; text-decoration:none; font-weight:600; }
      .btn:hover { background:#0b1220; }
      .muted { color:#64748b; font-size: 13px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="topbar">
        <h1>Finance API Index</h1>
        <a class="btn" href="${base}/api/docs" target="_blank" rel="noreferrer">Open API Docs</a>
      </div>
      <p class="muted">Click a GET endpoint below to view live JSON in your browser.</p>

      <div class="section">
        <div class="section-title">Branches</div>
        <div class="card">
          <ul>
            <li><a href="${base}/api/branches" target="_blank">GET /api/branches</a></li>
          </ul>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Branch Entries</div>
        <div class="card">
          <ul>
            <li><a href="${base}/api/branch-entries" target="_blank">GET /api/branch-entries</a></li>
            <li><a href="${base}/api/branch-entries/mumbai" target="_blank">GET /api/branch-entries/mumbai</a></li>
            <li><a href="${base}/api/branch-entries/delhi" target="_blank">GET /api/branch-entries/delhi</a></li>
          </ul>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Expenses</div>
        <div class="card">
          <ul>
            <li><a href="${base}/api/expenses/Office/2025-10" target="_blank">GET /api/expenses/Office/2025-10</a></li>
            <li><a href="${base}/api/expenses/total/Office/2025-10" target="_blank">GET /api/expenses/total/Office/2025-10</a></li>
            <li><a href="${base}/api/expenses/2025-10" target="_blank">GET /api/expenses/2025-10</a></li>
            <li><a href="${base}/api/branch-expenses/mumbai" target="_blank">GET /api/branch-expenses/mumbai</a></li>
            <li><a href="${base}/api/branch-expenses/delhi" target="_blank">GET /api/branch-expenses/delhi</a></li>
          </ul>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Customer Expenses</div>
        <div class="card">
          <ul>
            <li><a href="${base}/api/customer-expenses" target="_blank">GET /api/customer-expenses</a></li>
          </ul>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Employees</div>
        <div class="card">
          <ul>
            <li><a href="${base}/api/employees" target="_blank">GET /api/employees</a></li>
            <li><a href="${base}/api/branch-employees/mumbai" target="_blank">GET /api/branch-employees/mumbai</a></li>
            <li><a href="${base}/api/branch-employees/delhi" target="_blank">GET /api/branch-employees/delhi</a></li>
            <li><a href="${base}/api/employee-expenses/mumbai" target="_blank">GET /api/employee-expenses/mumbai</a></li>
            <li><a href="${base}/api/employee-expenses/delhi" target="_blank">GET /api/employee-expenses/delhi</a></li>
          </ul>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Utilities</div>
        <div class="card">
          <ul>
            <li><a href="${base}/" target="_blank">GET /</a> <span class="muted">(health)</span></li>
            <li><a href="${base}/api/test" target="_blank">GET /api/test</a></li>
            <li>POST /api/seed <span class="muted">(use in <a href="${base}/api/docs" target="_blank">API Docs</a>)</span></li>
          </ul>
        </div>
      </div>

      <p class="muted">Tip: Use the “Open API Docs” button for POST/PUT/DELETE tryouts.</p>
    </div>
  </body>
</html>`;

app.get('/api', (req, res) => {
  const base = `${req.protocol}://${req.get('host')}`;
  res.type('html').send(buildApiIndexHtml(base));
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
  branch: { type: String }, // optional; used for per-branch indirect expenses
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

// Branch Indirect Expenses (per branch)
app.get('/api/branch-expenses/:branch', async (req, res) => {
  try {
    const expenses = await Expense.find({ branch: req.params.branch }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/branch-expenses', async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/branch-expenses/:id', async (req, res) => {
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

app.delete('/api/branch-expenses/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
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

// Employee Expenses (per branch)
const employeeExpenseSchema = new mongoose.Schema({
  branch: { type: String, required: true },
  employeeName: { type: String, required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String }
});

const EmployeeExpense = mongoose.model('EmployeeExpense', employeeExpenseSchema);

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

// Employee Expenses routes
app.get('/api/employee-expenses/:branch', async (req, res) => {
  try {
    const expenses = await EmployeeExpense.find({ branch: req.params.branch }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/employee-expenses', async (req, res) => {
  try {
    const exp = new EmployeeExpense(req.body);
    await exp.save();
    res.status(201).json(exp);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/employee-expenses/:id', async (req, res) => {
  try {
    const exp = await EmployeeExpense.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!exp) return res.status(404).json({ error: 'Expense not found' });
    res.json(exp);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/employee-expenses/:id', async (req, res) => {
  try {
    const exp = await EmployeeExpense.findByIdAndDelete(req.params.id);
    if (!exp) return res.status(404).json({ error: 'Expense not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------
// Employee Master (separate collection)
// ---------------------------------------------

const employeeSchema = new mongoose.Schema({
  branch: { type: String }, // optional; used for per-branch employee master
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

// Branch Employees (per branch)
app.get('/api/branch-employees/:branch', async (req, res) => {
  try {
    const employees = await Employee.find({ branch: req.params.branch }).sort({ name: 1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/branch-employees', async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/branch-employees/:id', async (req, res) => {
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

app.delete('/api/branch-employees/:id', async (req, res) => {
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
    const base = `http://localhost:${PORT}`;
    console.log(`API Index: ${base}/api`);
    console.log(`API Docs:  ${base}/api/docs`);
    if (process.env.NODE_ENV !== 'production' && !process.env.NO_OPEN) {
      // Best-effort open the API Index in default browser; swallow async rejections (Windows EPERM, etc.)
      try { open(`${base}/api`).catch(() => {}); } catch (e) { /* ignore */ }
    }
  });
}).catch((err) => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});


