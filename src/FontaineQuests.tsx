import { useState, useEffect } from "react";

const TIERS = [
  { id:1, label:"Tier 1", sublabel:"Very Fast",      time:"5-15 min",      color:"#93c5fd", bg:"rgba(147,197,253,0.07)", border:"rgba(147,197,253,0.22)", glow:"rgba(147,197,253,0.12)", icon:"⚡" },
  { id:2, label:"Tier 2", sublabel:"Short",          time:"15-30 min",     color:"#67e8f9", bg:"rgba(103,232,249,0.07)", border:"rgba(103,232,249,0.22)", glow:"rgba(103,232,249,0.12)", icon:"💧" },
  { id:3, label:"Tier 3", sublabel:"Medium",         time:"30-60 min",     color:"#a5b4fc", bg:"rgba(165,180,252,0.07)", border:"rgba(165,180,252,0.22)", glow:"rgba(165,180,252,0.12)", icon:"⚖" },
  { id:4, label:"Tier 4", sublabel:"Long / Gated",   time:"60 min+",       color:"#c4b5fd", bg:"rgba(196,181,253,0.07)", border:"rgba(196,181,253,0.22)", glow:"rgba(196,181,253,0.12)", icon:"⚜" },
];

const CHAIN_TAG = {
  archon:     { label:"Archon Quest",        color:"#fbbf24" },
  narzissen:  { label:"Narzissenkreuz",      color:"#a78bfa" },
  canticles:  { label:"Canticles of Harmony", color:"#f59e0b" },
  fri:        { label:"Research Institute",   color:"#06b6d4" },
  ancient:    { label:"Ancient Colors",       color:"#10b981" },
  gestion:    { label:"Maison Gestion",       color:"#3b82f6" },
  leroy:      { label:"Leroy Chain",          color:"#ec4899" },
  garcia:     { label:"Garcia's Paean",       color:"#8b5cf6" },
  caterpillar:{ label:"Caterpillar/Seymour",  color:"#84cc16" },
  reputation: { label:"Reputation Quest",     color:"#94a3b8" },
  standalone: { label:"Standalone",           color:"#64748b" },
};

const gameWithSearch = (q) => `https://gamewith.net/genshin-impact/article/search?keyword=${encodeURIComponent(q)}`;
const ignSearch      = (q) => `https://www.ign.com/wikis/genshin-impact/${q.replace(/[^A-Za-z0-9]+/g, "_")}`;
const fandomUrl      = (q) => `https://genshin-impact.fandom.com/wiki/${q.replace(/[^A-Za-z0-9]+/g, "_")}`;

