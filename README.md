# Centralized Operations Backend

Production-grade backend system for managing users, projects, tasks,
activity logs, and background jobs.

---

## Tech Stack
- Node.js
- Express.js
- MySQL (raw SQL)
- JWT Authentication
- cookie-parser
- node-cron
- bcrypt

---

## Features
- JWT-based authentication
- Role-based access control
- Transaction-safe write operations
- Background job processing with retry logic
- Aggregated analytics
- System health monitoring

---

## Setup Instructions

### 1. Clone Repository
```bash
git clone <repo-url>
cd backend
npm install

.env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=centralized_ops

JWT_SECRET=supersecret
JWT_EXPIRES_IN=1d

CREATE DATABASE centralized_ops;
USE centralized_ops;
SOURCE sql/schema.sql;
SOURCE sql/seed.sql;
SHOW TABLES;
mysql -u root -p

npm run dev

Expected Console Output
Server running on port 5000
