const express = require('express');
const { getConnection } = require('../config/db');
const router = express.Router();

// Login page
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// Login POST
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const conn = await getConnection();
        const [users] = await conn.execute(
            'SELECT * FROM users WHERE username = ? AND password = ?',
            [username, password]
        );
        await conn.end();

        if (users.length === 0) {
            return res.render('login', { error: 'Invalid credentials' });
        }

        const user = users[0];
        
        if (!user.access_granted && user.role !== 'Admin') {
            return res.render('login', { error: 'Access not yet approved by Admin. Please contact the administrator.' });
        }

        req.session.user = user;
        
        if (user.role === 'Admin') {
            res.redirect('/admin/dashboard');
        } else {
            res.redirect('/dashboard');
        }
    } catch (error) {
        res.render('login', { error: 'Login failed' });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;