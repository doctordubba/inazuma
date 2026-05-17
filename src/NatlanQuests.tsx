import RegionQuestTracker from "./RegionQuestTracker";

/* ============================================================
   NATLAN QUEST DATA
   World Quests + Tribal Chronicles + Story Quests + Hangouts
   that reward primogems. Archon Quests intentionally excluded.
   Sources: Game8, Fandom Wiki, GameWith (cross-checked May 2026).
   ============================================================ */

const tiers = [
  { id:1, label:"Tier 1", sublabel:"Very Fast",    time:"5-15 min",  color:"#93c5fd", bg:"rgba(147,197,253,0.07)", border:"rgba(147,197,253,0.22)", glow:"rgba(147,197,253,0.12)", icon:"🔥" },
  { id:2, label:"Tier 2", sublabel:"Short",        time:"15-30 min", color:"#67e8f9", bg:"rgba(103,232,249,0.07)", border:"rgba(103,232,249,0.22)", glow:"rgba(103,232,249,0.12)", icon:"🪶" },
  { id:3, label:"Tier 3", sublabel:"Medium",       time:"30-60 min", color:"#a5b4fc", bg:"rgba(165,180,252,0.07)", border:"rgba(165,180,252,0.22)", glow:"rgba(165,180,252,0.12)", icon:"⚖" },
  { id:4, label:"Tier 4", sublabel:"Long / Gated", time:"60 min+",   color:"#c4b5fd", bg:"rgba(196,181,253,0.07)", border:"rgba(196,181,253,0.22)", glow:"rgba(196,181,253,0.12)", icon:"🌋" },
];

const chainTags = {
  story:      { label:"Story Quest",       color:"#06b6d4" },
  hangout:    { label:"Hangout Event",     color:"#ec4899" },
  tribal:     { label:"Tribal Chronicle",  color:"#f59e0b" },
  saurian:    { label:"Saurian Companion", color:"#22c55e" },
  standalone: { label:"Standalone",        color:"#64748b" },
};

