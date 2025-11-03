const express = require('express');
const { getConnection } = require('../config/db');
const router = express.Router();

// User dashboard
router.get('/dashboard', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    try {
        const conn = await getConnection();
        
        // Get fresh user data
        const [users] = await conn.execute(
            'SELECT * FROM users WHERE id = ?',
            [req.session.user.id]
        );
        
        const currentUser = users[0] || req.session.user;
        
        // Get user's department access permissions
        const [userDepartments] = await conn.execute(
            'SELECT department FROM user_department_access WHERE user_id = ?',
            [req.session.user.id]
        );
        
        const [resources] = await conn.execute('SELECT * FROM resources ORDER BY name');
        
        await conn.end();
        
        res.render('dashboard', { 
            resources, 
            user: currentUser,
            userDepartments
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).send('Error loading dashboard');
    }
});

module.exports = router;