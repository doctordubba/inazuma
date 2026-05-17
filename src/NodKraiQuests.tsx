import { useState, useEffect } from "react";

/* ============================================================
   NOD-KRAI WORLD-QUEST TRACKER
   World Quests + Story Quests + Hangouts that reward primogems.
   Nod-Krai is the newest region (v6.0 Luna I, Sept 2025).
   Sources: Game8, Fandom Wiki, BitTopup (cross-checked May 2026).
   ============================================================ */

const TIERS = [
  { id:1, label:"Tier 1", sublabel:"Very Fast",    time:"5-15 min",  color:"#93c5fd", bg:"rgba(147,197,253,0.07)", border:"rgba(147,197,253,0.22)", glow:"rgba(147,197,253,0.12)", icon:"❄" },
  { id:2, label:"Tier 2", sublabel:"Short",        time:"15-30 min", color:"#67e8f9", bg:"rgba(103,232,249,0.07)", border:"rgba(103,232,249,0.22)", glow:"rgba(103,232,249,0.12)", icon:"🌙" },
  { id:3, label:"Tier 3", sublabel:"Medium",       time:"30-60 min", color:"#a5b4fc", bg:"rgba(165,180,252,0.07)", border:"rgba(165,180,252,0.22)", glow:"rgba(165,180,252,0.12)", icon:"⚖" },
  { id:4, label:"Tier 4", sublabel:"Long / Gated", time:"60 min+",   color:"#c4b5fd", bg:"rgba(196,181,253,0.07)", border:"rgba(196,181,253,0.22)", glow:"rgba(196,181,253,0.12)", icon:"🐺" },
];

const CHAIN_TAG = {
  story:      { label:"Story Quest",      color:"#06b6d4" },
  hangout:    { label:"Hangout Event",    color:"#ec4899" },
  polkka:     { label:"Polkka chain",     color:"#a78bfa" },
  emptiness:  { label:"Colors of Emptiness", color:"#fbbf24" },
  east:       { label:"East of the Moon", color:"#34d399" },
  standalone: { label:"Standalone",       color:"#64748b" },
};

const gameWithSearch = (q) => `https://gamewith.net/genshin-impact/article/search?keyword=${encodeURIComponent(q)}`;
const ignSearch      = (q) => `https://www.ign.com/wikis/genshin-impact/${q.replace(/[^A-Za-z0-9]+/g, "_")}`;
const fandomUrl      = (q) => `https://genshin-impact.fandom.com/wiki/${q.replace(/[^A-Za-z0-9]+/g, "_")}`;

