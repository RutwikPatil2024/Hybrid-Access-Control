-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: ABAC
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `access_logs`
--

DROP TABLE IF EXISTS `access_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `access_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `resource_id` int DEFAULT NULL,
  `decision` varchar(20) NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `resource_id` (`resource_id`),
  KEY `idx_access_logs_user_id` (`user_id`),
  CONSTRAINT `access_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `access_logs_ibfk_2` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `access_logs`
--

LOCK TABLES `access_logs` WRITE;
/*!40000 ALTER TABLE `access_logs` DISABLE KEYS */;
INSERT INTO `access_logs` VALUES (1,2,NULL,'Permit','Professor access within clearance level','2025-11-01 13:12:05'),(2,2,NULL,'Deny','Sensitivity level exceeds permission','2025-11-01 13:12:05'),(3,4,NULL,'Permit','Student access to department resource','2025-11-01 13:12:05'),(4,5,NULL,'Deny','User not approved by admin','2025-11-01 13:12:05'),(5,3,NULL,'Permit','Professor access to research document','2025-11-01 13:12:05'),(6,2,NULL,'Deny','Access outside business hours (9-17)','2025-11-01 13:16:31'),(7,2,NULL,'Deny','Access outside business hours (9-17)','2025-11-01 13:16:44'),(8,2,NULL,'Deny','Access outside business hours (9-17)','2025-11-01 13:16:50'),(9,6,NULL,'Deny','Department mismatch','2025-11-01 13:22:19'),(10,2,NULL,'REVOKE','Permission revoked by Admin','2025-11-01 13:28:53'),(11,2,NULL,'GRANT','Access granted by Admin','2025-11-01 13:31:03'),(12,6,NULL,'Permit','Student access to department resource','2025-11-01 13:32:06'),(13,6,NULL,'Deny','Sensitivity level exceeds permission','2025-11-01 13:32:44'),(14,6,NULL,'Deny','Department mismatch','2025-11-01 13:33:06'),(15,1,NULL,'Permit','Admin has full access','2025-11-01 13:36:40'),(16,1,NULL,'Permit','Admin has full access','2025-11-01 13:36:56'),(17,6,NULL,'Permit','Student access to department resource','2025-11-01 13:42:36'),(18,6,NULL,'Deny','Sensitivity level exceeds permission','2025-11-01 13:43:05'),(19,6,NULL,'Deny','Sensitivity level exceeds permission','2025-11-01 13:44:42'),(20,6,NULL,'Deny','Sensitivity level exceeds permission','2025-11-01 13:45:17'),(21,6,NULL,'Deny','Sensitivity level exceeds permission','2025-11-01 13:45:40'),(22,6,NULL,'Permit','Student access to department resource','2025-11-01 13:48:21'),(23,2,NULL,'Deny','Access outside business hours (9-17)','2025-11-01 13:49:50'),(24,2,NULL,'Deny','Access outside business hours (9-17)','2025-11-01 13:50:30'),(25,6,9,'Permit','Student access to department resource','2025-11-01 14:22:20'),(26,2,9,'Deny','Access outside allowed hours (9-17)','2025-11-01 14:22:52'),(27,2,9,'Deny','Access outside allowed hours (9-17)','2025-11-01 14:24:01'),(28,6,9,'Permit','Student access to department resource','2025-11-02 04:33:52'),(29,6,11,'Deny','Department mismatch','2025-11-02 04:34:11'),(30,6,10,'Deny','Sensitivity level exceeds permission','2025-11-02 04:34:46'),(31,6,6,'Deny','Department mismatch','2025-11-02 04:34:54'),(32,3,11,'Permit','Professor access within clearance level','2025-11-02 04:35:56'),(33,3,11,'Permit','Professor access within clearance level','2025-11-02 04:36:27'),(34,3,10,'Permit','Professor access within clearance level','2025-11-02 04:36:42'),(35,3,9,'Permit','Professor access within clearance level','2025-11-02 04:36:50'),(36,3,10,'Permit','Professor access within clearance level','2025-11-02 04:36:54'),(37,3,11,'Deny','Access outside allowed hours (11-22)','2025-11-02 04:41:46'),(38,3,11,'Deny','Access outside allowed hours (11-22)','2025-11-02 04:52:01'),(39,3,9,'Deny','Access outside allowed hours (11-22)','2025-11-02 04:52:23'),(40,3,10,'Deny','Access outside allowed hours (11-22)','2025-11-02 04:52:28'),(41,3,6,'Deny','Access outside allowed hours (11-22)','2025-11-02 04:52:33'),(42,3,11,'Permit','Professor access within clearance level','2025-11-02 04:53:30'),(43,3,6,'Permit','Professor access within clearance level','2025-11-02 04:53:46'),(44,3,10,'Permit','Professor access within clearance level','2025-11-02 04:53:54'),(45,3,9,'Permit','Professor access within clearance level','2025-11-02 04:53:58'),(46,3,11,'Permit','Professor access within clearance level','2025-11-02 04:54:02'),(47,5,NULL,'REVOKE','Permission revoked by Admin','2025-11-02 04:55:14'),(48,6,11,'Deny','Department mismatch','2025-11-02 04:57:10'),(49,6,10,'Deny','Sensitivity level exceeds permission','2025-11-02 04:57:21'),(50,6,6,'Deny','Department mismatch','2025-11-02 04:57:27'),(51,6,9,'Permit','Student access to department resource','2025-11-02 04:57:38'),(52,6,NULL,'UPDATE','Access settings updated by admin_user','2025-11-02 05:33:28'),(53,6,11,'Deny','Sensitivity level exceeds permission','2025-11-02 05:36:26'),(54,6,NULL,'UPDATE','Access settings updated by admin_user','2025-11-02 05:37:19'),(55,6,11,'Permit','Student access to department resource','2025-11-02 05:37:42'),(56,6,6,'Permit','Student access to department resource','2025-11-02 05:37:54'),(57,6,10,'Permit','Student access to department resource','2025-11-02 05:38:02'),(58,6,9,'Permit','Student access to department resource','2025-11-02 05:38:07'),(59,5,NULL,'GRANT','Access granted by Admin','2025-11-02 05:43:10'),(60,5,NULL,'REVOKE','Permission revoked by Admin','2025-11-02 05:43:30'),(61,5,NULL,'GRANT','Access granted by Admin','2025-11-02 05:44:17'),(62,5,9,'Permit','Student access to department resource','2025-11-02 05:45:10'),(63,5,11,'Deny','Department access not granted','2025-11-02 05:45:16'),(64,2,9,'Permit','Professor access within clearance level','2025-11-02 05:47:57'),(65,2,12,'Permit','Professor access within clearance level','2025-11-02 05:49:45');
/*!40000 ALTER TABLE `access_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `resource_id` int DEFAULT NULL,
  `permission_type` varchar(100) NOT NULL,
  `granted_by` varchar(100) NOT NULL,
  `granted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `resource_id` (`resource_id`),
  KEY `idx_permissions_user_id` (`user_id`),
  CONSTRAINT `permissions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `permissions_ibfk_2` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (12,4,NULL,'Assignment','admin_user','2025-11-01 13:19:24'),(13,4,NULL,'Result','admin_user','2025-11-01 13:19:24'),(14,4,NULL,'Report','admin_user','2025-11-01 13:19:24'),(36,3,NULL,'Assignment','admin_user','2025-11-02 04:53:10'),(37,3,NULL,'Result','admin_user','2025-11-02 04:53:10'),(38,3,NULL,'Report','admin_user','2025-11-02 04:53:10'),(39,6,NULL,'Assignment','admin_user','2025-11-02 04:56:34'),(40,6,NULL,'Result','admin_user','2025-11-02 04:56:34'),(41,6,NULL,'Report','admin_user','2025-11-02 04:56:34');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resources`
--

DROP TABLE IF EXISTS `resources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resources` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `resource_type` varchar(100) NOT NULL,
  `owner_department` varchar(50) NOT NULL,
  `sensitivity_level` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_resources_department` (`owner_department`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resources`
--

LOCK TABLES `resources` WRITE;
/*!40000 ALTER TABLE `resources` DISABLE KEYS */;
INSERT INTO `resources` VALUES (6,'Student Grade Database','Result','Administration',2),(9,'Mid SEM Result','Assignment','Computer Science',1),(10,'Student Details','Document','Computer Science',3),(11,'College Budget','Report','Administration',3),(12,'Teacher Records','Document','Computer Science',2);
/*!40000 ALTER TABLE `resources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_department_access`
--

DROP TABLE IF EXISTS `user_department_access`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_department_access` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `department` varchar(50) NOT NULL,
  `granted_by` varchar(100) NOT NULL,
  `granted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_dept` (`user_id`,`department`),
  CONSTRAINT `user_department_access_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_department_access`
--

LOCK TABLES `user_department_access` WRITE;
/*!40000 ALTER TABLE `user_department_access` DISABLE KEYS */;
INSERT INTO `user_department_access` VALUES (4,6,'Computer Science','admin_user','2025-11-02 05:37:19'),(5,6,'Mathematics','admin_user','2025-11-02 05:37:19'),(6,6,'Physics','admin_user','2025-11-02 05:37:19'),(7,6,'Administration','admin_user','2025-11-02 05:37:19'),(8,6,'IT','admin_user','2025-11-02 05:37:19');
/*!40000 ALTER TABLE `user_department_access` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Admin','Professor','Student') NOT NULL,
  `department` varchar(50) DEFAULT NULL,
  `clearance_level` int DEFAULT '1',
  `access_granted` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `access_start_time` time DEFAULT '09:00:00',
  `access_end_time` time DEFAULT '17:00:00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `idx_users_username` (`username`),
  KEY `idx_users_role` (`role`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin_user','Admin@123','Admin','IT',3,1,'2025-11-01 13:12:04','09:00:00','17:00:00'),(2,'prof_smith','Prof@123','Professor','Computer Science',2,1,'2025-11-01 13:12:04','09:00:00','17:00:00'),(3,'prof_johnson','Prof@123','Professor','Mathematics',3,1,'2025-11-01 13:12:04','10:00:00','22:00:00'),(4,'mary_student','Stud@123','Student','Mathematics',1,1,'2025-11-01 13:12:04','09:00:00','17:00:00'),(5,'john_student','Stud@123','Student','Computer Science',1,1,'2025-11-01 13:12:04','09:00:00','17:00:00'),(6,'Rutwik','abc123','Student','Computer Science',3,1,'2025-11-01 13:20:16','10:00:00','22:00:00');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-03 22:04:39
