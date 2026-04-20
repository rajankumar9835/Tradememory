// components/LandingPage.jsx
// Shown to unauthenticated users.
// Contains both the marketing hero and Clerk's SignIn/SignUp modal trigger.

import React, { useState } from "react";
import {
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";
import { Brain, TrendingUp, TrendingDown, Database, Zap, Shield, ChevronRight } from "lucide-react";

const FEATURES = [
  {
    icon: <Brain size={20} />,
    color: "#00d4aa",
    title: "Persistent AI Memory",
    desc: "Every trade, lesson, and pattern stored forever in Hindsight vector memory. Your AI gets smarter with every session.",
  },
  {
    icon: <TrendingUp size={20} />,
    color: "#22c55e",
    title: "Pattern Recognition",
    desc: "The agent analyzes your win/loss patterns, emotional triggers, and setup performance across your entire history.",
  },
  {
    icon: <Database size={20} />,
    color: "#3b82f6",
    title: "Semantic Trade Search",
    desc: "Ask 'when did I lose on breakout setups?' and get real answers grounded in your actual trade history.",
  },
  {
    icon: <Zap size={20} />,
    color: "#f59e0b",
    title: "Pre-Trade Sanity Check",
    desc: "Before entering a position, get a memory-backed analysis of similar past setups and how they played out.",
  },
];

const STATS = [
  { value: "∞", label: "Memory Horizon" },
  { value: "5", label: "AI Tools" },
  { value: "<1s", label: "Recall Speed" },
  { value: "100%", label: "Your Data" },
];

export default function LandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  return (
    <div style={styles.page}>
      {/* Background grid */}
      <div style={styles.grid} aria-hidden="true" />

      {/* Glow orbs */}
      <div style={{ ...styles.orb, top: "15%", left: "20%", background: "rgba(0,212,170,0.07)" }} />
      <div style={{ ...styles.orb, bottom: "20%", right: "15%", background: "rgba(59,130,246,0.06)", width: 500, height: 500 }} />

      {/* ── Top nav ── */}
      <nav style={styles.nav}>
        <div style={styles.navLogo}>
          <div style={styles.logoIcon}>
            <Brain size={18} color="#00d4aa" />
          </div>
          <span style={styles.logoText}>TradeMemory</span>
        </div>

        <div style={styles.navActions}>
          {/* Sign In — opens Clerk modal */}
          <SignInButton mode="modal">
            <button style={styles.signInBtn}>Sign In</button>
          </SignInButton>

          {/* Sign Up — opens Clerk modal */}
          <SignUpButton mode="modal">
            <button style={styles.signUpBtn}>
              Get Started
              <ChevronRight size={15} />
            </button>
          </SignUpButton>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={styles.hero}>
        <div style={styles.badge}>
          <span style={styles.badgeDot} />
          Powered by Hindsight Memory · Groq AI
        </div>

        <h1 style={styles.heroTitle}>
          The AI Trading Journal<br />
          <span style={styles.heroAccent}>That Never Forgets</span>
        </h1>

        <p style={styles.heroSub}>
          Log trades in plain English. TradeMemory remembers every position,
          every lesson, every mistake — and uses that memory to make you
          a measurably better trader over time.
        </p>

        {/* Stats row */}
        <div style={styles.statsRow}>
          {STATS.map((s, i) => (
            <div key={i} style={styles.statItem}>
              <div style={styles.statValue}>{s.value}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div style={styles.ctaRow}>
          <SignUpButton mode="modal">
            <button style={styles.ctaPrimary}>
              Start Journaling Free
              <ChevronRight size={16} />
            </button>
          </SignUpButton>

          <SignInButton mode="modal">
            <button style={styles.ctaSecondary}>
              I have an account
            </button>
          </SignInButton>
        </div>

        <p style={styles.ctaNote}>No credit card required · Free Hindsight tier included</p>
      </section>

      {/* ── Features ── */}
      <section style={styles.features}>
        <div style={styles.featuresGrid}>
          {FEATURES.map((f, i) => (
            <div
              key={i}
              style={{
                ...styles.featureCard,
                borderColor:
                  hoveredFeature === i ? f.color + "55" : "var(--border)",
                background:
                  hoveredFeature === i ? f.color + "08" : "var(--bg-surface)",
                transform: hoveredFeature === i ? "translateY(-3px)" : "none",
              }}
              onMouseEnter={() => setHoveredFeature(i)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div
                style={{
                  ...styles.featureIcon,
                  color: f.color,
                  background: f.color + "15",
                  border: `1px solid ${f.color}30`,
                }}
              >
                {f.icon}
              </div>
              <h3 style={{ ...styles.featureTitle, color: hoveredFeature === i ? f.color : "var(--text-primary)" }}>
                {f.title}
              </h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section style={styles.bottomCta}>
        <p style={styles.bottomText}>
          Join traders who remember every lesson they've ever learned.
        </p>
        <SignUpButton mode="modal">
          <button style={styles.ctaPrimary}>
            Create Free Account
            <ChevronRight size={16} />
          </button>
        </SignUpButton>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <span>TradeMemory — AI Trading Journal</span>
        <span style={{ color: "var(--text-muted)" }}>·</span>
        <a href="https://hindsight.vectorize.io" target="_blank" rel="noopener noreferrer" style={styles.footerLink}>
          Powered by Hindsight
        </a>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "var(--bg-void)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    overflowX: "hidden",
  },

  // Background decorations
  grid: {
    position: "fixed",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(0,212,170,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,170,0.03) 1px, transparent 1px)",
    backgroundSize: "48px 48px",
    pointerEvents: "none",
    zIndex: 0,
  },
  orb: {
    position: "fixed",
    width: 600,
    height: 600,
    borderRadius: "50%",
    filter: "blur(80px)",
    pointerEvents: "none",
    zIndex: 0,
  },

  // Nav
  nav: {
    position: "relative",
    zIndex: 10,
    width: "100%",
    maxWidth: 1100,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 32px",
  },
  navLogo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  logoIcon: {
    width: 36,
    height: 36,
    background: "var(--accent-glow)",
    border: "1px solid rgba(0,212,170,0.3)",
    borderRadius: "var(--radius)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 18,
    color: "var(--text-primary)",
    letterSpacing: "-0.3px",
  },
  navActions: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  signInBtn: {
    background: "transparent",
    border: "1px solid var(--border-bright)",
    color: "var(--text-secondary)",
    padding: "8px 18px",
    borderRadius: 99,
    fontSize: 13,
    fontFamily: "var(--font-body)",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.15s",
  },
  signUpBtn: {
    background: "var(--accent)",
    border: "none",
    color: "#080b0f",
    padding: "8px 18px",
    borderRadius: 99,
    fontSize: 13,
    fontFamily: "var(--font-body)",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 4,
    transition: "all 0.15s",
  },

  // Hero
  hero: {
    position: "relative",
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "80px 32px 60px",
    maxWidth: 760,
    animation: "fadeIn 0.6s ease both",
  },
  badge: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "var(--accent-glow)",
    border: "1px solid rgba(0,212,170,0.25)",
    borderRadius: 99,
    padding: "5px 14px",
    fontSize: 12,
    color: "var(--accent)",
    fontFamily: "var(--font-mono)",
    marginBottom: 28,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "var(--accent)",
    display: "inline-block",
    animation: "pulse 1.5s ease infinite",
  },
  heroTitle: {
    fontFamily: "var(--font-display)",
    fontWeight: 800,
    fontSize: "clamp(36px, 6vw, 62px)",
    lineHeight: 1.1,
    color: "var(--text-primary)",
    letterSpacing: "-1.5px",
    marginBottom: 22,
  },
  heroAccent: {
    color: "var(--accent)",
    position: "relative",
  },
  heroSub: {
    fontSize: 17,
    color: "var(--text-secondary)",
    lineHeight: 1.7,
    maxWidth: 580,
    marginBottom: 40,
    fontWeight: 300,
  },

  // Stats
  statsRow: {
    display: "flex",
    gap: 0,
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    overflow: "hidden",
    marginBottom: 40,
    background: "var(--bg-surface)",
  },
  statItem: {
    padding: "14px 28px",
    textAlign: "center",
    borderRight: "1px solid var(--border)",
  },
  statValue: {
    fontFamily: "var(--font-mono)",
    fontWeight: 700,
    fontSize: 22,
    color: "var(--accent)",
    lineHeight: 1,
  },
  statLabel: {
    fontSize: 11,
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginTop: 4,
  },

  // CTAs
  ctaRow: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  ctaPrimary: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "var(--accent)",
    border: "none",
    color: "#080b0f",
    padding: "13px 26px",
    borderRadius: 99,
    fontSize: 15,
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.15s",
    boxShadow: "0 0 30px rgba(0,212,170,0.25)",
  },
  ctaSecondary: {
    background: "transparent",
    border: "1px solid var(--border-bright)",
    color: "var(--text-secondary)",
    padding: "13px 24px",
    borderRadius: 99,
    fontSize: 14,
    fontFamily: "var(--font-body)",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  ctaNote: {
    marginTop: 14,
    fontSize: 12,
    color: "var(--text-muted)",
  },

  // Features
  features: {
    position: "relative",
    zIndex: 10,
    width: "100%",
    maxWidth: 1100,
    padding: "20px 32px 80px",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 16,
  },
  featureCard: {
    background: "var(--bg-surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: "24px",
    transition: "all 0.2s ease",
    cursor: "default",
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: "var(--radius)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  featureTitle: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 15,
    marginBottom: 8,
    transition: "color 0.2s",
  },
  featureDesc: {
    fontSize: 13,
    color: "var(--text-secondary)",
    lineHeight: 1.65,
  },

  // Bottom CTA
  bottomCta: {
    position: "relative",
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
    padding: "40px 32px 60px",
  },
  bottomText: {
    fontSize: 18,
    color: "var(--text-secondary)",
    fontFamily: "var(--font-display)",
    fontWeight: 500,
  },

  // Footer
  footer: {
    position: "relative",
    zIndex: 10,
    display: "flex",
    gap: 10,
    alignItems: "center",
    padding: "20px 32px",
    fontSize: 12,
    color: "var(--text-secondary)",
    borderTop: "1px solid var(--border)",
    width: "100%",
    justifyContent: "center",
  },
  footerLink: {
    color: "var(--accent)",
    textDecoration: "none",
    fontWeight: 600,
  },
};