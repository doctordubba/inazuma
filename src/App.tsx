import { useState, useEffect } from "react";

const TIERS = [
  { id:2, label:"Tier 2", sublabel:"Short",        time:"15–35 min",      color:"#86efac", bg:"rgba(134,239,172,0.07)", border:"rgba(134,239,172,0.22)", glow:"rgba(134,239,172,0.12)", icon:"🌸" },
  { id:3, label:"Tier 3", sublabel:"Medium",       time:"30–60 min",      color:"#d8b4fe", bg:"rgba(216,180,254,0.07)", border:"rgba(216,180,254,0.22)", glow:"rgba(216,180,254,0.12)", icon:"⛩" },
  { id:4, label:"Tier 4", sublabel:"Long / Gated", time:"60 min+ or RNG", color:"#fca5a5", bg:"rgba(252,165,165,0.07)", border:"rgba(252,165,165,0.22)", glow:"rgba(252,165,165,0.12)", icon:"⚔" },
];

const CHAIN_TAG = {
  gourmet:    { label:"Gourmet Supremos",  color:"#fb923c" },
  tatara:     { label:"Tatara Tales",       color:"#fbbf24" },
  neko:       { label:"Neko Is a Cat",      color:"#f9a8d4" },
  mists:      { label:"Through the Mists",  color:"#67e8f9" },
  enka:       { label:"Enkanomiya Chain",   color:"#c084fc" },
  standalone: { label:"Standalone",         color:"#94a3b8" },
};

