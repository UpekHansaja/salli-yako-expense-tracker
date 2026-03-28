import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import bcryptjs from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, 'data', 'salli_yako.db');
const usersFilePath = path.join(__dirname, 'data', 'users.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Database opening error:', err);
  else console.log('Connected to SQLite database');
});

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Categories table
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    icon TEXT,
    color TEXT DEFAULT '#3B82F6',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  // Expenses table
  db.run(`CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE CASCADE
  )`);

  // Savings goals table
  db.run(`CREATE TABLE IF NOT EXISTS savings_goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    target_amount DECIMAL(10, 2) NOT NULL,
    current_amount DECIMAL(10, 2) DEFAULT 0,
    target_date DATE,
    icon TEXT,
    color TEXT DEFAULT '#10B981',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  // Monthly budgets table
  db.run(`CREATE TABLE IF NOT EXISTS budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    month_year TEXT NOT NULL,
    budget_amount DECIMAL(10, 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE CASCADE
  )`);

  // Monthly income table
  db.run(`CREATE TABLE IF NOT EXISTS monthly_income (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    renewal_date INTEGER NOT NULL DEFAULT 1,
    last_renewal_date DATE,
    next_renewal_date DATE,
    description TEXT,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  // Other income table (gifts, projects, bonuses, etc.)
  db.run(`CREATE TABLE IF NOT EXISTS other_income (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    source TEXT NOT NULL,
    description TEXT,
    income_date DATE NOT NULL,
    category TEXT DEFAULT 'other',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);
});

// Initialize users.json if it doesn't exist
if (!fs.existsSync(usersFilePath)) {
  fs.writeFileSync(usersFilePath, JSON.stringify([], null, 2));
}

// Utility function to add user to JSON file
function addUserToJsonFile(username, password) {
  const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
  const hashedPassword = bcryptjs.hashSync(password, 10);
  users.push({ username, password: hashedPassword });
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

// Utility function to verify password
function verifyPassword(username, password) {
  const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
  const user = users.find(u => u.username === username);
  if (!user) return false;
  return bcryptjs.compareSync(password, user.password);
}

// Utility function to check if username exists in JSON
function usernameExistsInJson(username) {
  const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
  return users.some(u => u.username === username);
}

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (usernameExistsInJson(username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  // Add user to SQLite
  db.run(
    'INSERT INTO users (username, email) VALUES (?, ?)',
    [username, email],
    function(err) {
      if (err) {
        return res.status(400).json({ error: 'Email already exists or invalid' });
      }

      // Add user to JSON file
      addUserToJsonFile(username, password);

      res.json({ id: this.lastID, username, email });
    }
  );
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  if (!verifyPassword(username, password)) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  db.get('SELECT id, username, email FROM users WHERE username = ?', [username], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'User not found' });
    }
    res.json({ id: user.id, username: user.username, email: user.email });
  });
});

// ==================== EXPENSE ROUTES ====================

// Get all expenses for a user
app.get('/api/expenses/:userId', (req, res) => {
  const { userId } = req.params;
  db.all(
    'SELECT e.*, c.name as category_name, c.color FROM expenses e LEFT JOIN categories c ON e.category_id = c.id WHERE e.user_id = ? ORDER BY e.date DESC',
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows || []);
    }
  );
});

// Get expenses for a specific month
app.get('/api/expenses/:userId/month/:month', (req, res) => {
  const { userId, month } = req.params;
  const year = new Date().getFullYear();
  const monthStr = String(month).padStart(2, '0');
  const startDate = `${year}-${monthStr}-01`;
  const endDate = `${year}-${monthStr}-31`;

  db.all(
    'SELECT e.*, c.name as category_name, c.color FROM expenses e LEFT JOIN categories c ON e.category_id = c.id WHERE e.user_id = ? AND e.date >= ? AND e.date <= ? ORDER BY e.date DESC',
    [userId, startDate, endDate],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows || []);
    }
  );
});

// Add expense
app.post('/api/expenses', (req, res) => {
  const { user_id, category_id, amount, description, date } = req.body;

  if (!user_id || !category_id || !amount || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.run(
    'INSERT INTO expenses (user_id, category_id, amount, description, date) VALUES (?, ?, ?, ?, ?)',
    [user_id, category_id, amount, description, date],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, user_id, category_id, amount, description, date });
    }
  );
});

// Update expense
app.put('/api/expenses/:id', (req, res) => {
  const { id } = req.params;
  const { category_id, amount, description, date } = req.body;

  db.run(
    'UPDATE expenses SET category_id = ?, amount = ?, description = ?, date = ? WHERE id = ?',
    [category_id, amount, description, date, id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Expense updated' });
    }
  );
});

// Delete expense
app.delete('/api/expenses/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM expenses WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Expense deleted' });
  });
});

// ==================== CATEGORY ROUTES ====================

// Get categories for a user
app.get('/api/categories/:userId', (req, res) => {
  const { userId } = req.params;
  db.all('SELECT * FROM categories WHERE user_id = ? ORDER BY name', [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
});

// Add category
app.post('/api/categories', (req, res) => {
  const { user_id, name, icon, color } = req.body;

  if (!user_id || !name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.run(
    'INSERT INTO categories (user_id, name, icon, color) VALUES (?, ?, ?, ?)',
    [user_id, name, icon || '', color || '#3B82F6'],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, user_id, name, icon, color });
    }
  );
});

// ==================== SAVINGS GOALS ROUTES ====================

// Get savings goals for a user
app.get('/api/savings-goals/:userId', (req, res) => {
  const { userId } = req.params;
  db.all('SELECT * FROM savings_goals WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
});

// Add savings goal
app.post('/api/savings-goals', (req, res) => {
  const { user_id, name, target_amount, target_date, icon, color } = req.body;

  if (!user_id || !name || !target_amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.run(
    'INSERT INTO savings_goals (user_id, name, target_amount, current_amount, target_date, icon, color) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [user_id, name, target_amount, 0, target_date || null, icon || '', color || '#10B981'],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, user_id, name, target_amount, current_amount: 0, target_date, icon, color });
    }
  );
});

// Update savings goal progress
app.put('/api/savings-goals/:id', (req, res) => {
  const { id } = req.params;
  const { current_amount, name, target_amount, target_date } = req.body;

  db.run(
    'UPDATE savings_goals SET current_amount = ?, name = ?, target_amount = ?, target_date = ? WHERE id = ?',
    [current_amount, name, target_amount, target_date, id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Savings goal updated' });
    }
  );
});

// Delete savings goal
app.delete('/api/savings-goals/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM savings_goals WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Savings goal deleted' });
  });
});

// ==================== ANALYTICS ROUTES ====================

// Get monthly summary
app.get('/api/analytics/:userId/monthly/:month', (req, res) => {
  const { userId, month } = req.params;
  const year = new Date().getFullYear();
  const monthStr = String(month).padStart(2, '0');
  const startDate = `${year}-${monthStr}-01`;
  const endDate = `${year}-${monthStr}-31`;

  db.all(
    `SELECT c.name, SUM(e.amount) as total FROM expenses e 
     LEFT JOIN categories c ON e.category_id = c.id 
     WHERE e.user_id = ? AND e.date >= ? AND e.date <= ? 
     GROUP BY e.category_id, c.name`,
    [userId, startDate, endDate],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      
      db.get(
        `SELECT SUM(amount) as total_spent FROM expenses 
         WHERE user_id = ? AND date >= ? AND date <= ?`,
        [userId, startDate, endDate],
        (err2, totals) => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json({ 
            categories: rows || [], 
            total: totals?.total_spent || 0,
            month: monthStr,
            year 
          });
        }
      );
    }
  );
});

// Get yearly summary
app.get('/api/analytics/:userId/yearly', (req, res) => {
  const { userId } = req.params;
  const year = new Date().getFullYear();

  db.all(
    `SELECT strftime('%m', date) as month, SUM(amount) as total FROM expenses 
     WHERE user_id = ? AND strftime('%Y', date) = ? 
     GROUP BY strftime('%m', date)
     ORDER BY month`,
    [userId, year.toString()],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows || []);
    }
  );
});

// ==================== REPORTS ROUTES ====================

// Get monthly report
app.get('/api/reports/:userId/monthly/:month', (req, res) => {
  const { userId, month } = req.params;
  const year = new Date().getFullYear();
  const monthStr = String(month).padStart(2, '0');
  const startDate = `${year}-${monthStr}-01`;
  const endDate = `${year}-${monthStr}-31`;

  db.all(
    `SELECT e.id, e.date, c.name as category, e.amount, e.description FROM expenses e 
     LEFT JOIN categories c ON e.category_id = c.id 
     WHERE e.user_id = ? AND e.date >= ? AND e.date <= ? 
     ORDER BY e.date DESC`,
    [userId, startDate, endDate],
    (err, expenses) => {
      if (err) return res.status(500).json({ error: err.message });

      db.all(
        `SELECT c.name, SUM(e.amount) as total FROM expenses e 
         LEFT JOIN categories c ON e.category_id = c.id 
         WHERE e.user_id = ? AND e.date >= ? AND e.date <= ? 
         GROUP BY e.category_id, c.name`,
        [userId, startDate, endDate],
        (err2, summary) => {
          if (err2) return res.status(500).json({ error: err2.message });

          db.get(
            `SELECT SUM(amount) as total_spent FROM expenses 
             WHERE user_id = ? AND date >= ? AND date <= ?`,
            [userId, startDate, endDate],
            (err3, totals) => {
              if (err3) return res.status(500).json({ error: err3.message });
              res.json({
                month: monthStr,
                year,
                expenses: expenses || [],
                summary: summary || [],
                total_spent: totals?.total_spent || 0
              });
            }
          );
        }
      );
    }
  );
});

// ==================== MONTHLY INCOME ROUTES ====================

// Get monthly income for a user
app.get('/api/monthly-income/:userId', (req, res) => {
  const { userId } = req.params;
  db.all(
    'SELECT * FROM monthly_income WHERE user_id = ? ORDER BY created_at DESC',
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows || []);
    }
  );
});

// Add monthly income
app.post('/api/monthly-income', (req, res) => {
  const { user_id, amount, renewal_date, description } = req.body;

  if (!user_id || !amount || !renewal_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Calculate next renewal date
  const today = new Date();
  const currentDay = today.getDate();
  let nextRenewalDate = new Date(today.getFullYear(), today.getMonth(), renewal_date);
  
  if (nextRenewalDate < today) {
    nextRenewalDate = new Date(today.getFullYear(), today.getMonth() + 1, renewal_date);
  }

  const nextRenewalStr = nextRenewalDate.toISOString().split('T')[0];
  const lastRenewalStr = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];

  db.run(
    `INSERT INTO monthly_income (user_id, amount, renewal_date, last_renewal_date, next_renewal_date, description, active) 
     VALUES (?, ?, ?, ?, ?, ?, 1)`,
    [user_id, amount, renewal_date, lastRenewalStr, nextRenewalStr, description || ''],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ 
        id: this.lastID, 
        user_id, 
        amount, 
        renewal_date, 
        last_renewal_date: lastRenewalStr,
        next_renewal_date: nextRenewalStr,
        description 
      });
    }
  );
});

// Update monthly income
app.put('/api/monthly-income/:id', (req, res) => {
  const { id } = req.params;
  const { amount, renewal_date, description, active } = req.body;

  // Calculate next renewal date if renewal_date changed
  let nextRenewalDate = null;
  if (renewal_date !== undefined) {
    const today = new Date();
    nextRenewalDate = new Date(today.getFullYear(), today.getMonth(), renewal_date);
    
    if (nextRenewalDate < today) {
      nextRenewalDate = new Date(today.getFullYear(), today.getMonth() + 1, renewal_date);
    }
    nextRenewalDate = nextRenewalDate.toISOString().split('T')[0];
  }

  const updateQuery = nextRenewalDate
    ? `UPDATE monthly_income SET amount = ?, renewal_date = ?, next_renewal_date = ?, description = ?, active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    : `UPDATE monthly_income SET amount = ?, description = ?, active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

  const params = nextRenewalDate
    ? [amount, renewal_date, nextRenewalDate, description || '', active !== undefined ? active : 1, id]
    : [amount, description || '', active !== undefined ? active : 1, id];

  db.run(updateQuery, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Monthly income updated' });
  });
});

// Delete monthly income
app.delete('/api/monthly-income/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM monthly_income WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Monthly income deleted' });
  });
});

// Get total monthly income for a user
app.get('/api/monthly-income/:userId/total', (req, res) => {
  const { userId } = req.params;
  db.get(
    'SELECT COALESCE(SUM(amount), 0) as total FROM monthly_income WHERE user_id = ? AND active = 1',
    [userId],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ total: row?.total || 0 });
    }
  );
});

// ==================== OTHER INCOME ROUTES ====================

// Get other income for a user
app.get('/api/other-income/:userId', (req, res) => {
  const { userId } = req.params;
  db.all(
    'SELECT * FROM other_income WHERE user_id = ? ORDER BY income_date DESC, created_at DESC',
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows || []);
    }
  );
});

// Get other income for a specific month
app.get('/api/other-income/:userId/month/:month', (req, res) => {
  const { userId, month } = req.params;
  const year = new Date().getFullYear();
  const monthStr = String(month).padStart(2, '0');
  const startDate = `${year}-${monthStr}-01`;
  const endDate = `${year}-${monthStr}-31`;

  db.all(
    'SELECT * FROM other_income WHERE user_id = ? AND income_date >= ? AND income_date <= ? ORDER BY income_date DESC',
    [userId, startDate, endDate],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows || []);
    }
  );
});

// Add other income
app.post('/api/other-income', (req, res) => {
  const { user_id, amount, source, description, income_date, category } = req.body;

  if (!user_id || !amount || !source || !income_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.run(
    `INSERT INTO other_income (user_id, amount, source, description, income_date, category) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [user_id, amount, source, description || '', income_date, category || 'other'],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ 
        id: this.lastID, 
        user_id, 
        amount, 
        source, 
        description, 
        income_date,
        category 
      });
    }
  );
});

