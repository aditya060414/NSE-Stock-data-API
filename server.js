import "dotenv/config"

import app from "./app.js"
import connectDB from "./src/config/db.js"
import { updateMissingDays } from "./src/services/nseService.js";
import startNSESyncJob from "./src/jobs/nseSyncJob.js";

const PORT  = process.env.PORT || 3001;;

async function startServer() {
  await connectDB();

  await updateMissingDays();

  startNSESyncJob();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();