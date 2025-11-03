const express = require('express');
const { getConnection } = require('../config/db');
const router = express.Router();

// Admin middleware
function requireAdmin(req, res, next) {
    if (!req.session.user || req.session.user.role !== 'Admin') {
        return res.redirect('/login');
    }
    next();
}

// Admin dashboard
router.get('/dashboard', requireAdmin, async (req, res) => {
    try {
        const conn = await getConnection();
        
        const [pendingUsers] = await conn.execute(
            'SELECT * FROM users WHERE access_granted = FALSE AND role != "Admin"'
        );
        
        const [approvedUsers] = await conn.execute(
            'SELECT * FROM users WHERE access_granted = TRUE AND role != "Admin"'
        );
        
        const [logs] = await conn.execute(`
            SELECT al.*, u.username, r.name as resource_name 
            FROM access_logs al 
            JOIN users u ON al.user_id = u.id 
            LEFT JOIN resources r ON al.resource_id = r.id 
            ORDER BY al.timestamp DESC LIMIT 50
        `);
        
        const [allResources] = await conn.execute(
            'SELECT * FROM resources ORDER BY name'
        );
        
        const [allUsers] = await conn.execute(
            'SELECT * FROM users ORDER BY role, username'
        );
        
        await conn.end();
        
        res.render('admin_dashboard', { 
            pendingUsers, 
            approvedUsers, 
            logs,
            allResources,
            allUsers,
            user: req.session.user,
            message: req.query.message || null
        });
    } catch (error) {
        res.status(500).send('Error loading dashboard');
    }
});

// User management page
router.get('/user/:id', requireAdmin, async (req, res) => {
    try {
        const conn = await getConnection();
        
        const [users] = await conn.execute(
            'SELECT * FROM users WHERE id = ?',
            [req.params.id]
        );
        
        const [permissions] = await conn.execute(
            'SELECT * FROM permissions WHERE user_id = ?',
            [req.params.id]
        );
        
        await conn.end();
        
        if (users.length === 0) {
            return res.status(404).send('User not found');
        }
        
        res.render('admin_user', { 
            targetUser: users[0], 
            permissions,
            user: req.session.user,
            message: req.query.message || null,
            error: req.query.error || null
        });
    } catch (error) {
        res.status(500).send('Error loading user');
    }
});

// Approve user
router.post('/user/:id/approve', requireAdmin, async (req, res) => {
    try {
        const conn = await getConnection();
        
        await conn.execute(
            'UPDATE users SET access_granted = TRUE WHERE id = ?',
            [req.params.id]
        );
        
        // Log the grant action
        await conn.execute(
            'INSERT INTO access_logs (user_id, decision, reason, timestamp) VALUES (?, ?, ?, NOW())',
            [req.params.id, 'GRANT', 'Access granted by Admin']
        );
        
        await conn.end();
        res.redirect('/admin/dashboard?message=Access granted successfully');
    } catch (error) {
        res.status(500).send('Error approving user');
    }
});

// Revoke user access
router.post('/revoke/:id', requireAdmin, async (req, res) => {
    try {
        const conn = await getConnection();
        
        // Update user access_granted to false
        await conn.execute(
            'UPDATE users SET access_granted = FALSE WHERE id = ?',
            [req.params.id]
        );
        
        // Delete existing permissions
        await conn.execute(
            'DELETE FROM permissions WHERE user_id = ?',
            [req.params.id]
        );
        
        // Log the revoke action
        await conn.execute(
            'INSERT INTO access_logs (user_id, decision, reason, timestamp) VALUES (?, ?, ?, NOW())',
            [req.params.id, 'REVOKE', 'Permission revoked by Admin']
        );
        
        await conn.end();
        res.redirect('/admin/dashboard?message=Access revoked successfully');
    } catch (error) {
        res.status(500).send('Error revoking user access');
    }
});

