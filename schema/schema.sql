CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `candidate ranking` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `Full_Name` VARCHAR(255) NOT NULL,
  `Email` VARCHAR(255) NOT NULL,
  `Phone_No` VARCHAR(20) NOT NULL,
  `Domain` VARCHAR(100) NOT NULL,
  `Sub_Domain` VARCHAR(100) NOT NULL,
  `Rank` INT DEFAULT 0,
  `Date` INT NOT NULL,
  `Month` INT NOT NULL,
  `Year` INT NOT NULL,
  `dob` DATE,
  `gender` VARCHAR(50),
  `location` VARCHAR(255),
  `pincode` VARCHAR(20),
  `state` VARCHAR(100),
  `city` VARCHAR(100),
  `country` VARCHAR(100),
  `emergencyPhone` VARCHAR(20),
  `contactName` VARCHAR(255),
  `contactRelation` VARCHAR(100),
  `highestQualification` VARCHAR(100),
  `degree` VARCHAR(100),
  `courseName` VARCHAR(100),
  `collegeName` VARCHAR(255),
  `universityName` VARCHAR(255),
  `yearOfPassing` INT,
  `marks` VARCHAR(50),
  `internship_experience` TEXT,
  `skills` TEXT,
  `resume_url` VARCHAR(255),
  INDEX `idx_email` (`Email`),
  INDEX `idx_domain_subdomain` (`Domain`, `Sub_Domain`),
  INDEX `idx_year` (`Year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `franchiselogindata` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `Email` VARCHAR(255) NOT NULL,
  `Password` VARCHAR(255) NOT NULL,
  `Organization name` VARCHAR(255) NOT NULL,
  `Timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE `uniq_email_org` (`Email`, `Organization name`),
  INDEX `idx_email` (`Email`),
  INDEX `idx_timestamp` (`Timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `candidate_email_status` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `candidateEmail` VARCHAR(255) NOT NULL,
  `orgName` VARCHAR(255) NOT NULL,
  `email_status` TINYINT NOT NULL DEFAULT 0,
  `candidateName` VARCHAR(255),
  `subDomain` VARCHAR(100),
  UNIQUE `uniq_email_org` (`candidateEmail`, `orgName`),
  INDEX `idx_email_org` (`candidateEmail`, `orgName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `org_email_counts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `orgName` VARCHAR(255) NOT NULL,
  `email_sent_count` INT NOT NULL DEFAULT 0,
  UNIQUE `uniq_orgName` (`orgName`),
  INDEX `idx_orgName` (`orgName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `tokens` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `token` VARCHAR(255) NOT NULL,
  `used` TINYINT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE `uniq_token` (`token`),
  INDEX `idx_token` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `franchiselogindata` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `Email` VARCHAR(255) NOT NULL,
  `Password` VARCHAR(255) NOT NULL,
  `Organization name` VARCHAR(255) NOT NULL,
  `Timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE `uniq_email_org` (`Email`, `Organization name`),
  INDEX `idx_email` (`Email`),
  INDEX `idx_timestamp` (`Timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;