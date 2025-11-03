-- Add access time columns to users table
ALTER TABLE users 
ADD COLUMN access_start_time TIME DEFAULT '09:00:00',
ADD COLUMN access_end_time TIME DEFAULT '17:00:00';