// Save permissions and access time
router.post('/user/:id/permissions', requireAdmin, async (req, res) => {
    const { assignment_level, result_level, report_level, access_start_time, access_end_time } = req.body;
    
    try {
        const conn = await getConnection();
        
        // Update access time (skip if columns don't exist)
        if (access_start_time && access_end_time) {
            try {
                await conn.execute(
                    'UPDATE users SET access_start_time = ?, access_end_time = ? WHERE id = ?',
                    [access_start_time, access_end_time, req.params.id]
                );
            } catch (timeError) {
                console.log('Access time columns not available, skipping time update');
            }
        }
        
        // Delete existing permissions
        await conn.execute(
            'DELETE FROM permissions WHERE user_id = ?',
            [req.params.id]
        );
        
        // Insert new permissions based on levels
        const permissionTypes = [
            { type: 'Assignment', level: assignment_level },
            { type: 'Result', level: result_level },
            { type: 'Report', level: report_level }
        ];
        
        for (const perm of permissionTypes) {
            if (perm.level && perm.level !== '0') {
                await conn.execute(
                    'INSERT INTO permissions (user_id, resource_id, permission_type, granted_by) VALUES (?, ?, ?, ?)',
                    [req.params.id, null, perm.type, req.session.user.username]
                );
            }
        }
        
        await conn.end();
        res.redirect(`/admin/user/${req.params.id}?message=Permissions saved successfully`);
    } catch (error) {
        console.error('Permission save error:', error);
        res.redirect(`/admin/user/${req.params.id}?error=Error saving permissions`);
    }
});

// Add new resource
router.post('/add-resource', requireAdmin, async (req, res) => {
    const { name, resource_type, owner_department, sensitivity_level } = req.body;
    
    try {
        const conn = await getConnection();
        
        await conn.execute(
            'INSERT INTO resources (name, resource_type, owner_department, sensitivity_level) VALUES (?, ?, ?, ?)',
            [name, resource_type, owner_department, parseInt(sensitivity_level)]
        );
        
        await conn.end();
        res.redirect('/admin/dashboard?message=Resource added successfully');
    } catch (error) {
        res.status(500).send('Error adding resource');
    }
});

// Delete resource
router.post('/delete-resource/:id', requireAdmin, async (req, res) => {
    try {
        const conn = await getConnection();
        
        await conn.execute(
            'DELETE FROM resources WHERE id = ?',
            [req.params.id]
        );
        
        await conn.end();
        res.redirect('/admin/dashboard?message=Resource deleted successfully');
    } catch (error) {
        res.status(500).send('Error deleting resource');
    }
});

// API Routes for user access management

