import { pool } from "../config/db.js";

export const processJobs = async () => {
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        const [jobs] = await conn.query(`
      SELECT * FROM job_queue
      WHERE status='pending' AND retry_count < 3
      LIMIT 5
      FOR UPDATE
    `);

        for (const job of jobs) {
            try {
                await conn.query(
                    "UPDATE job_queue SET status='processing', last_attempt_at=NOW() WHERE id=?",
                    [job.id]
                );

                await new Promise(r => setTimeout(r, 500));

                await conn.query(
                    "UPDATE job_queue SET status='done' WHERE id=?",
                    [job.id]
                );

                await conn.query(
                    "INSERT INTO job_execution_logs (job_id,status) VALUES (?,?)",
                    [job.id, "SUCCESS"]
                );
            } catch (err) {
                await conn.query(
                    "UPDATE job_queue SET retry_count=retry_count+1, status='failed' WHERE id=?",
                    [job.id]
                );

                await conn.query(
                    "INSERT INTO job_execution_logs (job_id,status,error) VALUES (?,?,?)",
                    [job.id, "FAILED", err.message]
                );
            }
        }

        await conn.commit();
    } catch (err) {
        await conn.rollback();
    } finally {
        conn.release();
    }
};