const quests = [
  { id:1, tier:1, chain:"standalone", name:"Natlan! A New Adventure", time:"10-15 min", region:"Natlan — entry portal → Stadium of the Sacred Flame", activate:"Auto-triggers upon entering Natlan via the AQ entry. The opening quest of the region.", prereqs:"AR 30+ · AQ Sumeru completed · entry to Natlan via AQ Ch V Act I", notes:"Pulls you to the Stadium of the Sacred Flame and introduces the Saurian companion mechanic. Required gateway to most other Natlan content.", rewards:"Primogems · Saurian companion intro · Adv EXP · Mora", game8:"https://game8.co/games/Genshin-Impact/archives/470215" },
  { id:2, tier:1, chain:"saurian", name:"Lost in the Woods", time:"10-15 min", region:"Coatepec Mountain area", activate:"Find the wandering Tepetlisaur near Coatepec Mountain.", prereqs:"Natlan accessible", notes:"First sub-quest of the Between Pledge and Forgettance series. You meet the saurian later named 'Little One' here.", rewards:"Primogems · Adv EXP · Mora · unlocks Little One follow-up", game8:"https://game8.co/games/Genshin-Impact/archives/408476" },
  { id:3, tier:1, chain:"saurian", name:"Little One (Tepetlisaur Naming)", time:"5-10 min", region:"Coatepec Mountain (continues from Lost in the Woods)", activate:"Continues from Lost in the Woods. Pick a name for your saurian companion.", prereqs:"Lost in the Woods completed", notes:"Naming ceremony — the chosen name persists in all later Natlan dialogue. Pick deliberately.", rewards:"Primogems · named Saurian companion · achievement", fandom:"https://genshin-impact.fandom.com/wiki/Little_One" },

  { id:4, tier:2, chain:"tribal", name:"Tribal Chronicles — Scions of the Canopy", time:"20-30 min", region:"Toyac Springs · Scions of the Canopy territory", activate:"Talk to the Tribal Chieftain after reaching the Scions of the Canopy area.", prereqs:"Natlan unlocked (AQ Ch V Act I)", notes:"Kinich + Ajaw's home tribe. Tribe Reputation EXP + crafting / domain unlocks here.", rewards:"Primogems · Adv EXP · Mora · Tribe Reputation EXP · crafting unlocks", fandom:"https://genshin-impact.fandom.com/wiki/Scions_of_the_Canopy" },
  { id:5, tier:2, chain:"tribal", name:"Tribal Chronicles — Children of Echoes", time:"20-30 min", region:"Coatepec Mountain · Children of Echoes territory", activate:"Tribal Chronicles menu. Talk to the liaison in the tribe's plaza.", prereqs:"Natlan unlocked", notes:"Xilonen's tribe (the smiths). Gear-tuning bench and saurian-related crafting unlocks here.", rewards:"Primogems · Adv EXP · Mora · Tribe Reputation EXP · gear-tuning bench unlocks", fandom:"https://genshin-impact.fandom.com/wiki/Children_of_Echoes" },
  { id:6, tier:2, chain:"tribal", name:"Tribal Chronicles — People of the Springs", time:"20-30 min", region:"Tequemecan Valley · People of the Springs territory", activate:"Tribal Chronicles menu. Talk to Mualani or her relatives near the Springs.", prereqs:"Natlan unlocked", notes:"Mualani's tribe (surfer/water folk). Water-related domain and crafting unlocks here.", rewards:"Primogems · Adv EXP · Mora · Tribe Reputation EXP", fandom:"https://genshin-impact.fandom.com/wiki/People_of_the_Springs" },
  { id:7, tier:2, chain:"tribal", name:"Tribal Chronicles — Masters of the Night-Wind", time:"20-30 min", region:"Sulfurous Veins · Masters of the Night-Wind territory", activate:"Tribal Chronicles menu. Liaison NPC in the tribe plaza.", prereqs:"Natlan unlocked", notes:"Ororon (Bidii) and Iansan's tribe. Spirit-related crafting / shop unlocks here.", rewards:"Primogems · Adv EXP · Mora · Tribe Reputation EXP", fandom:"https://genshin-impact.fandom.com/wiki/Masters_of_the_Night-Wind" },
  { id:8, tier:2, chain:"tribal", name:"Tribal Chronicles — Flower-Feather Clan", time:"20-30 min", region:"Atocpan · Flower-Feather Clan territory", activate:"Tribal Chronicles menu. Talk to the Flower-Feather liaison.", prereqs:"Natlan unlocked", notes:"Kachina and Chasca's tribe. Gliding-related rewards unlock here.", rewards:"Primogems · Adv EXP · Mora · Tribe Reputation EXP", fandom:"https://genshin-impact.fandom.com/wiki/Flower-Feather_Clan" },
  { id:9, tier:2, chain:"tribal", name:"Tribal Chronicles — Collective of Plenty", time:"20-30 min", region:"Tezcatepetonco Range · Collective of Plenty territory", activate:"Tribal Chronicles menu. Talk to the capybara-kin liaison.", prereqs:"Natlan unlocked", notes:"Varesa's tribe (the Capybara-kin). Plunge-related challenges unlock here.", rewards:"Primogems · Adv EXP · Mora · Tribe Reputation EXP", fandom:"https://genshin-impact.fandom.com/wiki/Collective_of_Plenty" },
  { id:10, tier:2, chain:"saurian", name:"Tepetlisaurus Hide-and-Seek", time:"15-25 min", region:"Natlan — various tribal areas", activate:"After naming the Tepetlisaur, the hide-and-seek mini-quest auto-starts.", prereqs:"Little One completed", notes:"Find your saurian in 4 hiding spots across Natlan. Light tutorial for Saurian companion abilities.", rewards:"Primogems · Adv EXP · Mora · Saurian companion familiarity unlocks", game8:"https://game8.co/games/Genshin-Impact/archives/409233" },
  { id:11, tier:2, chain:"saurian", name:"A Saurian Returns to the Nest", time:"15-25 min", region:"Toyac Springs area", activate:"Find the lost saurian baby NPC at a Toyac Springs camp.", prereqs:"Natlan accessible", notes:"Help reunite a saurian baby with its mother. Mostly dialogue + escort.", rewards:"Primogems · Adv EXP · Mora · Saurian-themed achievement", game8:"https://game8.co/games/Genshin-Impact/archives/331209" },
  { id:12, tier:2, chain:"saurian", name:"A Saurian Lover's Ordinary Days", time:"15-25 min", region:"Natlan — multiple tribal homes", activate:"Talk to the saurian researcher NPC who travels between tribes.", prereqs:"Natlan AQ Ch V Act II accessible", notes:"Multi-location chain visiting different saurian habitats. Light combat + observation objectives.", rewards:"Primogems · Adv EXP · Mora · saurian almanac entries", game8:"https://game8.co/games/Genshin-Impact/archives/470263" },

  { id:13, tier:3, chain:"story", name:"Mavuika — As the Blazing Sun", time:"45-60 min", region:"Natlan — Stadium of Sacred Flame", activate:"Story Quest menu. Spend 1 Story Key. Find Mavuika in the Stadium.", prereqs:"AR 40 + AQ Ch V Act V 'Incandescent Ode of Resurrection' + 1 Story Key (released v5.3)", notes:"Sol Invictus Chapter — Act I. Mavuika's first independent Story Quest. Time-limited bonus rewards if completed during the 'As the Blazing Sun' event window (now past for new players).", rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Mavuika ascension materials", game8:"https://game8.co/games/Genshin-Impact/archives/491942" },
  { id:14, tier:3, chain:"standalone", name:"Someday, We All Must Walk Alone", time:"30-45 min", region:"Sulfurous Veins area (Masters of the Night-Wind)", activate:"Find the marked NPC at the Sulfurous Veins.", prereqs:"Masters of the Night-Wind Tribal Chronicle started", notes:"Mid-length quest tied to Night-Wind spirit lore. Moderate combat + Night-Realm puzzles.", rewards:"Primogems · Adv EXP · Mora · Hero's Wit", game8:"https://game8.co/games/Genshin-Impact/archives/507447" },
  { id:15, tier:3, chain:"standalone", name:"Open Your Heart To Me", time:"30-45 min", region:"Natlan — multiple stops", activate:"Triggered by Natlan exploration progress + Saurian companion familiarity.", prereqs:"Natlan exploration + Saurian companion bond raised", notes:"Multi-step quest culminating in the 'Devoted to Eternal Serenity' achievement.", rewards:"Primogems · Achievement: Devoted to Eternal Serenity · Adv EXP · Mora", fandom:"https://genshin-impact.fandom.com/wiki/Open_Your_Heart_To_Me" },

  { id:16, tier:4, chain:"saurian", name:"In the Footsteps of the Chosen Dragons (10 quests)", time:"2-4 hours (full set, in any order)", region:"Natlan — across all tribal regions", activate:"Each of the 10 sub-quests auto-triggers at a specific saurian landmark.", prereqs:"Natlan + Saurian companion unlocked", notes:"10 standalone world quests, can be done in any order. Each highlights one of the saurian species you can ride. Critical for unlocking the full Saurian companion roster.", rewards:"Primogems (~20-40 each, ~300+ total) · Saurian companion gadgets · achievements", fandom:"https://genshin-impact.fandom.com/wiki/In_the_Footsteps_of_the_Chosen_of_Dragons" },
  { id:17, tier:4, chain:"standalone", name:"Revelations from the Past", time:"60-90 min", region:"Stadium of Sacred Flame + ancient ruins", activate:"Late AQ progression auto-triggers this chain.", prereqs:"AQ Ch V late progression", notes:"Long lore-heavy chain about pre-Cataclysm Natlan. Several boss-tier encounters.", rewards:"Primogems · Adv EXP · Mora · Hero's Wit · major lore unlocks", fandom:"https://genshin-impact.fandom.com/wiki/Revelations_from_the_Past" },
  { id:18, tier:4, chain:"standalone", name:"Pilgrimage of the Return of the Sacred Flame", time:"60-90 min", region:"Stadium of Sacred Flame", activate:"Late AQ progression auto-triggers this.", prereqs:"Natlan AQ Act IV+ progression", notes:"Ceremonial chain. Cinematic, dialogue-driven, sets up later character / story content.", rewards:"Primogems · Adv EXP · Mora · Hero's Wit · ceremonial unlocks", fandom:"https://genshin-impact.fandom.com/wiki/Pilgrimage_of_the_Return_of_the_Sacred_Flame_(Quest)" },
  { id:19, tier:4, chain:"standalone", name:"Natlan World Quests — Full Region", time:"15-25 hours (full ~48-quest set)", region:"All of Natlan", activate:"Natural progression as you explore. World quests pop on the map as you approach NPCs.", prereqs:"AR 30+ · Natlan unlocked · Statues of the Seven cycled", notes:"Natlan ships with ~48 permanent world quests per Game8 — this entry summarises the rest beyond what's individually listed above. Estimated 1,500-2,000 primogems for full clear.", rewards:"~1,500-2,000 Primogems · ~150,000+ Mora · Hero's Wit · MEO · Saurian companion gadgets · achievements", game8:"https://game8.co/games/Genshin-Impact/archives/470500" },
];

const orderNote = [
  { step:1, text:"Quick wins: Natlan! A New Adventure (intro) → Lost in the Woods → Little One (naming) → Tepetlisaurus Hide-and-Seek. All four are short and chain together — they unlock the Saurian companion system that gates a lot of later Natlan content." },
  { step:2, text:"Tribal Chronicles are Natlan's reputation-style backbone (one per tribe). Pick them up as you visit each tribe's home; each gives crafting / domain / mobility unlocks beyond the primogems." },
  { step:3, text:"Saurian companion line: A Saurian Returns to the Nest → A Saurian Lover's Ordinary Days → In the Footsteps of the Chosen Dragons (10 sub-quests, any order). Tier 4 entry alone is worth ~300 primo and unlocks every ride-able dragon." },
  { step:4, text:"Mavuika's Story Quest is gated by AQ Ch V Act V (Incandescent Ode of Resurrection) — finish the main story before spending a Story Key on it." },
  { step:5, text:"Pilgrimage / Revelations are late-AQ chains. Don't go for them before completing Acts IV / V of Chapter V." },
  { step:6, text:"This tracker enumerates the well-documented chains. The 'Natlan World Quests — Full Region' Tier 4 entry covers the remaining ~30 short side-stories per tribe that aren't individually listed." },
];

const config = {
  title: "Natlan World Quests",
  subtitleLabel: "Tribal Chronicles · Story Quests · Hangouts — primogem-bearing",
  logoEmoji: "🌋",
  completeEmoji: "🌋✨",
  completeTitle: "ALL NATLAN QUESTS COMPLETE",
  completeMessage: "The Sacred Flame remembers your tribe, Traveler.",
  storageKey: "natlan-quest-tracker-v1",
  tiers, chainTags, quests, orderNote,
  theme: {
    pageBg:           "linear-gradient(160deg,#1a0703 0%,#3a1308 40%,#552010 100%)",
    headerBg:         "rgba(15,4,2,0.97)",
    pattern1:         "rgba(254,202,87,0.06)",
    pattern2:         "rgba(220,38,38,0.06)",
    cardBg:           "linear-gradient(135deg,rgba(40,15,8,0.92),rgba(28,8,4,0.92))",
    logoBg:           "linear-gradient(135deg,#dc2626,#7c1d1d)",
    titleGradient:    "linear-gradient(135deg,#fff7ed 0%,#fb923c 50%,#9a3412 100%)",
    progressGradient: "linear-gradient(90deg,#7c2d12,#dc2626,#fb923c)",
    textPrimary:      "#ffedd5",
    textBright:       "#fff7ed",
    textRgb:          [255, 237, 213],
    accent:           "#fb923c",
    accentRgb:        [251, 146, 60],
  },
};

export default function NatlanQuests() {
  return <RegionQuestTracker config={config} />;
}
