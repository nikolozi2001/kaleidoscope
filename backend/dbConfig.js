require('dotenv').config();
const sql = require("mssql");

// Validate required environment variables
const requiredEnvVars = ['DB_USER', 'DB_PASSWORD', 'DB_SERVER', 'DB_NAME'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars);
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  connectionTimeout: 30000,
  requestTimeout: 30000,
};

// Log configuration (without password) for debugging
if (process.env.NODE_ENV !== 'production') {
  console.log('Database Configuration:');
  console.log('Server:', config.server);
  console.log('Database:', config.database);
  console.log('User:', config.user);
  console.log('Port:', config.port);
  console.log('Encrypt:', config.options.encrypt);
  console.log('Trust Certificate:', config.options.trustServerCertificate);
}

module.exports = config;
