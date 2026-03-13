import axios from "axios";
import csv from "csvtojson";
import Stock from "../models/Stock.js";
import { isoDate, nseParts } from "../utils/dateUtils.js";

/* =========================
   Fetch NSE Bhavcopy
========================= */

export async function fetchAndStoreForDate(date) {
  const tradeDate = isoDate(date);

  const exists = await Stock.exists({ tradeDate });
  if (exists) {
    console.log(`Skipping ${tradeDate} (already exists)`);
    return;
  }

  const { dd, mm, yyyy } = nseParts(date);

  const url = `https://archives.nseindia.com/products/content/sec_bhavdata_full_${dd}${mm}${yyyy}.csv`;

  const res = await axios.get(url, {
  headers: {
    "User-Agent": "Mozilla/5.0",
    "Accept": "text/csv",
    "Referer": "https://www.nseindia.com/"
  },
  timeout: 15000,
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

export async function getLatestTradeDate() {
  const latest = await Stock.findOne().sort({ tradeDate: -1 }).lean();
  return latest ? new Date(latest.tradeDate) : null;
}

/* =========================
   Sync Missing Bhavcopies
========================= */

export async function updateMissingDays() {
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
    } catch (err) {}

    startDate.setDate(startDate.getDate() + 1);
  }

  console.log("Database synced with NSE");
}