const QUESTS = [
  // ─── TIER 2 — SHORT ──────────────────────────────────────────────────────
  {
    id:1, tier:2, chain:"standalone",
    name:"O Archon, Have I Done Right?",
    time:"20–30 min",
    region:"Watatsumi Island",
    activate:"Progress through Watatsumi Island after Ch2 Act 3 — find the NPC linked to the Orobashi aftermath storyline on Watatsumi Island.",
    prereqs:"Chapter 2: Act 3 (Omnipresence Over Mortals) completed + Watatsumi Island accessible",
    notes:"Emotional epilogue reflecting on serpent god Orobashi's legacy. Dialogue-heavy with meaningful Watatsumi lore. Short travel, no combat.",
    rewards:"100 Adv EXP · 30,000 Mora · Hero's Wit ×4",
    link:"https://game8.co/games/Genshin-Impact/archives/337746",
  },
  {
    id:2, tier:2, chain:"standalone",
    name:"Gazing Three Thousand Miles Away",
    time:"25–35 min (+real-world days between parts)",
    region:"Yashiori Island → Tatarasuna → Inazuma City",
    activate:"Complete Chapter 2: Act 1 (Ritou Escape Plan), then find Chouji on Yashiori Island.",
    prereqs:"Chapter 2: Act 1 completed",
    notes:"Multi-part quest following Chouji. Needs 24× Crystal Marrow total split across 2 visits. ⚠️ After the quest 'completes', Chouji moves — find him in Tatarasuna and then Inazuma City for the full chain. 🌟 Unlocks Imported Poultry recipe. Achievement: ...And I Would Walk 3,000 More.",
    rewards:"🌟 Imported Poultry Recipe · 100 Adv EXP · 30,000 Mora · Achievement: ...And I Would Walk 3,000 More",
    isSpecial:true,
    link:"https://game8.co/games/Genshin-Impact/archives/337751",
  },

  // ─── TIER 3 — MEDIUM ─────────────────────────────────────────────────────
  {
    id:3, tier:3, chain:"gourmet",
    name:"The Gourmet Supremos: The Importance of Eating Well",
    time:"30–40 min",
    region:"Narukami Island → Watatsumi Island",
    activate:"Complete 'Gourmet Supremos: Breakthrough Thinking' Daily Commission — ⚠️ MUST give ingredients to Xiangling (not Chef Mao). Then find Parvaneh (relog if she doesn't appear at Xudong's old spot).",
    prereqs:"⚠️ All prior Gourmet Supremos quests + 'Breakthrough Thinking' Daily Commission (Inazuma preferred region — may take weeks of RNG)",
    notes:"Final Inazuma Gourmet Supremos quest. Parvaneh is in a fluster. Two enemy groups along the way — bring AoE DPS. 🌟 Rewards Sashimi Platter recipe.",
    rewards:"🌟 Sashimi Platter Recipe · 100 Adv EXP · 30,000 Mora · Hero's Wit ×5",
    isSpecial:true,
    link:"https://game8.co/games/Genshin-Impact/archives/337761",
  },
  {
    id:4, tier:3, chain:"standalone",
    name:"Treatment on the Island",
    time:"30–45 min (+optional multi-day bonus)",
    region:"Kannazuka (Tatarasuna / Mikage Forge area)",
    activate:"Find Yasumoto (doctor NPC) in the Tatarasuna area of Kannazuka island.",
    prereqs:"Inazuma accessible",
    notes:"Collect 20× Naku Weed — farm near the Mikage Forge or plant in Serenitea Pot. Final phase: defend Yasumoto from Nobushi and Kairagi waves (stay away from cliffs, use shields). ⭐ BONUS: Keep adding Naku Weed to Yasumoto's basket for a few real-world days post-quest → extra chest + A Doctor's Odyssey achievement.",
    rewards:"100 Adv EXP · 30,000 Mora · Hero's Wit ×4 · Post-quest chest + A Doctor's Odyssey achievement",
    link:"https://game8.co/games/Genshin-Impact/archives/337752",
  },
  {
    id:5, tier:3, chain:"tatara",
    name:"Tatara Tales: The Last Act",
    time:"35–45 min",
    region:"Tatarasuna (Kannazuka)",
    activate:"Complete all prior Tatara Tales quests (The Sword Songstress, No Rest for the Wicked, and sub-quests), then find Xavier in Tatarasuna.",
    prereqs:"⚠️ All previous Tatara Tales World Quests fully completed. Must be done BEFORE 'The Seventh Samurai'.",
    notes:"Culminating act of the Tatara Tales chain — resolves the Mikage Furnace storyline. This is a mandatory prerequisite for 'The Seventh Samurai', so complete it first.",
    rewards:"100 Adv EXP · 30,000 Mora · Hero's Wit ×5",
    link:"https://game8.co/games/Genshin-Impact/archives/337748",
  },
  {
    id:6, tier:3, chain:"tatara",
    name:'"The Seventh Samurai"',
    time:"30–40 min",
    region:"Narukami Island (east of Inazuma City, beside Toranosuke)",
    activate:"Complete ALL Tatara Tales quests including The Last Act, then talk to Xavier east of Inazuma City beside Toranosuke.",
    prereqs:"⚠️ All Tatara Tales quests (including The Last Act) must be completed first",
    notes:"Xavier wants help producing a film! Enemies have elevated HP — bring your hardest hitters. One of the most creative and memorable Inazuma quests.",
    rewards:"100 Adv EXP · 30,000 Mora · Hero's Wit ×5",
    link:"https://game8.co/games/Genshin-Impact/archives/337745",
  },
  {
    id:7, tier:3, chain:"standalone",
    name:"Storytelling Method",
    time:"30–40 min",
    region:"Narukami Island (Yae Publishing House area)",
    activate:"Unlock via 'Is This Novel Amazing?' Daily Commission (Inazuma preferred). Side with Shigeru (editor) → 'This Novel seems... Familiar' OR side with Junkichi (author) → 'This Novel seems... Problematic?'. You'll know it triggered when you earn the 'Editorial Opinion' achievement.",
    prereqs:"⚠️ Inazuma preferred commissions set. RNG dependent — may take days or weeks to get the 'Is This Novel Amazing?' commission.",
    notes:"Two branching paths give different dialogue/events but the same quest credit. Each path is equally valid. Picking either side on the commission is fine.",
    rewards:"100 Adv EXP · 30,000 Mora · Hero's Wit ×5 · Achievement: Editorial Opinion",
    link:"https://game8.co/games/Genshin-Impact/archives/341300",
  },
  {
    id:8, tier:3, chain:"standalone",
    name:"The Saga of Mr. Forgetful",
    time:"15–20 min",
    region:"Inazuma (Reputation Request)",
    activate:"Unlock Inazuma Reputation system — quest appears as a Reputation Request.",
    prereqs:"Inazuma Reputation system unlocked (Chapter 2: Act 3 + Commission's Commission quest done)",
    notes:"Help the famously forgetful Mr. Forgetful with something he's... forgotten. Short and comedic. Fastest one remaining on this list.",
    rewards:"Inazuma Reputation EXP · 100 Adv EXP · 20,000 Mora",
    link:"https://game8.co/games/Genshin-Impact/archives/341304",
  },
  {
    id:9, tier:3, chain:"mists",
    name:"The Sun-Wheel and Mt. Kanna",
    time:"35–50 min",
    region:"Tsurumi Island → Inazuma City",
    activate:"Complete the first three Through the Mists sub-quests in order, then talk to Sumida in Inazuma City (by the stairs into the city). Finish at Kiminami Restaurant.",
    prereqs:"⚠️ Full Through the Mists chain: A Particularly Particular Author → Octave of the Maushiro → The Sea of Fog and the Rite of the Trees → THEN this quest.",
    notes:"🌟 Finale of Through the Mists — permanently clears Tsurumi Island's fog. KAMA WILL appear if prerequisites are correct. After completion, Tsurumi Island is beautifully fog-free for exploration.",
    rewards:"🌟 Tsurumi fog permanently removed · 100 Adv EXP · 30,000 Mora · Hero's Wit ×6 · Primogems ×10",
    isSpecial:true,
    link:"https://game8.co/games/Genshin-Impact/archives/346187",
  },
  {
    id:10, tier:3, chain:"enka",
    name:"The Phaethons' Syrtos",
    time:"30–45 min",
    region:"Enkanomiya (Byakuyakoku)",
    activate:"Unlock Enkanomiya via The Entrance to Tokoyo quest (requires Watatsumi Island + Ch2 Act 3). Find the quest marker inside Enkanomiya.",
    prereqs:"⚠️ The Entrance to Tokoyo + Enkanomiya unlocked",
    notes:"Explores the Phaethon family legacy in Enkanomiya. Lore-rich with light puzzle elements and the history of the Byakuyakoku people.",
    rewards:"100 Adv EXP · 30,000 Mora · Hero's Wit ×5",
    link:"https://game8.co/games/Genshin-Impact/archives/353530",
  },

  // ─── TIER 4 — LONG / GATED ───────────────────────────────────────────────
  {
    id:11, tier:4, chain:"neko",
    name:"The Narukami Trail",
    time:"60+ min across multiple days",
    region:"Grand Narukami Shrine (Narukami Island)",
    activate:"Complete ALL 9 Neko Is a Cat world quests. Then with Inazuma as your preferred commission region, get all three specific commissions (any order, different days ok): 'The Cat's Trail', 'Fishy Flavor', and 'Shrine Cleanup'. The quest unlocks once all three have been done.",
    prereqs:"⚠️ All 9 Neko Is a Cat World Quests completed + 3 specific Neko daily commissions. Potentially weeks of RNG.",
    notes:"Grand finale of Neko's entire questline. Set Inazuma as your ONLY preferred region. Commissions don't need to appear on the same day — just accumulate them. The emotional payoff is significant.",
    rewards:"🌟 100 Adv EXP · 30,000 Mora · Hero's Wit ×8 · Primogems ×10",
    isSpecial:true,
    link:"https://game8.co/games/Genshin-Impact/archives/341302",
  },
  {
    id:12, tier:4, chain:"standalone",
    name:"Battle of Revenge",
    time:"20 min quest + weeks of RNG unlock",
    region:"Inazuma City (Shogun's Palace gate)",
    activate:"Complete 'An Art to Be Honed' Daily Commission featuring Asakura exactly 4 times (cumulative — different days fine), then talk to Asakura inside the Shogun's palace near the gate.",
    prereqs:"⚠️ 'An Art to Be Honed' commission completed 4× — purely RNG. Set Inazuma as preferred region. This is the most notoriously stubborn Inazuma achievement for many players.",
    notes:"Asakura found the Kairagi who wronged him. The quest combat is straightforward (Nobushi: Hitsukeban, Kikouban, Jintouban). The real boss is the commission RNG. You're not alone in hating this one.",
    rewards:"100 Adv EXP · 30,000 Mora · Hero's Wit ×5",
    link:"https://game8.co/games/Genshin-Impact/archives/337760",
  },
  {
    id:13, tier:4, chain:"enka",
    name:"The Subterranean Trials of Drake and Serpent",
    time:"90–120 min (full chain)",
    region:"Enkanomiya (Byakuyakoku)",
    activate:"Complete The Entrance to Tokoyo to unlock Enkanomiya access. Then explore Enkanomiya to find the chain starting points.",
    prereqs:"⚠️ The Entrance to Tokoyo must be completed. Enkanomiya requires Chapter 2: Act 3 + Watatsumi quests.",
    notes:"🌟 The mandatory Enkanomiya main chain. Sub-quests include: The Heart of Ouroboros, The Trail of Drake and Serpent, etc. Unlocks the Day-Night switch mechanic — REQUIRED for nearly ALL other Enkanomiya quests (Lotus Eater, Collection of Dragons, Three Martial Trials). Do this BEFORE anything else in Enkanomiya.",
    rewards:"🌟 100 Adv EXP · 50,000 Mora · Hero's Wit ×8 · Primogems ×10 — Unlocks Enkanomiya Day-Night mechanics",
    isSpecial:true,
    link:"https://game8.co/games/Genshin-Impact/archives/353480",
  },
  {
    id:14, tier:4, chain:"enka",
    name:"Lotus Eater",
    time:"45–60 min (+server reset wait)",
    region:"Enkanomiya — Secret Island (Evernight mode)",
    activate:"Complete 'The Entrance to Tokoyo' AND the 'Heart of Ouroboros' sub-quest inside Subterranean Trials. Then go to the Secret Island via the Phase Gate north of Dainichi Mikoshi — ⚠️ must be in Evernight (Night) mode.",
    prereqs:"⚠️ Entrance to Tokoyo + Heart of Ouroboros (Subterranean Trials) completed + Evernight mode active",
    notes:"Find the afterimage in the Vishap Research Lab on the Secret Island. Password: 'After the sun, the darkness starts...' (2nd choice). ⚠️ TIME-LOCKED: a section requires waiting for a server reset. 🌟 Rewards Dragonbone Orb — sell at any Souvenir Shop (Mondstadt/Liyue/Inazuma) for 80,000 Mora + a regional dish.",
    rewards:"🌟 Dragonbone Orb (sell for 80,000 Mora + dish) · 100 Adv EXP · 30,000 Mora · Hero's Wit ×6",
    isSpecial:true,
    link:"https://game8.co/games/Genshin-Impact/archives/353533",
  },
  {
    id:15, tier:4, chain:"enka",
    name:"Collection of Dragons and Snakes",
    time:"120+ min (multiple sub-quests across Enkanomiya)",
    region:"Enkanomiya (multiple zones) + Inazuma City",
    activate:"Unlock Enkanomiya + complete Subterranean Trials (for Day-Night switch). Then collect all 5 of Ema's lost books and bring them to her.",
    prereqs:"⚠️ Subterranean Trials + Lotus Eater (for some book quests) completed. Each book requires its own sub-quest.",
    notes:"🌟 The massive Enkanomiya book-hunting quest. The 5 books for Ema:\n1. 'Serpent and Drakes of Tokoyokoku' — buy from Kuroda, Yae Publishing House, Inazuma City (1,500 Mora — DO THIS FIRST)\n2. 'Before Sun and Moon' — from Antigonus quest (under Dainichi Mikoshi, Evernight)\n3. 'Hydrological Studies of Byakuyakoku' — from Date's Challenge (Evernight Temple Maze)\n4. 'Bathysmal Vishap Experimental Records' — from Tricolor File quest (Secret Island, Evernight)\n5. 'In the Light, Beneath the Shadow' — Phase Gate Symbol Puzzle at The Serpent's Heart\n⚠️ You CANNOT read any book or finish the quest until all 5 are collected.",
    rewards:"🌟 'Before Sun and Moon' lore book · 100 Adv EXP · 50,000 Mora · Hero's Wit ×8 · Primogems ×10",
    isSpecial:true,
    link:"https://game8.co/games/Genshin-Impact/archives/353515",
  },
  {
    id:16, tier:4, chain:"enka",
    name:"The Three Great Martial Trials",
    time:"60–90 min",
    region:"Enkanomiya (The Serpent's Heart)",
    activate:"Complete The Entrance to Tokoyo AND The Subterranean Trials of Drake and Serpent. Then find the three trial ghosts in The Serpent's Heart — each unlocks a separate sub-quest.",
    prereqs:"⚠️ Entrance to Tokoyo + Subterranean Trials fully completed. Individual trials may require Lotus Eater completion.",
    notes:"Three separate combat challenges (Yachimatahime's Trial + two others) feed into this umbrella quest. Individual sub-trials give NO rewards — only the final Three Great Martial Trials completion pays out. Prepare a strong team for all three. Part of the Erebos' Secret series.",
    rewards:"🌟 100 Adv EXP · 50,000 Mora · Hero's Wit ×10 · Primogems ×20",
    isSpecial:true,
    link:"https://game8.co/games/Genshin-Impact/archives/353560",
  },
];

