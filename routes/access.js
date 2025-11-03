const express = require('express');
const { getConnection } = require('../config/db');
const router = express.Router();

// ABAC Policy Engine
function evaluateABAC(user, resource, permission) {
    // Get current time in IST
    const now = new Date();
    const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
    const currentHour = istTime.getHours();
    
    const startHour = user.access_start_time ? parseInt(user.access_start_time.split(':')[0]) : 9;
    const endHour = user.access_end_time ? parseInt(user.access_end_time.split(':')[0]) : 17;
    const allowedLevel = permission?.sensitivity_access || user.clearance_level;
    
    // Policy evaluation details
    const policyChecks = {
        roleAuth: { status: 'Passed', details: `User role: ${user.role}` },
        timeRestriction: null,
        departmentMatch: null,
        sensitivityLevel: null
    };
    
    // Check if user access is revoked
    if (user.access_granted === 0 || user.access_granted === false) {
        return { 
            decision: 'Deny', 
            reason: 'Access revoked by administrator',
            policyChecks
        };
    }

    if (user.role === 'Admin') {
        return { 
            decision: 'Permit', 
            reason: 'Admin has full access',
            policyChecks
        };
    }

    if (user.role === 'Professor') {
        // Check if professor has access to resource department
        let deptAccess = user.department === resource.owner_department;
        
        // If not their own department, check if they have cross-department access
        if (!deptAccess && user.departmentAccess) {
            deptAccess = user.departmentAccess.some(dept => dept.department === resource.owner_department);
        }
        
        if (!deptAccess) {
            policyChecks.departmentMatch = {
                status: 'Failed',
                details: `Professor department access not granted for ${resource.owner_department}`
            };
            return { 
                decision: 'Deny', 
                reason: 'Department access not granted',
                policyChecks
            };
        }
        
        // Time check
        const timeWithinHours = currentHour >= startHour && currentHour <= endHour;
        policyChecks.timeRestriction = {
            status: timeWithinHours ? 'Passed' : 'Failed',
            details: `Current time: ${currentHour}:00 (Allowed: ${startHour}-${endHour})`
        };
        
        if (!timeWithinHours) {
            return { 
                decision: 'Deny', 
                reason: `Access outside allowed hours (${startHour}-${endHour})`,
                policyChecks
            };
        }
        
        // Sensitivity check
        const sensitivityOk = allowedLevel >= resource.sensitivity_level;
        policyChecks.sensitivityLevel = {
            status: sensitivityOk ? 'Passed' : 'Failed',
            details: `User clearance: ${allowedLevel}, Required: ${resource.sensitivity_level}`
        };
        
        if (sensitivityOk) {
            return { 
                decision: 'Permit', 
                reason: 'Professor access within clearance level',
                policyChecks
            };
        }
        return { 
            decision: 'Deny', 
            reason: 'Sensitivity level exceeds permission',
            policyChecks
        };
    }

    if (user.role === 'Student') {
        // Check if user has access to resource department
        let deptMatch = user.department === resource.owner_department;
        
        // If not their own department, check if they have cross-department access
        if (!deptMatch && user.departmentAccess) {
            deptMatch = user.departmentAccess.some(dept => dept.department === resource.owner_department);
        }
        
        policyChecks.departmentMatch = {
            status: deptMatch ? 'Passed' : 'Failed',
            details: `User: ${user.department}, Resource: ${resource.owner_department}`
        };
        
        if (!deptMatch) {
            return { 
                decision: 'Deny', 
                reason: 'Department access not granted',
                policyChecks
            };
        }
        
        // Sensitivity check
        const sensitivityOk = allowedLevel >= resource.sensitivity_level;
        policyChecks.sensitivityLevel = {
            status: sensitivityOk ? 'Passed' : 'Failed',
            details: `User clearance: ${allowedLevel}, Required: ${resource.sensitivity_level}`
        };
        
        if (sensitivityOk) {
            return { 
                decision: 'Permit', 
                reason: 'Student access to department resource',
                policyChecks
            };
        }
        return { 
            decision: 'Deny', 
            reason: 'Sensitivity level exceeds permission',
            policyChecks
        };
    }

    return { 
        decision: 'Deny', 
        reason: 'Unknown role',
        policyChecks
    };
}

// Access evaluation
router.get('/access/:id', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    try {
        const conn = await getConnection();
        
        const [resources] = await conn.execute(
            'SELECT * FROM resources WHERE id = ?',
            [req.params.id]
        );
        
        if (resources.length === 0) {
            await conn.end();
            return res.status(404).send('Resource not found');
        }
        
        const resource = resources[0];
        
        // Get fresh user data with access times
        const [users] = await conn.execute(
            'SELECT * FROM users WHERE id = ?',
            [req.session.user.id]
        );
        
        const currentUser = users[0] || req.session.user;
        
        // Get user's department access permissions
        const [departmentAccess] = await conn.execute(
            'SELECT department FROM user_department_access WHERE user_id = ?',
            [req.session.user.id]
        );
        
        currentUser.departmentAccess = departmentAccess;
        
        // Get user permissions
        const [permissions] = await conn.execute(
            'SELECT * FROM permissions WHERE user_id = ? AND resource_id = ?',
            [req.session.user.id, resource.id]
        );
        
        const permission = permissions[0] || null;
        
        // Evaluate ABAC policy with fresh user data
        const result = evaluateABAC(currentUser, resource, permission);
        
        // Log access attempt
        await conn.execute(
            'INSERT INTO access_logs (user_id, resource_id, decision, reason, timestamp) VALUES (?, ?, ?, ?, NOW())',
            [currentUser.id, resource.id, result.decision, result.reason]
        );
        
        await conn.end();
        
        res.render('access', { 
            resource, 
            result, 
            user: currentUser 
        });
    } catch (error) {
        res.status(500).send('Error evaluating access');
    }
});

module.exports = router;