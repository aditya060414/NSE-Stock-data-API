import Stock from "../models/Stock.js";

export async function getLatestStocks(req, res) {
  const latest = await Stock.findOne().sort({ tradeDate: -1 }).lean();

  if (!latest) return res.json([]);

  const data = await Stock.find({ tradeDate: latest.tradeDate }).lean();

  res.json(data);
}

export async function getStockHistory(req, res) {
  const { symbol } = req.query;

  if (!symbol)
    return res.status(400).json({ error: "symbol query required" });

  const data = await Stock.find({ symbol })
    .sort({ tradeDate: 1 })
    .lean();

  res.json(data);
}