const regionIcons = {
  "Watatsumi Island":                                  "🐍",
  "Yashiori Island → Tatarasuna → Inazuma City":       "🌿",
  "Narukami Island → Watatsumi Island":                "🍜",
  "Kannazuka (Tatarasuna / Mikage Forge area)":        "⚒",
  "Tatarasuna (Kannazuka)":                            "🔥",
  "Narukami Island (east of Inazuma City, beside Toranosuke)": "🎬",
  "Narukami Island (Yae Publishing House area)":       "📖",
  "Inazuma (Reputation Request)":                      "📜",
  "Tsurumi Island → Inazuma City":                     "🌫",
  "Enkanomiya (Byakuyakoku)":                          "🌑",
  "Enkanomiya — Secret Island (Evernight mode)":       "🌑",
  "Enkanomiya (multiple zones) + Inazuma City":        "🌑",
  "Enkanomiya (The Serpent's Heart)":                  "🌑",
  "Grand Narukami Shrine (Narukami Island)":            "🐱",
  "Inazuma City (Shogun's Palace gate)":               "⚔",
};

// Recommended completion order
const ORDER_NOTE = [
  { step:1, text:"The Saga of Mr. Forgetful — fastest, just needs Inazuma Reputation unlocked" },
  { step:2, text:"O Archon, Have I Done Right? — short, no grinding, just post-Ch2 Act 3" },
  { step:3, text:"Gazing Three Thousand Miles Away — gather Crystal Marrow now; cross off over a couple days" },
  { step:4, text:"Treatment on the Island — farm Naku Weed while doing others; continue visiting Yasumoto daily for bonus chest" },
  { step:5, text:"Tatara Tales: The Last Act → 'The Seventh Samurai' — do both in one session" },
  { step:6, text:"The Sun-Wheel and Mt. Kanna — do full Through the Mists chain on Tsurumi Island" },
  { step:7, text:"The Phaethons' Syrtos — after Enkanomiya unlocks" },
  { step:8, text:"Subterranean Trials → Lotus Eater → Collection of Dragons & Snakes → Three Martial Trials — all Enkanomiya, chain in order" },
  { step:9, text:"Gourmet Supremos: Importance of Eating Well — set Inazuma commissions, wait for Breakthrough Thinking daily" },
  { step:10, text:"Storytelling Method — set Inazuma commissions, wait for Is This Novel Amazing? daily" },
  { step:11, text:"Battle of Revenge — set Inazuma commissions, wait for An Art to Be Honed ×4 (most stubborn)" },
  { step:12, text:"The Narukami Trail — complete all 9 Neko quests first, then farm 3 Neko daily commissions" },
];

