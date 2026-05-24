import { useState, useEffect } from "react";

/* ============================================================
   SHARED REGION QUEST TRACKER
   Generic component used by every region tracker (Mondstadt,
   Liyue, Inazuma, Sumeru, Natlan, Nod-Krai). Fontaine has its
   own bespoke file because the user supplied it as standalone
   code.

   Each region file passes a config object with data + theme
   tokens. All rendering logic and styling lives here.
   ============================================================ */

const rgba = (rgb, alpha) => `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;

const gameWithSearch = (q) => `https://gamewith.net/genshin-impact/article/search?keyword=${encodeURIComponent(q)}`;
const ignSearch      = (q) => `https://www.ign.com/wikis/genshin-impact/${q.replace(/[^A-Za-z0-9]+/g, "_")}`;
const fandomUrl      = (q) => `https://genshin-impact.fandom.com/wiki/${q.replace(/[^A-Za-z0-9]+/g, "_")}`;

const fillFallbackLinks = (quests) => {
  quests.forEach(q => {
    if (!q.fandom)   q.fandom   = fandomUrl(q.name.replace(/[''""]/g, ""));
    if (!q.gamewith) q.gamewith = gameWithSearch(q.name);
    if (!q.ign)      q.ign      = ignSearch(q.name);
  });
  return quests;
};

/* ============================================================
   VALUE SORT HELPERS
   ============================================================ */

/** Parse a time string like "10-15 min" or "2-3 hours" into its midpoint in minutes. */
const parseTimeMid = (timeStr: string): number => {
  if (!timeStr) return 30;
  // Strip parenthetical suffixes like "(full chain...)"
  const cleaned = timeStr.replace(/\s*\(.*\)/, "").trim();
  // Match patterns like "10-15 min" or "2-3 hours"
  const m = cleaned.match(/^(\d+(?:\.\d+)?)\s*[-–—]\s*(\d+(?:\.\d+)?)\s*(min|hour|hours|hr|hrs|minute|minutes)$/i);
  if (!m) return 30;
  const lo = parseFloat(m[1]);
  const hi = parseFloat(m[2]);
  const unit = m[3].toLowerCase();
  const mid = (lo + hi) / 2;
  if (unit.startsWith("hour") || unit === "hr" || unit === "hrs") return mid * 60;
  return mid;
};

/** Community standard: 1 Hero's Wit ~ 20,000 Mora equivalent (resin value). */
const HERO_WIT_MORA_VALUE = 20000;

const combinedValue = (quest: any): number =>
  (quest.mora || 0) + (quest.heroWit || 0) * HERO_WIT_MORA_VALUE;

const valuePerHour = (quest: any): number => {
  const val = combinedValue(quest);
  const mins = parseTimeMid(quest.time);
  return val / (mins / 60);
};

const moraPerHour = (quest: any): number => {
  const mins = parseTimeMid(quest.time);
  return (quest.mora || 0) / (mins / 60);
};

const hwPerHour = (quest: any): number => {
  const mins = parseTimeMid(quest.time);
  return (quest.heroWit || 0) / (mins / 60);
};

