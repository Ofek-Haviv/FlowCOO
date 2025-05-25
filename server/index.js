import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import { getShopifyClient, validateShopifyConnection } from './shopify.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `file:${path.join(__dirname, '..', 'prisma', 'dev.db')}`
    }
  }
});
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Basic error handling
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Test database connection
const testConnection = async () => {
  try {
    await prisma.$connect();
    console.log('Successfully connected to database');
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
};

testConnection();

app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Auth endpoints
app.post('/auth/register', async (req, res) => {
  try {
    console.log('Registration request received:', { email: req.body.email, name: req.body.name });
    const { email, password, name } = req.body;

    if (!email || !password) {
      console.log('Missing required fields:', { email: !!email, password: !!password });
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    console.log('Creating new user...');
    const user = await prisma.user.create({
      data: {
        email,
        name: name || null,
        password: hashedPassword
      }
    });

    console.log('User created successfully:', { id: user.id, email: user.email });

    // Generate token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token
    });
  } catch (error) {
    console.error('Registration error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
    res.status(500).json({ 
      error: 'Registration failed',
      details: error.message
    });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Protected route example
app.get('/auth/me', authenticateToken, async (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// --- PROJECTS ---
app.get('/projects', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });
  const projects = await prisma.project.findMany({ where: { userId: String(userId) }, include: { tasks: true } });
  res.json(projects);
});

app.post('/projects', async (req, res) => {
  const { title, category, dueDate, description, userId } = req.body;
  if (!userId || !title || !category) return res.status(400).json({ error: 'Missing required fields' });
  const project = await prisma.project.create({
    data: { title, category, dueDate: dueDate ? new Date(dueDate) : undefined, description, userId }
  });
  res.json(project);
});

app.put('/projects/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const project = await prisma.project.update({ where: { id }, data });
  res.json(project);
});

app.delete('/projects/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.project.delete({ where: { id } });
  res.json({ success: true });
});

// --- TASKS ---
app.get('/tasks', async (req, res) => {
  const { userId, projectId } = req.query;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });
  const where = { userId: String(userId) };
  if (projectId) where.projectId = String(projectId);
  const tasks = await prisma.task.findMany({ where });
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const { title, category, dueDate, description, userId, projectId } = req.body;
  if (!userId || !title || !category) return res.status(400).json({ error: 'Missing required fields' });
  const task = await prisma.task.create({
    data: { title, category, dueDate: dueDate ? new Date(dueDate) : undefined, description, userId, projectId }
  });
  res.json(task);
});

app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const task = await prisma.task.update({ where: { id }, data });
  res.json(task);
});

app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.task.delete({ where: { id } });
  res.json({ success: true });
});

// --- METRICS ---
app.get('/metrics', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });
  const metrics = await prisma.metric.findMany({ where: { userId: String(userId) } });
  res.json(metrics);
});

app.post('/metrics', async (req, res) => {
  const { title, value, change, increasing, userId } = req.body;
  if (!userId || !title || !value) return res.status(400).json({ error: 'Missing required fields' });
  const metric = await prisma.metric.create({ data: { title, value, change, increasing, userId } });
  res.json(metric);
});

app.put('/metrics/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const metric = await prisma.metric.update({ where: { id }, data });
  res.json(metric);
});

app.delete('/metrics/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.metric.delete({ where: { id } });
  res.json({ success: true });
});

// Shopify connection validation endpoint
app.post('/api/shopify/validate', async (req, res) => {
  try {
    const { accessToken } = req.body;
    console.log('Validating Shopify token...');
    
    if (!accessToken) {
      console.log('No access token provided');
      return res.status(400).json({ error: 'Access token is required' });
    }

    console.log('Attempting to validate connection with token:', accessToken.substring(0, 10) + '...');
    
    try {
      const isValid = await validateShopifyConnection(accessToken);
      if (!isValid) {
        console.log('Token validation failed');
        return res.status(401).json({ error: 'Invalid Shopify connection' });
      }
      console.log('Token validation successful');
      return res.status(200).json({ success: true });
    } catch (validationError) {
      console.error('Validation failed:', validationError);
      return res.status(401).json({ 
        error: validationError.message || 'Failed to validate Shopify connection'
      });
    }
  } catch (error) {
    console.error('Shopify validation error:', error);
    return res.status(500).json({ 
      error: 'Failed to validate Shopify connection',
      details: error.message 
    });
  }
});

