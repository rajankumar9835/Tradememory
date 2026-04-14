// hooks/useChat.js — Chat & Memory State Management
import { useState, useCallback, useRef } from "react";

export default function useChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Welcome to **TradeMemory** — your AI trading journal with persistent memory.\n\nI remember every trade you log, every lesson you learn, and every pattern in your behavior. Tell me about a trade, ask me to analyze your patterns, or share a market observation.\n\n**Try:** *\"I just took a long on AAPL at 185, stopped out at 182, loss of $300. Got in too early on FOMO.\"*",
      toolsUsed: [],
      id: "welcome",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // ── Stats State (Required by App.jsx) ──────────────────────────────
  const [stats, setStats] = useState({
    totalMemories: 0,
    totalTrades: 0,
    totalObservations: 0,
    wins: 0,
    losses: 0,
    winRate: "0.0",
  });

  const abortRef = useRef(null);

  // ── Refresh Stats Function ─────────────────────────────────────────
  const refreshStats = useCallback(async () => {
    try {
      const res = await fetch("/api/stats");
      if (!res.ok) throw new Error("Could not fetch stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Stats Error:", err.message);
    }
  }, []);

  // ── Send Message Function ──────────────────────────────────────────
  const sendMessage = useCallback(async (content) => {
    if (!content.trim() || isLoading) return;

    const userMsg = {
      role: "user",
      content,
      id: Date.now().toString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    const history = [...messages, userMsg].map(({ role, content }) => ({
      role,
      content,
    }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: abortRef.current,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "API error");
      }

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          toolsUsed: data.toolsUsed || [],
          id: Date.now().toString(),
        },
      ]);

      // Refresh the dashboard stats after the agent logs a trade
      await refreshStats();

    } catch (err) {
      if (err.name === "AbortError") return;
      setError(err.message);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ Connection error: ${err.message}. Make sure the backend is running on port 3001.`,
          toolsUsed: [],
          id: Date.now().toString(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, refreshStats]);

  // ── Clear Chat Function ────────────────────────────────────────────
  const clearChat = useCallback(() => {
    setMessages([
      {
        role: "assistant",
        content: "Memory cleared for this session. Your Hindsight memories are still persisted.",
        toolsUsed: [],
        id: Date.now().toString(),
      },
    ]);
  }, []);

  return { 
    messages, 
    isLoading, 
    error, 
    sendMessage, 
    clearChat, 
    stats,        // Returned for StatsBar
    refreshStats  // Returned for useEffect in App.jsx
  };
}