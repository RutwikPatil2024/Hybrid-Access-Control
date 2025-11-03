// import_to_cloud.js
const fs = require("fs");
const mysql = require("mysql2");

const sql = fs.readFileSync("./abac_backup.sql", "utf8");

const conn = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  multipleStatements: true,
});

conn.query(sql, (err) => {
  if (err) {
    console.error("❌ Import failed:", err.message);
    process.exit(1);
  }
  console.log("✅ Successfully imported ABAC backup into Railway MySQL");
  process.exit(0);
});
