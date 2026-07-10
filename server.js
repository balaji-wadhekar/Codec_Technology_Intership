const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = express();
app.use(cors());
app.use(express.json());

// Schemas
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true }
});
const Product = mongoose.model('Product', productSchema);

// Seed Data
const seedProducts = [
  { id: 'p1', name: 'MacBook Pro M3', price: 1999, category: 'Laptops', description: 'Powerful laptop for professionals.' },
  { id: 'p2', name: 'iPhone 15 Pro', price: 999, category: 'Smartphones', description: 'Latest Apple smartphone with titanium body.' },
  { id: 'p3', name: 'Sony WH-1000XM5', price: 398, category: 'Audio', description: 'Industry leading noise canceling headphones.' },
  { id: 'p4', name: 'iPad Pro 12.9', price: 1099, category: 'Tablets', description: 'The ultimate iPad experience.' },
  { id: 'p5', name: 'Logitech MX Master 3S', price: 99, category: 'Accessories', description: 'Advanced wireless mouse.' },
  { id: 'p6', name: 'Samsung 49" Odyssey G9', price: 1299, category: 'Monitors', description: 'Ultra-wide gaming monitor.' }
];

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'E-Commerce Backend Server is Running Successfully!' });
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({}, '-_id -__v');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }
  // Fake JWT
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake_token_for_' + email;
  res.json({ token, message: 'Login successful' });
});

// Initialization
let mongoServer;
const startServer = async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log('Connected to In-Memory MongoDB');

    // Seed database
    await Product.deleteMany({});
    await Product.insertMany(seedProducts);
    console.log('Database seeded with 6 tech products');

    const PORT = 5000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
  }
};

startServer();
