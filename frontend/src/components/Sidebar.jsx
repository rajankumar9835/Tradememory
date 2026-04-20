import React, { useState, useEffect } from "react";
import {
  Search, X, Activity, ChevronRight, 
  Terminal, ShieldCheck, RefreshCw, Layers
} from "lucide-react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  
  // --- Stock Search State ---
  const [stockQuery, setStockQuery] = useState("");
  const [stockResult, setStockResult] = useState(null);
  const [isSearchingStock, setIsSearchingStock] = useState(false);
  const [stockError, setStockError] = useState("");

  // --- Theme Constants ---
  const bg = "#0c1118";
  const border = "#1e293b";
  const text = "#f1f5f9";
  const muted = "#64748b";
  const surface = "#111827";
  const accent = "#00d4aa";

  // --- Handle Stock Search ---
  const handleStockSearch = async (e) => {
    if (e.key === "Enter" && stockQuery.trim() !== "") {
      setIsSearchingStock(true);
      setStockError("");
      setStockResult(null);
      
      try {
        const res = await fetch(`/api/stock/${stockQuery.trim().toUpperCase()}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setStockResult(data);
      } catch (err) {
        setStockError("Invalid symbol/Name or not found.");
      }
      setIsSearchingStock(false);
    }
  };

  if (collapsed) {
    return (
      <aside style={{ width: 48, background: bg, borderRight: `1px solid ${border}`, display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 0", gap: 16, flexShrink: 0 }}>
        <button onClick={() => setCollapsed(false)} style={iconBtn(muted)} title="Expand">
          <ChevronRight size={16} />
        </button>
        <Search size={16} color={muted} />
        <Activity size={16} color={accent} />
      </aside>
    );
  }

  return (
    <aside style={{
      width: 290, background: bg, borderRight: `1px solid ${border}`,
      display: "flex", flexDirection: "column", overflow: "hidden",
      flexShrink: 0, transition: "width 0.2s", position: "relative"
    }}>

      {/* 1. Header */}
      <div style={{ padding: "14px 16px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 11, color: text, textTransform: "uppercase", letterSpacing: "1px" }}>
          <Terminal size={14} color={accent} />
          Terminal Core
        </span>
        <button onClick={() => setCollapsed(true)} style={iconBtn(muted)}>
          <ChevronRight size={14} style={{ transform: "rotate(180deg)" }} />
        </button>
      </div>

      {/* 2. Live Asset Lookup Section */}
      <div style={{ padding: "16px", borderBottom: `1px solid ${border}`, background: surface }}>
        <span style={{ display: "block", fontSize: 10, color: muted, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 800, marginBottom: 8 }}>
          Live Asset Lookup
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: "8px 12px" }}>
          {isSearchingStock ? (
            <RefreshCw size={13} color={accent} style={{ animation: "spin 1s linear infinite" }} />
          ) : (
            <Search size={13} color={muted} />
          )}
          <input
            value={stockQuery}
            onChange={e => setStockQuery(e.target.value)}
            onKeyDown={handleStockSearch}
            placeholder="Symbol/Name (e.g. TCS.NS, NIFTY)"
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 12, color: text, fontFamily: "monospace" }}
          />
          {stockQuery && (
            <button onClick={() => { setStockQuery(""); setStockResult(null); setStockError(""); }} style={iconBtn(muted)}>
              <X size={12} />
            </button>
          )}
        </div>

        {stockError && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 8, textAlign: "center", fontFamily: "monospace" }}>{stockError}</div>}
        
        {stockResult && (
          <div style={{ marginTop: 12, padding: "12px", background: "rgba(0, 212, 170, 0.05)", border: `1px solid ${accent}33`, borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: text, fontFamily: "monospace" }}>{stockResult.symbol}</span>
              <span style={{ fontSize: 10, color: muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "120px" }}>{stockResult.name}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: text }}>{stockResult.price?.toFixed(2)}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: stockResult.changePercent >= 0 ? "#22c55e" : "#ef4444" }}>
                {stockResult.changePercent >= 0 ? "+" : ""}{stockResult.changePercent?.toFixed(2)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3. System Diagnostics Section (Static/Non-Fetching) */}
      <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 24 }}>
        
        <div>
          <div style={labelStyle(muted)}>NODE CONNECTION</div>
          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ 
              padding: "4px 8px", background: "rgba(0, 212, 170, 0.1)", 
              borderRadius: 4, border: `1px solid ${accent}44`,
              color: accent, fontSize: 10, fontWeight: 700, fontFamily: "monospace"
            }}>
              ENCRYPTED
            </div>
            <span style={{ fontSize: 11, color: muted, fontFamily: "monospace" }}>0.42ms Latency</span>
          </div>
        </div>

        <div>
          <div style={labelStyle(muted)}>SECURITY OVERLAY</div>
          <div style={{ 
            marginTop: 12, padding: "12px", background: surface, 
            borderRadius: 8, border: `1px solid ${border}`,
            display: "flex", alignItems: "center", gap: 12
          }}>
            <ShieldCheck size={18} color={accent} />
            <div>
              <div style={{ fontSize: 12, color: text, fontWeight: 600 }}>Hindsight Active</div>
              <div style={{ fontSize: 10, color: muted }}>Vector Memory Isolation On</div>
            </div>
          </div>
        </div>

        <div>
          <div style={labelStyle(muted)}>ENVIRONMENT</div>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={envRow(text, border)}>
              <span>Engine</span>
              <span style={{ color: accent }}>Qwen-3 32B</span>
            </div>
            <div style={envRow(text, border)}>
              <span>Memory Layer</span>
              <span>Vectorized</span>
            </div>
            <div style={envRow(text, border)}>
              <span>Version</span>
              <span>3.0.4-stable</span>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Minimal Footer */}
      <div style={{ 
        marginTop: "auto", padding: "16px", borderTop: `1px solid ${border}`,
        display: "flex", alignItems: "center", gap: 8, opacity: 0.6
      }}>
        <Layers size={12} color={muted} />
        <span style={{ fontSize: 9, color: muted, letterSpacing: "0.5px", fontWeight: 600, textTransform: "uppercase" }}>
          TradeMemory Terminal Core
        </span>
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </aside>
  );
}

// Helper Styles
const iconBtn = (color) => ({
  background: "transparent", border: "none", cursor: "pointer", 
  padding: 4, color, display: "flex", alignItems: "center"
});

const labelStyle = (color) => ({
  fontSize: 10, fontWeight: 800, color, letterSpacing: "1px"
});

const envRow = (text, border) => ({
  display: "flex", justifyContent: "space-between", fontSize: 11, 
  color: text, fontFamily: "monospace", padding: "4px 0",
  borderBottom: `1px solid ${border}33`
});