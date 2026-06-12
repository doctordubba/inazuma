import RegionQuestTracker from "./RegionQuestTracker";

/* ============================================================
   NOD-KRAI QUEST DATA
   World Quests + Selenic Chronicles + Story Quests + Hangouts.
   Nod-Krai is the newest region (v6.0 Luna I, Sept 2025).
   Sources: Game8, Fandom Wiki, BitTopup (cross-checked May 2026).
   ============================================================ */

const tiers = [
  { id:1, label:"Tier 1", sublabel:"Very Fast",    time:"5-15 min",  color:"#93c5fd", bg:"rgba(147,197,253,0.07)", border:"rgba(147,197,253,0.22)", glow:"rgba(147,197,253,0.12)", icon:"❄" },
  { id:2, label:"Tier 2", sublabel:"Short",        time:"15-30 min", color:"#67e8f9", bg:"rgba(103,232,249,0.07)", border:"rgba(103,232,249,0.22)", glow:"rgba(103,232,249,0.12)", icon:"🌙" },
  { id:3, label:"Tier 3", sublabel:"Medium",       time:"30-60 min", color:"#a5b4fc", bg:"rgba(165,180,252,0.07)", border:"rgba(165,180,252,0.22)", glow:"rgba(165,180,252,0.12)", icon:"⚖" },
  { id:4, label:"Tier 4", sublabel:"Long / Gated", time:"60 min+",   color:"#c4b5fd", bg:"rgba(196,181,253,0.07)", border:"rgba(196,181,253,0.22)", glow:"rgba(196,181,253,0.12)", icon:"🐺" },
];

const chainTags = {
  story:      { label:"Story Quest",         color:"#06b6d4" },
  hangout:    { label:"Hangout Event",       color:"#ec4899" },
  polkka:     { label:"Polkka chain",        color:"#a78bfa" },
  emptiness:  { label:"Colors of Emptiness", color:"#fbbf24" },
  east:       { label:"East of the Moon",    color:"#34d399" },
  selenic:    { label:"Selenic Chronicle",   color:"#f472b6" },
  standalone: { label:"Standalone",          color:"#64748b" },
  intel:      { label:"Intel Quest",         color:"#f472b6" },
};