const QUESTS = [
  // ───────── TIER 1 — VERY FAST (5-15 min) ─────────
  {
    id:1, tier:1, chain:"reputation",
    name:"Another Horizon of Adventure",
    time:"5-10 min",
    region:"Court of Fontaine — Adventurers' Guild",
    activate:"Auto-unlocks after completing Ch4 Act 2 'As Light Rain Falls Without Reason'. Just talk to Katheryne at the Fontaine Adventurers' Guild.",
    prereqs:"Chapter 4 Act 2 completed + AR 40+",
    notes:"Unlocks Fontaine Daily Commissions. Pure dialogue — fastest quest on this list.",
    rewards:"Adv EXP · Mora · Unlocks Fontaine commissions",
    game8:"https://game8.co/games/Genshin-Impact/archives/422138",
  },
  {
    id:2, tier:1, chain:"gestion",
    name:"A Certain Notice",
    time:"10-15 min",
    region:"Court of Fontaine — Palais Mermonia",
    activate:"Enter Palais Mermonia from Statue of Seven, walk up the steps. Talk to Iaune hunched at a table in the main hall.",
    prereqs:"Chapter 4 Act 2 completed",
    notes:"First of the Maison Gestion chain (Iaune's notice → trifle → stamp). All three are short.",
    rewards:"Adv EXP · Mora",
    game8:"https://game8.co/games/Genshin-Impact/archives/422093",
  },
  {
    id:3, tier:1, chain:"gestion",
    name:"A Certain Trifle",
    time:"10-15 min",
    region:"Court of Fontaine — Palais Mermonia",
    activate:"Wait/advance time to 8:00-12:00 next in-game day. Talk to Iaune at his desk, then Estelle at the blacksmith.",
    prereqs:"A Certain Notice completed",
    notes:"Help find a missing keycap from Estelle's workshop.",
    rewards:"Adv EXP · Mora",
    game8:"https://game8.co/games/Genshin-Impact/archives/422110",
  },
  {
    id:4, tier:1, chain:"gestion",
    name:"A Certain Stamp",
    time:"10-15 min",
    region:"Court of Fontaine — Palais Mermonia",
    activate:"Wait/advance time to 8:00-12:00 the next in-game day. Wake up Iaune sleeping at his desk.",
    prereqs:"A Certain Trifle completed",
    notes:"Get the stamp from Thales. Hidden achievement 'A Sudden Squall' (+5 primogems) on completion.",
    rewards:"Adv EXP · Mora · Hidden Achievement: A Sudden Squall (+5 Primogems)",
    game8:"https://game8.co/games/Genshin-Impact/archives/422149",
  },
  {
    id:5, tier:1, chain:"standalone",
    name:"Truly Mouthwatering!",
    time:"10-15 min",
    region:"West Slopes of Mont Automnequi (beach north of Poisson)",
    activate:"Go to the beach north of Poisson. Defeat 2 crabs near a buried man (Henri) — quest auto-starts.",
    prereqs:"None",
    notes:"Comedic deduction quest. Investigate 4 clues (chicken, shovel, broken machine, Turner & Hunter), then submit conclusions. Sequel 'Still Mouthwatering!' needs all 7 Mysterious Cores. Hidden achievement on completing the full chain.",
    rewards:"~17,000 Mora · Adv EXP · 30 Primogems",
    mora: 17000,
    game8:"https://game8.co/games/Genshin-Impact/archives/421886",
  },
  {
    id:6, tier:1, chain:"standalone",
    name:"Free Verse",
    time:"10-15 min",
    region:"Court of Fontaine — east of Opera Epiclese",
    activate:"Available immediately on entering Fontaine. Fast travel to waypoint east of Opera Epiclese, go down to the docks where Penny is.",
    prereqs:"Fontaine region unlocked",
    notes:"Friendship quest with Penny, Don Quijano (dog), and Nana (cat). Find three groups of 'children' hiding under huge shells.",
    rewards:"Adv EXP · Mora",
    game8:"https://game8.co/games/Genshin-Impact/archives/432242",
  },
  {
    id:7, tier:1, chain:"standalone",
    name:"Impromptu Poem of the Crimson Dawn",
    time:"10-15 min",
    region:"Erinnyes Forest",
    activate:"Use the waypoint southeast of Weeping Willow of the Lake. Head north to ruins/wooden cages. Talk to the redhead (Rogue) in the cage.",
    prereqs:"Erinnyes Forest unlocked",
    notes:"Short cutscene-heavy quest with Treasure Hoarders. Prerequisite for the Leroy chain.",
    rewards:"Adv EXP · Mora",
    game8:"https://game8.co/games/Genshin-Impact/archives/432238",
  },
  {
    id:8, tier:1, chain:"reputation",
    name:"Upon a Flowery Field of Grass",
    time:"10-15 min",
    region:"Earnshaw's Property (northwest of Court of Fontaine)",
    activate:"Teleport to the waypoint NW of Court of Fontaine, walk up to Earnshaw's settlement. Talk to him.",
    prereqs:"None",
    notes:"Guide 3 poodles (Hero, Prince, Princess) home without trampling the flowers — fly/glide over them. Hero is up the hill west with slimes nearby.",
    rewards:"Fontaine Reputation EXP · Adv EXP · Mora",
    game8:"https://game8.co/games/Genshin-Impact/archives/422030",
  },
  {
    id:9, tier:1, chain:"ancient",
    name:"The Three Primary Colors of the Solar Corona",
    time:"10-15 min",
    region:"Merusea Village",
    activate:"Teleport to Merusea Village, head west. Talk to the Melusine Sluasi by her small house under a tree.",
    prereqs:"Ancient Colors quest series (Mamere's chain) completed",
    notes:"Sluasi wants paint colors. Give: 1) Yellow (Cor Lapis/Berry/Nilotpala Lotus), 2) White, 3) Red. Quick reputation quest.",
    rewards:"20 Fontaine Reputation EXP · Adv EXP · Mora · Varunada Lazurite Fragment",
    game8:"https://game8.co/games/Genshin-Impact/archives/422140",
  },
  {
    id:10, tier:1, chain:"standalone",
    name:"The Lone Phantom Sail",
    time:"10-15 min",
    region:"Fontaine (coastal area)",
    activate:"Explore the Fontaine coastline near the marked waypoint. Talk to the NPC at the small beached boat.",
    prereqs:"Fontaine region accessible",
    notes:"Short reputation quest about a stranded sailor and his vessel. Very brief dialogue chain.",
    rewards:"Fontaine Reputation EXP · Adv EXP · Mora",
  },
  {
    id:11, tier:1, chain:"standalone",
    name:"\"Hey, this isn't Pumpkin Soup…\"",
    time:"10-15 min",
    region:"Court of Fontaine area",
    activate:"Find the NPC near the food stall in Court of Fontaine. Quest auto-triggers on interaction.",
    prereqs:"Fontaine region accessible",
    notes:"Comedic food mix-up quest. Prerequisite for 'Echoes of the Ancient World'.",
    rewards:"Adv EXP · Mora",
  },
  {
    id:12, tier:1, chain:"standalone",
    name:"Strange Stone Chronicle",
    time:"10-15 min",
    region:"Fontaine (Erinnyes Forest area)",
    activate:"Explore the Erinnyes Forest. Find the strange stone formation. Quest auto-triggers.",
    prereqs:"Erinnyes Forest accessible",
    notes:"Short investigation quest. Reputation quest.",
    rewards:"Fontaine Reputation EXP · Adv EXP · Mora",
  },
  {
    id:13, tier:1, chain:"standalone",
    name:"Fishing Game",
    time:"10-15 min",
    region:"Fontaine (near a fishing spot)",
    activate:"Talk to the fishing NPC at the marked spot. Have a fishing rod equipped.",
    prereqs:"Fishing system unlocked",
    notes:"Mini fishing challenge. Quick.",
    rewards:"Fish · Adv EXP · Mora",
  },
  {
    id:14, tier:1, chain:"standalone",
    name:"Were It So Easy",
    time:"10-15 min",
    region:"Fontaine",
    activate:"Find the NPC at the marked location and interact.",
    prereqs:"Fontaine region accessible",
    notes:"Short standalone reputation quest.",
    rewards:"Fontaine Reputation EXP · Adv EXP · Mora",
  },
  {
    id:15, tier:1, chain:"standalone",
    name:"The Fountain Flows Again",
    time:"10-15 min",
    region:"Court of Fontaine",
    activate:"Find the NPC near a malfunctioning fountain in Court of Fontaine.",
    prereqs:"Court of Fontaine accessible",
    notes:"Short utility-themed reputation quest.",
    rewards:"Fontaine Reputation EXP · Adv EXP · Mora",
  },
  {
    id:16, tier:1, chain:"standalone",
    name:"Danger Lurks Everywhere in Fontaine",
    time:"10-15 min",
    region:"Marcotte Station → Court of Fontaine",
    activate:"Go to Marcotte Station and talk to Guijarro. Ride the aquabus to Court of Fontaine with her, then meet her at the cafe.",
    prereqs:"Chapter 4 Act 2 'As Light Rain Falls Without Reason' completed",
    notes:"Introduces Guijarro (recurring NPC, returns in Qiaoying Village in Liyue).",
    rewards:"Adv EXP · Mora",
    game8:"https://game8.co/games/Genshin-Impact/archives/422095",
  },

  // ───────── TIER 2 — SHORT (15-30 min) ─────────
  {
    id:17, tier:2, chain:"narzissen",
    name:"Questioning Melusine and Answering Machine",
    time:"15-25 min",
    region:"Court of Fontaine",
    activate:"Find the marked NPC after Chapter 4 progress. Talk to start the investigation.",
    prereqs:"Chapter 4 Act 2 + some Narzissenkreuz quest progress",
    notes:"Investigation/dialogue quest. Prerequisite for the Leroy chain.",
    rewards:"Adv EXP · Mora · Fontaine Reputation EXP",
  },
  {
    id:18, tier:2, chain:"narzissen",
    name:"An Expected Lie",
    time:"20-25 min",
    region:"Morte Region (Nacker's Hideout, underwater)",
    activate:"Auto-triggers when you find the shipment's delivery point during 'An Expected Plan' quest. Nacker's Hideout is at the SW corner of Fort Charybdis Ruins, underwater.",
    prereqs:"An Expected Plan quest (must be in progress)",
    notes:"Underwater puzzle quest. Use Xenochromatic Ball Octopus ability to open the sealed door. Hit orange crystal → blue to lower frame gaps, then push the square block to bottom-right.",
    rewards:"Adv EXP · Mora",
    game8:"https://game8.co/games/Genshin-Impact/archives/432275",
  },
  {
    id:19, tier:2, chain:"fri",
    name:"A Letter",
    time:"20-25 min",
    region:"Fontaine Research Institute Region",
    activate:"After daily reset following 'Fontaine Research Institute, Stagnating in the Rubble', return to FRI. Talk to Iaune — quest auto-begins on arrival.",
    prereqs:"Fontaine Research Institute, Stagnating in the Rubble completed (+ ideally A Certain Stamp)",
    notes:"Defeat Meka enemies near Mary-Ann Memorial Park. At Academic Assembly Hall, position on the golden light and take a photo aiming slightly upward at the quest marker — common stuck point. Submit photo to Iaune.",
    rewards:"Adv EXP · Mora",
    game8:"https://game8.co/games/Genshin-Impact/archives/428603",
  },
  {
    id:20, tier:2, chain:"garcia",
    name:"Daydreams Beyond Space and Time",
    time:"20-25 min",
    region:"Court of Fontaine — Waterway Hub",
    activate:"After 1 daily reset following 'Where His Life Lies', return to Waterway Hub. Take the lift to floor 1. Garcia, Lutong, and Kaia stand near the fountain.",
    prereqs:"Where His Life Lies completed + 1 daily reset",
    notes:"Story conclusion to the Garcia/Kaia arc. Largely dialogue-driven, low combat. Pure 4.6 follow-up.",
    rewards:"Adv EXP · Mora · Fontaine Reputation EXP",
    game8:"https://game8.co/games/Genshin-Impact/archives/452258",
  },
  {
    id:21, tier:2, chain:"caterpillar",
    name:"Caterpillar's Story: Prologue",
    time:"20-25 min",
    region:"Narzissenkreuz Ordo (auto-starts near Earnshaw's Property)",
    activate:"Auto-starts near Earnshaw's Property NW of Court of Fontaine after completing Unfinished Comedy.",
    prereqs:"Unfinished Comedy chain (4.1) completed",
    notes:"Caterpillar revisits the Ordo with Ann and Seymour. Two sub-quests: Initial Facts + Riddles Awaiting Answers. Completion grants the prologue entry.",
    rewards:"20 Fontaine Reputation EXP · Adv EXP · Mora",
    game8:"https://game8.co/games/Genshin-Impact/archives/428611",
  },
  {
    id:22, tier:2, chain:"ancient",
    name:"Seymour's Story: Prologue",
    time:"Counts toward Ancient Colors completion (no separate quest)",
    region:"A Very Warm Place (Elynas — Ancient Colors quest line)",
    activate:"Not a playable quest — Reputation Board entry that auto-completes when you finish the Ancient Colors quest chain (A Brush of Seafoam and Crimson → A Gradient of Dreams and Ochre → Blue Longing of Heart and Moon).",
    prereqs:"Complete the entire Ancient Colors quest chain",
    notes:"This is the reputation board credit, not a separate world quest. If you've completed Ancient Colors, this is automatically marked done.",
    rewards:"20 Fontaine Reputation EXP",
    game8:"https://game8.co/games/Genshin-Impact/archives/422218",
  },
  {
    id:23, tier:2, chain:"narzissen",
    name:"Both Brains and Brawn",
    time:"25-30 min",
    region:"The Fortress of Meropide — Pankration Ring",
    activate:"Explore The Fortress of Meropide after completing Unfinished Comedy. Find Genevieve, then Poiret (talking to a guard).",
    prereqs:"Unfinished Comedy quest chain completed (+ Fortress of Meropide access)",
    notes:"Direct Genevieve & Poiret in 3 Pankration Ring matches. Use Poiret's Pyro→Freeze pattern with Genevieve. Final fight: Clockwork Mekas + Roussimoff. Adjust time to 18:00-22:00 between matches.",
    rewards:"Adv EXP · Mora · Pneumosia Achievement",
    game8:"https://game8.co/games/Genshin-Impact/archives/428477",
  },
  {
    id:24, tier:2, chain:"canticles",
    name:"Latecoming Homecoming",
    time:"25-30 min",
    region:"Petrichor (Nostoi Region)",
    activate:"After Canticles of Harmony + 1 server reset, head to Petrichor. Talk to Giulietta to start.",
    prereqs:"Canticles of Harmony quest chain completed + 1 server reset",
    notes:"Take Giulietta to Bayda Harbor, then bring seasick Giustino back. Find his brother Giovanni (he's disappointed). Multi-NPC fetch quest in Petrichor.",
    rewards:"Adv EXP · Mora · Achievement",
    game8:"https://game8.co/games/Genshin-Impact/archives/451906",
  },

  // ───────── TIER 3 — MEDIUM (30-60 min) ─────────
  {
    id:25, tier:3, chain:"narzissen",
    name:"Wish-Fulfilling Treasure Hunt",
    time:"30-45 min",
    region:"Morte Region (sea west of Fort Charybdis Ruins)",
    activate:"After completing In the Wake of Narcissus chain, teleport to Fort Charybdis Ruins, swim WEST until you see Urville floating on wood with Nadia. Talk to Urville.",
    prereqs:"In the Wake of Narcissus quest chain fully completed",
    notes:"Underwater treasure hunt across the sea. Multi-stage with cutscenes at the Rusty Rudder.",
    rewards:"Adv EXP · Mora · Primogems",
    game8:"https://game8.co/games/Genshin-Impact/archives/432265",
  },
  {
    id:26, tier:3, chain:"ancient",
    name:"Echoes of the Ancient World",
    time:"30-45 min",
    region:"Merusea Village → A Very Bright Place (underwater)",
    activate:"Talk to Melusine Verenata near Xana in Merusea Village.",
    prereqs:"Ancient Colors quest chain + 'Hey, this isn't Pumpkin Soup…' completed",
    notes:"Find Carabosse + Topyas underwater at A Very Bright Place (where Puca was saved). Get Melody of Vesta. Use Xenochromatic Armored Crab to activate the Conch Harp — hit the middle orifice. Fight Armored Crab waves.",
    rewards:"Hidden Viewpoint · Adv EXP · Mora",
    game8:"https://game8.co/games/Genshin-Impact/archives/421964",
  },
  {
    id:27, tier:3, chain:"fri",
    name:"Treacherous Light of the Depths",
    time:"35-45 min",
    region:"Fontaine Research Institute Region (underwater cavern)",
    activate:"Teleport to FRI waypoint, dive into the water to find a blocked cavern. Use Xenochromatic Jellyfish ability to clear rocks. Swim down, hit the switch by the metal door.",
    prereqs:"FRI region accessible",
    notes:"Find 3 Punched Tapes for Sevigne: 1) atop the box near a picture frame, 2) drawer of a broken closet, 3) on the floor by boxes/books. Return to Sevigne, then to Chisseray at FRI.",
    rewards:"Adv EXP · Mora · FRI Chronicles progression",
    game8:"https://game8.co/games/Genshin-Impact/archives/428467",
  },
  {
    id:28, tier:3, chain:"fri",
    name:"Fontaine Research Institute, Stagnating in the Rubble",
    time:"45-60 min",
    region:"Fontaine Research Institute Region",
    activate:"Explore the FRI Region. Quest auto-triggers via investigation in the ruined institute.",
    prereqs:"FRI region accessible (4.1 content)",
    notes:"Opening quest of the FRI Chronicles. Unlocks the rest of the FRI quest chain including A Letter and Road to the Singularity.",
    rewards:"Adv EXP · Mora · Unlocks FRI chain",
  },
  {
    id:29, tier:3, chain:"fri",
    name:"Road to the Singularity",
    time:"45-60 min",
    region:"Fontaine Research Institute Region",
    activate:"Teleport to the FRI waypoint, head southwest down the path to find a cave entrance with an automated lift. Approaching the lift auto-starts the quest.",
    prereqs:"FRI region accessible + ideally the Stagnating in the Rubble quest underway",
    notes:"Use the Ousia Block at the Pneuma terminal to power the lift. Multiple Pneuma/Ousia puzzles and dialogue-heavy progression.",
    rewards:"Adv EXP · Mora · Hero's Wit",
    game8:"https://game8.co/games/Genshin-Impact/archives/428379",
  },
  {
    id:30, tier:3, chain:"garcia",
    name:"Where His Life Lies",
    time:"30-45 min (+ potential RNG wait for daily commissions)",
    region:"Court of Fontaine — Waterway Hub",
    activate:"Teleport near Vasari Passage, head into the Waterway Hub. Lutong and Garcia at the Information Booth.",
    prereqs:"Sumeru's 'Garcia's Paean: A Gift of Compatibility' completed. ⚠ If quest doesn't appear: get the Principia Arithmetica Achievement (Garcia's Paean: Echo of Someone daily x3), OR do Substitutes / Key Items daily 2x, then wait for server reset.",
    notes:"After Waterway Hub dialogue, head to Opera Epiclese with Lutong/Garcia. Kaia joins. Garcia & Kaia go to cafe; you investigate with Lutong. Lots of back-and-forth. The trigger RNG can take days.",
    rewards:"Adv EXP · Mora · Fontaine Reputation · Prerequisite for Daydreams Beyond Space and Time",
    game8:"https://game8.co/games/Genshin-Impact/archives/451942",
  },
  {
    id:31, tier:3, chain:"leroy",
    name:"Leroy",
    time:"45-60 min total (+ in-game day waits between sub-quests)",
    region:"Court of Fontaine — Steambird's HQ → Vasari Passage",
    activate:"Talk to Euphrasie by Steambird's HQ. She points you to Mr. Benoit Leroy at Vasari Passage.",
    prereqs:"Questioning Melusine and Answering Machine + Impromptu Poem of the Crimson Dawn",
    notes:"Help Mr. Leroy with various chores/commissions across Fontaine. Sub-quests unlock by advancing the in-game clock to the next day (Dying Flash → others). Touching Rainbow Rose's Ideals lore.",
    rewards:"Adv EXP · Mora · Hero's Wit · Multi-chapter rewards",
    game8:"https://game8.co/games/Genshin-Impact/archives/437599",
  },

  // ───────── TIER 4 — LONG / GATED (60 min+) ─────────
  {
    id:32, tier:4, chain:"archon",
    name:"Prelude of Blancheur and Noirceur",
    time:"60-90 min",
    region:"Fontaine — Court of Fontaine arrival",
    activate:"Auto-unlocks at AR 40+ after completing Sumeru Chapter 3 Act 6 'Caribert'. Story-driven progression.",
    prereqs:"AR 40+ + Chapter 3 Act 6 'Caribert' completed",
    notes:"🌟 The OPENING Archon Quest of Fontaine — Chapter 4 Act 1. Introduces Furina, Lyney, Lynette, Freminet, Neuvillette. Must-do to unlock the rest of Fontaine.",
    rewards:"Primogems · Hero's Wit · Mora · Unlocks Fontaine progression",
    isSpecial:true,
    game8:"https://game8.co/games/Genshin-Impact/archives/420282",
  },
  {
    id:33, tier:4, chain:"narzissen",
    name:"In the Wake of Narcissus",
    time:"3-4 hours (full chain)",
    region:"Morte Region → Narzissenkreuz Ordo → Tower of Gestalt",
    activate:"Auto-unlocks after completing Caterpillar's Story: Prologue and other Narzissenkreuz chain prereqs. Head to Narzissenkreuz Ordo to progress.",
    prereqs:"Caterpillar's Story: Prologue + Narzissenkreuz Adventure chain quests",
    notes:"🌟 The MASSIVE 4.2 finale of the Narzissenkreuz Adventure. Unlocks Morte Region. Help Ann, Seymour, Caterpillar defeat Narzissenkreuz. Includes 'Search in the Algae Sea' (Mary-Ann brainstorming sessions) and unlocks Tower of Gestalt by clearing 4 seals.",
    rewards:"Primogems x60+ · Hero's Wit x10+ · Mora · Unlocks Tower of Gestalt + Through the Looking Glass",
    mora: 195000,
    heroWit: 17,
    isSpecial:true,
    game8:"https://game8.co/games/Genshin-Impact/archives/432256",
  },
  {
    id:34, tier:4, chain:"canticles",
    name:"Canticles of Harmony",
    time:"3-5 hours (full chain)",
    region:"Petrichor (Nostoi Region) — Remuria",
    activate:"Unlock Statue of Seven in Petrichor, then walk over to the town — quest auto-triggers.",
    prereqs:"Petrichor / Nostoi Region accessible (4.6 content)",
    notes:"🌟 The 4.6 MEGA-CHAIN. Help Cassiodor save Remurian citizens, foil Beothius. Multiple sub-quests including Underwater Nocturne, Gradus ad Capitolium, Fortune Plango Vulnera. Collect all 6 Ancient Autoharmonic Music Box Scores for the Echoes of the Grand Symphony achievement. Don't miss: give 3 A Ridiculously Common Branch to Giovanni BEFORE completing the chain.",
    rewards:"Primogems x100+ · Hero's Wit x15+ · Mora · 6 Music Scores · Major Remuria achievements",
    heroWit: 15,
    isSpecial:true,
    game8:"https://game8.co/games/Genshin-Impact/archives/451839",
  },
  {
    id:35, tier:4, chain:"narzissen",
    name:"Happy Birthday",
    time:"30-45 min (after long chain of prerequisites)",
    region:"Earnshaw's House (Court of Fontaine region) → Mont Esus East",
    activate:"After ALL prereqs done, wait 2 in-game days (rotate the clock's hour-hand twice). Then go to Earnshaw's House in front of his property.",
    prereqs:"⚠ In the Wake of Narcissus Act 2 + Through the Looking Glass + Wish-Fulfilling Treasure Hunt + Pursuit Parts 1 & 2 + 2 in-game days passed",
    notes:"Short, sweet quest itself — but the prerequisite stack is massive. Go north from Earnshaw to Mont Esus East to find Lanoire next to a Hilichurl named Caterpillar. Dialogue resolves the arc. Unlocks the 'Happy Birthday' hidden achievement.",
    rewards:"Adv EXP · Mora · Hidden Achievement: Happy Birthday",
    isSpecial:true,
    game8:"https://game8.co/games/Genshin-Impact/archives/432341",
  },
  {
    id:36, tier:4, chain:"fri",
    name:"Our Purpose Is in Another Canal",
    time:"45-60 min",
    region:"Fontaine Research Institute / FRI Region",
    activate:"Continuation quest after major FRI Chronicles progress. Auto-triggers on revisiting key NPCs after prereqs.",
    prereqs:"Road to the Singularity + FRI chain progress",
    notes:"Mid-to-late FRI Chronicles quest. Continues the Mary-Ann/Sigewinne lore thread. Combat + Pneuma/Ousia puzzles.",
    rewards:"Adv EXP · Mora · Hero's Wit",
  },
  {
    id:37, tier:4, chain:"fri",
    name:"In Search of Lost Time",
    time:"45-60 min",
    region:"Fontaine Research Institute Region",
    activate:"Late-chain FRI quest. Auto-unlocks after sufficient FRI Chronicles progression.",
    prereqs:"Our Purpose Is in Another Canal + FRI chain progress",
    notes:"Capstone-style FRI quest with lore-heavy reveals. Story finalization for the institute arc.",
    rewards:"Adv EXP · Mora · Hero's Wit · Primogems",
  },
  {
    id:38, tier:4, chain:"narzissen",
    name:"Ann of the Narzissenkreuz",
    time:"2-3 hours",
    region:"Fontaine — multiple locations",
    activate:"Complete 'Unfinished Comedy' to unlock. Major Narzissenkreuz Ordo chain.",
    prereqs:"Unfinished Comedy completed · Fontaine Archon Quest progress",
    notes:"Core Narzissenkreuz Ordo chain. Heavy lore, multi-act structure. One of the highest Mora + HW payouts in Fontaine.",
    rewards:"170,000 Mora · 17 Hero's Wit · Adv EXP · Primogems",
    mora: 170000,
    heroWit: 17,
    fandom:"https://genshin-impact.fandom.com/wiki/Ann_of_the_Narzissenkreuz",
  },
  {
    id:39, tier:3, chain:"fri",
    name:"Fontaine Research Institute of Kinetic Energy",
    time:"45-60 min",
    region:"Fontaine Research Institute ruins",
    activate:"Rescue Desnos from Meka enemies at the Fontaine Research Institute area.",
    prereqs:"Fontaine Research Institute area accessible",
    notes:"Multi-part investigation chain. Solid Mora + HW for medium time investment.",
    rewards:"110,000 Mora · 5 Hero's Wit · Adv EXP · Primogems",
    mora: 110000,
    heroWit: 5,
    fandom:"https://genshin-impact.fandom.com/wiki/Fontaine_Research_Institute_of_Kinetic_Energy_Engineering",
  },
];

