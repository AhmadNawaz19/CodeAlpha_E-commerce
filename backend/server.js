import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch { res.status(401).json({ error: 'Invalid token' }); }
};

// --- AUTH ---
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const [r] = await db.query('INSERT INTO users (name,email,password) VALUES (?,?,?)', [name, email, hash]);
    const token = jwt.sign({ id: r.insertId, email }, process.env.JWT_SECRET);
    res.json({ token, user: { id: r.insertId, name, email } });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await db.query('SELECT * FROM users WHERE email=?', [email]);
  if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, rows[0].password);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: rows[0].id, email }, process.env.JWT_SECRET);
  res.json({ token, user: { id: rows[0].id, name: rows[0].name, email } });
});

// --- PRODUCTS ---
app.get('/api/products', async (_, res) => {
  const [rows] = await db.query('SELECT * FROM products');
  res.json(rows);
});

app.get('/api/products/:id', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM products WHERE id=?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

// --- ORDERS ---
app.post('/api/orders', auth, async (req, res) => {
  const { items, total } = req.body;
  const [r] = await db.query('INSERT INTO orders (user_id,total,items) VALUES (?,?,?)',
    [req.user.id, total, JSON.stringify(items)]);
  res.json({ id: r.insertId, message: 'Order placed!' });
});

app.get('/api/orders', auth, async (req, res) => {
  const [rows] = await db.query('SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC', [req.user.id]);
  res.json(rows);
});

app.listen(process.env.PORT, () => console.log(`API on http://localhost:${process.env.PORT}`));
