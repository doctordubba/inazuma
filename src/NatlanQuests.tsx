import { useState, useEffect } from "react";

/* ============================================================
   NATLAN WORLD-QUEST TRACKER
   World Quests + Story Quests + Hangouts that reward primogems.
   Archon Quests intentionally excluded per scope. Natlan has 48
   permanent world quests per Game8 — this tracker covers the
   tribe Chronicles and major Story Quests with verified rewards.
   Sources: Game8, Fandom Wiki, GameWith (cross-checked).
   ============================================================ */

const TIERS = [
  { id:1, label:"Tier 1", sublabel:"Very Fast",    time:"5-15 min",  color:"#93c5fd", bg:"rgba(147,197,253,0.07)", border:"rgba(147,197,253,0.22)", glow:"rgba(147,197,253,0.12)", icon:"🔥" },
  { id:2, label:"Tier 2", sublabel:"Short",        time:"15-30 min", color:"#67e8f9", bg:"rgba(103,232,249,0.07)", border:"rgba(103,232,249,0.22)", glow:"rgba(103,232,249,0.12)", icon:"🪶" },
  { id:3, label:"Tier 3", sublabel:"Medium",       time:"30-60 min", color:"#a5b4fc", bg:"rgba(165,180,252,0.07)", border:"rgba(165,180,252,0.22)", glow:"rgba(165,180,252,0.12)", icon:"⚖" },
  { id:4, label:"Tier 4", sublabel:"Long / Gated", time:"60 min+",   color:"#c4b5fd", bg:"rgba(196,181,253,0.07)", border:"rgba(196,181,253,0.22)", glow:"rgba(196,181,253,0.12)", icon:"🌋" },
];

const CHAIN_TAG = {
  story:      { label:"Story Quest",      color:"#06b6d4" },
  hangout:    { label:"Hangout Event",    color:"#ec4899" },
  tribal:     { label:"Tribal Chronicle", color:"#f59e0b" },
  standalone: { label:"Standalone",       color:"#64748b" },
};

const gameWithSearch = (q) => `https://gamewith.net/genshin-impact/article/search?keyword=${encodeURIComponent(q)}`;
const ignSearch      = (q) => `https://www.ign.com/wikis/genshin-impact/${q.replace(/[^A-Za-z0-9]+/g, "_")}`;
const fandomUrl      = (q) => `https://genshin-impact.fandom.com/wiki/${q.replace(/[^A-Za-z0-9]+/g, "_")}`;