// Get all users API
router.get('/api/users', requireAdmin, async (req, res) => {
    try {
        const conn = await getConnection();
        const [users] = await conn.execute(
            'SELECT id, username, role, department, access_start_time, access_end_time, clearance_level, access_granted FROM users WHERE role != "Admin" ORDER BY role, username'
        );
        await conn.end();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get user department access
router.get('/api/users/:id/departments', requireAdmin, async (req, res) => {
    try {
        const conn = await getConnection();
        const [departments] = await conn.execute(
            'SELECT department FROM user_department_access WHERE user_id = ?',
            [req.params.id]
        );
        await conn.end();
        res.json(departments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch department access' });
    }
});

// Update user access settings API
router.put('/api/users/:id/access', requireAdmin, async (req, res) => {
    const { department, access_start_time, access_end_time, clearance_level, access_granted, department_access } = req.body;
    
    console.log('Update request received:', {
        userId: req.params.id,
        department,
        access_start_time,
        access_end_time,
        clearance_level,
        access_granted,
        department_access
    });
    
    // Validation
    if (!department || !clearance_level) {
        return res.status(400).json({ error: 'Department and clearance level are required' });
    }
    
    try {
        const conn = await getConnection();
        
        // Check if user exists
        const [userCheck] = await conn.execute(
            'SELECT id FROM users WHERE id = ?',
            [req.params.id]
        );
        
        if (userCheck.length === 0) {
            await conn.end();
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Update user basic info
        const updateResult = await conn.execute(
            'UPDATE users SET department = ?, clearance_level = ?, access_granted = ? WHERE id = ?',
            [department, parseInt(clearance_level), access_granted ? 1 : 0, req.params.id]
        );
        
        console.log('User update result:', updateResult);
        
        // Update access times if provided
        if (access_start_time && access_end_time) {
            try {
                await conn.execute(
                    'UPDATE users SET access_start_time = ?, access_end_time = ? WHERE id = ?',
                    [access_start_time, access_end_time, req.params.id]
                );
                console.log('Access times updated successfully');
            } catch (timeError) {
                console.log('Access time update skipped (columns may not exist):', timeError.message);
            }
        }
        
        // Update department access
        await conn.execute(
            'DELETE FROM user_department_access WHERE user_id = ?',
            [req.params.id]
        );
        
        if (department_access && Array.isArray(department_access) && department_access.length > 0) {
            for (const dept of department_access) {
                await conn.execute(
                    'INSERT INTO user_department_access (user_id, department, granted_by) VALUES (?, ?, ?)',
                    [req.params.id, dept, req.session.user.username]
                );
            }
            console.log('Department access updated:', department_access);
        }
        
        // Log the access update
        await conn.execute(
            'INSERT INTO access_logs (user_id, decision, reason, timestamp) VALUES (?, ?, ?, NOW())',
            [req.params.id, 'UPDATE', `Access settings updated by ${req.session.user.username}`]
        );
        
        await conn.end();
        console.log('Update completed successfully');
        res.json({ success: true, message: 'Access settings updated successfully' });
    } catch (error) {
        console.error('Access update error:', error);
        res.status(500).json({ 
            error: 'Failed to update access settings', 
            details: error.message 
        });
    }
});

// Clear access logs API
router.delete('/api/logs/clear', requireAdmin, async (req, res) => {
    try {
        const conn = await getConnection();
        
        await conn.execute('DELETE FROM access_logs');
        
        await conn.end();
        res.json({ success: true, message: 'Access logs cleared successfully' });
    } catch (error) {
        console.error('Clear logs error:', error);
        res.status(500).json({ error: 'Failed to clear logs' });
    }
});

// Get all departments API
router.get('/api/departments', requireAdmin, async (req, res) => {
    try {
        const conn = await getConnection();
        const [departments] = await conn.execute('SELECT * FROM departments ORDER BY name');
        await conn.end();
        res.json(departments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch departments' });
    }
});

// Get all roles API
router.get('/api/roles', requireAdmin, async (req, res) => {
    try {
        const conn = await getConnection();
        const [roles] = await conn.execute('SELECT * FROM roles ORDER BY name');
        await conn.end();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch roles' });
    }
});

// Add new department API
router.post('/api/departments', requireAdmin, async (req, res) => {
    const { name, description } = req.body;
    
    if (!name) {
        return res.status(400).json({ error: 'Department name is required' });
    }
    
    try {
        const conn = await getConnection();
        const [result] = await conn.execute(
            'INSERT INTO departments (name, description) VALUES (?, ?)',
            [name, description || '']
        );
        await conn.end();
        res.json({ success: true, id: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Department already exists' });
        }
        res.status(500).json({ error: 'Failed to add department' });
    }
});

// Add new role API
router.post('/api/roles', requireAdmin, async (req, res) => {
    const { name, description } = req.body;
    
    if (!name) {
        return res.status(400).json({ error: 'Role name is required' });
    }
    
    try {
        const conn = await getConnection();
        const [result] = await conn.execute(
            'INSERT INTO roles (name, description) VALUES (?, ?)',
            [name, description || '']
        );
        await conn.end();
        res.json({ success: true, id: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Role already exists' });
        }
        res.status(500).json({ error: 'Failed to add role' });
    }
});

// Delete department API
router.delete('/api/departments/:id', requireAdmin, async (req, res) => {
    try {
        const conn = await getConnection();
        
        // Check if department is in use
        const [usage] = await conn.execute(
            'SELECT COUNT(*) as count FROM users WHERE department = (SELECT name FROM departments WHERE id = ?)',
            [req.params.id]
        );
        
        if (usage[0].count > 0) {
            await conn.end();
            return res.status(400).json({ error: 'Cannot delete department that is in use' });
        }
        
        await conn.execute('DELETE FROM departments WHERE id = ?', [req.params.id]);
        await conn.end();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete department' });
    }
});

// Delete role API
router.delete('/api/roles/:id', requireAdmin, async (req, res) => {
    try {
        const conn = await getConnection();
        
        // Check if role is in use
        const [usage] = await conn.execute(
            'SELECT COUNT(*) as count FROM users WHERE role = (SELECT name FROM roles WHERE id = ?)',
            [req.params.id]
        );
        
        if (usage[0].count > 0) {
            await conn.end();
            return res.status(400).json({ error: 'Cannot delete role that is in use' });
        }
        
        await conn.execute('DELETE FROM roles WHERE id = ?', [req.params.id]);
        await conn.end();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete role' });
    }
});

module.exports = router;