-- AccessIQ Pro+ ABAC System Database Setup
-- Updated for new MySQL admin user configuration

-- Create database
CREATE DATABASE IF NOT EXISTS ABAC;
USE ABAC;

-- Drop existing tables (for clean setup)
DROP TABLE IF EXISTS access_logs;
DROP TABLE IF EXISTS permissions;
DROP TABLE IF EXISTS resources;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Professor', 'Student') NOT NULL,
    department VARCHAR(50),
    clearance_level INT DEFAULT 1,
    access_granted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create resources table
CREATE TABLE resources (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    owner_department VARCHAR(50) NOT NULL,
    sensitivity_level INT NOT NULL
);

-- Create permissions table (updated structure)
CREATE TABLE permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    resource_id INT,
    permission_type VARCHAR(100) NOT NULL,
    granted_by VARCHAR(100) NOT NULL,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE SET NULL
);

-- Create access_logs table (updated structure)
CREATE TABLE access_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    resource_id INT,
    decision VARCHAR(20) NOT NULL,
    reason VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE SET NULL
);

-- Insert demo users (updated with prof_johnson)
INSERT INTO users (username, password, role, department, clearance_level, access_granted) VALUES
('admin_user', 'Admin@123', 'Admin', 'IT', 3, TRUE),
('prof_smith', 'Prof@123', 'Professor', 'Computer Science', 2, TRUE),
('prof_johnson', 'Prof@123', 'Professor', 'Mathematics', 3, TRUE),
('mary_student', 'Stud@123', 'Student', 'Mathematics', 1, TRUE),
('john_student', 'Stud@123', 'Student', 'Computer Science', 1, FALSE);

-- Insert sample resources
INSERT INTO resources (name, resource_type, owner_department, sensitivity_level) VALUES
('CS101 Assignment 1', 'Assignment', 'Computer Science', 1),
('CS201 Midterm Results', 'Result', 'Computer Science', 2),
('Faculty Salary Report', 'Report', 'Administration', 3),
('Math101 Quiz Answers', 'Assignment', 'Mathematics', 1),
('Research Grant Proposal', 'Report', 'Computer Science', 3),
('Student Grade Database', 'Result', 'Administration', 2),
('Physics Lab Equipment', 'Resource', 'Physics', 1),
('Department Budget 2024', 'Report', 'Mathematics', 3);

-- Insert sample permissions for approved users
INSERT INTO permissions (user_id, resource_id, permission_type, granted_by) VALUES
-- Prof Smith permissions
(2, 1, 'read', 'admin_user'),
(2, 2, 'read', 'admin_user'),
-- Prof Johnson permissions  
(3, 4, 'read', 'admin_user'),
(3, 8, 'read', 'admin_user'),
-- Mary Student permissions
(4, 4, 'read', 'admin_user');

-- Insert sample access logs
INSERT INTO access_logs (user_id, resource_id, decision, reason) VALUES
(2, 1, 'Permit', 'Professor access within clearance level'),
(2, 3, 'Deny', 'Sensitivity level exceeds permission'),
(4, 4, 'Permit', 'Student access to department resource'),
(5, 1, 'Deny', 'User not approved by admin'),
(3, 8, 'Permit', 'Professor access to research document');

-- Create indexes for better performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_permissions_user_id ON permissions(user_id);
CREATE INDEX idx_access_logs_user_id ON access_logs(user_id);
CREATE INDEX idx_resources_department ON resources(owner_department);

-- Display setup summary
SELECT 'Database setup complete!' as Status;
SELECT COUNT(*) as Total_Users FROM users;
SELECT COUNT(*) as Total_Resources FROM resources;
SELECT COUNT(*) as Total_Permissions FROM permissions;
SELECT COUNT(*) as Total_Access_Logs FROM access_logs;

-- Show user status
SELECT 
    username,
    role,
    department,
    clearance_level,
    CASE WHEN access_granted THEN 'Approved' ELSE 'Pending' END as Status
FROM users
ORDER BY role, username;