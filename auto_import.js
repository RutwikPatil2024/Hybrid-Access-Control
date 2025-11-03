// auto_import.js
const fs = require("fs");
const mysql = require("mysql2");
const url = require("url");

console.log("🚀 Starting automatic SQL import...");

try {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL not found. Check Railway environment variables.");
    process.exit(1);
  }

  const sql = fs.readFileSync("./abac_backup.sql", "utf8");

  // Parse DATABASE_URL
  const parsedUrl = new url.URL(process.env.DATABASE_URL);

  const conn = mysql.createConnection({
    host: parsedUrl.hostname,
    user: parsedUrl.username,
    password: parsedUrl.password,
    database: parsedUrl.pathname.replace("/", ""),
    port: parsedUrl.port || 3306,
    multipleStatements: true,
  });

  conn.query(sql, (err) => {
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
