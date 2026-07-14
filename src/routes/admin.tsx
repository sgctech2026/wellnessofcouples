import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { analyticsClient, ADMIN_PASSWORD, ANALYTICS_BRAND } from "@/lib/analytics";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin · DESIRE Analytics" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

const AUTH_KEY = "desire_admin_ok";

type RangeKey = "24h" | "7d" | "30d" | "all" | "custom";
const RANGES: { k: RangeKey; label: string; ms: number | null }[] = [
  { k: "24h", label: "Last 24 hours", ms: 24 * 60 * 60 * 1000 },
  { k: "7d", label: "Last 7 days", ms: 7 * 24 * 60 * 60 * 1000 },
  { k: "30d", label: "Last 30 days", ms: 30 * 24 * 60 * 60 * 1000 },
  { k: "all", label: "All time", ms: null },
  { k: "custom", label: "Custom", ms: null },
];

function toInputDate(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(AUTH_KEY) === "1") {
      setAuthed(true);
    }
    setReady(true);
  }, []);

  if (!ready) return null;

  if (!authed) {
    return (
      <div style={styles.gateWrap}>
        <div style={styles.gateGlow} />
        <form
          style={styles.gateCard}
          onSubmit={(e) => {
            e.preventDefault();
            if (pw === ADMIN_PASSWORD) {
              localStorage.setItem(AUTH_KEY, "1");
              setAuthed(true);
            } else {
              setErr("Incorrect password");
            }
          }}
        >
          <div style={styles.gateBadge}>Private Access</div>
          <h1 style={styles.gateTitle}>
            DESIRE <span style={styles.gateTitleEm}>Admin</span>
          </h1>
          <p style={styles.gateSubtitle}>Enter password to view analytics</p>
          <div style={styles.gateFieldWrap}>
            <input
              type="password"
              value={pw}
              onChange={(e) => { setPw(e.target.value); if (err) setErr(""); }}
              placeholder="••••••••"
              style={styles.gateInput}
              autoFocus
            />
          </div>
          {err && <p style={styles.gateError}>⚠ {err}</p>}
          <button type="submit" style={styles.gateBtn}>Unlock Dashboard</button>
        </form>
      </div>
    );
  }

  return <Dashboard onLogout={() => { localStorage.removeItem(AUTH_KEY); setAuthed(false); }} />;
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [range, setRange] = useState<RangeKey>("7d");
  const today = toInputDate(new Date());
  const weekAgo = toInputDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const [startDate, setStartDate] = useState<string>(weekAgo);
  const [endDate, setEndDate] = useState<string>(today);
  const [data, setData] = useState<{
    visits: any[];
    engaged: any[];
    cart: any[];
    checkouts: any[];
    sections: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const c = analyticsClient();
        if (!c) return;

        let since: string | null = null;
        let until: string | null = null;

        if (range === "custom") {
          if (startDate) since = new Date(startDate + "T00:00:00").toISOString();
          if (endDate) until = new Date(endDate + "T23:59:59.999").toISOString();
        } else {
          const ms = RANGES.find((r) => r.k === range)?.ms;
          if (ms != null) since = new Date(Date.now() - ms).toISOString();
        }

        const q = (table: string, tsCol: string) => {
          let b = c
            .from(table)
            .select("*")
            .eq("brand", ANALYTICS_BRAND)
            .order(tsCol, { ascending: false })
            .limit(5000);
          if (since) b = b.gte(tsCol, since);
          if (until) b = b.lte(tsCol, until);
          return b;
        };

        const [visits, engaged, cart, checkouts, sections] = await Promise.all([
          q("analytics_visits", "visited_at"),
          q("analytics_engaged", "engaged_at"),
          q("analytics_cart", "created_at"),
          q("analytics_checkouts", "created_at"),
          q("analytics_sections", "viewed_at"),
        ]);

        const firstErr =
          visits.error || engaged.error || cart.error || checkouts.error || sections.error;
        if (firstErr) throw firstErr;

        if (!alive) return;
        setData({
          visits: visits.data || [],
          engaged: engaged.data || [],
          cart: cart.data || [],
          checkouts: checkouts.data || [],
          sections: sections.data || [],
        });
      } catch (e: any) {
        console.error(e);
        setError(e?.message || "Failed to load analytics. Did you run the SQL setup?");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [range, startDate, endDate]);

  const stats = useMemo(() => {
    if (!data) return null;
    const uniqueVisitors = new Set(data.visits.map((v: any) => v.device_id)).size;
    const totalVisits = data.visits.length;
    const engagedVisitors = new Set(data.engaged.map((v: any) => v.device_id)).size;
    const addToCartEvents = data.cart.length;
    const addToCartDevices = new Set(data.cart.map((c: any) => c.device_id)).size;
    const abandonedDevices = new Set(
      data.cart.filter((c: any) => !c.checked_out).map((c: any) => c.device_id),
    );
    data.checkouts.forEach((co: any) => abandonedDevices.delete(co.device_id));
    const checkoutCount = data.checkouts.length;

    const perPage = new Map<string, Set<string>>();
    data.visits.forEach((v: any) => {
      if (!perPage.has(v.page_path)) perPage.set(v.page_path, new Set());
      perPage.get(v.page_path)!.add(v.device_id);
    });
    const pageRanking = Array.from(perPage.entries())
      .map(([path, set]) => ({ path, visitors: set.size }))
      .sort((a, b) => b.visitors - a.visitors);

    type SecAgg = { page: string; section: string; viewers: Set<string>; totalMs: number };
    const secMap = new Map<string, SecAgg>();
    data.sections.forEach((s: any) => {
      const key = `${s.page_path}|${s.section_id}`;
      if (!secMap.has(key)) {
        secMap.set(key, {
          page: s.page_path,
          section: s.section_name || s.section_id,
          viewers: new Set(),
          totalMs: 0,
        });
      }
      const agg = secMap.get(key)!;
      agg.viewers.add(s.device_id);
      agg.totalMs += Number(s.duration_ms || 0);
    });
    const sectionRanking = Array.from(secMap.values())
      .map((a) => {
        const avgMs = a.viewers.size ? a.totalMs / a.viewers.size : 0;
        const score = a.viewers.size * (avgMs / 1000);
        return {
          page: a.page,
          section: a.section,
          viewers: a.viewers.size,
          avgSec: avgMs / 1000,
          score,
        };
      })
      .sort((a, b) => b.score - a.score);

    return {
      uniqueVisitors,
      totalVisits,
      engagedVisitors,
      addToCartEvents,
      addToCartDevices,
      abandonedDevices: abandonedDevices.size,
      checkoutCount,
      pageRanking,
      sectionRanking,
    };
  }, [data]);

  const maxPageVisitors = stats?.pageRanking[0]?.visitors || 1;
  const maxSectionScore = stats?.sectionRanking[0]?.score || 1;

  return (
    <div style={styles.wrap}>
      <div style={styles.bgGlow} />
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <div style={styles.eyebrow}>
              <span style={styles.liveDot} /> Live · updated on load
            </div>
            <h1 style={styles.h1}>
              DESIRE <span style={styles.h1Em}>Analytics</span>
            </h1>
            <p style={styles.subtitle}>Real-time site metrics & visitor engagement</p>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.segmented}>
              {RANGES.map((r) => (
                <button
                  key={r.k}
                  onClick={() => setRange(r.k)}
                  style={{
                    ...styles.segBtn,
                    ...(range === r.k ? styles.segBtnActive : {}),
                  }}
                >
                  {r.label.replace("Last ", "")}
                </button>
              ))}
            </div>
            {range === "custom" && (
              <div style={styles.dateRange}>
                <div style={styles.dateField}>
                  <label style={styles.dateLabel}>From</label>
                  <input
                    type="date"
                    value={startDate}
                    max={endDate || today}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={styles.dateInput}
                  />
                </div>
                <span style={styles.dateSep}>→</span>
                <div style={styles.dateField}>
                  <label style={styles.dateLabel}>To</label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate}
                    max={today}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={styles.dateInput}
                  />
                </div>
              </div>
            )}
            <button style={styles.logout} onClick={onLogout}>Log out</button>
          </div>
        </header>

        {loading && (
          <div style={styles.info}>
            <span style={styles.pulseDot} /> Loading analytics…
          </div>
        )}
        {error && <p style={styles.errBox}>⚠ {error}</p>}

        {stats && (
          <>
            {/* Primary KPIs */}
            <section style={styles.kpiGrid}>
              <StatCard
                label="Visitors"
                value={stats.uniqueVisitors}
                hint={`${stats.totalVisits} total page loads`}
                accent="red"
                icon="◉"
              />
              <StatCard
                label="Engaged (≥ 2 min)"
                value={stats.engagedVisitors}
                hint={
                  stats.uniqueVisitors
                    ? `${Math.round((stats.engagedVisitors / stats.uniqueVisitors) * 100)}% of visitors stayed 2+ minutes`
                    : "Stayed on site 2+ minutes"
                }
                accent="gold"
                icon="✦"
              />
              <StatCard
                label="Added to Cart, Didn't Checkout"
                value={stats.abandonedDevices}
                hint={
                  stats.addToCartDevices
                    ? `${stats.addToCartDevices} added · ${stats.checkoutCount} checked out`
                    : "No cart activity yet"
                }
                accent="red"
                icon="⚠"
              />
              <StatCard
                label="Checkouts"
                value={stats.checkoutCount}
                hint={
                  stats.uniqueVisitors
                    ? `${((stats.checkoutCount / stats.uniqueVisitors) * 100).toFixed(1)}% conversion`
                    : "Completed orders"
                }
                accent="cream"
                icon="✓"
              />
            </section>

            {/* Funnel */}
            <section style={styles.funnelCard}>
              <div style={styles.sectionHead}>
                <h2 style={styles.h2}>Purchase Funnel</h2>
                <span style={styles.h2Sub}>from first visit to checkout</span>
              </div>
              <div style={styles.funnelRow}>
                <FunnelStep label="Visitors" value={stats.uniqueVisitors} total={stats.uniqueVisitors} />
                <FunnelArrow />
                <FunnelStep label="Add to Cart" value={stats.addToCartDevices} total={stats.uniqueVisitors} />
                <FunnelArrow />
                <FunnelStep label="Abandoned" value={stats.abandonedDevices} total={stats.uniqueVisitors} tone="warn" />
                <FunnelArrow />
                <FunnelStep label="Checkouts" value={stats.checkoutCount} total={stats.uniqueVisitors} tone="good" />
              </div>
            </section>

            {/* Pages */}
            <section style={styles.card}>
              <div style={styles.sectionHead}>
                <h2 style={styles.h2}>Pages by Visitors</h2>
                <span style={styles.h2Sub}>{stats.pageRanking.length} pages tracked</span>
              </div>
              <div style={styles.rankList}>
                {stats.pageRanking.map((p, i) => (
                  <div key={p.path} style={styles.rankRow}>
                    <div style={styles.rankNum}>{String(i + 1).padStart(2, "0")}</div>
                    <div style={styles.rankMain}>
                      <div style={styles.rankLabel}>{p.path}</div>
                      <div style={styles.barTrack}>
                        <div
                          style={{
                            ...styles.barFill,
                            width: `${(p.visitors / maxPageVisitors) * 100}%`,
                            background: `linear-gradient(90deg, ${BRAND.red}, ${BRAND.redDeep})`,
                          }}
                        />
                      </div>
                    </div>
                    <div style={styles.rankValue}>
                      {p.visitors}
                      <span style={styles.rankValueUnit}>visitors</span>
                    </div>
                  </div>
                ))}
                {stats.pageRanking.length === 0 && <div style={styles.empty}>No data yet.</div>}
              </div>
            </section>

            {/* Sections */}
            <section style={styles.card}>
              <div style={styles.sectionHead}>
                <div>
                  <h2 style={styles.h2}>Section Ranking</h2>
                  <span style={styles.h2Sub}>Engagement Score = viewers × avg-seconds</span>
                </div>
              </div>
              <div style={styles.rankList}>
                {stats.sectionRanking.map((s, i) => (
                  <div key={`${s.page}|${s.section}`} style={styles.rankRow}>
                    <div style={{
                      ...styles.rankNum,
                      color: i === 0 ? BRAND.gold : i < 3 ? BRAND.cream : BRAND.creamMuted,
                    }}>
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div style={styles.rankMain}>
                      <div style={styles.rankLabel}>
                        {s.section}
                        <span style={styles.pagePill}>{s.page}</span>
                      </div>
                      <div style={styles.barTrack}>
                        <div
                          style={{
                            ...styles.barFill,
                            width: `${(s.score / maxSectionScore) * 100}%`,
                            background: i === 0
                              ? `linear-gradient(90deg, ${BRAND.gold}, ${BRAND.red})`
                              : `linear-gradient(90deg, ${BRAND.red}, ${BRAND.redDeep})`,
                          }}
                        />
                      </div>
                      <div style={styles.metaRow}>
                        <span style={styles.metaChip}>{s.viewers} viewers</span>
                        <span style={styles.metaChip}>{s.avgSec.toFixed(1)}s avg</span>
                      </div>
                    </div>
                    <div style={styles.rankValue}>
                      <span style={{ color: i === 0 ? BRAND.gold : BRAND.cream }}>
                        {s.score.toFixed(1)}
                      </span>
                      <span style={styles.rankValueUnit}>score</span>
                    </div>
                  </div>
                ))}
                {stats.sectionRanking.length === 0 && <div style={styles.empty}>No section data yet.</div>}
              </div>
            </section>

            {/* Secondary stats */}
            <section style={styles.miniGrid}>
              <MiniStat label="Cart events" value={stats.addToCartEvents} />
              <MiniStat label="Cart devices" value={stats.addToCartDevices} />
              <MiniStat label="Abandoners" value={stats.abandonedDevices} tone="warn" />
              <MiniStat label="Checkouts" value={stats.checkoutCount} tone="good" />
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label, value, hint, accent = "cream", icon,
}: {
  label: string;
  value: number | string;
  hint?: string;
  accent?: "red" | "cream" | "gold";
  icon?: string;
}) {
  const accentColor = accent === "red" ? BRAND.red : accent === "gold" ? BRAND.gold : BRAND.cream;
  return (
    <div style={styles.stat}>
      <div style={{ ...styles.statAccentBar, background: accentColor }} />
      <div style={styles.statHeader}>
        <div style={styles.statLabel}>{label}</div>
        {icon && <div style={{ ...styles.statIcon, color: accentColor }}>{icon}</div>}
      </div>
      <div style={styles.statValue}>{value}</div>
      {hint && <div style={styles.statHint}>{hint}</div>}
    </div>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: number; tone?: "warn" | "good" }) {
  const color = tone === "warn" ? BRAND.red : tone === "good" ? BRAND.gold : BRAND.cream;
  return (
    <div style={styles.miniStat}>
      <div style={styles.miniLabel}>{label}</div>
      <div style={{ ...styles.miniValue, color }}>{value}</div>
    </div>
  );
}