// Fill in fallback link generators for each quest
QUESTS.forEach(q => {
  if (!q.fandom)   q.fandom   = fandomUrl(q.name.replace(/[''"]/g, ""));
  if (!q.gamewith) q.gamewith = gameWithSearch(q.name);
  if (!q.ign)      q.ign      = ignSearch(q.name);
});

const ORDER_NOTE = [
  { step:1,  text:"Knock out Tier 1 first — most are short standalones, several are Reputation Quests that give Fontaine Rep EXP" },
  { step:2,  text:"A Certain Notice → A Certain Trifle → A Certain Stamp — chain them in one session (8:00-12:00 next-day waits in-between)" },
  { step:3,  text:"Truly Mouthwatering! at the Poisson beach is a great quick win — comedic and earns a fun achievement" },
  { step:4,  text:"For Where His Life Lies: do the Garcia's Paean daily commissions in Sumeru first, get Principia Arithmetica achievement" },
  { step:5,  text:"Big chain order: Prelude of Blancheur and Noirceur → As Light Rain Falls Without Reason (Ch4 Acts 1-2) before most others" },
  { step:6,  text:"Caterpillar's Story: Prologue → In the Wake of Narcissus → Wish-Fulfilling Treasure Hunt → Through the Looking Glass → Pursuit → Happy Birthday (with 2 in-game day wait at end)" },
  { step:7,  text:"Ancient Colors chain unlocks: The Three Primary Colors of the Solar Corona, Seymour's Story: Prologue, Echoes of the Ancient World" },
  { step:8,  text:"FRI block (do in order): Fontaine Research Institute Stagnating in the Rubble → Treacherous Light of the Depths → Road to the Singularity → A Letter → Our Purpose Is in Another Canal → In Search of Lost Time" },
  { step:9,  text:"Canticles of Harmony (4.6 mega-chain at Petrichor) — set aside a few hours, collect all 6 music scores, give 3 branches to Giovanni BEFORE finishing" },
  { step:10, text:"After Canticles done + server reset: Latecoming Homecoming + For Yesterday and Tomorrow (the cat Osse follow-up)" },
  { step:11, text:"Leroy chain: needs Questioning Melusine + Impromptu Poem first; advance in-game days between sub-quests" },
];

const STORAGE_KEY = "fontaine-quest-tracker-v1";

export default function FontaineQuests() {
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

  const alreadyDone = 9;
  const totalQuests = 45;
  const sessionDone = Object.values(completed).filter(Boolean).length;
  const totalDone   = alreadyDone + sessionDone;
  const pct         = Math.round((totalDone / totalQuests) * 100);

  const filtered = QUESTS.filter(q => {
    if (filterTier && q.tier !== filterTier) return false;
    if (search) {
      const s = search.toLowerCase();
      if (!q.name.toLowerCase().includes(s) && !q.region.toLowerCase().includes(s)) return false;
    }
    return true;
  });

  const byTier = TIERS.map(t => ({
    ...t,
    quests: filtered.filter(q => q.tier === t.id),
  })).filter(t => t.quests.length > 0);

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#020617 0%,#0c1a3d 40%,#0e2a55 100%)", fontFamily:"Georgia,serif", color:"#dbeafe", paddingBottom:64 }}>
      {/* Header */}
      <div style={{ background:"rgba(2,6,23,0.97)", borderBottom:"1px solid rgba(103,232,249,0.2)", padding:"32px 24px 24px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:600, height:200, background:"radial-gradient(ellipse,rgba(103,232,249,0.1) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, backgroundImage:"radial-gradient(circle at 20% 50%, rgba(125,211,252,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(56,189,248,0.06) 0%, transparent 50%)", pointerEvents:"none" }} />

        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:4 }}>
          <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#06b6d4,#0c4a6e)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow:"0 0 20px rgba(103,232,249,0.5)" }}>💧</div>
          <h1 style={{ fontSize:"clamp(18px,4vw,28px)", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", background:"linear-gradient(135deg,#e0f2fe 0%,#67e8f9 50%,#0891b2 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", margin:0 }}>
            Fontaine World Quests
          </h1>
        </div>
        <p style={{ fontSize:12, letterSpacing:"0.22em", color:"rgba(125,211,252,0.5)", textTransform:"uppercase", marginBottom:24 }}>
          Quest Completion Tracker — primogems, Mora & Hero's Wit · 9/45 Completed · 36 Remaining
        </p>

        {/* Progress bar */}
        <div style={{ maxWidth:480, margin:"0 auto 20px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"rgba(219,234,254,0.4)", marginBottom:6, letterSpacing:"0.08em" }}>
            <span>OVERALL PROGRESS</span>
            <span>{totalDone}/{totalQuests} — {pct}%</span>
          </div>
          <div style={{ height:6, background:"rgba(255,255,255,0.05)", borderRadius:3, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${pct}%`, borderRadius:3, background:"linear-gradient(90deg,#0c4a6e,#0891b2,#67e8f9)", transition:"width 0.5s ease", boxShadow:"0 0 8px rgba(103,232,249,0.5)" }} />
          </div>
        </div>

        {/* Controls */}
        <div style={{ display:"flex", gap:8, maxWidth:720, margin:"0 auto", flexWrap:"wrap", justifyContent:"center" }}>
          <input
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(103,232,249,0.2)", borderRadius:6, padding:"8px 14px", color:"#dbeafe", fontSize:13, outline:"none", width:200 }}
            placeholder="Search quests or regions..."
            value={search} onChange={e => setSearch(e.target.value)} />
          <button onClick={() => setFilterTier(null)}
            style={{ padding:"6px 14px", borderRadius:6, border:`1px solid ${!filterTier ? "#67e8f9" : "rgba(255,255,255,0.08)"}`, background:!filterTier ? "rgba(103,232,249,0.12)" : "rgba(255,255,255,0.02)", color:!filterTier ? "#67e8f9" : "rgba(219,234,254,0.4)", fontSize:12, cursor:"pointer", fontWeight:!filterTier?600:400 }}>
            ALL
          </button>
          {TIERS.map(t => (
            <button key={t.id} onClick={() => setFilterTier(filterTier===t.id ? null : t.id)}
              style={{ padding:"6px 14px", borderRadius:6, border:`1px solid ${filterTier===t.id ? t.color : "rgba(255,255,255,0.08)"}`, background:filterTier===t.id ? t.bg : "rgba(255,255,255,0.02)", color:filterTier===t.id ? t.color : "rgba(219,234,254,0.4)", fontSize:12, cursor:"pointer", fontWeight:filterTier===t.id?600:400 }}>
              {t.icon} {t.label}
            </button>
          ))}
          <button onClick={() => setShowOrder(p => !p)}
            style={{ padding:"6px 14px", borderRadius:6, border:`1px solid ${showOrder ? "#fbbf24" : "rgba(255,255,255,0.08)"}`, background:showOrder ? "rgba(251,191,36,0.1)" : "rgba(255,255,255,0.02)", color:showOrder ? "#fbbf24" : "rgba(219,234,254,0.4)", fontSize:12, cursor:"pointer" }}>
            📋 Order
          </button>
        </div>
      </div>

      {showOrder && (
        <div style={{ maxWidth:880, margin:"24px auto 0", padding:"0 16px" }}>
          <div style={{ background:"rgba(251,191,36,0.06)", border:"1px solid rgba(251,191,36,0.2)", borderRadius:12, padding:"20px 24px" }}>
            <h3 style={{ color:"#fbbf24", fontSize:13, letterSpacing:"0.15em", textTransform:"uppercase", margin:"0 0 16px 0" }}>📋 Recommended Completion Order</h3>
            {ORDER_NOTE.map(o => (
              <div key={o.step} style={{ display:"flex", gap:12, marginBottom:10, alignItems:"flex-start" }}>
                <span style={{ fontSize:11, minWidth:24, height:24, borderRadius:"50%", background:"rgba(251,191,36,0.15)", border:"1px solid rgba(251,191,36,0.3)", color:"#fbbf24", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, flexShrink:0 }}>{o.step}</span>
                <span style={{ fontSize:12, color:"rgba(219,234,254,0.7)", lineHeight:1.5 }}>{o.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quest list */}
      <div style={{ maxWidth:880, margin:"0 auto", padding:"32px 16px 0" }}>
        {byTier.length === 0 && (
          <div style={{ textAlign:"center", padding:"60px 20px", color:"rgba(219,234,254,0.3)", fontSize:14 }}>
            <div style={{ fontSize:32, marginBottom:12 }}>🔍</div>No quests found
          </div>
        )}

        {byTier.map(tier => (
          <div key={tier.id} style={{ marginBottom:32, opacity:mounted?1:0, transform:mounted?"none":"translateY(16px)", transition:"all 0.4s ease" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, paddingBottom:10, borderBottom:`1px solid ${tier.border}` }}>
              <span style={{ fontSize:18 }}>{tier.icon}</span>
              <span style={{ fontSize:15, fontWeight:700, color:tier.color, letterSpacing:"0.07em" }}>{tier.label} — {tier.sublabel}</span>
              <span style={{ fontSize:11, color:"rgba(219,234,254,0.35)", marginLeft:"auto" }}>{tier.time}</span>
              <div style={{ padding:"3px 10px", borderRadius:20, background:tier.bg, border:`1px solid ${tier.border}`, color:tier.color, fontSize:11, fontWeight:600 }}>
                {tier.quests.filter(q => completed[q.id]).length}/{tier.quests.length} done
              </div>
            </div>

            {tier.quests.map(quest => {
              const isDone  = !!completed[quest.id];
              const isOpen  = expanded === quest.id;
              const chain   = CHAIN_TAG[quest.chain] || CHAIN_TAG.standalone;

              return (
                <div key={quest.id}
                  style={{ background:isDone ? "rgba(255,255,255,0.015)" : "linear-gradient(135deg,rgba(8,18,40,0.92),rgba(5,12,28,0.92))", border:`1px solid ${isOpen ? tier.color+"55" : isDone ? "rgba(255,255,255,0.05)" : tier.border}`, borderRadius:10, marginBottom:8, overflow:"hidden", transition:"all 0.2s", opacity:isDone?0.42:1, boxShadow:isOpen?`0 0 22px ${tier.glow}`:"none", cursor:"pointer" }}>

                  <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px" }} onClick={() => toggleExp(quest.id)}>
                    <div onClick={e => { e.stopPropagation(); toggle(quest.id); }}
                      style={{ width:20, height:20, minWidth:20, borderRadius:4, border:`2px solid ${isDone ? tier.color : "rgba(103,232,249,0.3)"}`, background:isDone ? tier.color+"28" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all 0.2s", fontSize:12, color:tier.color }}>
                      {isDone && "✓"}
                    </div>
                    <span style={{ flex:1, fontSize:14, fontWeight:600, color:isDone?"rgba(219,234,254,0.4)":"#e0f2fe", letterSpacing:"0.03em", textDecoration:isDone?"line-through":"none" }}>
                      {quest.name}
                    </span>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:9, padding:"2px 7px", borderRadius:10, background:`${chain.color}15`, color:chain.color, border:`1px solid ${chain.color}40`, whiteSpace:"nowrap" }}>
                        {chain.label}
                      </span>
                      {quest.isSpecial && <span style={{ fontSize:9, padding:"2px 6px", borderRadius:10, background:"rgba(103,232,249,0.15)", color:"#67e8f9", border:"1px solid rgba(103,232,249,0.35)", fontWeight:700 }}>KEY</span>}
                      <span style={{ fontSize:10, padding:"2px 8px", borderRadius:10, background:tier.bg, color:tier.color, border:`1px solid ${tier.border}`, whiteSpace:"nowrap" }}>{quest.time}</span>
                      <span style={{ fontSize:10, color:"rgba(219,234,254,0.3)", transform:isOpen?"rotate(180deg)":"none", transition:"transform 0.2s" }}>▼</span>
                    </div>
                  </div>

                  <div style={{ maxHeight:isOpen?900:0, overflow:"hidden", transition:"max-height 0.4s ease" }}>
                    <div style={{ padding:"14px 16px 16px 48px", borderTop:`1px solid ${tier.border}` }}>
                      {[
                        ["Region",   `📍 ${quest.region}`],
                        ["Activate", quest.activate],
                        ["Prereqs",  quest.prereqs],
                        ["Tips",     quest.notes],
                        ["Rewards",  quest.rewards],
                      ].map(([label, val]) => (
                        <div key={label} style={{ display:"flex", gap:8, marginBottom:8, alignItems:"flex-start" }}>
                          <span style={{ fontSize:10, color:"rgba(103,232,249,0.65)", letterSpacing:"0.12em", textTransform:"uppercase", minWidth:68, marginTop:2, fontWeight:600 }}>{label}</span>
                          <span style={{ fontSize:12, lineHeight:1.6, flex:1, whiteSpace:"pre-line",
                            color: label==="Prereqs" ? "#fde68a"
                                 : label==="Rewards" ? "#86efac"
                                 : label==="Tips"    ? "rgba(219,234,254,0.55)"
                                 : "rgba(219,234,254,0.75)",
                            fontStyle: label==="Tips" ? "italic" : "normal" }}>
                            {val}
                          </span>
                        </div>
                      ))}

                      {/* Guide links — 4 sites */}
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:12 }}>
                        {quest.game8 && (
                          <a href={quest.game8} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                            style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:6, background:tier.bg, border:`1px solid ${tier.border}`, color:tier.color, fontSize:10, textDecoration:"none", fontWeight:600, letterSpacing:"0.05em" }}>
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

        {totalDone === totalQuests && (
          <div style={{ textAlign:"center", padding:"40px 20px", background:"linear-gradient(135deg,rgba(103,232,249,0.06),rgba(8,145,178,0.02))", border:"1px solid rgba(103,232,249,0.15)", borderRadius:12 }}>
            <div style={{ fontSize:36, marginBottom:12 }}>💧✨</div>
            <div style={{ color:"#67e8f9", fontSize:16, fontWeight:700, letterSpacing:"0.15em" }}>ALL FONTAINE QUESTS COMPLETE</div>
            <div style={{ color:"rgba(219,234,254,0.4)", fontSize:12, marginTop:8 }}>The Hydro Archon sings of your deeds, Traveler.</div>
          </div>
        )}
      </div>
    </div>
  );
}
