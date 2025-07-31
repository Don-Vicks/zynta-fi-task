const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const { validateJSON } = require('./middleware/validation');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api', userRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the User Registration API',
    endpoints: {
      'GET /api/users': 'Get all users',
      'POST /api/register': 'Register a new user',
      'GET /api/users/:referralCode': 'Get user by referral code',
      'GET /health': 'Health check'
    }
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// JSON parsing error handler
app.use(validateJSON);

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: error.message })
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation:`);
  console.log(`   GET    /api/users - Get all users`);
  console.log(`   POST   /api/register - Register a new user`);
  console.log(`   GET    /api/users/:referralCode - Get user by referral code`);
  console.log(`   GET    /health - Health check`);
});

module.exports = app;
