const mysql = require('mysql2/promise');

const dbConfig = {
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
        console.log('✅ Connected to MySQL Database: ABAC using admin@localhost');
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
}

module.exports = { getConnection, testConnection };