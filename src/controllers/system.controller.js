import { pool } from "../config/db.js";

export const systemHealth = async (req, res) => {
    const [[db]] = await pool.query("SELECT 1");
    const [[queue]] = await pool.query(`
    SELECT
      SUM(status='pending') AS pending,
      SUM(status='failed') AS failed
    FROM job_queue
  `);

    res.json({
        db: db ? "connected" : "down",
        uptime: process.uptime(),
        queue
    });
};
