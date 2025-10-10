require('dotenv').config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

// Import routes
const itemsRoute = require("./routes/items");
const groupIndexRoute = require("./routes/groupindex");
const groupIndexRightPanelRoute = require("./routes/groupindexrightpanel");
const groupWeightRoute = require("./routes/groupweight");
const groupWeightChartRoute = require("./routes/groupweightchart");

// Import middleware
const errorHandler = require("./middleware/errorHandler");
const logger = require("./config/logger");

const app = express();

// IIS-specific port configuration
const PORT = process.env.PORT || process.env.IISNODE_PORT || 8080;

// Trust proxy for IIS
app.set('trust proxy', true);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for now to avoid conflicts
  crossOriginEmbedderPolicy: false
}));

// Rate limiting - adjusted for IIS
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 200, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP, please try again later.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Use X-Forwarded-For header from IIS
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'unknown';
  }
});

app.use(limiter);

// Compression middleware
app.use(compression());

// CORS configuration - Allow all origins with proper headers
const corsOptions = {
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With', 
    'Accept', 
    'Origin',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Methods'
  ],
  exposedHeaders: ['Access-Control-Allow-Origin'],
  optionsSuccessStatus: 200, // For legacy browser support
  preflightContinue: false
};

app.use(cors(corsOptions));

// Additional CORS headers middleware for production
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware - simplified for IIS
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoints
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    port: PORT
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    port: PORT
  });
});

// Database health check endpoint
app.get('/api/health/db', async (req, res) => {
  const sql = require("mssql");
  const { config } = require("./dbConfig");
  
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT 1 as test');
    await pool.close();
    
    res.status(200).json({
      success: true,
      message: 'Database connection is healthy',
      timestamp: new Date().toISOString(),
      database: {
        server: config.server,
        database: config.database,
        user: config.user,
        connected: true
      }
    });
  } catch (error) {
    logger.error('Database health check failed:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      timestamp: new Date().toISOString(),
      error: {
        code: error.code,
        message: error.message
      },
      database: {
        server: config.server,
        database: config.database,
        user: config.user,
        connected: false
      }
    });
  }
});

// API routes
app.use("/api/items", itemsRoute);
app.use("/api/groupindex", groupIndexRoute);
app.use("/api/groupindexrightpanel", groupIndexRightPanelRoute);
app.use("/api/groupweight", groupWeightRoute);
app.use("/api/groupweightchart", groupWeightChartRoute);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.originalUrl} not found`
    }
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// Start server - IIS handles the listening when deployed
if (process.env.NODE_ENV !== 'production' || !process.env.IISNODE_PORT) {
  const server = app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Server is running on http://localhost:${PORT}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Please use a different port.`);
      logger.error(`Port ${PORT} is already in use. Please use a different port.`);
    } else if (err.code === 'EACCES') {
      console.error(`Permission denied to bind to port ${PORT}. Please use a different port or run with admin privileges.`);
      logger.error(`Permission denied to bind to port ${PORT}. Please use a different port or run with admin privileges.`);
    } else {
      console.error('Server error:', err);
      logger.error('Server error:', err);
    }
    process.exit(1);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      logger.info('Process terminated');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    logger.info('SIGINT received. Shutting down gracefully...');
    server.close(() => {
      logger.info('Process terminated');
      process.exit(0);
    });
  });
} else {
  // Running under IIS - just export the app
  logger.info('Running under IIS/IISNODE');
  console.log('Running under IIS/IISNODE');
}

module.exports = app;
