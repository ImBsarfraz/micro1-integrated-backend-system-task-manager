export const validate = (schema) => (req, res, next) => {
    for (const key of schema) {
        if (!req.body[key]) {
            return res.status(400).json({ message: `${key} is required` });
        }
    }
    next();
};
