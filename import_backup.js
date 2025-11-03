// import_backup.js
const mysql = require('mysql2');
const fs = require('fs');

const {
  MYSQLHOST,
  MYSQLUSER,
  MYSQLPASSWORD,
  MYSQLDATABASE,
  MYSQLPORT
} = process.env;

// Create MySQL connection using Railway environment variables
const connection = mysql.createConnection({
  host: MYSQLHOST || 'mysql',
  user: MYSQLUSER || 'root',
  password: MYSQLPASSWORD,
  database: MYSQLDATABASE || 'railway',
  port: MYSQLPORT || 3306,
  multipleStatements: true
});

// Read the SQL file
const sql = fs.readFileSync('./abac_backup.sql', 'utf8');

// Import SQL
connection.query(sql, (err) => {
  if (err) {
    console.error('❌ Import failed:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Successfully imported ABAC backup into Railway MySQL');
    process.exit(0);
  }
});
