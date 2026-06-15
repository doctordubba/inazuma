import { useState, useEffect, useMemo } from "react";

/* ============================================================
   NOD-KRAI INTEL DOSSIER
   Tracks the 24 "Recorded Intel" NPCs around Nasha Town that
   Nefer / Jahoda can scan via Elemental Skill. Trade 5 per
   Intel Quest with Katheryne. Soft cap of 6 per week.
   ============================================================ */

const NPCS = [
  // Adventurers' Guild cluster
  { id: "kaunea",    name: "Kaunea",    area: "Adventurers' Guild",         role: "Local Resident",      intel: "Comments on Nefer's appearance and shares opinions on Nod-Krai fashion.",                location: "Near the Adventurers' Guild waypoint." },
  { id: "gaudenty",  name: "Gaudenty",  area: "Adventurers' Guild",         role: "Service Provider",    intel: "Outraged by the unpopularity of his services; receives a lecture from a lady.",          location: "A few meters from the Adventurers' Guild." },
  { id: "sedzimir",  name: "Sedzimir",  area: "Adventurers' Guild",         role: "Merchant",            intel: "Cares about wealth more than his life; sharp business acumen.",                          location: "Right beside the Adventurers' Guild waypoint." },
  { id: "hjerson",   name: "Hjerson",   area: "Adventurers' Guild",         role: "Detective / Writer",  intel: "Solved several murders, but none of them through actual deduction.",                     location: "Near the Adventurers' Guild." },
  { id: "jujian",    name: "Jujian",    area: "Adventurers' Guild",         role: "Merchant from Liyue", intel: "Used to sell tea in Liyue; now hawks antiques at suspiciously low prices.",              location: "Left of the Adventurers' Guild waypoint." },
  { id: "reko",      name: "Reko",      area: "Adventurers' Guild",         role: "Jeweler",             intel: "Sea treasure merchant reselling goods from sunken ships; no real valuables.",            location: "Near the Adventurers' Guild — sells 2-star artifacts." },
  { id: "slazhnev",  name: "Slazhnev",  area: "Adventurers' Guild",         role: "Aspiring Critic",     intel: "Wants to become famous in Snezhnaya by compiling the Nod-Krai Battle Rating.",           location: "Adventurers' Guild area." },
  { id: "sukhovykh", name: "Sukhovykh", area: "Adventurers' Guild",         role: "Lightkeeper",         intel: "Scolds Lushne, who keeps causing trouble due to naive kindness.",                        location: "Adventurers' Guild area." },

  // Blacksmith / Bank lift area
  { id: "dhabit",    name: "Dhabit",    area: "Mimisbrunnr Books",          role: "Bookshop Owner",       intel: "Auto-starts the World Quest A Small Venture after intel is taken.",                       location: "Lift behind Rossum Workshop (Blacksmith) → 1st floor → turn left.", quest: "A Small Venture" },
  { id: "kamenka",   name: "Kamenka",   area: "Bank of the Northern Kingdom", role: "Speculator from Snezhnaya", intel: "Has a Kuuhenki standing behind him.",                                                  location: "Lift behind the Blacksmith → 1st floor → near the Bank." },
  { id: "kudratov",  name: "Kudratov",  area: "Bank of the Northern Kingdom", role: "Fatui Pyro Agent",       intel: "Inexperienced and cowardly; saving up for a special weapon.",                         location: "A few meters from Kamenka." },

  // Curatorium of Secrets area
  { id: "harshin",   name: "Harshin",   area: "Curatorium of Secrets",      role: "Akademiya Scholar",     intel: "Sounds learned but talks nonsense; wrote 'Criticism on Pseudo Remuria History.'",        location: "Glide down from the waypoint above the Curatorium." },
  { id: "iratxa",    name: "Iratxa",    area: "Capital Square",             role: "Melusine — Marechaussee Phantom", intel: "Twilight Court agent wandering the square.",                                       location: "Glide down-left from the waypoint above the Curatorium." },

  // Flagship tavern cluster
  { id: "kruchek",   name: "Kruchek",   area: "The Flagship Tavern",        role: "Fatui Recruiter",       intel: "Quietly recruiting for the Fatui in the back corner.",                                    location: "Inside The Flagship, beside Demyan's stall." },
  { id: "omesov",    name: "Omesov",    area: "The Flagship Tavern",        role: "Ex-Fatui",              intel: "Expelled from the Fatui for reselling supplies for profit.",                              location: "Right beside the entrance of The Flagship." },

  // Mead-Boy shop
  { id: "golitsyna", name: "Golitsyna", area: "Mead-Boy Shop",              role: "Shopkeeper",            intel: "Snezhnayan aristocrat who left home after a fight with her parents.",                    location: "Mead-Boy shop in Nasha Town." },

  // Fishing Association
  { id: "hedvika",   name: "Hedvika",   area: "Nod-Krai Fishing Association", role: "Head of Anglers",     intel: "Holds the top Angler position; keeps several personal secrets.",                          location: "Left of the Adventurers' Guild waypoint, follow the path to the Fishing Association." },

  // Harbor / Outskirts
  { id: "berain",    name: "Berain",    area: "Ship Harbor",                role: "Merchant from Fontaine", intel: "Naive — at risk of getting tangled up in dangerous affairs.",                            location: "Near the Ship Harbor waypoint." },
  { id: "chicherin", name: "Chicherin", area: "Nasha Town Outskirts",       role: "Warehouse Manager",     intel: "Former warrior, injured during the Wild Hunt years ago.",                                 location: "Harbor waypoint → head out to the marked outskirts area." },
  { id: "zinaida",   name: "Zinaida",   area: "Ship Harbor",                role: "Bodyguard / Treasure Hunter", intel: "Ex-mid-level leader of the Seahook Gang; now bodyguards Port Chief Manez.",         location: "Ship Harbor area." },
  { id: "zompaynco", name: "Zompaynco", area: "Saurian Relics Association", role: "Relics Investigator",   intel: "Auto-starts the World Quest Research Spillover after intel is taken.",                   location: "Saurian Relics Association building.", quest: "Research Spillover" },

  // Other
  { id: "urwa",      name: "Urwa",      area: "Nasha Town",                 role: "Sangemah Bay Representative", intel: "Former bandit chief; now a symbol of nobility in the desert tribes.",               location: "Nasha Town." },
  { id: "viljami",   name: "Viljami",   area: "Nasha Town",                 role: "Retired Smuggler",      intel: "Once a major smuggler; the truth of his stories is questionable.",                        location: "Nasha Town." },
  { id: "valehti",   name: "Valehti",   area: "Alchemy Workbench Nook",     role: "Mysterious Figure",     intel: "TIME-LOCKED: only appears between 00:00 and 06:00 in-game.",                              location: "Tucked into a nook beside the alchemy workbench. Set time to ~02:00 in the menu.", timed: true },
];