const quests = [
  { id:1, tier:1, chain:"standalone", name:"The Bell of Mourning Echoes", time:"10-15 min", region:"Final Night Cemetery (Paha Isle)", activate:"Approach the Bell at Final Night Cemetery.", prereqs:"Nod-Krai accessible · Paha Isle unlocked", notes:"Short standalone with Final Night Cemetery flavor. Quick atmospheric quest.", rewards:"Primogems · Adv EXP · Mora · Final Night reputation" },

  { id:2, tier:2, chain:"east", name:"East of the Moon, West of the Sun (Chain)", time:"20-30 min per sub-quest (3 parts, any order)", region:"Across Lempo / Hiisi / Paha isles", activate:"Trigger by approaching the marked NPCs across the three isles. Sub-quests can be done in any order.", prereqs:"Nod-Krai accessible · Statues of the Seven cycled", notes:"Three-part chain spread across the isles. Completion rewards include Proof of Cognoscenti (Frostmoon Enclave currency).", rewards:"Primogems (per sub-quest) · Adv EXP · Mora · Proof of Cognoscenti · Nod-Krai reputation", game8:"https://game8.co/games/Genshin-Impact/archives/550377" },
  { id:3, tier:2, chain:"standalone", name:"Team Rigor / Team Intuition", time:"15-25 min", region:"Kuuvahki Experimental Design Bureau (Paha Isle)", activate:"Investigate the Kuuvahki Bureau; quest triggers via investigation choice.", prereqs:"Paha Isle accessible", notes:"Choice-based detective quest. Two solution branches (rigorous evidence vs gut intuition). Both reward primogems but unlock different achievements.", rewards:"Primogems · Adv EXP · Mora · achievement varies by chosen branch" },
  { id:4, tier:2, chain:"standalone", name:"For a Green Island", time:"15-25 min", region:"Lempo Isle", activate:"Talk to the conservation NPCs near Nasha Town.", prereqs:"Lempo Isle accessible", notes:"Short conservation-themed quest. Luxurious Chest reward at completion.", rewards:"Primogems · Adv EXP · Mora · Luxurious Chest" },
  { id:5, tier:2, chain:"standalone", name:"Friends of Moleyvalley", time:"15-25 min", region:"Moleyvalley (Lempo Isle)", activate:"Visit the Moleyvalley area on Lempo Isle.", prereqs:"Lempo Isle accessible", notes:"Light quest involving the Moleyvalley locals. Luxurious Chest reward.", rewards:"Primogems · Adv EXP · Mora · Luxurious Chest" },
  { id:6, tier:2, chain:"standalone", name:"Whisper Beneath the Waves", time:"20-30 min", region:"Nod-Krai coastal area", activate:"Investigate disturbances along the Nod-Krai coastline.", prereqs:"Nod-Krai accessible", notes:"Part of a small chain (Shoemaker's Children + Tale-Telling Heart + this). Coastal exploration with light combat.", rewards:"Primogems · Adv EXP · Mora" },

  { id:7, tier:3, chain:"emptiness", name:"Colors of Emptiness (Trilogy)", time:"45-60 min (full 3-part chain)", region:"Nothing Passage", activate:"Investigate the floating orb in the Nothing Passage; the chain auto-progresses.", prereqs:"Nod-Krai accessible · Nothing Passage unlocked", notes:"Three-part chain (Echoes, Shadows, Reverberations). Each part wraps with ~50 primogems. The final part involves a Frostmoon Scion philosophy puzzle.", rewards:"~150 Primogems total (50 per part) · ~450 AR EXP per part · 50,000 Mora per part · 5 Hero's Wit · 4 MEO", mora: 150000, heroWit: 5, game8:"https://game8.co/games/Genshin-Impact/archives/550292" },
  { id:8, tier:3, chain:"standalone", name:"The Shoemaker's Children Go Barefoot", time:"30-45 min", region:"Clink-Clank Krumkake Craftshop (Lempo Isle)", activate:"Talk to the craftshop NPC at Clink-Clank.", prereqs:"Lempo Isle accessible", notes:"Crafting / commerce mid-length chain. Tied to the Clink-Clank reputation. Luxurious Chest at end.", rewards:"Primogems · Adv EXP · Mora · Luxurious Chest · Clink-Clank reputation" },
  { id:9, tier:3, chain:"standalone", name:"The Tale-Telling Heart", time:"30-45 min", region:"Lempo Isle (continues from Shoemaker's Children)", activate:"Auto-follows after Shoemaker's Children Go Barefoot.", prereqs:"Shoemaker's Children completed", notes:"Mid-chain follow-up. Continues the craftshop arc with deeper character beats.", rewards:"Primogems · Adv EXP · Mora" },
  { id:10, tier:3, chain:"standalone", name:"A Nocturne of the Far North", time:"30-45 min", region:"Hiisi Isle northern reaches", activate:"Triggered by exploration of Hiisi Isle's northern reaches.", prereqs:"Hiisi Isle accessible", notes:"Standalone world quest with Frostmoon-themed plot. Sets up later Selenic Chronicles content.", rewards:"Primogems · Adv EXP · Mora · Hero's Wit", game8:"https://game8.co/games/Genshin-Impact/archives/567335" },

  { id:11, tier:4, chain:"polkka", name:"Polkka Beneath the Moon's Oracle", time:"3-4 hours (6-part chain)", region:"Frostmoon Enclave (Hiisi Isle)", activate:"Follow the Frostmoon Scions' Oracle path via the Enclave's main quest line.", prereqs:"Nod-Krai accessible + Frostmoon Enclave intro quests done", notes:"6-part chain about unsealing the sanctum closed off by the first moonchanter. Biggest single Nod-Krai chain — deep Frostmoon Scions / Kuutar (Columbina) lore.", rewards:"~280 Primogems · Adv EXP · Mora · Hero's Wit · MEO · Frostmoon Enclave reputation", heroWit: 6, game8:"https://game8.co/games/Genshin-Impact/archives/550304" },
  { id:12, tier:4, chain:"standalone", name:"Come Play With the Moon", time:"45-60 min", region:"Silvermoon Hall area (Hiisi Isle)", activate:"Talk to the Frostmoon liaison at Silvermoon Hall.", prereqs:"Silvermoon Hall accessible + Selenic Chronicles unlocked", notes:"Long Frostmoon-themed world quest tied to Silvermoon Hall.", rewards:"Primogems · Adv EXP · Mora · Hero's Wit · Frostmoon reputation", game8:"https://game8.co/games/Genshin-Impact/archives/574763" },
  { id:13, tier:4, chain:"selenic", name:"Selenic Chronicles — Frostmoon Enclave (Lauma)", time:"2-3 hours (5 chronicles)", region:"Frostmoon Enclave (Hiisi Isle)", activate:"Unlocked via reputation milestones with the Frostmoon Enclave.", prereqs:"Frostmoon Enclave reputation accrued", notes:"Five chronicles: The Stone at the Gate · Mirage Extraction · Mirrors, the Labyrinth and the King · To the green island... · Echoes of an unfinished past.", rewards:"~250 Primogems (50 per chronicle) · Sanctifying Unction × 5 each · Frostmoon Enclave reputation", game8:"https://game8.co/games/Genshin-Impact/archives/550721" },
  { id:14, tier:4, chain:"selenic", name:"Selenic Chronicles — Final Night Cemetery (Flins)", time:"1.5-2 hours (3 chronicles)", region:"Final Night Cemetery (Paha Isle)", activate:"Unlocked via reputation milestones with Final Night Cemetery.", prereqs:"Final Night Cemetery reputation accrued", notes:"Three chronicles: The Shoemaker's Children Have No Shoes · Priorities First · Up to the Promised Heaven.", rewards:"~150 Primogems (50 per chronicle) · Sanctifying Unction · Final Night Cemetery reputation" },
  { id:15, tier:4, chain:"selenic", name:"Selenic Chronicles — Silvermoon Hall (Columbina)", time:"2-3 hours (multi-act, time-gated)", region:"Silvermoon Hall (Hiisi Isle)", activate:"Unlocked via the AQ 'Song of the Welkin Moon Act II — Elegy of Dust and Lamplight'. Acts are time-gated across patches (Luna II onward).", prereqs:"AQ Ch VI 'Song of the Welkin Moon Act II' completed", notes:"Columbina's personal reputation chronicles. Released in waves: The 1st Moon · The Artist By the Moon's Side · Moonlight Sonata: Lingering Resonance · The 4th Moon. All acts may not be unlocked depending on current patch.", rewards:"~250+ Primogems (50 per chronicle) · Sanctifying Unction · Silvermoon Hall reputation", fandom:"https://genshin-impact.fandom.com/wiki/Silvermoon_Hall:_Selenic_Chronicles" },
  { id:16, tier:4, chain:"standalone", name:"Meeting Point Upgrades (3 hubs)", time:"1-2 hours per hub (5 upgrade tiers each)", region:"Clink-Clank (Lempo) · Frostmoon Enclave (Hiisi) · Final Night Cemetery (Paha)", activate:"Progress reputation at each Meeting Point through the unlock conditions (donating materials, completing chronicles).", prereqs:"Nod-Krai reputation grind", notes:"Each Meeting Point has 5 upgrade tiers; each tier rewards primogems + Acquaint Fate + crafting blueprints. 250 primo per Meeting Point at full upgrade.", rewards:"750 Primogems total across 3 Meeting Points · Acquaint Fates · Crown of Insight · faction blueprints", game8:"https://game8.co/games/Genshin-Impact/archives/492722" },
  { id:17, tier:4, chain:"standalone", name:"Nod-Krai — Full Region Sweep", time:"10-15 hours (full ~18-20 quest set + chest exploration)", region:"All of Nod-Krai (Lempo, Hiisi, Paha)", activate:"Natural progression. World quests pop on the map as you explore.", prereqs:"AR 30+ · Nod-Krai unlocked", notes:"Aggregate entry for what isn't enumerated individually. Includes remaining standalone world quests, ~293+ chests, Valiant Chronicles. Total chest payout ~2,400-3,000 primogems.", rewards:"~2,400-3,000 Primogems from chests · Adv EXP · Mora · Hero's Wit · 180 primo from Valiant Chronicles", mora: 200000, heroWit: 25 },
  { id:18, tier:3, chain:"selenic", name:"Echoes of an Unfinished Past", time:"45-60 min", region:"Frostmoon Enclave (Hiisi Isle)", activate:"Complete earlier Selenic Chronicles (Frostmoon Enclave set) to unlock this finale.", prereqs:"Selenic Chronicles — Frostmoon Enclave progress", notes:"Finale of the Frostmoon Selenic Chronicles. Rewards the Moonweaver's Dawn weapon. Highest single-quest Mora + HW payout in Nod-Krai.", rewards:"50,000 Mora · 5 Hero's Wit · 4 Mystic Enhancement Ore · Moonweaver's Dawn weapon", mora: 50000, heroWit: 5, fandom:"https://genshin-impact.fandom.com/wiki/Echoes_of_an_Unfinished_Past" },

  // ───────── SHORT MORA / HERO'S WIT QUESTS ─────────
  { id:19, tier:1, chain:"standalone", name:"Venture Towards the Moonlight", time:"2 min", region:"Nasha Town — Adventurer's Guild", activate:"Talk to Katheryne at the Nod-Krai Adventurer's Guild.", prereqs:"AQ 'Where the Moon Rises' progress (Katheryne returns to Guild)", notes:"Just talk to Katheryne. Unlocks Nod-Krai daily commissions. 4 Hero's Wit in 2 minutes is the best HW/min in Nod-Krai.", rewards:"20,000 Mora · 4 Hero's Wit", mora: 20000, heroWit: 4, game8:"https://game8.co/games/Genshin-Impact/archives/550301" },
  { id:20, tier:1, chain:"standalone", name:"Gift of the Mirage", time:"5 min", region:"Hiisi Island — beach west of Frostmoon Enclave", activate:"Talk to Pekkani on the beach west of Frostmoon Enclave.", prereqs:"Nod-Krai accessible", notes:"Find and place 3 fragments on a stone. Break Conch Shells for Kuuvahki empowerment. 35k Mora in 5 min is outstanding.", rewards:"35,000 Mora · 30 Primogems", mora: 35000, game8:"https://game8.co/games/Genshin-Impact/archives/550383" },
  { id:21, tier:1, chain:"standalone", name:"The Special Support Squad's Tale", time:"5 min", region:"Final Night Cemetery (Paha Isle)", activate:"Auto-unlocks when Final Night Cemetery Meeting Point reaches Level 2.", prereqs:"Meeting Point Level 2", notes:"Guide Lost Phantoms using a lighthouse. Very short and simple.", rewards:"20,000 Mora · Exquisite Chest", mora: 20000, game8:"https://game8.co/games/Genshin-Impact/archives/550609" },

  { id:22, tier:2, chain:"standalone", name:"The Mirrors, the Maze, and the Tsar", time:"15-20 min", region:"Hiisi Island — SE of Frostmoon Enclave", activate:"Jump into the large hole in the ground near Frostmoon Enclave (auto-start).", prereqs:"None beyond reaching the area", notes:"Chase the Crab Tsar through an underground cave. Unlocks Local Legend 'Crab Tsar — Lord of the Palace.' Fun and mostly linear.", rewards:"40 Primogems · 4 Hero's Wit · Precious Chest ×2 · Luxurious Chest ×1", heroWit: 4, game8:"https://game8.co/games/Genshin-Impact/archives/550398" },
  { id:23, tier:2, chain:"standalone", name:"Priorities First (World Quest)", time:"15-20 min", region:"Kuuvahki Experimental Design Bureau (Paha Isle)", activate:"Available upon reaching Nod-Krai — no quest lock.", prereqs:"None", notes:"Retrieve 3 Data Storage Cassettes, defeat Cutting Edge Storm Landcruiser. Achievement: 'Tempus Fugit, Pecunia Fugit.' Not the Selenic Chronicle of the same name.", rewards:"30,000 Mora · 2 Hero's Wit · 40 Primogems", mora: 30000, heroWit: 2, game8:"https://game8.co/games/Genshin-Impact/archives/550451" },
  { id:24, tier:2, chain:"standalone", name:"Drifting Toward a Promised Sky", time:"15 min", region:"Maroon Basin", activate:"Approach the fallen jellyfish behind a barrier in Maroon Basin (auto-start).", prereqs:"None beyond reaching the area", notes:"Rescue jellyfish, solve Kuuvahki Separator puzzles. Achievement: 'Silent Spring.' Charming short quest.", rewards:"40 Primogems · chests (Mora + Hero's Wit)", game8:"https://game8.co/games/Genshin-Impact/archives/550426" },
  { id:25, tier:2, chain:"standalone", name:"The Power of Research", time:"15-20 min", region:"Barrowmoss Barrens / Kuuvahki Bureau (Paha Isle)", activate:"Available upon reaching Nod-Krai — no quest lock.", prereqs:"None", notes:"Assembly module puzzles and lightning experiments. Rewards 'Electric Dreams' achievement and Airspace Data Collector 2.0 gadget.", rewards:"20,000 Mora · 30 Primogems", mora: 20000, game8:"https://game8.co/games/Genshin-Impact/archives/550378" },

  { id:26, tier:2, chain:"intel", name:"Intel Quests (5-quest chain)", time:"10 min each (50 min total)", region:"Nasha Town + various Nod-Krai locations", activate:"Intel Exchange with Katheryne using Recorded Intel ×5 per quest.", prereqs:"Own Nefer or Jahoda · collect Recorded Intel", notes:"5 investigation quests: The Vanishing Bounty Target, The Disturbance Caused by Theft, The Haunted Pirate Shipwreck, The Suspicious Hermit, The Dust Settles. Each is ~10 min. Total: ~100k Mora + 13 HW.", rewards:"~100,000 Mora · ~13 Hero's Wit total across 5 quests", mora: 100000, heroWit: 13, fandom:"https://genshin-impact.fandom.com/wiki/Intel_Quest" },

  { id:27, tier:3, chain:"standalone", name:"Echoes of a Forsaken Song", time:"20-25 min", region:"Amsvartnir (between Ashveil Peak and Wavechaser Plain)", activate:"Break the Lunar Conflux Barrier using Mandagoras, then play the hidden harp.", prereqs:"Luna IV content unlocked", notes:"Follow Seelies, solve Lakeside Prism puzzles on a floating island. Achievement: 'Farewell Hope, With Hope Farewell Fear.' Viewpoint unlock.", rewards:"33,000 Mora · 4 Hero's Wit · 40 Primogems", mora: 33000, heroWit: 4, game8:"https://game8.co/games/Genshin-Impact/archives/574425" },
  { id:28, tier:3, chain:"standalone", name:"The Stress of Changing Careers", time:"20-25 min", region:"Northern Training Ground (Lempo Isle)", activate:"Talk to Vaino at the Northern Training Grounds waypoint.", prereqs:"Nod-Krai accessible", notes:"Target shooting challenges. Achievement: 'Dark Secret of The Hollowhands.' Exquisite Chest ×2 + Luxurious Chest ×1.", rewards:"30,000 Mora · 2 Hero's Wit · 40 Primogems", mora: 30000, heroWit: 2, game8:"https://game8.co/games/Genshin-Impact/archives/550294" },
  { id:29, tier:3, chain:"standalone", name:"To Turn Each Sin Against the Sinner", time:"25-30 min", region:"Dreadshade Mire", activate:"Find unconscious Ratnik Janusz NE of Dreadshade Mire Waypoint.", prereqs:"Luna IV content", notes:"Seal 3 pillars using Kuuvahki Prism puzzles, then defeat Serpent of All Evils. Combat-heavy.", rewards:"40 Primogems · Luxurious Chest ×1 · Precious Chest ×2 · Exquisite Chest ×3", game8:"https://game8.co/games/Genshin-Impact/archives/574429" },
];

