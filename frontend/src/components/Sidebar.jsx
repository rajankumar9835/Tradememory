// components/Sidebar.jsx
import React, { useState, useEffect } from "react";
import { BookOpen, TrendingUp, TrendingDown, Lightbulb, BarChart2, RefreshCw, ChevronRight } from "lucide-react";

const TYPE_CONFIG = {
  trade_log: { icon: <BookOpen size={12} />, color: "#3b82f6", label: "Trade" },
  observation: { icon: <Lightbulb size={12} />, color: "#f59e0b", label: "Lesson" },
  analysis: { icon: <BarChart2 size={12} />, color: "#a855f7", label: "Analysis" },
};

const OUTCOME_COLOR = {
  WIN: "#22c55e",
  LOSS: "#ef4444",
  BREAKEVEN: "#f59e0b",
  OPEN: "#3b82f6",
};

export default function Sidebar() {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const fetchMemories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/memories?limit=30");
      const data = await res.json();
      setMemories(data.documents || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const trades = memories.filter((m) => m.metadata?.type === "trade_log");
  const observations = memories.filter((m) => m.metadata?.type === "observation");

  return (
    <aside style={styles.sidebar}>
      <div style={styles.sidebarHeader}>
        <span style={styles.sidebarTitle}>Memory Vault</span>
        <button
          onClick={fetchMemories}
          style={styles.refreshBtn}
          title="Refresh memories"
        >
          <RefreshCw size={13} style={{ animation: loading ? "pulse 1s ease infinite" : "none" }} />
        </button>
      </div>

      {/* Section: Trades */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          <BookOpen size={12} style={{ color: "#3b82f6" }} />
          Trades ({trades.length})
        </div>
        <div style={styles.memList}>
          {trades.length === 0 && (
            <div style={styles.empty}>No trades logged yet</div>
          )}
          {trades.slice(0, 8).map((m, i) => {
            const outcome = m.metadata?.outcome;
            const symbol = m.metadata?.symbol || "—";
            const isOpen = expanded === `trade-${i}`;
            const preview = (m.content || "").split("\n")[0];

            return (
              <div
                key={i}
                onClick={() => setExpanded(isOpen ? null : `trade-${i}`)}
                style={styles.memItem}
              >
                <div style={styles.memRow}>
                  <span
                    style={{
                      ...styles.outcomeTag,
                      color: OUTCOME_COLOR[outcome] || "var(--text-muted)",
                      background: (OUTCOME_COLOR[outcome] || "#888") + "18",
                    }}
                  >
                    {outcome === "WIN" ? <TrendingUp size={10} /> : outcome === "LOSS" ? <TrendingDown size={10} /> : null}
                    {outcome || "OPEN"}
                  </span>
                  <span style={styles.memSymbol}>{symbol}</span>
                  <ChevronRight
                    size={12}
                    style={{
                      marginLeft: "auto",
                      color: "var(--text-muted)",
                      transform: isOpen ? "rotate(90deg)" : "none",
                      transition: "transform 0.15s",
                    }}
                  />
                </div>
                {isOpen && (
                  <div style={styles.memExpanded}>
                    {(m.content || "").split("\n").map((line, j) => (
                      <div key={j} style={styles.memLine}>{line}</div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Section: Lessons */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          <Lightbulb size={12} style={{ color: "#f59e0b" }} />
          Lessons ({observations.length})
        </div>
        <div style={styles.memList}>
          {observations.length === 0 && (
            <div style={styles.empty}>No lessons stored yet</div>
          )}
          {observations.slice(0, 6).map((m, i) => {
            const isOpen = expanded === `obs-${i}`;
            const preview = (m.content || "").substring(0, 60) + "...";
            return (
              <div
                key={i}
                onClick={() => setExpanded(isOpen ? null : `obs-${i}`)}
                style={styles.memItem}
              >
                <div style={styles.obsPreview}>{preview}</div>
                {isOpen && (
                  <div style={styles.memExpanded}>{m.content}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={styles.footer}>
        <span>Powered by</span>
        <a
          href="https://hindsight.vectorize.io"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.footerLink}
        >
          Hindsight
        </a>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: "var(--sidebar-w)",
    background: "var(--bg-deep)",
    borderRight: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    flexShrink: 0,
  },
  sidebarHeader: {
    padding: "16px",
    borderBottom: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sidebarTitle: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 13,
    color: "var(--text-primary)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  refreshBtn: {
    background: "transparent",
    border: "none",
    color: "var(--text-muted)",
    cursor: "pointer",
    padding: 4,
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    transition: "color 0.15s",
  },
  section: {
    padding: "12px 0",
    borderBottom: "1px solid var(--border)",
  },
  sectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "0 16px 8px",
    fontSize: 11,
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    fontWeight: 600,
  },
  memList: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
    overflowY: "auto",
    maxHeight: 240,
  },
  memItem: {
    padding: "8px 16px",
    cursor: "pointer",
    background: "transparent",
    transition: "background 0.12s",
    borderRadius: 0,
  },
  memRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  outcomeTag: {
    display: "flex",
    alignItems: "center",
    gap: 3,
    fontSize: 10,
    fontFamily: "var(--font-mono)",
    fontWeight: 600,
    padding: "1px 6px",
    borderRadius: 99,
    textTransform: "uppercase",
  },
  memSymbol: {
    fontFamily: "var(--font-mono)",
    fontWeight: 600,
    fontSize: 12,
    color: "var(--text-primary)",
  },
  memExpanded: {
    marginTop: 6,
    fontSize: 11,
    color: "var(--text-secondary)",
    fontFamily: "var(--font-mono)",
    background: "var(--bg-surface)",
    borderRadius: "var(--radius)",
    padding: "8px",
    lineHeight: 1.6,
  },
  memLine: {
    lineHeight: 1.7,
  },
  obsPreview: {
    fontSize: 12,
    color: "var(--text-secondary)",
    lineHeight: 1.5,
  },
  empty: {
    padding: "6px 16px",
    fontSize: 12,
    color: "var(--text-muted)",
    fontStyle: "italic",
  },
  footer: {
    marginTop: "auto",
    padding: "14px 16px",
    fontSize: 11,
    color: "var(--text-muted)",
    display: "flex",
    gap: 5,
    alignItems: "center",
    borderTop: "1px solid var(--border)",
  },
  footerLink: {
    color: "var(--accent)",
    textDecoration: "none",
    fontWeight: 600,
  },
};