const AREAS = [
  "Adventurers' Guild",
  "Mimisbrunnr Books",
  "Bank of the Northern Kingdom",
  "Curatorium of Secrets",
  "Capital Square",
  "The Flagship Tavern",
  "Mead-Boy Shop",
  "Nod-Krai Fishing Association",
  "Ship Harbor",
  "Nasha Town Outskirts",
  "Saurian Relics Association",
  "Alchemy Workbench Nook",
  "Nasha Town",
];

const STORAGE_KEY = "nodkrai-intel-v1";

const GOLD = "#dab36c";
const GOLD_BRIGHT = "#f4e8c8";
const PARCH = "#c8c0a8";
const MUTED = "#7a7a70";
const DIM   = "#5a5a52";

export default function NodKraiIntel() {
  const [collected, setCollected] = useState({});
  const [filter, setFilter] = useState("all"); // all | pending | done
  const [expanded, setExpanded] = useState({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCollected(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  const persist = (next) => {
    setCollected(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch (e) { /* ignore */ }
  };

  const toggle = (id) => {
    const next = { ...collected, [id]: !collected[id] };
    if (!next[id]) delete next[id];
    persist(next);
  };

  const resetWeek = () => {
    if (window.confirm("Reset all collected intel? Use on Monday after weekly reset.")) {
      persist({});
    }
  };

  const totalDone   = Object.values(collected).filter(Boolean).length;
  const weeklyCount = Math.min(totalDone, 6);
  const questsReady = Math.floor(totalDone / 5);

  const grouped = useMemo(() => {
    const visible = NPCS.filter(n => {
      if (filter === "pending") return !collected[n.id];
      if (filter === "done")    return !!collected[n.id];
      return true;
    });
    return AREAS
      .map(area => ({ area, npcs: visible.filter(n => n.area === area) }))
      .filter(g => g.npcs.length > 0);
  }, [collected, filter]);

  const sectionTitle = { fontSize:11, color:GOLD, letterSpacing:"0.22em", textTransform:"uppercase", fontFamily:"Georgia, serif", margin:0 };

  return (
    <div style={{
      maxWidth:880, margin:"0 auto", padding:"40px 16px 64px",
      fontFamily:"Georgia, serif", color:GOLD_BRIGHT,
    }}>
      {/* Header */}
      <div style={{ position:"relative", paddingBottom:24, borderBottom:`1px solid ${GOLD}22` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
          <span style={{ fontSize:16, color:GOLD }}>☾</span>
          <span style={sectionTitle}>Curatorium of Secrets</span>
        </div>
        <h2 style={{
          fontSize:"clamp(22px,3.5vw,30px)", fontWeight:600, margin:"0 0 10px 0",
          color:GOLD_BRIGHT, letterSpacing:"0.04em",
        }}>
          Recorded Intel — Nasha Town
        </h2>
        <p style={{ fontSize:13, color:"#a8a89c", margin:0, fontStyle:"italic", lineHeight:1.55, maxWidth:640 }}>
          Use Nefer's or Jahoda's Elemental Skill on each marked resident. Trade 5 per Intel Quest with Katheryne. Soft cap of 6 collections per week.
        </p>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:10, marginTop:22 }}>
          <StatBox label="Total"        value={`${totalDone} / 24`} />
          <StatBox label="Week Cap"     value={`${weeklyCount} / 6`} highlight={weeklyCount >= 6} />
          <StatBox label="Quests Ready" value={questsReady} highlight={questsReady > 0} />
        </div>

        {weeklyCount >= 6 && (
          <div style={{
            marginTop:14, padding:"10px 14px", borderRadius:6, fontSize:12,
            display:"flex", alignItems:"flex-start", gap:8,
            background:"rgba(218,165,32,0.08)", border:`1px solid ${GOLD}55`,
            color:"#e8dcb8",
          }}>
            <span style={{ color:GOLD, marginTop:1 }}>⚠</span>
            <span>Weekly cap reached. Resets Monday server time — hit Reset below after the new week starts.</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{
        display:"flex", justifyContent:"space-between", alignItems:"center",
        flexWrap:"wrap", gap:8, padding:"16px 0", margin:"0 0 8px 0",
        borderBottom:`1px solid ${GOLD}15`,
      }}>
        <div style={{ display:"flex", gap:6 }}>
          {[
            { k:"all", l:"All" },
            { k:"pending", l:"Pending" },
            { k:"done", l:"Collected" },
          ].map(f => {
            const active = filter === f.k;
            return (
              <button key={f.k} onClick={() => setFilter(f.k)}
                style={{
                  padding:"6px 14px", borderRadius:6, fontSize:11, cursor:"pointer",
                  fontFamily:"Georgia, serif", letterSpacing:"0.1em", textTransform:"uppercase",
                  fontWeight:active ? 600 : 400,
                  background: active ? "rgba(218,165,32,0.15)" : "transparent",
                  color: active ? GOLD_BRIGHT : MUTED,
                  border: `1px solid ${active ? GOLD+"66" : "rgba(122,122,112,0.2)"}`,
                }}>
                {f.l}
              </button>
            );
          })}
        </div>
        <button onClick={resetWeek}
          style={{
            display:"inline-flex", alignItems:"center", gap:6,
            padding:"6px 14px", borderRadius:6, fontSize:11, cursor:"pointer",
            fontFamily:"Georgia, serif", letterSpacing:"0.1em", textTransform:"uppercase",
            background:"transparent", color:MUTED, border:"1px solid rgba(122,122,112,0.2)",
          }}>
          ↺ Reset
        </button>
      </div>

      {/* Groups */}
      {grouped.map(({ area, npcs }) => (
        <section key={area} style={{
          marginTop:24, opacity:mounted?1:0,
          transform:mounted?"none":"translateY(8px)", transition:"all 0.4s ease",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
            <span style={{ fontSize:11, color:GOLD }}>◆</span>
            <h3 style={sectionTitle}>{area}</h3>
            <div style={{
              flex:1, height:1,
              background:`linear-gradient(90deg, ${GOLD}66, transparent)`,
            }} />
            <span style={{ fontSize:11, color:DIM, fontStyle:"italic" }}>
              {npcs.filter(n => collected[n.id]).length}/{npcs.length}
            </span>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {npcs.map(npc => {
              const isDone = !!collected[npc.id];
              const isOpen = !!expanded[npc.id];
              return (
                <div key={npc.id} style={{
                  borderRadius:6, overflow:"hidden",
                  background: isDone ? "rgba(218,165,32,0.04)" : "rgba(20,26,44,0.55)",
                  border: `1px solid ${isDone ? GOLD+"44" : "rgba(80,90,120,0.22)"}`,
                  transition:"all 0.2s",
                }}>
                  <div style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"11px 14px" }}>
                    <button onClick={() => toggle(npc.id)}
                      aria-label={`Mark ${npc.name} ${isDone ? "pending" : "collected"}`}
                      style={{
                        marginTop:2, width:18, height:18, borderRadius:3, flexShrink:0,
                        cursor:"pointer",
                        background: isDone ? GOLD : "transparent",
                        border: `1.5px solid ${isDone ? GOLD : "#5a6480"}`,
                        color: "#0a0e1a", fontSize:13, lineHeight:1, fontWeight:700,
                      }}>
                      {isDone ? "✓" : ""}
                    </button>

                    <button onClick={() => setExpanded(p => ({ ...p, [npc.id]: !p[npc.id] }))}
                      style={{
                        flex:1, textAlign:"left", background:"transparent",
                        border:"none", padding:0, cursor:"pointer", color:"inherit",
                      }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                        <span style={{
                          fontSize:15, fontWeight:500,
                          color: isDone ? MUTED : GOLD_BRIGHT,
                          textDecoration: isDone ? "line-through" : "none",
                          letterSpacing:"0.02em",
                        }}>
                          {npc.name}
                        </span>
                        {npc.quest && (
                          <span style={{
                            fontSize:9, padding:"2px 7px", borderRadius:10, whiteSpace:"nowrap",
                            background:"rgba(132,180,220,0.15)", color:"#a8d0e8",
                            border:"1px solid rgba(132,180,220,0.35)",
                            letterSpacing:"0.08em", textTransform:"uppercase",
                          }}>
                            ✦ auto-quest
                          </span>
                        )}
                        {npc.timed && (
                          <span style={{
                            fontSize:9, padding:"2px 7px", borderRadius:10, whiteSpace:"nowrap",
                            background:"rgba(180,140,220,0.15)", color:"#d0a8e8",
                            border:"1px solid rgba(180,140,220,0.35)",
                            letterSpacing:"0.08em", textTransform:"uppercase",
                          }}>
                            ☾ 00:00–06:00
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize:11, fontStyle:"italic", marginTop:2, color:MUTED }}>
                        {npc.role}
                      </div>
                    </button>

                    <button onClick={() => setExpanded(p => ({ ...p, [npc.id]: !p[npc.id] }))}
                      aria-label="Toggle details"
                      style={{
                        flexShrink:0, padding:"2px 6px", background:"transparent",
                        border:"none", cursor:"pointer", color:MUTED, fontSize:12,
                        transform: isOpen ? "rotate(180deg)" : "none", transition:"transform 0.2s",
                      }}>
                      ▼
                    </button>
                  </div>

                  {isOpen && (
                    <div style={{
                      padding:"0 14px 14px 42px",
                      borderTop:`1px solid ${GOLD}15`,
                      marginTop:2, paddingTop:10,
                    }}>
                      <div style={{ fontSize:13, lineHeight:1.55, color:PARCH, marginBottom:8 }}>
                        {npc.intel}
                      </div>
                      <div style={{ fontSize:11, fontStyle:"italic", color:MUTED, display:"flex", gap:6, alignItems:"flex-start" }}>
                        <span style={{ marginTop:1 }}>📍</span>
                        <span>{npc.location}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {/* Footer note */}
      <div style={{
        marginTop:40, paddingTop:24, textAlign:"center",
        borderTop:`1px solid ${GOLD}22`,
      }}>
        <div style={{ fontSize:14, color:DIM, marginBottom:8 }}>✦</div>
        <p style={{ fontSize:12, fontStyle:"italic", maxWidth:480, margin:"0 auto", lineHeight:1.55, color:DIM }}>
          Approach the marked NPC with Nefer or Jahoda in your party — a small icon appears above their head. Press{" "}
          <span style={{ color:GOLD, letterSpacing:"0.1em", fontWeight:600 }}>E</span>{" "}
          to extract the dossier. Six per week. Trade with Katheryne.
        </p>
      </div>
    </div>
  );
}

function StatBox({ label, value, highlight }) {
  return (
    <div style={{
      padding:"12px 10px", borderRadius:6, textAlign:"center",
      background:"rgba(20,26,44,0.6)",
      border:`1px solid ${highlight ? GOLD+"66" : "rgba(80,90,120,0.22)"}`,
    }}>
      <div style={{
        fontSize:10, color:MUTED, marginBottom:4,
        letterSpacing:"0.18em", textTransform:"uppercase", fontFamily:"Georgia, serif",
      }}>
        {label}
      </div>
      <div style={{
        fontSize:20, fontWeight:600,
        color: highlight ? GOLD : GOLD_BRIGHT, fontFamily:"Georgia, serif",
      }}>
        {value}
      </div>
    </div>
  );
}
