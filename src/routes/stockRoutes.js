import express from "express";
import {
  getLatestStocks,
  getStockHistory,
} from "../controllers/stockController.js";

const router = express.Router();

router.get("/stocks", getLatestStocks);
router.get("/stocks/history", getStockHistory);

export default router;