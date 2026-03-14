//imports secret codes or password from .env file
import "dotenv/config";

import app from "./app.js";
import connectDB from "./src/config/db.js";
import { updateMissingDays } from "./src/services/nseService.js";
import startNSESyncJob from "./src/jobs/nseSyncJob.js";

//port numnber configuration on which the local host will be hosted
const PORT = process.env.PORT || 3001;

async function startServer() {
  // ensures connection with database
  await connectDB();

  // server starts listening on the specified port
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

//function calls
startServer();
updateMissingDays();

startNSESyncJob();