const formatValueBadge = (value: number, unit: string): string => {
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k ${unit}`;
  return `${value.toFixed(1)} ${unit}`;
};

type ValueSortMode = null | "mora" | "hw" | "value";

export default function RegionQuestTracker({ config }) {
  const {
    title, subtitleLabel, logoEmoji,
    completeEmoji, completeTitle, completeMessage,
    storageKey, tiers, chainTags, quests, orderNote,
    theme,
  } = config;

  const t = theme;
  const ptext = t.textRgb;          // primary text rgb
  const pacc  = t.accentRgb;        // primary accent rgb
  const pborder = rgba(pacc, 0.22); // standard accent border

  const [completed, setCompleted]   = useState({});
  const [expanded, setExpanded]     = useState(null);
  const [filterTier, setFilterTier] = useState(null);
  const [search, setSearch]         = useState("");
  const [showOrder, setShowOrder]   = useState(false);
  const [mounted, setMounted]       = useState(false);
  const [valueSort, setValueSort]   = useState<ValueSortMode>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setCompleted(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, [storageKey]);

  const persist = (next) => {
    setCompleted(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch (e) {
      // ignore
    }
  };

  const toggle    = (id) => persist({ ...completed, [id]: !completed[id] });
  const toggleExp = (id) => setExpanded(p => p === id ? null : id);

  // ensure fallback links on quests
  fillFallbackLinks(quests);

  const totalQuests = quests.length;
  const totalDone   = Object.values(completed).filter(Boolean).length;
  const pct         = Math.round((totalDone / totalQuests) * 100);

  const filtered = quests.filter(q => {
    if (filterTier && q.tier !== filterTier) return false;
    if (search) {
      const s = search.toLowerCase();
      if (!q.name.toLowerCase().includes(s) && !q.region.toLowerCase().includes(s)) return false;
    }
    return true;
  });

  const byTier = tiers.map(tier => ({
    ...tier,
    quests: filtered.filter(q => q.tier === tier.id),
  })).filter(tier => tier.quests.length > 0);

  // Value-sorted flat list (when a value sort is active)
  const valueSorted = (() => {
    if (!valueSort) return [];
    // Separate quests with vs without reward data for the active sort
    const hasData = (q: any) => {
      if (valueSort === "mora") return typeof q.mora === "number" && q.mora > 0;
      if (valueSort === "hw") return typeof q.heroWit === "number" && q.heroWit > 0;
      // "value" — has either
      return (typeof q.mora === "number" && q.mora > 0) || (typeof q.heroWit === "number" && q.heroWit > 0);
    };
    const withData = filtered.filter(hasData);
    const withoutData = filtered.filter(q => !hasData(q));
    const sortFn = (a: any, b: any) => {
      if (valueSort === "mora") return moraPerHour(b) - moraPerHour(a);
      if (valueSort === "hw") return hwPerHour(b) - hwPerHour(a);
      return valuePerHour(b) - valuePerHour(a);
    };
    withData.sort(sortFn);
    return [...withData, ...withoutData];
  })();

  return (
    <div style={{ minHeight:"100vh", background:t.pageBg, fontFamily:"Georgia,serif", color:t.textPrimary, paddingBottom:64 }}>
      {/* Header */}
      <div style={{ background:t.headerBg, borderBottom:`1px solid ${pborder}`, padding:"32px 24px 24px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:600, height:200, background:`radial-gradient(ellipse,${rgba(pacc, 0.10)} 0%,transparent 70%)`, pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, backgroundImage:`radial-gradient(circle at 20% 50%, ${t.pattern1} 0%, transparent 50%), radial-gradient(circle at 80% 50%, ${t.pattern2} 0%, transparent 50%)`, pointerEvents:"none" }} />

        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:4 }}>
          <div style={{ width:36, height:36, borderRadius:"50%", background:t.logoBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow:`0 0 20px ${rgba(pacc, 0.5)}` }}>{logoEmoji}</div>
          <h1 style={{ fontSize:"clamp(18px,4vw,28px)", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", background:t.titleGradient, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", margin:0 }}>
            {title}
          </h1>
        </div>
        <p style={{ fontSize:12, letterSpacing:"0.22em", color:rgba(pacc, 0.55), textTransform:"uppercase", marginBottom:24 }}>
          {subtitleLabel}
        </p>

        {/* Progress bar */}
        <div style={{ maxWidth:480, margin:"0 auto 20px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:rgba(ptext, 0.4), marginBottom:6, letterSpacing:"0.08em" }}>
            <span>OVERALL PROGRESS</span>
            <span>{totalDone}/{totalQuests} — {pct}%</span>
          </div>
          <div style={{ height:6, background:"rgba(255,255,255,0.05)", borderRadius:3, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${pct}%`, borderRadius:3, background:t.progressGradient, transition:"width 0.5s ease", boxShadow:`0 0 8px ${rgba(pacc, 0.5)}` }} />
          </div>
        </div>

        {/* Controls */}
        <div style={{ display:"flex", gap:8, maxWidth:720, margin:"0 auto", flexWrap:"wrap", justifyContent:"center" }}>
          <input
            style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${pborder}`, borderRadius:6, padding:"8px 14px", color:t.textPrimary, fontSize:13, outline:"none", width:200 }}
            placeholder="Search quests or regions..."
            value={search} onChange={e => setSearch(e.target.value)} />
          <button onClick={() => setFilterTier(null)}
            style={{ padding:"6px 14px", borderRadius:6, border:`1px solid ${!filterTier ? t.accent : "rgba(255,255,255,0.08)"}`, background:!filterTier ? rgba(pacc, 0.12) : "rgba(255,255,255,0.02)", color:!filterTier ? t.accent : rgba(ptext, 0.4), fontSize:12, cursor:"pointer", fontWeight:!filterTier?600:400 }}>
            ALL
          </button>
          {tiers.map(tier => (
            <button key={tier.id} onClick={() => setFilterTier(filterTier===tier.id ? null : tier.id)}
              style={{ padding:"6px 14px", borderRadius:6, border:`1px solid ${filterTier===tier.id ? tier.color : "rgba(255,255,255,0.08)"}`, background:filterTier===tier.id ? tier.bg : "rgba(255,255,255,0.02)", color:filterTier===tier.id ? tier.color : rgba(ptext, 0.4), fontSize:12, cursor:"pointer", fontWeight:filterTier===tier.id?600:400 }}>
              {tier.icon} {tier.label}
            </button>
          ))}
          <button onClick={() => setShowOrder(p => !p)}
            style={{ padding:"6px 14px", borderRadius:6, border:`1px solid ${showOrder ? "#fbbf24" : "rgba(255,255,255,0.08)"}`, background:showOrder ? "rgba(251,191,36,0.1)" : "rgba(255,255,255,0.02)", color:showOrder ? "#fbbf24" : rgba(ptext, 0.4), fontSize:12, cursor:"pointer" }}>
            📋 Order
          </button>
        </div>

        {/* Value sort buttons */}
        <div style={{ display:"flex", gap:8, maxWidth:720, margin:"10px auto 0", flexWrap:"wrap", justifyContent:"center" }}>
          {([
            { mode: "mora"  as ValueSortMode, label: "💰 Mora/hr" },
            { mode: "hw"    as ValueSortMode, label: "📘 HW/hr" },
            { mode: "value" as ValueSortMode, label: "⚡ Value/hr" },
            { mode: null    as ValueSortMode, label: "Default" },
          ]).map(btn => {
            const isActive = valueSort === btn.mode;
            return (
              <button key={btn.label} onClick={() => setValueSort(btn.mode)}
                style={{
                  padding:"6px 14px", borderRadius:6, fontSize:12, cursor:"pointer", fontWeight:isActive?600:400,
                  border:`1px solid ${isActive ? "#f59e0b" : "rgba(255,255,255,0.08)"}`,
                  background:isActive ? "rgba(245,158,11,0.14)" : "rgba(255,255,255,0.02)",
                  color:isActive ? "#fbbf24" : rgba(ptext, 0.4),
                }}>
                {btn.label}
              </button>
            );
          })}
        </div>

        {/* Value sort indicator */}
        {valueSort && (
          <div style={{ textAlign:"center", margin:"10px auto 0", fontSize:11, color:"rgba(251,191,36,0.7)", letterSpacing:"0.05em" }}>
            Sorted by {valueSort === "mora" ? "Mora/hr" : valueSort === "hw" ? "HW/hr" : "Combined value/hr"} · 1 Hero's Wit ≈ 20k Mora
          </div>
        )}
      </div>

      {showOrder && (
        <div style={{ maxWidth:880, margin:"24px auto 0", padding:"0 16px" }}>
          <div style={{ background:"rgba(251,191,36,0.06)", border:"1px solid rgba(251,191,36,0.2)", borderRadius:12, padding:"20px 24px" }}>
            <h3 style={{ color:"#fbbf24", fontSize:13, letterSpacing:"0.15em", textTransform:"uppercase", margin:"0 0 16px 0" }}>📋 Recommended Completion Order</h3>
            {orderNote.map(o => (
              <div key={o.step} style={{ display:"flex", gap:12, marginBottom:10, alignItems:"flex-start" }}>
                <span style={{ fontSize:11, minWidth:24, height:24, borderRadius:"50%", background:"rgba(251,191,36,0.15)", border:"1px solid rgba(251,191,36,0.3)", color:"#fbbf24", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, flexShrink:0 }}>{o.step}</span>
                <span style={{ fontSize:12, color:rgba(ptext, 0.7), lineHeight:1.5 }}>{o.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quest list */}
      <div style={{ maxWidth:880, margin:"0 auto", padding:"32px 16px 0" }}>
        {((valueSort ? valueSorted.length : byTier.length) === 0) && (
          <div style={{ textAlign:"center", padding:"60px 20px", color:rgba(ptext, 0.3), fontSize:14 }}>
            <div style={{ fontSize:32, marginBottom:12 }}>🔍</div>No quests found
          </div>
        )}

        {/* ── Default tier-grouped view ── */}
        {!valueSort && byTier.map(tier => (
          <div key={tier.id} style={{ marginBottom:32, opacity:mounted?1:0, transform:mounted?"none":"translateY(16px)", transition:"all 0.4s ease" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, paddingBottom:10, borderBottom:`1px solid ${tier.border}` }}>
              <span style={{ fontSize:18 }}>{tier.icon}</span>
              <span style={{ fontSize:15, fontWeight:700, color:tier.color, letterSpacing:"0.07em" }}>{tier.label} — {tier.sublabel}</span>
              <span style={{ fontSize:11, color:rgba(ptext, 0.35), marginLeft:"auto" }}>{tier.time}</span>
              <div style={{ padding:"3px 10px", borderRadius:20, background:tier.bg, border:`1px solid ${tier.border}`, color:tier.color, fontSize:11, fontWeight:600 }}>
                {tier.quests.filter(q => completed[q.id]).length}/{tier.quests.length} done
              </div>
            </div>

            {tier.quests.map(quest => {
              const isDone  = !!completed[quest.id];
              const isOpen  = expanded === quest.id;
              const chain   = chainTags[quest.chain] || chainTags.standalone || { label: quest.chain, color: "#64748b" };
              const tierObj = tiers.find(ti => ti.id === quest.tier) || tier;

              return (
                <div key={quest.id}
                  style={{ background:isDone ? "rgba(255,255,255,0.015)" : t.cardBg, border:`1px solid ${isOpen ? tierObj.color+"55" : isDone ? "rgba(255,255,255,0.05)" : tierObj.border}`, borderRadius:10, marginBottom:8, overflow:"hidden", transition:"all 0.2s", opacity:isDone?0.42:1, boxShadow:isOpen?`0 0 22px ${tierObj.glow}`:"none", cursor:"pointer" }}>

                  <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px" }} onClick={() => toggleExp(quest.id)}>
                    <div onClick={e => { e.stopPropagation(); toggle(quest.id); }}
                      style={{ width:20, height:20, minWidth:20, borderRadius:4, border:`2px solid ${isDone ? tierObj.color : rgba(pacc, 0.3)}`, background:isDone ? tierObj.color+"28" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all 0.2s", fontSize:12, color:tierObj.color }}>
                      {isDone && "✓"}
                    </div>
                    <span style={{ flex:1, fontSize:14, fontWeight:600, color:isDone?rgba(ptext, 0.4):t.textBright, letterSpacing:"0.03em", textDecoration:isDone?"line-through":"none" }}>
                      {quest.name}
                    </span>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:9, padding:"2px 7px", borderRadius:10, background:`${chain.color}15`, color:chain.color, border:`1px solid ${chain.color}40`, whiteSpace:"nowrap" }}>
                        {chain.label}
                      </span>
                      {quest.isSpecial && <span style={{ fontSize:9, padding:"2px 6px", borderRadius:10, background:rgba(pacc, 0.15), color:t.accent, border:`1px solid ${rgba(pacc, 0.35)}`, fontWeight:700 }}>KEY</span>}
                      <span style={{ fontSize:10, padding:"2px 8px", borderRadius:10, background:tierObj.bg, color:tierObj.color, border:`1px solid ${tierObj.border}`, whiteSpace:"nowrap" }}>{quest.time}</span>
                      <span style={{ fontSize:10, color:rgba(ptext, 0.3), transform:isOpen?"rotate(180deg)":"none", transition:"transform 0.2s" }}>▼</span>
                    </div>
                  </div>

                  <div style={{ maxHeight:isOpen?900:0, overflow:"hidden", transition:"max-height 0.4s ease" }}>
                    <div style={{ padding:"14px 16px 16px 48px", borderTop:`1px solid ${tierObj.border}` }}>
                      {[
                        ["Region",   `📍 ${quest.region}`],
                        ["Activate", quest.activate],
                        ["Prereqs",  quest.prereqs],
                        ["Tips",     quest.notes],
                        ["Rewards",  quest.rewards],
                      ].map(([label, val]) => (
                        <div key={label} style={{ display:"flex", gap:8, marginBottom:8, alignItems:"flex-start" }}>
                          <span style={{ fontSize:10, color:rgba(pacc, 0.65), letterSpacing:"0.12em", textTransform:"uppercase", minWidth:68, marginTop:2, fontWeight:600 }}>{label}</span>
                          <span style={{ fontSize:12, lineHeight:1.6, flex:1, whiteSpace:"pre-line",
                            color: label==="Prereqs" ? "#fde68a"
                                 : label==="Rewards" ? "#86efac"
                                 : label==="Tips"    ? rgba(ptext, 0.55)
                                 : rgba(ptext, 0.75),
                            fontStyle: label==="Tips" ? "italic" : "normal" }}>
                            {val}
                          </span>
                        </div>
                      ))}

                      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:12 }}>
                        {quest.game8 && (
                          <a href={quest.game8} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                            style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:6, background:tierObj.bg, border:`1px solid ${tierObj.border}`, color:tierObj.color, fontSize:10, textDecoration:"none", fontWeight:600, letterSpacing:"0.05em" }}>
                            Game8 ↗
                          </a>
                        )}
                        <a href={quest.fandom} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                          style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:6, background:"rgba(245,158,11,0.06)", border:"1px solid rgba(245,158,11,0.25)", color:"#fbbf24", fontSize:10, textDecoration:"none", fontWeight:600, letterSpacing:"0.05em" }}>
                          Fandom Wiki ↗
                        </a>
                        <a href={quest.gamewith} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                          style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:6, background:"rgba(244,114,182,0.06)", border:"1px solid rgba(244,114,182,0.25)", color:"#f9a8d4", fontSize:10, textDecoration:"none", fontWeight:600, letterSpacing:"0.05em" }}>
                          GameWith ↗
                        </a>
                        <a href={quest.ign} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                          style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:6, background:"rgba(132,204,22,0.06)", border:"1px solid rgba(132,204,22,0.25)", color:"#a3e635", fontSize:10, textDecoration:"none", fontWeight:600, letterSpacing:"0.05em" }}>
                          IGN ↗
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* ── Value-sorted flat view ── */}
        {valueSort && valueSorted.length > 0 && (
          <div style={{ marginBottom:32, opacity:mounted?1:0, transform:mounted?"none":"translateY(16px)", transition:"all 0.4s ease" }}>
            {valueSorted.map(quest => {
              const isDone  = !!completed[quest.id];
              const isOpen  = expanded === quest.id;
              const chain   = chainTags[quest.chain] || chainTags.standalone || { label: quest.chain, color: "#64748b" };
              const tierObj = tiers.find(ti => ti.id === quest.tier) || tiers[0];

              // Compute value badge content
              const hasRewardData = (valueSort === "mora" && typeof quest.mora === "number" && quest.mora > 0)
                || (valueSort === "hw" && typeof quest.heroWit === "number" && quest.heroWit > 0)
                || (valueSort === "value" && ((typeof quest.mora === "number" && quest.mora > 0) || (typeof quest.heroWit === "number" && quest.heroWit > 0)));

              let valueBadgeText = "—";
              if (hasRewardData) {
                if (valueSort === "mora") valueBadgeText = formatValueBadge(moraPerHour(quest), "Mora/hr");
                else if (valueSort === "hw") valueBadgeText = formatValueBadge(hwPerHour(quest), "HW/hr");
                else valueBadgeText = formatValueBadge(valuePerHour(quest), "value/hr");
              }

              return (
                <div key={quest.id}
                  style={{ background:isDone ? "rgba(255,255,255,0.015)" : t.cardBg, border:`1px solid ${isOpen ? tierObj.color+"55" : isDone ? "rgba(255,255,255,0.05)" : tierObj.border}`, borderRadius:10, marginBottom:8, overflow:"hidden", transition:"all 0.2s", opacity:isDone?0.42:1, boxShadow:isOpen?`0 0 22px ${tierObj.glow}`:"none", cursor:"pointer" }}>

                  <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px" }} onClick={() => toggleExp(quest.id)}>
                    <div onClick={e => { e.stopPropagation(); toggle(quest.id); }}
                      style={{ width:20, height:20, minWidth:20, borderRadius:4, border:`2px solid ${isDone ? tierObj.color : rgba(pacc, 0.3)}`, background:isDone ? tierObj.color+"28" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all 0.2s", fontSize:12, color:tierObj.color }}>
                      {isDone && "✓"}
                    </div>
                    <span style={{ flex:1, fontSize:14, fontWeight:600, color:isDone?rgba(ptext, 0.4):t.textBright, letterSpacing:"0.03em", textDecoration:isDone?"line-through":"none" }}>
                      {quest.name}
                    </span>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:9, padding:"2px 7px", borderRadius:10, background:`${chain.color}15`, color:chain.color, border:`1px solid ${chain.color}40`, whiteSpace:"nowrap" }}>
                        {chain.label}
                      </span>
                      {quest.isSpecial && <span style={{ fontSize:9, padding:"2px 6px", borderRadius:10, background:rgba(pacc, 0.15), color:t.accent, border:`1px solid ${rgba(pacc, 0.35)}`, fontWeight:700 }}>KEY</span>}
                      <span style={{ fontSize:10, padding:"2px 8px", borderRadius:10, background:tierObj.bg, color:tierObj.color, border:`1px solid ${tierObj.border}`, whiteSpace:"nowrap" }}>{quest.time}</span>
                      {/* Value badge */}
                      <span style={{
                        fontSize:10, padding:"2px 8px", borderRadius:10, whiteSpace:"nowrap", fontWeight:600,
                        background: hasRewardData ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,0.04)",
                        color: hasRewardData ? "#fbbf24" : rgba(ptext, 0.3),
                        border: `1px solid ${hasRewardData ? "rgba(251,191,36,0.35)" : "rgba(255,255,255,0.08)"}`,
                      }}>
                        {hasRewardData ? "⚡ " : ""}{valueBadgeText}
                      </span>
                      <span style={{ fontSize:10, color:rgba(ptext, 0.3), transform:isOpen?"rotate(180deg)":"none", transition:"transform 0.2s" }}>{"▼"}</span>
                    </div>
                  </div>

                  <div style={{ maxHeight:isOpen?900:0, overflow:"hidden", transition:"max-height 0.4s ease" }}>
                    <div style={{ padding:"14px 16px 16px 48px", borderTop:`1px solid ${tierObj.border}` }}>
                      {[
                        ["Region",   `📍 ${quest.region}`],
                        ["Activate", quest.activate],
                        ["Prereqs",  quest.prereqs],
                        ["Tips",     quest.notes],
                        ["Rewards",  quest.rewards],
                      ].map(([label, val]) => (
                        <div key={label} style={{ display:"flex", gap:8, marginBottom:8, alignItems:"flex-start" }}>
                          <span style={{ fontSize:10, color:rgba(pacc, 0.65), letterSpacing:"0.12em", textTransform:"uppercase", minWidth:68, marginTop:2, fontWeight:600 }}>{label}</span>
                          <span style={{ fontSize:12, lineHeight:1.6, flex:1, whiteSpace:"pre-line",
                            color: label==="Prereqs" ? "#fde68a"
                                 : label==="Rewards" ? "#86efac"
                                 : label==="Tips"    ? rgba(ptext, 0.55)
                                 : rgba(ptext, 0.75),
                            fontStyle: label==="Tips" ? "italic" : "normal" }}>
                            {val}
                          </span>
                        </div>
                      ))}

                      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:12 }}>
                        {quest.game8 && (
                          <a href={quest.game8} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                            style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:6, background:tierObj.bg, border:`1px solid ${tierObj.border}`, color:tierObj.color, fontSize:10, textDecoration:"none", fontWeight:600, letterSpacing:"0.05em" }}>
                            Game8 ↗
                          </a>
                        )}
                        <a href={quest.fandom} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                          style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:6, background:"rgba(245,158,11,0.06)", border:"1px solid rgba(245,158,11,0.25)", color:"#fbbf24", fontSize:10, textDecoration:"none", fontWeight:600, letterSpacing:"0.05em" }}>
                          Fandom Wiki ↗
                        </a>
                        <a href={quest.gamewith} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                          style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:6, background:"rgba(244,114,182,0.06)", border:"1px solid rgba(244,114,182,0.25)", color:"#f9a8d4", fontSize:10, textDecoration:"none", fontWeight:600, letterSpacing:"0.05em" }}>
                          GameWith ↗
                        </a>
                        <a href={quest.ign} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                          style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:6, background:"rgba(132,204,22,0.06)", border:"1px solid rgba(132,204,22,0.25)", color:"#a3e635", fontSize:10, textDecoration:"none", fontWeight:600, letterSpacing:"0.05em" }}>
                          IGN ↗
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {totalDone === totalQuests && (
          <div style={{ textAlign:"center", padding:"40px 20px", background:`linear-gradient(135deg,${rgba(pacc, 0.06)},rgba(0,0,0,0.02))`, border:`1px solid ${rgba(pacc, 0.15)}`, borderRadius:12 }}>
            <div style={{ fontSize:36, marginBottom:12 }}>{completeEmoji}</div>
            <div style={{ color:t.accent, fontSize:16, fontWeight:700, letterSpacing:"0.15em" }}>{completeTitle}</div>
            <div style={{ color:rgba(ptext, 0.4), fontSize:12, marginTop:8 }}>{completeMessage}</div>
          </div>
        )}
      </div>
    </div>
  );
}