const QUESTS = [
  // ───────── TIER 2 — SHORT (15-30 min) ─────────
  {
    id:1, tier:2, chain:"tribal",
    name:"Tribal Chronicles — Scions of the Canopy",
    time:"20-30 min",
    region:"Toyac Springs · Scions of the Canopy territory",
    activate:"Talk to the Tribal Chieftain after reaching the Scions of the Canopy area. Auto-tracked under Tribal Chronicles.",
    prereqs:"Natlan unlocked (AQ Ch V Act I 'Natlan! A New Adventure')",
    notes:"Kinich + Ajaw's home tribe. Progresses your Scions reputation; key reputation-related crafting & domains unlock here.",
    rewards:"Primogems · Adv EXP · Mora · Tribe Reputation EXP · ascension/tribal crafting unlocks",
    fandom:"https://genshin-impact.fandom.com/wiki/Scions_of_the_Canopy",
  },
  {
    id:2, tier:2, chain:"tribal",
    name:"Tribal Chronicles — Children of Echoes",
    time:"20-30 min",
    region:"Coatepec Mountain · Children of Echoes territory",
    activate:"Tribal Chronicles menu unlocks after AQ progression in Natlan. Talk to the local liaison.",
    prereqs:"Natlan unlocked + relevant AQ progression",
    notes:"Xilonen's tribe (the smiths). Reputation progresses; gear-tuning bench and saurian-related crafting unlocks here.",
    rewards:"Primogems · Adv EXP · Mora · Tribe Reputation EXP · gear-tuning bench unlocks",
    fandom:"https://genshin-impact.fandom.com/wiki/Children_of_Echoes",
  },
  {
    id:3, tier:2, chain:"tribal",
    name:"Tribal Chronicles — People of the Springs",
    time:"20-30 min",
    region:"Tequemecan Valley · People of the Springs territory",
    activate:"Tribal Chronicles menu. Talk to Mualani or her relatives near the Springs.",
    prereqs:"Natlan unlocked + relevant AQ progression",
    notes:"Mualani's tribe (the surfer/water folk). Reputation progresses; water-related domains and crafting unlocks here.",
    rewards:"Primogems · Adv EXP · Mora · Tribe Reputation EXP",
    fandom:"https://genshin-impact.fandom.com/wiki/People_of_the_Springs",
  },
  {
    id:4, tier:2, chain:"tribal",
    name:"Tribal Chronicles — Masters of the Night-Wind",
    time:"20-30 min",
    region:"Sulfurous Veins · Masters of the Night-Wind territory",
    activate:"Tribal Chronicles menu. Liaison NPC in the tribe's plaza.",
    prereqs:"Natlan unlocked + relevant AQ progression",
    notes:"Ororon (Bidii) and Iansan's tribe. Reputation progresses; spirit-related crafting and shop unlocks here.",
    rewards:"Primogems · Adv EXP · Mora · Tribe Reputation EXP",
    fandom:"https://genshin-impact.fandom.com/wiki/Masters_of_the_Night-Wind",
  },
  {
    id:5, tier:2, chain:"tribal",
    name:"Tribal Chronicles — Flower-Feather Clan",
    time:"20-30 min",
    region:"Atocpan · Flower-Feather Clan territory",
    activate:"Tribal Chronicles menu. Talk to the liaison in the Flower-Feather plaza.",
    prereqs:"Natlan unlocked + relevant AQ progression",
    notes:"Kachina and Chasca's tribe (bird-clan, dragoon arc). Reputation progresses; gliding-related rewards unlock here.",
    rewards:"Primogems · Adv EXP · Mora · Tribe Reputation EXP",
    fandom:"https://genshin-impact.fandom.com/wiki/Flower-Feather_Clan",
  },
  {
    id:6, tier:2, chain:"tribal",
    name:"Tribal Chronicles — Collective of Plenty",
    time:"20-30 min",
    region:"Tezcatepetonco Range · Collective of Plenty territory",
    activate:"Tribal Chronicles menu. Talk to the capybara-kin liaison.",
    prereqs:"Natlan unlocked + relevant AQ progression",
    notes:"Varesa's tribe. The Capybara-kin Collective progresses; plunge-related challenges unlock here.",
    rewards:"Primogems · Adv EXP · Mora · Tribe Reputation EXP",
    fandom:"https://genshin-impact.fandom.com/wiki/Collective_of_Plenty",
  },

  // ───────── TIER 3 — MEDIUM (30-60 min) ─────────
  {
    id:7, tier:3, chain:"story",
    name:"Mavuika — As the Blazing Sun",
    time:"45-60 min",
    region:"Natlan — across multiple tribes",
    activate:"Story Quest menu. Spend 1 Story Key. Find Mavuika in the Stadium of the Sacred Flame.",
    prereqs:"AR 40 + AQ Ch V Act V 'Incandescent Ode of Resurrection' + 1 Story Key (released v5.3)",
    notes:"Sol Invictus Chapter — Act I. Mavuika's first independent Story Quest. Time-limited bonus rewards if completed during the 'As the Blazing Sun' event window (now past for new players).",
    rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Mavuika ascension materials",
    game8:"https://game8.co/games/Genshin-Impact/archives/491942",
  },

  // ───────── TIER 4 — LONG / GATED (60 min+) ─────────
  {
    id:8, tier:4, chain:"standalone",
    name:"Natlan World Quests — Full Region",
    time:"15-25 hours (full ~48-quest set)",
    region:"All of Natlan (Stadium, Toyac, Coatepec, Tequemecan, Sulfurous Veins, Atocpan, Tezcatepetonco)",
    activate:"Natural progression as you explore the region and unlock waypoints; world quests pop on the map as you approach NPCs.",
    prereqs:"AR 30+ · Natlan unlocked · Statues of the Seven cycled",
    notes:"Natlan ships with ~48 permanent world quests per Game8 — too many to enumerate individually here. Major Tier-4-equivalent chains include the Hero's Tales side-stories and several Saurian-companion sequences. Reward total estimated at 1,500-2,000 primogems for full clear.",
    rewards:"~1,500-2,000 Primogems total across the full Natlan world-quest set · ~150,000+ Mora · Hero's Wit, MEO · several Saurian companion gadgets · multiple achievements",
    game8:"https://game8.co/games/Genshin-Impact/archives/470500",
  },
];

