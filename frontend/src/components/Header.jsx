import React, { useState, useEffect } from "react";
import { Brain, Wifi, WifiOff } from "lucide-react";
import { UserButton, useUser } from "@clerk/clerk-react";

export default function Header() {
  const [connected, setConnected] = useState(null);
  const { user } = useUser();

  const [tickerData, setTickerData] = useState([
    "NIFTY +1.6%", "RELIANCE +2.3%", "TCS +3.3%", "ZOMATO +4.1%", "HDFC -0.2%"
  ]);

  useEffect(() => {
    // 1. Check API Health
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
    const interval = setInterval(updateTicker, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header style={styles.header}>

      {/* ── LEFT — Logo (unchanged) ── */}
      <div style={styles.logo}>
        <div style={styles.logoIcon}>
          <Brain size={20} color="#00d4aa" />
        </div>
        <div>
          <div style={styles.logoName}>TradeMemory</div>
          <div style={styles.logoTagline}>AI Journal</div>
        </div>
      </div>

      {/* ── CENTER — Live Ticker (unchanged) ── */}
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

      {/* ── RIGHT — Live Indicator + UserButton ── */}
      {/*
        Layout: [● Live] [divider] [Hey, Name] [Avatar]
        UserButton is placed immediately after the live indicator as requested.
      */}
      <div style={styles.rightZone}>

        {/* Live API Status (your original code, untouched) */}
        <div style={styles.statusPill}>
          <div
            className={connected ? "blink-dot" : ""}
            style={{
              ...styles.statusDot,
              background: connected === null ? "#f59e0b" : connected ? "#22c55e" : "#ef4444",
              boxShadow: connected ? "0 0 8px #22c55e" : "none",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#94a3b8", fontSize: 13 }}>
            {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
            {connected === null ? "Connecting..." : connected ? "Live" : "Offline"}
          </div>
        </div>

        {/* Vertical divider line */}
        <div style={styles.divider} />

        {/* User greeting + Clerk avatar button */}
        <div style={styles.userZone}>
          {/* Shows "Hey, Rahul" next to the avatar */}
          {user && (
            <div style={styles.greeting}>
              <span style={styles.greetingHey}>Hey,</span>
              <span style={styles.greetingName}>
                {user.firstName ||
                  user.emailAddresses?.[0]?.emailAddress?.split("@")[0] ||
                  "Trader"}
              </span>
            </div>
          )}

          {/*
            Clerk UserButton — renders user avatar.
            Click → dropdown with "Manage Account" and "Sign Out".
            appearance prop styles it to match the dark TradeMemory theme.
          */}
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                // The circular/square avatar button
                avatarBox: {
                  width: 34,
                  height: 34,
                  borderRadius: "8px",
                  border: "1.5px solid rgba(0, 212, 170, 0.4)",
                  boxShadow: "0 0 10px rgba(0, 212, 170, 0.12)",
                  transition: "border-color 0.2s ease",
                },
                // Dropdown popup card
                card: {
                  background: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: "12px",
                  boxShadow: "0 24px 48px rgba(0,0,0,0.7)",
                  fontFamily: "sans-serif",
                },
                // User's name in the dropdown
                userPreviewMainIdentifier: {
                  color: "#1c2023",
                  fontWeight: 700,
                },
                // User's email in dropdown
                userPreviewSecondaryIdentifier: {
                  color: "#64748b",
                },
                // Each clickable menu item (Manage Account, Sign Out)
                userButtonPopoverActionButton: {
                  color: "#e2e8f0",
                  borderRadius: "8px",
                },
                userButtonPopoverActionButtonText: {
                  color: "#e2e8f0",
                },
                userButtonPopoverActionButtonIcon: {
                  color: "#64748b",
                },
                // Bottom border above footer
                userButtonPopoverFooter: {
                  borderTop: "1px solid #1e293b",
                },
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    height: "var(--header-h, 60px)",
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

  // ── Logo (your original styles, untouched) ──
  logo: { display: "flex", alignItems: "center", gap: 12 },
  logoIcon: {
    width: 40, height: 40,
    background: "rgba(0,212,170,0.1)",
    border: "1px solid rgba(0,212,170,0.3)",
    borderRadius: "8px",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  logoName: { fontWeight: 700, fontSize: 17, color: "#ffffff", letterSpacing: "-0.3px" },
  logoTagline: { fontSize: 11, color: "#94a3b8", letterSpacing: "0.5px", textTransform: "uppercase" },

  // ── Ticker (your original styles, untouched) ──
  ticker: { display: "flex", gap: 20, fontSize: 12, fontWeight: 500 },
  tickerItem: { transition: "color 0.3s ease" },

  // ── Right zone — NEW ──
  rightZone: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexShrink: 0,
  },
  // Pill wrapping the live dot + text
  statusPill: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid #1e293b",
    borderRadius: 99,
    padding: "5px 12px 5px 8px",
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    flexShrink: 0,
  },
  // Thin vertical line between status and user
  divider: {
    width: 1,
    height: 22,
    background: "#1e293b",
    flexShrink: 0,
  },
  // Groups greeting text + avatar
  userZone: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  greeting: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    lineHeight: 1.15,
  },
  greetingHey: {
    fontSize: 10,
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  greetingName: {
    fontSize: 13,
    color: "#f1f5f9",
    fontWeight: 600,
    maxWidth: 90,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
};