const orderNote = [
  { step:1, text:"Nod-Krai is the newest region (v6.0 Luna I, Sept 2025). Content shipped across patches v6.0 → v6.3 (Columbina) with more Selenic Chronicles still releasing in waves." },
  { step:2, text:"Quick win first: The Bell of Mourning Echoes is a fast standalone in Final Night Cemetery." },
  { step:3, text:"Short-quest sweep on Lempo Isle: For a Green Island + Friends of Moleyvalley + The Shoemaker's Children Go Barefoot → The Tale-Telling Heart. All cluster in the same fast-travel area." },
  { step:4, text:"East of the Moon, West of the Sun is a parallel three-part chain across all isles — pick up each part as you naturally pass through." },
  { step:5, text:"Polkka Beneath the Moon's Oracle is the single biggest Nod-Krai chain (~280 primo, 6 parts). It directly opens Kuutar (Columbina) lore — do it before her Story Quest for context." },
  { step:6, text:"Selenic Chronicles are reputation-gated and split per faction (Frostmoon Enclave / Final Night Cemetery / Silvermoon Hall). Silvermoon's Columbina chronicles are time-gated across patches — Luna II acts may still be releasing." },
  { step:7, text:"Meeting Point upgrades give a flat 750 primo total across the three hubs. Don't sleep on these — they're easy to miss if you only chase quest markers." },
  { step:8, text:"This tracker covers the verified named chains. The 'Full Region Sweep' Tier 4 entry rolls in the remaining ~2,400-3,000 primogems from chests + Valiant Chronicles + small standalone quests." },
  { step:9, text:"Ultra-fast Mora sweep: Venture Towards the Moonlight (2 min, 20k+4HW), Gift of the Mirage (5 min, 35k), The Special Support Squad's Tale (5 min, 20k). All under 5 min — combine for ~75k Mora + 4 HW in 12 min." },
  { step:10, text:"Intel Quests (need Nefer or Jahoda): 5 short investigation quests via Katheryne, ~10 min each. Total ~100k Mora + 13 HW. Best sustained HW farming in Nod-Krai." },
];

