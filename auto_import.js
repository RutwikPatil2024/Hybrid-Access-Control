// auto_import.js
const fs = require("fs");
const mysql = require("mysql2");

console.log("🚀 Starting automatic SQL import...");

try {
  if (!fs.existsSync("./abac_backup.sql")) {
    console.error("❌ abac_backup.sql not found in project root!");
    process.exit(1);
  }

  const sql = fs.readFileSync("./abac_backup.sql", "utf8");

  const conn = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT,
    multipleStatements: true,
  });

  conn.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Import failed with SQL error:");
      console.error(err);
      process.exit(1);
    } else {
      console.log("✅ ABAC backup imported successfully into Railway MySQL!");
      process.exit(0);
    }
  });
} catch (e) {
  console.error("❌ Unexpected import failure:");
  console.error(e);
  process.exit(1);
}
