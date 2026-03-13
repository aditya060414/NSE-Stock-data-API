import cron from "node-cron";
import { updateMissingDays } from "../services/nseService.js";

function startNSESyncJob() {
  cron.schedule("0 20 * * *", async () => {
    console.log("Running daily NSE sync...");

    try {
      await updateMissingDays();
    } catch (err) {
      console.log("Daily sync failed:", err.message);
    }
  });
}

export default startNSESyncJob;