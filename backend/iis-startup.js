// IIS-specific environment configuration
require('dotenv').config();

// Set IIS-specific environment variables
process.env.PORT = process.env.PORT || process.env.IISNODE_PORT || 8080;
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// Import the main application
module.exports = require('./index.js');