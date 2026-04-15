import React, { useState, useEffect } from "react";
import { Brain, Wifi, WifiOff } from "lucide-react";

export default function Header() {
  const [connected, setConnected] = useState(null);
  
  // Start with your original static list as a fallback so the page isn't blank
  const [tickerData, setTickerData] = useState([
    "NIFTY +1.6%", "RELIANCE +2.3%", "TCS +3.3%", "ZOMATO +4.1%", "HDFC -0.2%"
  ]);

  useEffect(() => {
    // 1. Check API Health (Original Code)
    fetch("/api/health")
      .then((r) => r.ok ? setConnected(true) : setConnected(false))
      .catch(() => setConnected(false));

    // 2. Fetch Indian Market Data
    const updateTicker = async () => {
      try {
        const response = await fetch("/api/market-ticker");
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setTickerData(data);
          }
        }
      } catch (err) {
        console.error("Ticker fetch failed, keeping fallback data.");
      }
    };

    updateTicker();
    const interval = setInterval(updateTicker, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <header style={styles.header}>
      {/* Logo */}
      <div style={styles.logo}>
        <div style={styles.logoIcon}>
          <Brain size={20} color="#00d4aa" />
        </div>
        <div>
          <div style={styles.logoName}>TradeMemory</div>
          <div style={styles.logoTagline}>AI Journal</div>
        </div>
      </div>

      {/* Center — Live Ticker (Safe Render) */}
      <div style={styles.ticker}>
        {tickerData.map((t, i) => (
          <span
            key={i}
            style={{
              ...styles.tickerItem,
              color: t.includes("-") ? "#ef4444" : "#22c55e",
            }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Status */}
      <div style={styles.status}>
  <div 
    className={connected ? "blink-dot" : ""} // Add the class here
    style={{ 
      ...styles.statusDot, 
      background: connected === null ? "#f59e0b" : connected ? "#22c55e" : "#ef4444",
      boxShadow: connected ? "0 0 8px #22c55e" : "none" // Added a glow for better effect
    }} 
  />
  <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-secondary)", fontSize: 13 }}>
    {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
    {connected === null ? "Connecting..." : connected ? "Live" : "Offline"} 
  </div>
</div>
    </header>
  );
}

const styles = {
  header: {
    height: "var(--header-h, 60px)", // Fallback height added
    background: "var(--bg-deep, #0f172a)", 
    borderBottom: "1px solid var(--border, #1e293b)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    position: "sticky",
    top: 0,
    zIndex: 100,
    backdropFilter: "blur(12px)",
  },
  logo: { display: "flex", alignItems: "center", gap: 12 },
  logoIcon: {
    width: 40, height: 40,
    background: "rgba(0,212,170,0.1)",
    border: "1px solid rgba(0,212,170,0.3)",
    borderRadius: "8px",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  logoName: {
    fontWeight: 700, fontSize: 17,
    color: "#ffffff", letterSpacing: "-0.3px",
  },
  logoTagline: {
    fontSize: 11, color: "#94a3b8",
    letterSpacing: "0.5px", textTransform: "uppercase",
  },
  ticker: { display: "flex", gap: 20, fontSize: 12, fontWeight: 500 },
  tickerItem: { transition: "color 0.3s ease" },
  status: { display: "flex", alignItems: "center", gap: 8 },
  statusDot: {
    width: 7, height: 7, borderRadius: "50%",
    boxShadow: "0 0 8px currentColor",
  },
};