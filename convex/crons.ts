import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Clean up expired sessions every day at 03:00
crons.cron("cleanup expired sessions", "0 3 * * *", internal.users.cleanupExpiredSessions, {});

export default crons;
