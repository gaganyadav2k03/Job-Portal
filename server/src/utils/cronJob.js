import cron from "node-cron";

cron.schedule(
  "53 11 * * *", // ⏰ Runs at 11:53 AM IST daily
  () => {
    void (async () => {
      console.log(
        `[CRON] Notify TL triggered at IST: ${new Date().toLocaleString(
          "en-IN",
          {
            timeZone: "Asia/Kolkata",
          }
        )}`
      );
      try {
        console.log("[CRON] CronJob is working...");
        // const attendanceService = new AttendanceService();
        // await attendanceService.notifyTL();
      } catch (err) {
        console.error("[CRON] Error:", err);
      }
    })();
  },
  {
    timezone: "Asia/Kolkata",
  }
);
