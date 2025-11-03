-- Add email column to users table
USE ABAC;
ALTER TABLE users ADD COLUMN email VARCHAR(255) NULL;