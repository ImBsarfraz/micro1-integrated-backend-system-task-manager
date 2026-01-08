import { withTransaction } from "../services/transaction.service.js";

export const createTask = async (req, res) => {
    const { project_id, title, description, priority } = req.body;

    await withTransaction(async (conn) => {
        const [result] = await conn.query(
            "INSERT INTO tasks (project_id,title,description,priority) VALUES (?,?,?,?)",
            [project_id, title, description, priority]
        );

        await conn.query(
            "INSERT INTO activity_logs (entity_type,entity_id,action) VALUES ('task',?,?)",
            [result.insertId, "CREATED"]
        );
    });

    res.status(201).json({ message: "Task created" });
};

export const updateTaskStatus = async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    await withTransaction(async (conn) => {
        const [result] = await conn.query(
            "UPDATE tasks SET status=? WHERE id=?",
            [status, id]
        );

        if (!result.affectedRows)
            throw { status: 404, message: "Task not found" };

        await conn.query(
            "INSERT INTO activity_logs (entity_type,entity_id,action,metadata) VALUES('task',?, 'STATUS_CHANGED', JSON_OBJECT('status',?))",
            [id, status]
        );
    });

    res.json({ message: "Task status updated" });
};
