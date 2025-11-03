const express = require('express');
const session = require('express-session');
const path = require('path');
const { testConnection } = require('./config/db');

const authRoutes = require('./routes/auth');
const registerRoutes = require('./routes/register');
const adminRoutes = require('./routes/admin');
const accessRoutes = require('./routes/access');
const resourceRoutes = require('./routes/resources');
const profileRoutes = require('./routes/profile');

const app = express();
const PORT = 4000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(session({
    secret: 'abac-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
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
app.get('/', (req, res) => {
    res.redirect('/login');
});

app.listen(PORT, async () => {
    console.log(`🚀 AccessIQ running on http://localhost:${PORT}`);
    console.log(`👥 Users: admin_user, prof_smith, prof_jones, mary_student, john_student`);
    
    // Test database connection
    await testConnection();
});