// IISNODE entry point
// This file is specifically for IIS deployment with IISNODE

// Load environment configuration first
require('./iis-startup');

// Import and start the Express app
const app = require('./index');

// Export for IISNODE
module.exports = app;