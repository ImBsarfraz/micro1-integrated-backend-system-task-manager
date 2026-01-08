import { pool } from "../config/db.js";
import { withTransaction } from "../services/transaction.service.js";
import { hashPassword } from "../utils/password.js";

export const createUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    await withTransaction(async (conn) => {
        const hash = await hashPassword(password);

        const [result] = await conn.query(
            "INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,?)",
            [name, email, hash, role]
        );

        await conn.query(
            "INSERT INTO activity_logs (entity_type,entity_id,action) VALUES ('user',?,?)",
            [result.insertId, "CREATED"]
        );
    });

    res.status(201).json({ message: "User created" });
};

export const listUsers = async (req, res) => {
    const { page = 1, limit = 10, search = "", role } = req.query;
    const offset = (page - 1) * limit;

    let where = "WHERE (name LIKE ? OR email LIKE ?)";
    const params = [`%${search}%`, `%${search}%`];

    if (role) {
        where += " AND role = ?";
        params.push(role);
    }

    const [rows] = await pool.query(
        `SELECT id,name,email,role,created_at
     FROM users ${where}
     LIMIT ? OFFSET ?`,
        [...params, Number(limit), Number(offset)]
    );

    res.json({ page, limit, data: rows });
};

