// server.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const path = require('path');
const { testConnection } = require('./config/db');

const authRoutes = require('./routes/auth');
const registerRoutes = require('./routes/register');
const adminRoutes = require('./routes/admin');
const accessRoutes = require('./routes/access');
const resourceRoutes = require('./routes/resources');
const profileRoutes = require('./routes/profile');

const app = express();

// Use Railway PORT dynamically or default to 4000 locally
const PORT = process.env.PORT || 4000;

// ✅ Configure session store using Railway MySQL
const dbOptions = {
  uri: process.env.DATABASE_URL, // Railway auto-provided
  createDatabaseTable: true,
  connectionLimit: 10
};

const sessionStore = new MySQLStore(dbOptions);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use(session({
  secret: 'accessiq-secret-key',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,       // ✅ Persistent session storage
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 // 1 hour
  }
}));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', authRoutes);
app.use('/', registerRoutes);
app.use('/admin', adminRoutes);
app.use('/', accessRoutes);
app.use('/', resourceRoutes);
app.use('/profile', profileRoutes);

// Root redirect
app.get('/', (req, res) => res.redirect('/login'));

// ✅ Start server
app.listen(PORT, async () => {
  console.log(`🚀 AccessIQ running on port ${PORT}`);
  console.log(`👥 Users: admin_user, prof_smith, prof_jones, mary_student, john_student`);
  
  // Verify DB connection
  await testConnection();
  console.log('✅ Session Store: MySQL connected successfully.');
});
