// components/Header.jsx
import React, { useState, useEffect } from "react";
import { Brain, Activity, Wifi, WifiOff } from "lucide-react";

export default function Header() {
  const [connected, setConnected] = useState(null);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.ok ? setConnected(true) : setConnected(false))
      .catch(() => setConnected(false));
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
          <div style={styles.logoTagline}>AI Journal · Hindsight Memory</div>
        </div>
      </div>

      {/* Center — live ticker decoration */}
      <div style={styles.ticker}>
        {["AAPL +2.1%", "BTC +4.3%", "TSLA -1.8%", "SPY +0.6%", "QQQ +1.2%"].map((t, i) => (
          <span
            key={i}
            style={{
              ...styles.tickerItem,
              color: t.includes("-") ? "#ef4444" : "#22c55e",
              animationDelay: `${i * 0.1}s`,
            }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Status */}
      <div style={styles.status}>
        <div style={{ ...styles.statusDot, background: connected === null ? "#f59e0b" : connected ? "#22c55e" : "#ef4444" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-secondary)", fontSize: 13 }}>
          {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
          {connected === null ? "Connecting..." : connected ? "API Online" : "API Offline"}
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    height: "var(--header-h)",
    background: "var(--bg-deep)",
    borderBottom: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    position: "sticky",
    top: 0,
    zIndex: 100,
    backdropFilter: "blur(12px)",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  logoIcon: {
    width: 40,
    height: 40,
    background: "var(--accent-glow)",
    border: "1px solid rgba(0,212,170,0.3)",
    borderRadius: "var(--radius)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoName: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 17,
    color: "var(--text-primary)",
    letterSpacing: "-0.3px",
  },
  logoTagline: {
    fontSize: 11,
    color: "var(--text-muted)",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  ticker: {
    display: "flex",
    gap: 20,
    fontSize: 12,
    fontFamily: "var(--font-mono)",
    fontWeight: 500,
  },
  tickerItem: {
    animation: "fadeIn 0.4s ease both",
  },
  status: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    animation: "pulse 2s ease infinite",
  },
};