QUESTS.forEach(q => {
  if (!q.fandom)   q.fandom   = fandomUrl(q.name.replace(/[''""]/g, ""));
  if (!q.gamewith) q.gamewith = gameWithSearch(q.name);
  if (!q.ign)      q.ign      = ignSearch(q.name);
});

const ORDER_NOTE = [
  { step:1, text:"Tribal Chronicles are Natlan's reputation-style backbone. Pick them up as you visit each tribe's home for the first time — they're the most consistent primogem source." },
  { step:2, text:"Tribe-reputation unlocks gate several quality-of-life features (gear tuning, faster gliding, Saurian companions). Do at least 2-3 chronicles before deep exploration." },
  { step:3, text:"Mavuika's Story Quest is gated by AQ Ch V Act V (Incandescent Ode of Resurrection) — finish the main story before spending a Story Key on it." },
  { step:4, text:"This tracker covers verified chronicle / Story Quest entries. Natlan has 48 individual world quests in total per Game8 — many short side-stories per tribe — which is summarized in the Tier 4 'Full Region' entry rather than enumerated here." },
];

const STORAGE_KEY = "natlan-quest-tracker-v1";

export default function NatlanQuests() {
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
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#1a0703 0%,#3a1308 40%,#552010 100%)", fontFamily:"Georgia,serif", color:"#ffedd5", paddingBottom:64 }}>
      <div style={{ background:"rgba(15,4,2,0.97)", borderBottom:"1px solid rgba(217,107,80,0.22)", padding:"32px 24px 24px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:600, height:200, background:"radial-gradient(ellipse,rgba(217,107,80,0.10) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, backgroundImage:"radial-gradient(circle at 20% 50%, rgba(254,202,87,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(220,38,38,0.06) 0%, transparent 50%)", pointerEvents:"none" }} />

        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:4 }}>
          <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#dc2626,#7c1d1d)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow:"0 0 20px rgba(217,107,80,0.5)" }}>🌋</div>
          <h1 style={{ fontSize:"clamp(18px,4vw,28px)", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", background:"linear-gradient(135deg,#fff7ed 0%,#fb923c 50%,#9a3412 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", margin:0 }}>
            Natlan World Quests
          </h1>
        </div>
        <p style={{ fontSize:12, letterSpacing:"0.22em", color:"rgba(251,146,60,0.55)", textTransform:"uppercase", marginBottom:24 }}>
          Tribal Chronicles · Story Quests · Hangouts — primogem-bearing
        </p>

        <div style={{ maxWidth:480, margin:"0 auto 20px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"rgba(255,237,213,0.4)", marginBottom:6, letterSpacing:"0.08em" }}>
            <span>OVERALL PROGRESS</span>
            <span>{totalDone}/{totalQuests} — {pct}%</span>
          </div>
          <div style={{ height:6, background:"rgba(255,255,255,0.05)", borderRadius:3, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${pct}%`, borderRadius:3, background:"linear-gradient(90deg,#7c2d12,#dc2626,#fb923c)", transition:"width 0.5s ease", boxShadow:"0 0 8px rgba(217,107,80,0.5)" }} />
          </div>
        </div>

        <div style={{ display:"flex", gap:8, maxWidth:720, margin:"0 auto", flexWrap:"wrap", justifyContent:"center" }}>
          <input style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(217,107,80,0.22)", borderRadius:6, padding:"8px 14px", color:"#ffedd5", fontSize:13, outline:"none", width:200 }} placeholder="Search quests or regions..." value={search} onChange={e => setSearch(e.target.value)} />
          <button onClick={() => setFilterTier(null)} style={{ padding:"6px 14px", borderRadius:6, border:`1px solid ${!filterTier ? "#fb923c" : "rgba(255,255,255,0.08)"}`, background:!filterTier ? "rgba(251,146,60,0.12)" : "rgba(255,255,255,0.02)", color:!filterTier ? "#fb923c" : "rgba(255,237,213,0.4)", fontSize:12, cursor:"pointer", fontWeight:!filterTier?600:400 }}>ALL</button>
          {TIERS.map(t => (
            <button key={t.id} onClick={() => setFilterTier(filterTier===t.id ? null : t.id)} style={{ padding:"6px 14px", borderRadius:6, border:`1px solid ${filterTier===t.id ? t.color : "rgba(255,255,255,0.08)"}`, background:filterTier===t.id ? t.bg : "rgba(255,255,255,0.02)", color:filterTier===t.id ? t.color : "rgba(255,237,213,0.4)", fontSize:12, cursor:"pointer", fontWeight:filterTier===t.id?600:400 }}>{t.icon} {t.label}</button>
          ))}
          <button onClick={() => setShowOrder(p => !p)} style={{ padding:"6px 14px", borderRadius:6, border:`1px solid ${showOrder ? "#fbbf24" : "rgba(255,255,255,0.08)"}`, background:showOrder ? "rgba(251,191,36,0.1)" : "rgba(255,255,255,0.02)", color:showOrder ? "#fbbf24" : "rgba(255,237,213,0.4)", fontSize:12, cursor:"pointer" }}>📋 Order</button>
        </div>
      </div>

      {showOrder && (
        <div style={{ maxWidth:880, margin:"24px auto 0", padding:"0 16px" }}>
          <div style={{ background:"rgba(251,191,36,0.06)", border:"1px solid rgba(251,191,36,0.2)", borderRadius:12, padding:"20px 24px" }}>
            <h3 style={{ color:"#fbbf24", fontSize:13, letterSpacing:"0.15em", textTransform:"uppercase", margin:"0 0 16px 0" }}>📋 Recommended Completion Order</h3>
            {ORDER_NOTE.map(o => (
              <div key={o.step} style={{ display:"flex", gap:12, marginBottom:10, alignItems:"flex-start" }}>
                <span style={{ fontSize:11, minWidth:24, height:24, borderRadius:"50%", background:"rgba(251,191,36,0.15)", border:"1px solid rgba(251,191,36,0.3)", color:"#fbbf24", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, flexShrink:0 }}>{o.step}</span>
                <span style={{ fontSize:12, color:"rgba(255,237,213,0.7)", lineHeight:1.5 }}>{o.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ maxWidth:880, margin:"0 auto", padding:"32px 16px 0" }}>
        {byTier.length === 0 && (
          <div style={{ textAlign:"center", padding:"60px 20px", color:"rgba(255,237,213,0.3)", fontSize:14 }}><div style={{ fontSize:32, marginBottom:12 }}>🔍</div>No quests found</div>
        )}

        {byTier.map(tier => (
          <div key={tier.id} style={{ marginBottom:32, opacity:mounted?1:0, transform:mounted?"none":"translateY(16px)", transition:"all 0.4s ease" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, paddingBottom:10, borderBottom:`1px solid ${tier.border}` }}>
              <span style={{ fontSize:18 }}>{tier.icon}</span>
              <span style={{ fontSize:15, fontWeight:700, color:tier.color, letterSpacing:"0.07em" }}>{tier.label} — {tier.sublabel}</span>
              <span style={{ fontSize:11, color:"rgba(255,237,213,0.35)", marginLeft:"auto" }}>{tier.time}</span>
              <div style={{ padding:"3px 10px", borderRadius:20, background:tier.bg, border:`1px solid ${tier.border}`, color:tier.color, fontSize:11, fontWeight:600 }}>{tier.quests.filter(q => completed[q.id]).length}/{tier.quests.length} done</div>
            </div>

            {tier.quests.map(quest => {
              const isDone = !!completed[quest.id];
              const isOpen = expanded === quest.id;
              const chain  = CHAIN_TAG[quest.chain] || CHAIN_TAG.standalone;
              return (
                <div key={quest.id} style={{ background:isDone ? "rgba(255,255,255,0.015)" : "linear-gradient(135deg,rgba(40,15,8,0.92),rgba(28,8,4,0.92))", border:`1px solid ${isOpen ? tier.color+"55" : isDone ? "rgba(255,255,255,0.05)" : tier.border}`, borderRadius:10, marginBottom:8, overflow:"hidden", transition:"all 0.2s", opacity:isDone?0.42:1, boxShadow:isOpen?`0 0 22px ${tier.glow}`:"none", cursor:"pointer" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px" }} onClick={() => toggleExp(quest.id)}>
                    <div onClick={e => { e.stopPropagation(); toggle(quest.id); }} style={{ width:20, height:20, minWidth:20, borderRadius:4, border:`2px solid ${isDone ? tier.color : "rgba(217,107,80,0.3)"}`, background:isDone ? tier.color+"28" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all 0.2s", fontSize:12, color:tier.color }}>{isDone && "✓"}</div>
                    <span style={{ flex:1, fontSize:14, fontWeight:600, color:isDone?"rgba(255,237,213,0.4)":"#fff7ed", letterSpacing:"0.03em", textDecoration:isDone?"line-through":"none" }}>{quest.name}</span>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:9, padding:"2px 7px", borderRadius:10, background:`${chain.color}15`, color:chain.color, border:`1px solid ${chain.color}40`, whiteSpace:"nowrap" }}>{chain.label}</span>
                      {quest.isSpecial && <span style={{ fontSize:9, padding:"2px 6px", borderRadius:10, background:"rgba(251,146,60,0.15)", color:"#fb923c", border:"1px solid rgba(251,146,60,0.35)", fontWeight:700 }}>KEY</span>}
                      <span style={{ fontSize:10, padding:"2px 8px", borderRadius:10, background:tier.bg, color:tier.color, border:`1px solid ${tier.border}`, whiteSpace:"nowrap" }}>{quest.time}</span>
                      <span style={{ fontSize:10, color:"rgba(255,237,213,0.3)", transform:isOpen?"rotate(180deg)":"none", transition:"transform 0.2s" }}>▼</span>
                    </div>
                  </div>
                  <div style={{ maxHeight:isOpen?900:0, overflow:"hidden", transition:"max-height 0.4s ease" }}>
                    <div style={{ padding:"14px 16px 16px 48px", borderTop:`1px solid ${tier.border}` }}>
                      {[["Region",`📍 ${quest.region}`],["Activate",quest.activate],["Prereqs",quest.prereqs],["Tips",quest.notes],["Rewards",quest.rewards]].map(([label, val]) => (
                        <div key={label} style={{ display:"flex", gap:8, marginBottom:8, alignItems:"flex-start" }}>
                          <span style={{ fontSize:10, color:"rgba(251,146,60,0.65)", letterSpacing:"0.12em", textTransform:"uppercase", minWidth:68, marginTop:2, fontWeight:600 }}>{label}</span>
                          <span style={{ fontSize:12, lineHeight:1.6, flex:1, whiteSpace:"pre-line", color: label==="Prereqs" ? "#fde68a" : label==="Rewards" ? "#86efac" : label==="Tips" ? "rgba(255,237,213,0.55)" : "rgba(255,237,213,0.75)", fontStyle: label==="Tips" ? "italic" : "normal" }}>{val}</span>
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
          <div style={{ textAlign:"center", padding:"40px 20px", background:"linear-gradient(135deg,rgba(251,146,60,0.06),rgba(154,52,18,0.02))", border:"1px solid rgba(251,146,60,0.15)", borderRadius:12 }}>
            <div style={{ fontSize:36, marginBottom:12 }}>🌋✨</div>
            <div style={{ color:"#fb923c", fontSize:16, fontWeight:700, letterSpacing:"0.15em" }}>ALL NATLAN QUESTS COMPLETE</div>
            <div style={{ color:"rgba(255,237,213,0.4)", fontSize:12, marginTop:8 }}>The Sacred Flame remembers your tribe, Traveler.</div>
          </div>
        )}
      </div>
    </div>
  );
}
