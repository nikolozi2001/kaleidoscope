require('dotenv').config();
const sql = require("mssql");
const config = require("./dbConfig");

console.log('Database Configuration:');
console.log('Server:', config.server);
console.log('Database:', config.database);
console.log('User:', config.user);
console.log('Password:', config.password ? '[HIDDEN]' : 'NOT SET');
console.log('Encrypt:', config.options.encrypt);
console.log('Trust Certificate:', config.options.trustServerCertificate);

async function testConnection() {
  try {
    console.log('\nAttempting to connect to database...');
    const pool = await sql.connect(config);
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const result = await pool.request().query('SELECT 1 as test');
    console.log('✅ Test query successful:', result.recordset);
    
    await pool.close();
    console.log('✅ Connection closed successfully');
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
  }
}

testConnection();