export default function InazumaQuestTracker() {
  const [completed, setCompleted] = useState({});
  const [expanded, setExpanded]   = useState(null);
  const [filterTier, setFilterTier] = useState(null);
  const [search, setSearch]         = useState("");
  const [showOrder, setShowOrder]   = useState(false);
  const [mounted, setMounted]       = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const toggle = (id: number) => setCompleted((p: Record<number, boolean>) => ({ ...p, [id]: !p[id] }));
  const toggleExp = (id: number) => setExpanded((p: number | null) => p === id ? null : id);

  const alreadyDone  = 29;
  const totalQuests  = 45;
  const sessionDone  = Object.values(completed).filter(Boolean).length;
  const totalDone    = alreadyDone + sessionDone;
  const pct          = Math.round((totalDone / totalQuests) * 100);

  const filtered = QUESTS.filter(q => {
    if (filterTier && q.tier !== filterTier) return false;
    if (search && !q.name.toLowerCase().includes(search.toLowerCase()) &&
        !q.region.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const byTier = TIERS.map(t => ({
    ...t,
    quests: filtered.filter(q => q.tier === t.id),
  })).filter(t => t.quests.length > 0);

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#030008 0%,#06000f 40%,#0a0018 100%)", fontFamily:"'Georgia','Times New Roman',serif", color:"#e2d4f0", paddingBottom:64 }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{ background:"rgba(3,0,8,0.97)", borderBottom:"1px solid rgba(167,139,250,0.2)", padding:"32px 24px 24px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:600, height:200, background:"radial-gradient(ellipse,rgba(124,58,237,0.08) 0%,transparent 70%)", pointerEvents:"none" }} />

        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:4 }}>
          <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#7c3aed,#4c1d95)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow:"0 0 20px rgba(124,58,237,0.5)" }}>⛩</div>
          <h1 style={{ fontSize:"clamp(18px,4vw,28px)", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", background:"linear-gradient(135deg,#e9d5ff 0%,#a78bfa 50%,#7c3aed 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", margin:0 }}>
            Inazuma World Quests
          </h1>
        </div>
        <p style={{ fontSize:12, letterSpacing:"0.22em", color:"rgba(167,139,250,0.5)", textTransform:"uppercase", marginBottom:24 }}>
          Updated · 29/45 Completed · 16 Remaining
        </p>

        {/* Progress bar */}
        <div style={{ maxWidth:480, margin:"0 auto 20px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"rgba(226,212,240,0.4)", marginBottom:6, letterSpacing:"0.08em" }}>
            <span>OVERALL PROGRESS</span>
            <span>{totalDone}/{totalQuests} — {pct}%</span>
          </div>
          <div style={{ height:6, background:"rgba(255,255,255,0.05)", borderRadius:3, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${pct}%`, borderRadius:3, background:"linear-gradient(90deg,#4c1d95,#7c3aed,#e9d5ff)", transition:"width 0.5s ease", boxShadow:"0 0 8px rgba(167,139,250,0.5)" }} />
          </div>
        </div>

        {/* Controls */}
        <div style={{ display:"flex", gap:8, maxWidth:720, margin:"0 auto", flexWrap:"wrap", justifyContent:"center" }}>
          <input
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(167,139,250,0.2)", borderRadius:6, padding:"8px 14px", color:"#e2d4f0", fontSize:13, outline:"none", width:200, letterSpacing:"0.04em" }}
            placeholder="Search quests or regions..."
            value={search} onChange={e => setSearch(e.target.value)} />
          <button onClick={() => setFilterTier(null)}
            style={{ padding:"6px 14px", borderRadius:6, border:`1px solid ${!filterTier ? "#a78bfa" : "rgba(255,255,255,0.08)"}`, background:!filterTier ? "rgba(167,139,250,0.12)" : "rgba(255,255,255,0.02)", color:!filterTier ? "#a78bfa" : "rgba(226,212,240,0.4)", fontSize:12, cursor:"pointer", letterSpacing:"0.07em", fontWeight:!filterTier?600:400 }}>
            ALL
          </button>
          {TIERS.map(t => (
            <button key={t.id} onClick={() => setFilterTier(filterTier===t.id ? null : t.id)}
              style={{ padding:"6px 14px", borderRadius:6, border:`1px solid ${filterTier===t.id ? t.color : "rgba(255,255,255,0.08)"}`, background:filterTier===t.id ? t.bg : "rgba(255,255,255,0.02)", color:filterTier===t.id ? t.color : "rgba(226,212,240,0.4)", fontSize:12, cursor:"pointer", letterSpacing:"0.06em", fontWeight:filterTier===t.id?600:400 }}>
              {t.icon} {t.label}
            </button>
          ))}
          <button onClick={() => setShowOrder(p => !p)}
            style={{ padding:"6px 14px", borderRadius:6, border:`1px solid ${showOrder ? "#fbbf24" : "rgba(255,255,255,0.08)"}`, background:showOrder ? "rgba(251,191,36,0.1)" : "rgba(255,255,255,0.02)", color:showOrder ? "#fbbf24" : "rgba(226,212,240,0.4)", fontSize:12, cursor:"pointer", letterSpacing:"0.06em" }}>
            📋 Order
          </button>
        </div>
      </div>

      {/* ── Recommended Order Panel ─────────────────────────────────────────── */}
      {showOrder && (
        <div style={{ maxWidth:880, margin:"24px auto 0", padding:"0 16px" }}>
          <div style={{ background:"rgba(251,191,36,0.06)", border:"1px solid rgba(251,191,36,0.2)", borderRadius:12, padding:"20px 24px" }}>
            <h3 style={{ color:"#fbbf24", fontSize:13, letterSpacing:"0.15em", textTransform:"uppercase", margin:"0 0 16px 0" }}>📋 Recommended Completion Order</h3>
            {ORDER_NOTE.map(o => (
              <div key={o.step} style={{ display:"flex", gap:12, marginBottom:10, alignItems:"flex-start" }}>
                <span style={{ fontSize:11, minWidth:24, height:24, borderRadius:"50%", background:"rgba(251,191,36,0.15)", border:"1px solid rgba(251,191,36,0.3)", color:"#fbbf24", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, flexShrink:0 }}>{o.step}</span>
                <span style={{ fontSize:12, color:"rgba(226,212,240,0.7)", lineHeight:1.5 }}>{o.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Quest list ──────────────────────────────────────────────────────── */}
      <div style={{ maxWidth:880, margin:"0 auto", padding:"32px 16px 0" }}>
        {byTier.length === 0 && (
          <div style={{ textAlign:"center", padding:"60px 20px", color:"rgba(226,212,240,0.3)", fontSize:14, letterSpacing:"0.1em" }}>
            <div style={{ fontSize:32, marginBottom:12 }}>🔍</div>No quests found
          </div>
        )}

        {byTier.map(tier => (
          <div key={tier.id} style={{ marginBottom:32, opacity:mounted?1:0, transform:mounted?"none":"translateY(16px)", transition:"all 0.4s ease" }}>

            {/* Tier header */}
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, paddingBottom:10, borderBottom:`1px solid ${tier.border}` }}>
              <span style={{ fontSize:18 }}>{tier.icon}</span>
              <span style={{ fontSize:15, fontWeight:700, color:tier.color, letterSpacing:"0.07em" }}>{tier.label} — {tier.sublabel}</span>
              <span style={{ fontSize:11, color:"rgba(226,212,240,0.35)", marginLeft:"auto", letterSpacing:"0.07em" }}>{tier.time}</span>
              <div style={{ padding:"3px 10px", borderRadius:20, background:tier.bg, border:`1px solid ${tier.border}`, color:tier.color, fontSize:11, letterSpacing:"0.1em", fontWeight:600 }}>
                {tier.quests.filter(q => completed[q.id]).length}/{tier.quests.length} done
              </div>
            </div>

            {/* Cards */}
            {tier.quests.map(quest => {
              const isDone = !!completed[quest.id];
              const isOpen = expanded === quest.id;
              const chain  = CHAIN_TAG[quest.chain];

              return (
                <div key={quest.id}
                  style={{ background:isDone?"rgba(255,255,255,0.015)":"linear-gradient(135deg,rgba(12,5,24,0.92),rgba(8,3,16,0.92))", border:`1px solid ${isOpen ? tier.color+"55" : isDone ? "rgba(255,255,255,0.05)" : tier.border}`, borderRadius:10, marginBottom:8, overflow:"hidden", transition:"all 0.2s", opacity:isDone?0.42:1, boxShadow:isOpen?`0 0 22px ${tier.glow}`:"none", cursor:"pointer" }}>

                  {/* Top row */}
                  <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px" }} onClick={() => toggleExp(quest.id)}>
                    <div onClick={e => { e.stopPropagation(); toggle(quest.id); }}
                      style={{ width:20, height:20, minWidth:20, borderRadius:4, border:`2px solid ${isDone ? tier.color : "rgba(167,139,250,0.3)"}`, background:isDone ? tier.color+"28" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all 0.2s", fontSize:12, color:tier.color }}>
                      {isDone && "✓"}
                    </div>

                    <span style={{ flex:1, fontSize:14, fontWeight:600, color:isDone?"rgba(226,212,240,0.4)":"#f0e8ff", letterSpacing:"0.03em", textDecoration:isDone?"line-through":"none" }}>
                      {quest.name}
                    </span>

                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:9, padding:"2px 7px", borderRadius:10, background:`${chain.color}15`, color:chain.color, border:`1px solid ${chain.color}40`, letterSpacing:"0.07em", whiteSpace:"nowrap" }}>
                        {chain.label}
                      </span>
                      {quest.isSpecial && <span style={{ fontSize:9, padding:"2px 6px", borderRadius:10, background:"rgba(167,139,250,0.15)", color:"#a78bfa", border:"1px solid rgba(167,139,250,0.35)", letterSpacing:"0.12em", fontWeight:700 }}>KEY</span>}
                      <span style={{ fontSize:10, padding:"2px 8px", borderRadius:10, background:tier.bg, color:tier.color, border:`1px solid ${tier.border}`, letterSpacing:"0.05em", whiteSpace:"nowrap" }}>{quest.time}</span>
                      <span style={{ fontSize:10, color:"rgba(226,212,240,0.3)", transform:isOpen?"rotate(180deg)":"none", transition:"transform 0.2s" }}>▼</span>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  <div style={{ maxHeight:isOpen?700:0, overflow:"hidden", transition:"max-height 0.35s ease" }}>
                    <div style={{ padding:"0 16px 16px 48px", borderTop:`1px solid ${tier.border}`, paddingTop:14 }}>
                      {[
                        ["Region",   <span>{regionIcons[quest.region]||"📍"} {quest.region}</span>],
                        ["Activate", quest.activate],
                        ["Prereqs",  quest.prereqs],
                        ["Tips",     quest.notes],
                        ["Rewards",  quest.rewards],
                      ].map(([label, val]) => (
                        <div key={label} style={{ display:"flex", gap:8, marginBottom:8, alignItems:"flex-start" }}>
                          <span style={{ fontSize:10, color:"rgba(167,139,250,0.65)", letterSpacing:"0.12em", textTransform:"uppercase", minWidth:68, marginTop:2, fontWeight:600 }}>{label}</span>
                          <span style={{ fontSize:12, lineHeight:1.6, flex:1, whiteSpace:"pre-line",
                            color: label==="Prereqs" ? "#fde68a"
                                 : label==="Rewards" ? "#86efac"
                                 : label==="Tips"    ? "rgba(226,212,240,0.55)"
                                 : "rgba(226,212,240,0.75)",
                            fontStyle: label==="Tips" ? "italic" : "normal" }}>
                            {val}
                          </span>
                        </div>
                      ))}
                      <a href={quest.link} target="_blank" rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{ display:"inline-flex", alignItems:"center", gap:5, marginTop:10, padding:"6px 14px", borderRadius:6, background:tier.bg, border:`1px solid ${tier.border}`, color:tier.color, fontSize:11, textDecoration:"none", letterSpacing:"0.08em", fontWeight:600 }}>
                        📖 Game8 Guide ↗
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {totalDone === totalQuests && (
          <div style={{ textAlign:"center", padding:"40px 20px", background:"linear-gradient(135deg,rgba(124,58,237,0.06),rgba(124,58,237,0.02))", border:"1px solid rgba(167,139,250,0.15)", borderRadius:12 }}>
            <div style={{ fontSize:36, marginBottom:12 }}>⛩✨</div>
            <div style={{ color:"#a78bfa", fontSize:16, fontWeight:700, letterSpacing:"0.15em" }}>ALL INAZUMA QUESTS COMPLETE</div>
            <div style={{ color:"rgba(226,212,240,0.4)", fontSize:12, marginTop:8 }}>The Electro Archon looks upon your deeds with solemn approval, Traveler.</div>
          </div>
        )}
      </div>
    </div>
  );
}
