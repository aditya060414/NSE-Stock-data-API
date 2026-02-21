require("dotenv").config();
const express = require("express");
const axios = require("axios");
const csv = require("csvtojson");
const cors = require("cors");
const mongoose = require("mongoose");
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
  console.log("✅ MongoDB connected");
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
   Fetch & Store NSE Data
========================= */
async function fetchAndStoreForDate(date) {
  const tradeDate = isoDate(date);

  // ✅ SKIP if already exists (IMPORTANT)
  const exists = await Stock.exists({ tradeDate });
  if (exists) {
    console.log(`⏩ Skipping ${tradeDate} (already in DB)`);
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

  // 🚀 FAST BULK UPSERT
  await Stock.bulkWrite(
    stocks.map((s) => ({
      updateOne: {
        filter: { symbol: s.symbol, tradeDate: s.tradeDate },
        update: { $set: s },
        upsert: true,
      },
    }))
  );

  console.log(`✔ Stored ${stocks.length} stocks for ${tradeDate}`);
}

/* =========================
   Backfill (Runs ONLY ONCE)
========================= */
async function backfillLast12Months() {
  console.log("⏳ Backfilling last 12 months (only missing days)...");

  let loadedDays = 0;
  let i = 1;

  while (loadedDays < 260) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    i++;

    try {
      await fetchAndStoreForDate(d);
      loadedDays++;
    } catch (err) {
      // Weekend / Holiday / NSE error
    }
  }

  console.log("✅ Backfill completed");
}

/* =========================
   APIs
========================= */

// Latest trading day
app.get("/stocks", async (req, res) => {
  const latest = await Stock.findOne().sort({ tradeDate: -1 }).lean();
  if (!latest) return res.json([]);

  const data = await Stock.find({ tradeDate: latest.tradeDate }).lean();
  res.json(data);
});

// Full history of a stock
app.get("/stocks/history", async (req, res) => {
  const { symbol } = req.query;
  if (!symbol) return res.status(400).json({ error: "symbol required" });

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

    // 🔥 Backfill ONLY if DB is empty
    const count = await Stock.estimatedDocumentCount();
    if (count === 0) {
      await backfillLast12Months();
    } else {
      console.log("✅ Data already exists, skipping backfill");
    }

    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ Server failed to start:", err.message);
  }
})();