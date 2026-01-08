import { pool } from "../config/db.js";
import { withTransaction } from "../services/transaction.service.js";

export const createProject = async (req, res) => {
    const { name, description } = req.body;

    await withTransaction(async (conn) => {
        const [result] = await conn.query(
            "INSERT INTO projects (name,description) VALUES (?,?)",
            [name, description]
        );

        await conn.query(
            "INSERT INTO activity_logs (entity_type,entity_id,action) VALUES ('project',?,?)",
            [result.insertId, "CREATED"]
        );
    });

    res.status(201).json({ message: "Project created" });
};

export const updateProject = async (req, res) => {
    const { name, description, status } = req.body;
    const { id } = req.params;

    await withTransaction(async (conn) => {
        const [result] = await conn.query(
            "UPDATE projects SET name=?, description=?, status=? WHERE id=?",
            [name, description, status, id]
        );

        if (!result.affectedRows)
            throw { status: 404, message: "Project not found" };

        await conn.query(
            "INSERT INTO activity_logs (entity_type,entity_id,action) VALUES ('project',?,?)",
            [id, "UPDATED"]
        );
    });

    res.json({ message: "Project updated" });
};

export const projectSummary = async (req, res) => {
    const { id } = req.params;

    const [rows] = await pool.query(`
    SELECT 
      COUNT(t.id) AS total_tasks,
      SUM(t.status='done') AS completed_tasks,
      SUM(t.status='in_progress') AS in_progress
    FROM tasks t
    WHERE t.project_id=?
  `, [id]);

    res.json(rows[0]);
};
