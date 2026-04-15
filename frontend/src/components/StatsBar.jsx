// components/StatsBar.jsx
import React, { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Database, BookOpen, Target } from "lucide-react";

export default function StatsBar() {
  const [stats, setStats] = useState(null);

  const fetchStats = () => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 15000);
    return () => clearInterval(interval);
  }, []);

  const items = [
    {
      icon: <Database size={14} />,
      label: "Memories",
      value: stats?.totalMemories ?? "—",
      color: "var(--accent)",
    },
    {
      icon: <BookOpen size={14} />,
      label: "Trades",
      value: stats?.totalTrades ?? "—",
      color: "var(--blue)",
    },
    {
      icon: <TrendingUp size={14} />,
      label: "Wins",
      value: stats?.wins ?? "—",
      color: "var(--green)",
    },
    {
      icon: <TrendingDown size={14} />,
      label: "Losses",
      value: stats?.losses ?? "—",
      color: "var(--red)",
    },
    {
      icon: <Target size={14} />,
      label: "Win Rate",
      value: stats?.winRate ? `${stats.winRate}%` : "—",
      color: parseFloat(stats?.winRate) >= 50 ? "var(--green)" : "var(--red)",
    },
  ];

  return (
    <div style={styles.bar}>
      {items.map((item, i) => (
        <div key={i} style={styles.stat}>
          <div style={{ ...styles.statIcon, color: item.color }}>{item.icon}</div>
          <div>
            <div style={{ ...styles.statValue, color: item.color }}>{item.value}</div>
            <div style={styles.statLabel}>{item.label}</div>
          </div>
        </div>
      ))}
      <div style={styles.poweredBy}>
        <span style={styles.poweredDot} />
        Institutional Memory Enabled
      </div>
    </div>
  );
}

const styles = {
  bar: {
    background: "var(--bg-surface)",
    borderBottom: "1px solid var(--border)",
    padding: "10px 24px",
    display: "flex",
    alignItems: "center",
    gap: 32,
    flexWrap: "wrap",
  },
  stat: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  statIcon: {
    opacity: 0.8,
  },
  statValue: {
    fontFamily: "var(--font-mono)",
    fontWeight: 600,
    fontSize: 15,
    lineHeight: 1,
  },
  statLabel: {
    fontSize: 11,
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginTop: 2,
  },
  poweredBy: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 11,
    color: "var(--accent)",
    fontFamily: "var(--font-mono)",
    opacity: 0.8,
  },
  poweredDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "var(--accent)",
    display: "inline-block",
    animation: "pulse 1.5s ease infinite",
  },
};