function FunnelStep({
  label, value, total, tone,
}: { label: string; value: number; total: number; tone?: "warn" | "good" }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  const color = tone === "warn" ? BRAND.red : tone === "good" ? BRAND.gold : BRAND.cream;
  return (
    <div style={styles.funnelStep}>
      <div style={styles.funnelLabel}>{label}</div>
      <div style={{ ...styles.funnelValue, color }}>{value}</div>
      <div style={styles.funnelPct}>{pct}%</div>
    </div>
  );
}

function FunnelArrow() {
  return <div style={styles.funnelArrow}>→</div>;
}

const BRAND = {
  ink: "#0B0605",
  inkSoft: "#150C0A",
  inkSofter: "#1F1310",
  inkBorder: "#3A1F1B",
  inkBorderSoft: "rgba(58,31,27,0.5)",
  red: "#DB2626",
  redDeep: "#8B0F0F",
  cream: "#F5EFE6",
  creamDim: "#C9BFB2",
  creamMuted: "#8A8175",
  gold: "#D4B36A",
};

const serif = `'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif`;
const sans = `'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif`;

const styles: Record<string, React.CSSProperties> = {
  // ── Gate ─────────────────────────────────────────
  gateWrap: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: BRAND.ink,
    padding: 24,
    fontFamily: sans,
    position: "relative",
    overflow: "hidden",
  },
  gateGlow: {
    position: "absolute",
    top: "-20%",
    left: "50%",
    transform: "translateX(-50%)",
    width: 800,
    height: 800,
    background: `radial-gradient(circle, rgba(219,38,38,0.25), transparent 60%)`,
    pointerEvents: "none",
  },
  gateCard: {
    width: "100%",
    maxWidth: 420,
    background: `linear-gradient(160deg, ${BRAND.inkSoft}, ${BRAND.ink})`,
    border: `1px solid ${BRAND.inkBorder}`,
    borderRadius: 8,
    padding: "44px 40px",
    color: BRAND.cream,
    boxShadow: "0 40px 100px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(219,38,38,0.08), inset 0 1px 0 rgba(245,239,230,0.05)",
    position: "relative",
    zIndex: 1,
  },
  gateBadge: {
    display: "inline-block",
    padding: "4px 10px",
    fontSize: 9,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: BRAND.red,
    border: `1px solid ${BRAND.inkBorder}`,
    borderRadius: 999,
    marginBottom: 20,
  },
  gateTitle: {
    fontFamily: serif,
    fontSize: 38,
    fontWeight: 400,
    margin: 0,
    letterSpacing: "-0.02em",
    color: BRAND.cream,
    lineHeight: 1,
  },
  gateTitleEm: { color: BRAND.red, fontStyle: "italic" },
  gateSubtitle: {
    fontSize: 11,
    color: BRAND.creamMuted,
    marginTop: 12,
    marginBottom: 28,
    textTransform: "uppercase",
    letterSpacing: "0.2em",
  },
  gateFieldWrap: { position: "relative" },
  gateInput: {
    width: "100%",
    padding: "16px 18px",
    borderRadius: 4,
    border: `1px solid ${BRAND.inkBorder}`,
    background: BRAND.ink,
    color: BRAND.cream,
    fontSize: 15,
    outline: "none",
    fontFamily: sans,
    letterSpacing: "0.1em",
    boxSizing: "border-box",
  },
  gateError: {
    color: BRAND.red,
    fontSize: 12,
    marginTop: 12,
    marginBottom: 0,
    letterSpacing: "0.05em",
  },
  gateBtn: {
    marginTop: 24,
    width: "100%",
    padding: "16px",
    borderRadius: 999,
    background: `linear-gradient(180deg, ${BRAND.red}, ${BRAND.redDeep})`,
    color: BRAND.cream,
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.3em",
    fontFamily: sans,
    boxShadow: "0 14px 40px -12px rgba(219,38,38,0.7)",
  },

  // ── Dashboard shell ──────────────────────────────
  wrap: {
    minHeight: "100vh",
    background: BRAND.ink,
    color: BRAND.cream,
    fontFamily: sans,
    position: "relative",
    overflow: "hidden",
  },
  bgGlow: {
    position: "absolute",
    top: -200,
    left: "10%",
    width: 900,
    height: 600,
    background: `radial-gradient(ellipse, rgba(219,38,38,0.15), transparent 60%)`,
    pointerEvents: "none",
  },
  container: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "48px 32px 96px",
    position: "relative",
    zIndex: 1,
  },

  // ── Header ───────────────────────────────────────
  header: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 24,
    flexWrap: "wrap",
    paddingBottom: 28,
    marginBottom: 36,
    borderBottom: `1px solid ${BRAND.inkBorder}`,
  },
  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    fontSize: 10,
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    color: BRAND.creamMuted,
    marginBottom: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    background: BRAND.red,
    boxShadow: `0 0 12px ${BRAND.red}`,
    display: "inline-block",
  },
  headerRight: { display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" },
  h1: {
    fontFamily: serif,
    fontSize: 44,
    fontWeight: 400,
    margin: 0,
    letterSpacing: "-0.02em",
    color: BRAND.cream,
    lineHeight: 1,
  },
  h1Em: { color: BRAND.red, fontStyle: "italic" },
  subtitle: {
    color: BRAND.creamMuted,
    fontSize: 12,
    margin: "12px 0 0",
    letterSpacing: "0.05em",
  },
  segmented: {
    display: "inline-flex",
    padding: 4,
    background: BRAND.inkSoft,
    border: `1px solid ${BRAND.inkBorder}`,
    borderRadius: 999,
    gap: 2,
  },
  segBtn: {
    padding: "8px 14px",
    borderRadius: 999,
    background: "transparent",
    border: "none",
    color: BRAND.creamMuted,
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    cursor: "pointer",
    fontFamily: sans,
    fontWeight: 500,
    transition: "all 0.2s",
  },
  segBtnActive: {
    background: BRAND.red,
    color: BRAND.cream,
    boxShadow: "0 4px 14px -4px rgba(219,38,38,0.6)",
  },
  dateRange: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    padding: "6px 14px",
    background: BRAND.inkSoft,
    border: `1px solid ${BRAND.inkBorder}`,
    borderRadius: 999,
  },
  dateField: { display: "flex", flexDirection: "column", gap: 2 },
  dateLabel: {
    fontSize: 8,
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    color: BRAND.creamMuted,
    fontWeight: 600,
  },
  dateInput: {
    background: "transparent",
    border: "none",
    color: BRAND.cream,
    fontFamily: sans,
    fontSize: 12,
    padding: 0,
    outline: "none",
    colorScheme: "dark" as any,
    cursor: "pointer",
  },
  dateSep: {
    color: BRAND.creamMuted,
    fontSize: 14,
    marginTop: 10,
  },
  logout: {
    padding: "10px 18px",
    borderRadius: 999,
    background: "transparent",
    border: `1px solid ${BRAND.inkBorder}`,
    color: BRAND.creamDim,
    fontSize: 10,
    cursor: "pointer",
    textTransform: "uppercase",
    letterSpacing: "0.2em",
    fontFamily: sans,
    fontWeight: 500,
  },

  info: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: BRAND.creamMuted,
    letterSpacing: "0.1em",
    fontSize: 12,
    textTransform: "uppercase",
    padding: "20px 0",
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    background: BRAND.red,
    animation: "pulse 1.4s ease-in-out infinite",
  },
  errBox: {
    background: "rgba(219,38,38,0.12)",
    border: `1px solid ${BRAND.red}`,
    color: BRAND.cream,
    padding: 16,
    borderRadius: 6,
    fontSize: 13,
    marginBottom: 24,
  },

  // ── KPI Grid ─────────────────────────────────────
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 16,
    marginBottom: 32,
  },
  stat: {
    background: `linear-gradient(160deg, ${BRAND.inkSoft}, ${BRAND.ink})`,
    border: `1px solid ${BRAND.inkBorder}`,
    borderRadius: 8,
    padding: "24px 24px 26px",
    position: "relative",
    overflow: "hidden",
  },
  statAccentBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    opacity: 0.8,
  },
  statHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  statLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "0.25em",
    color: BRAND.creamMuted,
    fontWeight: 600,
  },
  statIcon: { fontSize: 16, opacity: 0.7 },
  statValue: {
    fontFamily: serif,
    fontSize: 46,
    fontWeight: 400,
    color: BRAND.cream,
    letterSpacing: "-0.03em",
    lineHeight: 1,
  },
  statHint: {
    fontSize: 11,
    color: BRAND.creamMuted,
    marginTop: 10,
    letterSpacing: "0.03em",
    fontStyle: "italic",
  },

  // ── Funnel ───────────────────────────────────────
  funnelCard: {
    background: `linear-gradient(160deg, ${BRAND.inkSoft}, ${BRAND.ink})`,
    border: `1px solid ${BRAND.inkBorder}`,
    borderRadius: 8,
    padding: "28px 32px",
    marginBottom: 24,
  },
  funnelRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 20,
  },
  funnelStep: {
    flex: "1 1 130px",
    textAlign: "center",
    padding: "18px 12px",
    background: BRAND.ink,
    border: `1px solid ${BRAND.inkBorder}`,
    borderRadius: 6,
  },
  funnelLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "0.2em",
    color: BRAND.creamMuted,
    marginBottom: 10,
  },
  funnelValue: {
    fontFamily: serif,
    fontSize: 32,
    lineHeight: 1,
    fontWeight: 400,
  },
  funnelPct: {
    fontSize: 11,
    color: BRAND.creamDim,
    marginTop: 6,
    letterSpacing: "0.05em",
  },
  funnelArrow: {
    color: BRAND.inkBorder,
    fontSize: 20,
    flexShrink: 0,
  },

  // ── Section cards ────────────────────────────────
  card: {
    background: `linear-gradient(160deg, ${BRAND.inkSoft}, ${BRAND.ink})`,
    border: `1px solid ${BRAND.inkBorder}`,
    borderRadius: 8,
    padding: "28px 32px",
    marginBottom: 24,
  },
  sectionHead: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 8,
    flexWrap: "wrap",
  },
  h2: {
    fontFamily: serif,
    fontSize: 26,
    fontWeight: 400,
    margin: 0,
    color: BRAND.cream,
    letterSpacing: "-0.01em",
  },
  h2Sub: {
    fontSize: 10,
    color: BRAND.creamMuted,
    textTransform: "uppercase",
    letterSpacing: "0.2em",
  },

  // ── Ranked list rows ─────────────────────────────
  rankList: {
    display: "flex",
    flexDirection: "column",
    marginTop: 20,
  },
  rankRow: {
    display: "grid",
    gridTemplateColumns: "44px 1fr auto",
    alignItems: "center",
    gap: 20,
    padding: "16px 0",
    borderBottom: `1px solid ${BRAND.inkBorderSoft}`,
  },
  rankNum: {
    fontFamily: serif,
    fontSize: 20,
    color: BRAND.creamMuted,
    fontVariantNumeric: "tabular-nums",
    letterSpacing: "-0.02em",
  },
  rankMain: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  rankLabel: {
    fontSize: 14,
    color: BRAND.cream,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  pagePill: {
    fontSize: 9,
    padding: "2px 8px",
    borderRadius: 999,
    background: BRAND.ink,
    border: `1px solid ${BRAND.inkBorder}`,
    color: BRAND.creamMuted,
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    fontWeight: 500,
  },
  barTrack: {
    height: 4,
    background: BRAND.ink,
    borderRadius: 999,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 999,
    transition: "width 0.4s ease",
  },
  metaRow: {
    display: "flex",
    gap: 8,
    marginTop: 2,
  },
  metaChip: {
    fontSize: 10,
    color: BRAND.creamMuted,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  rankValue: {
    fontFamily: serif,
    fontSize: 24,
    color: BRAND.cream,
    fontVariantNumeric: "tabular-nums",
    textAlign: "right",
    lineHeight: 1,
    display: "flex",
    flexDirection: "column",
    gap: 4,
    alignItems: "flex-end",
  },
  rankValueUnit: {
    fontFamily: sans,
    fontSize: 9,
    color: BRAND.creamMuted,
    textTransform: "uppercase",
    letterSpacing: "0.2em",
    fontWeight: 500,
  },

  empty: {
    padding: 40,
    textAlign: "center",
    color: BRAND.creamMuted,
    fontStyle: "italic",
    fontSize: 13,
  },

  // ── Mini stats ───────────────────────────────────
  miniGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 12,
  },
  miniStat: {
    background: BRAND.inkSoft,
    border: `1px solid ${BRAND.inkBorder}`,
    borderRadius: 6,
    padding: "16px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  miniLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "0.2em",
    color: BRAND.creamMuted,
    fontWeight: 500,
  },
  miniValue: {
    fontFamily: serif,
    fontSize: 24,
    fontWeight: 400,
    lineHeight: 1,
  },
};
