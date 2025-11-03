const express = require('express');
const { getConnection } = require('../config/db');
const router = express.Router();

// Middleware to check if user is logged in
function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
}

// Update profile
router.post('/update', requireLogin, async (req, res) => {
    const { department, email, password } = req.body;
    
    try {
        const conn = await getConnection();
        
        // Build update query based on provided fields
        let updateFields = [];
        let updateValues = [];
        
        if (department) {
            updateFields.push('department = ?');
            updateValues.push(department);
        }
        
        if (email !== undefined) {
            updateFields.push('email = ?');
            updateValues.push(email);
        }
        
        if (password) {
            updateFields.push('password = ?');
            updateValues.push(password);
        }
        
        if (updateFields.length === 0) {
            await conn.end();
            return res.status(400).json({ error: 'No fields to update' });
        }
        
        updateValues.push(req.session.user.id);
        
        await conn.execute(
            `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );
        
        // Update session data
        const [updatedUser] = await conn.execute(
            'SELECT * FROM users WHERE id = ?',
            [req.session.user.id]
        );
        
        if (updatedUser.length > 0) {
            req.session.user = updatedUser[0];
        }
        
        // Log the profile update
        await conn.execute(
            'INSERT INTO access_logs (user_id, decision, reason, timestamp) VALUES (?, ?, ?, NOW())',
            [req.session.user.id, 'PROFILE_UPDATE', 'User updated their profile']
        );
        
        await conn.end();
        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

module.exports = router;