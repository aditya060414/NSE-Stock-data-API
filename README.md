# 📈 Indian Stock Market Charting App (NSE)

A full-stack stock market application that fetches **NSE historical stock data**, stores it in **MongoDB**, and visualizes it using **TradingView Lightweight Charts** (Line & Candlestick charts).

This project is built for **learning, practice, and portfolio purposes**.

---

## 🚀 Features

- 📊 Line Chart (Close Price)
- 🕯️ Candlestick Chart (OHLC)
- ⏳ Historical Data (6–12 months)
- 🔘 Time Range Buttons (1M / 6M / 1Y / ALL)
- 🗃️ MongoDB-based time-series storage
- 🔄 Automatic NSE data backfilling
- ⚡ Fast frontend filtering (no repeated API calls)

---

## 🏗️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Axios
- csvtojson
- dotenv

### Frontend
- HTML / CSS / JavaScript
- TradingView **Lightweight Charts v4**

---

## 📁 Project Structure

project-root/
│
├── server.js # Backend server
├── package.json
│
├── stock/
│ ├── chart.html # Line chart UI
│ ├── candlestick.html # Candlestick chart UI
│
└── README.md


---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository
```bash
git clone <your-repo-url>
cd your-project

2️⃣ Install Backend Dependencies
npm install

3️⃣ Start MongoDB

Make sure MongoDB is running locally:
mongod
Database used:
nse_stocks

4️⃣ Start Backend Server
node server.js

Server runs on:
http://localhost:3001

5️⃣ Open Frontend

Use Live Server or open directly in browser:
stock/chart.html
stock/candlestick.html

🔌 API Endpoints
🔹 Get Latest Stocks
GET /stocks
Returns latest trading day data for all stocks.

🔹 Get Historical Data for a Stock
GET /stocks/history?symbol=RELIANCE


Response example:

[
  {
    "symbol": "RELIANCE",
    "tradeDate": "2026-02-19",
    "open": 1443,
    "high": 1443,
    "low": 1400,
    "close": 1409.5
  }
]

📊 Charts Data Format
Line Chart
{
  time: { year: 2026, month: 2, day: 19 },
  value: 1409.5
}

Candlestick Chart
{
  time: { year: 2026, month: 2, day: 19 },
  open: 1443,
  high: 1443,
  low: 1400,
  close: 1409.5
}

⏳ Time Range Buttons Logic
Button	Data Range
1M	Last 30 trading days
6M	Last 180 trading days
1Y	Last 365 trading days
ALL	Full available history

Filtering is done client-side for speed.

🧠 Key Learnings

Time-series data handling

NSE CSV ingestion

MongoDB upserts

Frontend chart debugging

Financial date logic

Range-based data filtering

⚠️ Disclaimer

This project is for educational purposes only.
Stock market data should not be used for real trading decisions.

🔮 Future Enhancements

📊 Volume bars

📉 Technical indicators (EMA, SMA, RSI)

⚡ Intraday data

⚛️ React-based frontend

🌐 Deployment (Vercel + MongoDB Atlas)

👨‍💻 Author

Built by Aditya Singh
Learning Full-Stack Development & Financial Data Systems