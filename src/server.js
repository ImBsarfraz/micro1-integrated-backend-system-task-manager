import "./config/env.js";
import app from "./app.js";
import "./cron/queue.cron.js";

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
