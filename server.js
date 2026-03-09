require("dotenv").config();
const express = require("express");
const axios = require("axios");
const csv = require("csvtojson");
const cors = require("cors");
const mongoose = require("mongoose");
const cron = require("node-cron");

const Stock = require("./models/Stock");

const app = express();
app.use(cors());

const MONGO_API = process.env.MONGO_URI;
const PORT = 3001;

/* =========================
   MongoDB Connection
========================= */

async function connectDB() {
  await mongoose.connect(MONGO_API);
  console.log("MongoDB connected");
}

/* =========================
   Helper Functions
========================= */

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

function nseParts(d) {
  return {
    dd: String(d.getDate()).padStart(2, "0"),
    mm: String(d.getMonth() + 1).padStart(2, "0"),
    yyyy: d.getFullYear(),
  };
}

/* =========================
   Fetch NSE Bhavcopy
========================= */

async function fetchAndStoreForDate(date) {
  const tradeDate = isoDate(date);

  // Skip if already exists
  const exists = await Stock.exists({ tradeDate });
  if (exists) {
    console.log(`Skipping ${tradeDate} (already exists)`);
    return;
  }

  const { dd, mm, yyyy } = nseParts(date);

  const url = `https://archives.nseindia.com/products/content/sec_bhavdata_full_${dd}${mm}${yyyy}.csv`;

  const res = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    timeout: 10000,
  });

  const json = await csv().fromString(res.data);

  const stocks = json
    .filter((r) => r.SERIES === "EQ")
    .map((r) => ({
      symbol: r.SYMBOL,
      open: Number(r.OPEN_PRICE),
      high: Number(r.HIGH_PRICE),
      low: Number(r.LOW_PRICE),
      close: Number(r.CLOSE_PRICE),
      tradeDate,
    }));

  if (!stocks.length) return;

  await Stock.bulkWrite(
    stocks.map((s) => ({
      updateOne: {
        filter: { symbol: s.symbol, tradeDate: s.tradeDate },
        update: { $set: s },
        upsert: true,
      },
    }))
  );

  console.log(`Stored ${stocks.length} stocks for ${tradeDate}`);
}

/* =========================
   Find Latest Stored Date
========================= */

async function getLatestTradeDate() {
  const latest = await Stock.findOne().sort({ tradeDate: -1 }).lean();
  return latest ? new Date(latest.tradeDate) : null;
}

/* =========================
   Sync Missing Bhavcopies
========================= */

async function updateMissingDays() {
  console.log("Checking missing trading days...");

  const latest = await getLatestTradeDate();

  let startDate;

  if (!latest) {
    startDate = new Date();
    startDate.setDate(startDate.getDate() - 365);
  } else {
    startDate = new Date(latest);
    startDate.setDate(startDate.getDate() + 1);
  }

  const today = new Date();

  while (startDate <= today) {
    try {
      await fetchAndStoreForDate(startDate);
    } catch (err) {
      // Weekend / Holiday / NSE not uploaded yet
    }

    startDate.setDate(startDate.getDate() + 1);
  }

  console.log("Database synced with NSE");
}

/* =========================
   APIs
========================= */

// Latest trading day stocks
app.get("/stocks", async (req, res) => {
  const latest = await Stock.findOne().sort({ tradeDate: -1 }).lean();

  if (!latest) return res.json([]);

  const data = await Stock.find({ tradeDate: latest.tradeDate }).lean();

  res.json(data);
});

// Full history of a stock
app.get("/stocks/history", async (req, res) => {
  const { symbol } = req.query;

  if (!symbol)
    return res.status(400).json({ error: "symbol query required" });

  const data = await Stock.find({ symbol })
    .sort({ tradeDate: 1 })
    .lean();

  res.json(data);
});

/* =========================
   Start Server
========================= */

(async () => {
  try {
    await connectDB();

    // Sync missing NSE data
    await updateMissingDays();

    /* =========================
       Daily Auto Update
    ========================= */

    cron.schedule("0 20 * * *", async () => {
      console.log("Running daily NSE sync...");

      try {
        await updateMissingDays();
      } catch (err) {
        console.log("Daily sync failed:", err.message);
      }
    });

    app.listen(PORT, () =>
      console.log(`Server running at http://localhost:${PORT}`)
    );

  } catch (err) {
    console.error("Server failed to start:", err.message);
  }
})();