const express = require('express');
const { getConnection } = require('../config/db');
const router = express.Router();

// Registration page
router.get('/register', async (req, res) => {
    try {
        const conn = await getConnection();
        
        // Get available departments and roles
        const [departments] = await conn.execute('SELECT * FROM departments ORDER BY name');
        const [roles] = await conn.execute('SELECT * FROM roles WHERE name != "Admin" ORDER BY name');
        
        await conn.end();
        
        res.render('register', { 
            message: null, 
            error: null,
            departments,
            roles
        });
    } catch (error) {
        console.error('Error loading registration page:', error);
        res.render('register', { 
            message: null, 
            error: null,
            departments: [],
            roles: []
        });
    }
});

// Registration POST
router.post('/register', async (req, res) => {
    const { username, password, role, department } = req.body;
    
    try {
        const conn = await getConnection();
        
        // Check if username exists
        const [existing] = await conn.execute(
            'SELECT id FROM users WHERE username = ?',
            [username]
        );
        
        if (existing.length > 0) {
            await conn.end();
            return res.render('register', { 
                error: 'Username already exists', 
                message: null 
            });
        }
        
        // Insert new user
        await conn.execute(
            'INSERT INTO users (username, password, role, department, access_granted) VALUES (?, ?, ?, ?, ?)',
            [username, password, role, department, false]
        );
        
        await conn.end();
        
        res.render('register', { 
            message: '✅ Registration complete. Wait for admin approval.',
            error: null 
        });
    } catch (error) {
        res.render('register', { 
            error: 'Registration failed', 
            message: null 
        });
    }
});

module.exports = router;