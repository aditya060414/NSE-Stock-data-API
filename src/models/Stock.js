import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  symbol: String,
  open: Number,
  high: Number,
  low: Number,
  close: Number,

  // 🔴 IMPORTANT FIX
  tradeDate: {
    type: String, // FORCE STRING
    index: true,
  },
});

// Prevent duplicate entries per day
stockSchema.index({ symbol: 1, tradeDate: 1 }, { unique: true });

const stock = mongoose.model("Stock", stockSchema);

export default stock;
