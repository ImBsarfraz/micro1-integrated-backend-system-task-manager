CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','manager','user') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email)
);

CREATE TABLE projects (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  status ENUM('active','completed','archived') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  project_id BIGINT NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  priority ENUM('low','medium','high') DEFAULT 'medium',
  status ENUM('todo','in_progress','done') DEFAULT 'todo',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id),
  INDEX idx_tasks_project_status (project_id, status)
);

CREATE TABLE activity_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  entity_type VARCHAR(50),
  entity_id BIGINT,
  action VARCHAR(50),
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_activity_entity (entity_type, entity_id)
);

CREATE TABLE job_queue (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  job_type VARCHAR(50),
  payload JSON,
  status ENUM('pending','processing','failed','done') DEFAULT 'pending',
  retry_count INT DEFAULT 0,
  last_attempt_at TIMESTAMP NULL,
  INDEX idx_job_status (status)
);

CREATE TABLE job_execution_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  job_id BIGINT,
  status VARCHAR(20),
  error TEXT,
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);