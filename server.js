require("dotenv").config();
const express = require("express");
const axios = require("axios");
const csv = require("csvtojson");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());

// ---------- MongoDB ----------
mongoose
  .connect("mongodb://127.0.0.1:27017/nse_stocks")
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

const StockSchema = new mongoose.Schema({
  symbol: String,
  open: Number,
  high: Number,
  low: Number,
  close: Number,
  tradeDate: String,
});

StockSchema.index({ symbol: 1, tradeDate: 1 }, { unique: true });

const Stock = mongoose.model("Stock", StockSchema);

// ---------- Helpers ----------
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

// ---------- Fetch & Store NSE Bhavcopy ----------
async function fetchAndStoreForDate(date) {
  const { dd, mm, yyyy } = nseParts(date);
  const tradeDate = isoDate(date);

  const url = `https://archives.nseindia.com/products/content/sec_bhavdata_full_${dd}${mm}${yyyy}.csv`;

  const res = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
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

  for (const s of stocks) {
    await Stock.updateOne(
      { symbol: s.symbol, tradeDate: s.tradeDate },
      { $set: s },
      { upsert: true },
    );
  }

  //   console.log(`Stored ${stocks.length} stocks for ${tradeDate}`);
}

// ---------- BACKFILL LAST 365 DAYS ----------
// (async () => {
//   console.log("⏳ Backfilling 12 months of NSE data...");

//   let loadedDays = 0;
//   let i = 1;

//   while (loadedDays < 260) {
//     const d = new Date();
//     d.setDate(d.getDate() - i);
//     i++;

//     try {
//       await fetchAndStoreForDate(d);
//       loadedDays++;
//       console.log(`✔ Loaded ${loadedDays}/260 → ${d.toDateString()}`);
//     } catch {
//       // Weekend / NSE holiday → skip
//     }
//   }

//   console.log("✅ 12 months NSE backfill completed");
// })();

// ---------- APIs ----------
app.get("/stocks", async (req, res) => {
  const latest = await Stock.findOne().sort({ tradeDate: -1 }).lean();
  if (!latest) return res.json([]);

  const data = await Stock.find({ tradeDate: latest.tradeDate }).lean();
  res.json(data);
});

app.get("/stocks/history", async (req, res) => {
  const { symbol } = req.query;
  if (!symbol) return res.status(400).json({ error: "symbol required" });

  const data = await Stock.find({ symbol }).sort({ tradeDate: 1 }).lean();

  res.json(data);
});

// ---------- Start ----------
app.listen(3001, () => console.log("Server running at http://localhost:3001"));
