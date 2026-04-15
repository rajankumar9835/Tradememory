// server.js — TradeMemory Express API server
import YahooFinance from 'yahoo-finance2';
import "dotenv/config";
import express from "express";
import cors from "cors";
import { runAgent } from "./agent.js";
import { recallMemories, listMemories } from "./hindsight.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
}));
app.use(express.json({ limit: "2mb" }));

// Health check updated with correct model ID
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        service: "TradeMemory API",
        timestamp: new Date().toISOString(),
        models: {
            llm: "qwen/qwen3-32b", 
            memory: "Hindsight by Vectorize",
        },
    });
});

app.post("/api/chat", async (req, res) => {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "messages array required" });
    }
    try {
        const { response, toolsUsed } = await runAgent({ messages });
        res.json({ response, toolsUsed });
    } catch (error) {
        console.error("[/api/chat] Error:", error.message);
        res.status(500).json({ error: "Agent error", message: error.message });
    }
});

app.get("/api/stats", async (req, res) => {
    try {
        const result = await listMemories({ limit: 100 });
        const docs = result.documents || [];
        const trades = docs.filter((d) => d.metadata?.type === "trade_log");
        const wins = trades.filter((d) => d.metadata?.outcome === "WIN");

        res.json({
            totalMemories: docs.length,
            totalTrades: trades.length,
            winRate: trades.length > 0 ? ((wins.length / trades.length) * 100).toFixed(1) : "0.0",
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`TradeMemory API Running on Port: ${PORT}`);
    console.log(`LLM Configured: qwen/qwen3-32b`);
});

const yahooFinance = new YahooFinance(); // Add this line if you haven't!

app.get("/api/market-ticker", async (req, res) => {
  try {
    const symbols = ["^NSEI", "RELIANCE.NS", "TCS.NS", "ZOMATO.NS", "HDFCBANK.NS"];
    // IMPORTANT: yahooFinance.quote expects symbols to be passed correctly
    const results = await yahooFinance.quote(symbols); 

    const tickerData = results.map(stock => {
      const priceChange = stock.regularMarketChangePercent || 0;
      const symbolMap = { "^NSEI": "NIFTY", "RELIANCE.NS": "RELIANCE", "TCS.NS": "TCS" };
      const shortName = symbolMap[stock.symbol] || stock.symbol.split('.')[0];
      
      return `${shortName} ${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)}%`;
    });

    res.json(tickerData);
  } catch (error) {
    console.error("Detailed Backend Error:", error);
    res.status(500).json({ error: error.message });
  }
});