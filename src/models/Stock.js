import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  symbol: String,
  open: Number,
  high: Number,
  low: Number,
  close: Number,

  tradeDate: {
    type: String, // FORCE STRING
    index: true,
  },
});

// Prevent duplicate entries per day
stockSchema.index({ symbol: 1, tradeDate: 1 }, { unique: true });

const Stock = mongoose.model("Stock", stockSchema);

export default Stock;