const config = {
  title: "Nod-Krai World Quests",
  subtitleLabel: "World Quests · Story Quests · Hangouts — primogems, Mora & Hero's Wit",
  logoEmoji: "🌙",
  completeEmoji: "🌙✨",
  completeTitle: "ALL NOD-KRAI QUESTS COMPLETE",
  completeMessage: "Kuutar's gaze finds you in the dark, Traveler.",
  storageKey: "nodkrai-quest-tracker-v1",
  tiers, chainTags, quests, orderNote,
  theme: {
    pageBg:           "linear-gradient(160deg,#020617 0%,#0a1428 40%,#152244 100%)",
    headerBg:         "rgba(2,6,23,0.97)",
    pattern1:         "rgba(165,243,252,0.06)",
    pattern2:         "rgba(96,165,250,0.06)",
    cardBg:           "linear-gradient(135deg,rgba(8,18,40,0.92),rgba(5,12,28,0.92))",
    logoBg:           "linear-gradient(135deg,#94a3b8,#1e293b)",
    titleGradient:    "linear-gradient(135deg,#f0f9ff 0%,#a5f3fc 50%,#0c4a6e 100%)",
    progressGradient: "linear-gradient(90deg,#1e3a8a,#0ea5e9,#a5f3fc)",
    textPrimary:      "#ecfeff",
    textBright:       "#f0f9ff",
    textRgb:          [236, 254, 255],
    accent:           "#a5f3fc",
    accentRgb:        [165, 243, 252],
  },
};

export default function NodKraiQuests() {
  return <RegionQuestTracker config={config} />;
}