// Update other income
app.put('/api/other-income/:id', (req, res) => {
  const { id } = req.params;
  const { amount, source, description, income_date, category } = req.body;

  db.run(
    `UPDATE other_income SET amount = ?, source = ?, description = ?, income_date = ?, category = ? WHERE id = ?`,
    [amount, source, description || '', income_date, category || 'other', id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Other income updated' });
    }
  );
});

// Delete other income
app.delete('/api/other-income/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM other_income WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Other income deleted' });
  });
});

// Get total other income for a user
app.get('/api/other-income/:userId/total', (req, res) => {
  const { userId } = req.params;
  db.get(
    'SELECT COALESCE(SUM(amount), 0) as total FROM other_income WHERE user_id = ?',
    [userId],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ total: row?.total || 0 });
    }
  );
});

// Get combined income summary for a specific month
app.get('/api/income/:userId/monthly/:month', (req, res) => {
  const { userId, month } = req.params;
  const year = new Date().getFullYear();
  const monthStr = String(month).padStart(2, '0');
  const startDate = `${year}-${monthStr}-01`;
  const endDate = `${year}-${monthStr}-31`;

  // Get monthly income total
  db.get(
    'SELECT COALESCE(SUM(amount), 0) as total FROM monthly_income WHERE user_id = ? AND active = 1',
    [userId],
    (err, monthlyIncome) => {
      if (err) return res.status(500).json({ error: err.message });

      // Get other income for the month
      db.get(
        'SELECT COALESCE(SUM(amount), 0) as total FROM other_income WHERE user_id = ? AND income_date >= ? AND income_date <= ?',
        [userId, startDate, endDate],
        (err2, otherIncome) => {
          if (err2) return res.status(500).json({ error: err2.message });

          res.json({
            month: monthStr,
            year,
            monthly_income: monthlyIncome?.total || 0,
            other_income: otherIncome?.total || 0,
            total_income: (monthlyIncome?.total || 0) + (otherIncome?.total || 0)
          });
        }
      );
    }
  );
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Salli Yako server running on http://localhost:${PORT}`);
});
