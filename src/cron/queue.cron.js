import cron from "node-cron";
import { processJobs } from "../jobs/jobProcessor.js";

cron.schedule("*/3 * * * *", processJobs);