// Get Shopify shop info
app.get('/api/shopify/shop', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const client = await getShopifyClient(token);
    const response = await client.get('shop.json');

    res.json(response.shop);
  } catch (error) {
    console.error('Error fetching shop info:', error);
    res.status(500).json({ error: 'Failed to fetch shop information' });
  }
});

// Get Shopify products
app.get('/api/shopify/products', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const client = await getShopifyClient(token);
    const response = await client.get('products.json');

    res.json(response.products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get Shopify orders and financial data
app.get('/api/shopify/finances', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Get the Shopify access token from the request
    const shopifyToken = req.headers['x-shopify-token'];
    if (!shopifyToken) {
      return res.status(401).json({ error: 'No Shopify token provided' });
    }

    const client = await getShopifyClient(shopifyToken);
    
    // Get recent orders
    const ordersResponse = await client.get('orders.json?status=any&limit=250');
    const orders = ordersResponse.orders;

    // Get customers
    const customersResponse = await client.get('customers.json?limit=250');
    const customers = customersResponse.customers;

    // Get products
    const productsResponse = await client.get('products.json?limit=250');
    const products = productsResponse.products;

    // Get analytics (visits) - Shopify does not provide direct API for visits, so this is a placeholder
    let websiteVisitsThisWeek = null;
    try {
      // If you have Shopify Plus or analytics app, fetch here
      // websiteVisitsThisWeek = ...
    } catch (e) {
      websiteVisitsThisWeek = null;
    }

    // Calculate this month's sales
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const salesMonthToDate = orders
      .filter(order => new Date(order.created_at) >= startOfMonth)
      .reduce((sum, order) => sum + parseFloat(order.total_price), 0);

    // Calculate this week's new customers (keep for now)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);
    const newCustomersThisWeek = customers
      .filter(customer => new Date(customer.created_at) >= startOfWeek)
      .length;

    // Calculate monthly revenue
    const monthlyRevenue = orders.reduce((acc, order) => {
      const date = new Date(order.created_at);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthYear]) {
        acc[monthYear] = 0;
      }
      acc[monthYear] += parseFloat(order.total_price);
      return acc;
    }, {});

    // Convert to array and sort by date
    const monthlyRevenueData = Object.entries(monthlyRevenue)
      .map(([month, revenue]) => ({
        month,
        revenue
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Calculate open orders (not fulfilled or shipped)
    const openOrdersCount = orders.filter(order => {
      const status = (order.fulfillment_status || '').toLowerCase();
      return status !== 'fulfilled' && status !== 'shipped';
    }).length;

    // Calculate financial metrics
    const metrics = {
      totalRevenue: orders.reduce((sum, order) => sum + parseFloat(order.total_price), 0),
      totalOrders: orders.length,
      averageOrderValue: orders.length > 0 
        ? orders.reduce((sum, order) => sum + parseFloat(order.total_price), 0) / orders.length 
        : 0,
      monthlyRevenue: monthlyRevenueData,
      recentOrders: orders.slice(0, 10).map(order => ({
        id: order.id,
        orderNumber: order.order_number,
        totalPrice: order.total_price,
        createdAt: order.created_at,
        financialStatus: order.financial_status,
        fulfillmentStatus: order.fulfillment_status
      })),
      salesMonthToDate,
      newCustomersThisWeek,
      openOrdersCount,
      websiteVisitsThisWeek
    };

    res.json(metrics);
  } catch (error) {
    console.error('Error fetching financial data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch financial data',
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}).on('error', (error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
}); 