const QUESTS = [
  // ───────── TIER 2 — SHORT (15-30 min) ─────────
  {
    id:1, tier:2, chain:"east",
    name:"East of the Moon, West of the Sun (Chain)",
    time:"20-30 min per sub-quest (3 parts, parallel)",
    region:"Nod-Krai — across multiple islands",
    activate:"Trigger by approaching the marked NPCs across Lempo Isle, Hiisi Isle, and Paha Isle. Sub-quests can be done in any order.",
    prereqs:"Nod-Krai region accessible (v6.0+) · Statues of the Seven cycled in Nod-Krai",
    notes:"Three-part chain in different locations of Nod-Krai (not strictly linked). Completion rewards include the Proof of Cognoscenti — exchange currency for the Frostmoon Enclave shop.",
    rewards:"Primogems (per sub-quest) · Adv EXP · Mora · Proof of Cognoscenti currency · Nod-Krai Reputation EXP",
    game8:"https://game8.co/games/Genshin-Impact/archives/550377",
  },

  // ───────── TIER 3 — MEDIUM (30-60 min) ─────────
  {
    id:2, tier:3, chain:"emptiness",
    name:"Colors of Emptiness (Trilogy)",
    time:"45-60 min (full 3-part chain)",
    region:"Nod-Krai — Nothing Passage",
    activate:"Investigate the floating orb in the Nothing Passage. The chain auto-progresses.",
    prereqs:"Nod-Krai accessible · Nothing Passage unlocked",
    notes:"Three-part chain: Echoes, Shadows, Reverberations (or similar). Each part wraps with ~50 primogems. The final part involves a brief Frostmoon Scion philosophy puzzle.",
    rewards:"~150 Primogems total (50 per part) · 5 Hero's Wit · ~450 AR EXP per part · 50,000 Mora per part · 4 Mystic Enhancement Ore",
    game8:"https://game8.co/games/Genshin-Impact/archives/550292",
  },

  // ───────── TIER 4 — LONG / GATED (60 min+) ─────────
  {
    id:3, tier:4, chain:"polkka",
    name:"Polkka Beneath the Moon's Oracle",
    time:"3-4 hours (6-part chain)",
    region:"Nod-Krai — Hiisi Isle / Frostmoon Enclave",
    activate:"Follow the Frostmoon Scions' Oracle path. Triggered via the Enclave's main quest line.",
    prereqs:"Nod-Krai accessible + Frostmoon Enclave introduction quests done",
    notes:"6-part chain about unsealing the sanctum closed off by the first moonchanter. Heaviest single Nod-Krai chain; deep Frostmoon Scions / Kuutar (Columbina) lore.",
    rewards:"~280 Primogems total across the 6 quests · Adv EXP · Mora · Hero's Wit · Mystic Enhancement Ore · Frostmoon Enclave reputation",
    game8:"https://game8.co/games/Genshin-Impact/archives/550304",
  },
  {
    id:4, tier:4, chain:"standalone",
    name:"Nod-Krai — Full Region Sweep",
    time:"10-15 hours (full ~18-20 world-quest set)",
    region:"All of Nod-Krai (Lempo, Hiisi, Paha isles)",
    activate:"Natural progression as you explore the region and meet NPCs.",
    prereqs:"AR 30+ · Nod-Krai unlocked",
    notes:"Nod-Krai shipped with 18-20 permanent world quests in v6.0. Major chains (Polkka, East of the Moon, Colors of Emptiness) are listed above; the remainder are individual side-quests across the three isles. Plus 750 primogems from the three Meeting Point upgrades and 180 primo from Valiant Chronicles.",
    rewards:"~2,400-3,000 Primogems total from chests + ~750 from Meeting Point upgrades (Clink-Clank Krumkake Craftshop, Frostmoon Enclave, Final Night Cemetery) + 180 from Valiant Chronicles · Adv EXP, Mora, Hero's Wit · Selenic Chronicles unlocks",
    game8:"https://game8.co/games/Genshin-Impact/archives/492722",
  },
  {
    id:5, tier:4, chain:"standalone",
    name:"Selenic Chronicles (Frostmoon Scion stories)",
    time:"1-2 hours per chronicle",
    region:"Nod-Krai — multiple isles",
    activate:"Each Selenic Chronicle is unlocked through reaching reputation milestones with the Frostmoon Scions.",
    prereqs:"Frostmoon Enclave reputation accrued + Nod-Krai exploration",
    notes:"Reputation-style story arcs in the Frostmoon Scions tribal frame. Equivalent to Natlan's Tribal Chronicles. Each chronicle is one major story beat per Frostmoon character / faction.",
    rewards:"Primogems per chronicle · Frostmoon Enclave reputation EXP · Adv EXP · Mora · unique Selenic-themed cosmetics",
    game8:"https://game8.co/games/Genshin-Impact/archives/550721",
  },
];

QUESTS.forEach(q => {
  if (!q.fandom)   q.fandom   = fandomUrl(q.name.replace(/[''""]/g, ""));
  if (!q.gamewith) q.gamewith = gameWithSearch(q.name);
  if (!q.ign)      q.ign      = ignSearch(q.name);
});

const ORDER_NOTE = [
  { step:1, text:"Nod-Krai is the newest region (v6.0 Luna I, Sept 2025). Most quest content has shipped across patches v6.0 → v6.3 (Columbina patch)." },
  { step:2, text:"Start with East of the Moon, West of the Sun — its three parts can be done in any order as you naturally explore." },
  { step:3, text:"Polkka Beneath the Moon's Oracle is the single biggest Nod-Krai chain (~280 primogems). It directly opens up Kuutar (Columbina) lore — do it before her Story Quest for context." },
  { step:4, text:"Colors of Emptiness is shorter (~150 primo) and self-contained in the Nothing Passage. Quick session win." },
  { step:5, text:"The full Nod-Krai region sweep including chest exploration + Meeting Point upgrades is worth roughly 3,000+ primogems all-in. Selenic Chronicles add the reputation-style story arcs on top." },
  { step:6, text:"Nod-Krai's character Story Quests (Columbina, Jahoda, Lauma, Nefer, Linnea) are documented in their respective Story-Quest menu entries — gated by AR + region access + a Story Key each." },
];

