const mysql = require('mysql2/promise');
require('dotenv').config();

// Use Railway DATABASE_URL if available, otherwise fallback to local config
const dbConfig = process.env.DATABASE_URL
  ? process.env.DATABASE_URL  // Railway auto-provided connection URL
  : {
      host: '127.0.0.1',
      port: 3306,
      user: 'admin',
      password: 'admin@123',
      database: 'ABAC'
    };

async function getConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    return connection;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
}

async function testConnection() {
  try {
    const connection = await getConnection();
    await connection.ping();
    await connection.end();

    if (process.env.DATABASE_URL) {
      console.log('✅ Connected to Railway MySQL Database via DATABASE_URL');
    } else {
      console.log('✅ Connected to Local MySQL Database: ABAC using admin@localhost');
    }
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

module.exports = { getConnection, testConnection };