const STORAGE_KEY = "nodkrai-quest-tracker-v1";

export default function NodKraiQuests() {
  const [completed, setCompleted]   = useState({});
  const [expanded, setExpanded]     = useState(null);
  const [filterTier, setFilterTier] = useState(null);
  const [search, setSearch]         = useState("");
  const [showOrder, setShowOrder]   = useState(false);
  const [mounted, setMounted]       = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCompleted(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  const persist = (next) => {
    setCompleted(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      // ignore
    }
  };

  const toggle    = (id) => persist({ ...completed, [id]: !completed[id] });
  const toggleExp = (id) => setExpanded(p => p === id ? null : id);

  const totalQuests = QUESTS.length;
  const totalDone   = Object.values(completed).filter(Boolean).length;
  const pct         = Math.round((totalDone / totalQuests) * 100);

  const filtered = QUESTS.filter(q => {
    if (filterTier && q.tier !== filterTier) return false;
    if (search) {
      const s = search.toLowerCase();
      if (!q.name.toLowerCase().includes(s) && !q.region.toLowerCase().includes(s)) return false;
    }
    return true;
  });

  const byTier = TIERS.map(t => ({ ...t, quests: filtered.filter(q => q.tier === t.id) })).filter(t => t.quests.length > 0);

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#020617 0%,#0a1428 40%,#152244 100%)", fontFamily:"Georgia,serif", color:"#ecfeff", paddingBottom:64 }}>
      <div style={{ background:"rgba(2,6,23,0.97)", borderBottom:"1px solid rgba(168,214,229,0.22)", padding:"32px 24px 24px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:600, height:200, background:"radial-gradient(ellipse,rgba(168,214,229,0.10) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, backgroundImage:"radial-gradient(circle at 20% 50%, rgba(165,243,252,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(96,165,250,0.06) 0%, transparent 50%)", pointerEvents:"none" }} />

        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:4 }}>
          <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#94a3b8,#1e293b)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow:"0 0 20px rgba(168,214,229,0.5)" }}>🌙</div>
          <h1 style={{ fontSize:"clamp(18px,4vw,28px)", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", background:"linear-gradient(135deg,#f0f9ff 0%,#a5f3fc 50%,#0c4a6e 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", margin:0 }}>
            Nod-Krai World Quests
          </h1>
        </div>
        <p style={{ fontSize:12, letterSpacing:"0.22em", color:"rgba(165,243,252,0.55)", textTransform:"uppercase", marginBottom:24 }}>
          World Quests · Story Quests · Hangouts — Frostmoon-bearing
        </p>

        <div style={{ maxWidth:480, margin:"0 auto 20px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"rgba(236,254,255,0.4)", marginBottom:6, letterSpacing:"0.08em" }}>
            <span>OVERALL PROGRESS</span>
            <span>{totalDone}/{totalQuests} — {pct}%</span>
          </div>
          <div style={{ height:6, background:"rgba(255,255,255,0.05)", borderRadius:3, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${pct}%`, borderRadius:3, background:"linear-gradient(90deg,#1e3a8a,#0ea5e9,#a5f3fc)", transition:"width 0.5s ease", boxShadow:"0 0 8px rgba(168,214,229,0.5)" }} />
          </div>
        </div>

        <div style={{ display:"flex", gap:8, maxWidth:720, margin:"0 auto", flexWrap:"wrap", justifyContent:"center" }}>
          <input style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(168,214,229,0.22)", borderRadius:6, padding:"8px 14px", color:"#ecfeff", fontSize:13, outline:"none", width:200 }} placeholder="Search quests or regions..." value={search} onChange={e => setSearch(e.target.value)} />
          <button onClick={() => setFilterTier(null)} style={{ padding:"6px 14px", borderRadius:6, border:`1px solid ${!filterTier ? "#a5f3fc" : "rgba(255,255,255,0.08)"}`, background:!filterTier ? "rgba(165,243,252,0.12)" : "rgba(255,255,255,0.02)", color:!filterTier ? "#a5f3fc" : "rgba(236,254,255,0.4)", fontSize:12, cursor:"pointer", fontWeight:!filterTier?600:400 }}>ALL</button>
          {TIERS.map(t => (
            <button key={t.id} onClick={() => setFilterTier(filterTier===t.id ? null : t.id)} style={{ padding:"6px 14px", borderRadius:6, border:`1px solid ${filterTier===t.id ? t.color : "rgba(255,255,255,0.08)"}`, background:filterTier===t.id ? t.bg : "rgba(255,255,255,0.02)", color:filterTier===t.id ? t.color : "rgba(236,254,255,0.4)", fontSize:12, cursor:"pointer", fontWeight:filterTier===t.id?600:400 }}>{t.icon} {t.label}</button>
          ))}
          <button onClick={() => setShowOrder(p => !p)} style={{ padding:"6px 14px", borderRadius:6, border:`1px solid ${showOrder ? "#fbbf24" : "rgba(255,255,255,0.08)"}`, background:showOrder ? "rgba(251,191,36,0.1)" : "rgba(255,255,255,0.02)", color:showOrder ? "#fbbf24" : "rgba(236,254,255,0.4)", fontSize:12, cursor:"pointer" }}>📋 Order</button>
        </div>
      </div>

      {showOrder && (
        <div style={{ maxWidth:880, margin:"24px auto 0", padding:"0 16px" }}>
          <div style={{ background:"rgba(251,191,36,0.06)", border:"1px solid rgba(251,191,36,0.2)", borderRadius:12, padding:"20px 24px" }}>
            <h3 style={{ color:"#fbbf24", fontSize:13, letterSpacing:"0.15em", textTransform:"uppercase", margin:"0 0 16px 0" }}>📋 Recommended Completion Order</h3>
            {ORDER_NOTE.map(o => (
              <div key={o.step} style={{ display:"flex", gap:12, marginBottom:10, alignItems:"flex-start" }}>
                <span style={{ fontSize:11, minWidth:24, height:24, borderRadius:"50%", background:"rgba(251,191,36,0.15)", border:"1px solid rgba(251,191,36,0.3)", color:"#fbbf24", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, flexShrink:0 }}>{o.step}</span>
                <span style={{ fontSize:12, color:"rgba(236,254,255,0.7)", lineHeight:1.5 }}>{o.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ maxWidth:880, margin:"0 auto", padding:"32px 16px 0" }}>
        {byTier.length === 0 && (
          <div style={{ textAlign:"center", padding:"60px 20px", color:"rgba(236,254,255,0.3)", fontSize:14 }}><div style={{ fontSize:32, marginBottom:12 }}>🔍</div>No quests found</div>
        )}

        {byTier.map(tier => (
          <div key={tier.id} style={{ marginBottom:32, opacity:mounted?1:0, transform:mounted?"none":"translateY(16px)", transition:"all 0.4s ease" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, paddingBottom:10, borderBottom:`1px solid ${tier.border}` }}>
              <span style={{ fontSize:18 }}>{tier.icon}</span>
              <span style={{ fontSize:15, fontWeight:700, color:tier.color, letterSpacing:"0.07em" }}>{tier.label} — {tier.sublabel}</span>
              <span style={{ fontSize:11, color:"rgba(236,254,255,0.35)", marginLeft:"auto" }}>{tier.time}</span>
              <div style={{ padding:"3px 10px", borderRadius:20, background:tier.bg, border:`1px solid ${tier.border}`, color:tier.color, fontSize:11, fontWeight:600 }}>{tier.quests.filter(q => completed[q.id]).length}/{tier.quests.length} done</div>
            </div>

            {tier.quests.map(quest => {
              const isDone = !!completed[quest.id];
              const isOpen = expanded === quest.id;
              const chain  = CHAIN_TAG[quest.chain] || CHAIN_TAG.standalone;
              return (
                <div key={quest.id} style={{ background:isDone ? "rgba(255,255,255,0.015)" : "linear-gradient(135deg,rgba(8,18,40,0.92),rgba(5,12,28,0.92))", border:`1px solid ${isOpen ? tier.color+"55" : isDone ? "rgba(255,255,255,0.05)" : tier.border}`, borderRadius:10, marginBottom:8, overflow:"hidden", transition:"all 0.2s", opacity:isDone?0.42:1, boxShadow:isOpen?`0 0 22px ${tier.glow}`:"none", cursor:"pointer" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px" }} onClick={() => toggleExp(quest.id)}>
                    <div onClick={e => { e.stopPropagation(); toggle(quest.id); }} style={{ width:20, height:20, minWidth:20, borderRadius:4, border:`2px solid ${isDone ? tier.color : "rgba(168,214,229,0.3)"}`, background:isDone ? tier.color+"28" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all 0.2s", fontSize:12, color:tier.color }}>{isDone && "✓"}</div>
                    <span style={{ flex:1, fontSize:14, fontWeight:600, color:isDone?"rgba(236,254,255,0.4)":"#f0f9ff", letterSpacing:"0.03em", textDecoration:isDone?"line-through":"none" }}>{quest.name}</span>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:9, padding:"2px 7px", borderRadius:10, background:`${chain.color}15`, color:chain.color, border:`1px solid ${chain.color}40`, whiteSpace:"nowrap" }}>{chain.label}</span>
                      {quest.isSpecial && <span style={{ fontSize:9, padding:"2px 6px", borderRadius:10, background:"rgba(165,243,252,0.15)", color:"#a5f3fc", border:"1px solid rgba(165,243,252,0.35)", fontWeight:700 }}>KEY</span>}
                      <span style={{ fontSize:10, padding:"2px 8px", borderRadius:10, background:tier.bg, color:tier.color, border:`1px solid ${tier.border}`, whiteSpace:"nowrap" }}>{quest.time}</span>
                      <span style={{ fontSize:10, color:"rgba(236,254,255,0.3)", transform:isOpen?"rotate(180deg)":"none", transition:"transform 0.2s" }}>▼</span>
                    </div>
                  </div>
                  <div style={{ maxHeight:isOpen?900:0, overflow:"hidden", transition:"max-height 0.4s ease" }}>
                    <div style={{ padding:"14px 16px 16px 48px", borderTop:`1px solid ${tier.border}` }}>
                      {[["Region",`📍 ${quest.region}`],["Activate",quest.activate],["Prereqs",quest.prereqs],["Tips",quest.notes],["Rewards",quest.rewards]].map(([label, val]) => (
                        <div key={label} style={{ display:"flex", gap:8, marginBottom:8, alignItems:"flex-start" }}>
                          <span style={{ fontSize:10, color:"rgba(165,243,252,0.65)", letterSpacing:"0.12em", textTransform:"uppercase", minWidth:68, marginTop:2, fontWeight:600 }}>{label}</span>
                          <span style={{ fontSize:12, lineHeight:1.6, flex:1, whiteSpace:"pre-line", color: label==="Prereqs" ? "#fde68a" : label==="Rewards" ? "#86efac" : label==="Tips" ? "rgba(236,254,255,0.55)" : "rgba(236,254,255,0.75)", fontStyle: label==="Tips" ? "italic" : "normal" }}>{val}</span>
                        </div>
                      ))}
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:12 }}>
                        {quest.game8 && (<a href={quest.game8} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:6, background:tier.bg, border:`1px solid ${tier.border}`, color:tier.color, fontSize:10, textDecoration:"none", fontWeight:600, letterSpacing:"0.05em" }}>Game8 ↗</a>)}
                        <a href={quest.fandom} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:6, background:"rgba(245,158,11,0.06)", border:"1px solid rgba(245,158,11,0.25)", color:"#fbbf24", fontSize:10, textDecoration:"none", fontWeight:600, letterSpacing:"0.05em" }}>Fandom Wiki ↗</a>
                        <a href={quest.gamewith} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:6, background:"rgba(244,114,182,0.06)", border:"1px solid rgba(244,114,182,0.25)", color:"#f9a8d4", fontSize:10, textDecoration:"none", fontWeight:600, letterSpacing:"0.05em" }}>GameWith ↗</a>
                        <a href={quest.ign} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:6, background:"rgba(132,204,22,0.06)", border:"1px solid rgba(132,204,22,0.25)", color:"#a3e635", fontSize:10, textDecoration:"none", fontWeight:600, letterSpacing:"0.05em" }}>IGN ↗</a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {totalDone === totalQuests && (
          <div style={{ textAlign:"center", padding:"40px 20px", background:"linear-gradient(135deg,rgba(165,243,252,0.06),rgba(8,47,73,0.02))", border:"1px solid rgba(165,243,252,0.15)", borderRadius:12 }}>
            <div style={{ fontSize:36, marginBottom:12 }}>🌙✨</div>
            <div style={{ color:"#a5f3fc", fontSize:16, fontWeight:700, letterSpacing:"0.15em" }}>ALL NOD-KRAI QUESTS COMPLETE</div>
            <div style={{ color:"rgba(236,254,255,0.4)", fontSize:12, marginTop:8 }}>Kuutar's gaze finds you in the dark, Traveler.</div>
          </div>
        )}
      </div>
    </div>
  );
}
