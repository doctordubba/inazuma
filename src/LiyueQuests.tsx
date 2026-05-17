import RegionQuestTracker from "./RegionQuestTracker";

/* ============================================================
   LIYUE QUEST DATA
   World Quests + Story Quests + Hangouts that reward primogems.
   Archon Quests intentionally excluded per scope.
   Sources: Game8, Fandom Wiki, GameWith (cross-checked May 2026).
   ============================================================ */

const tiers = [
  { id:1, label:"Tier 1", sublabel:"Very Fast",    time:"5-15 min",  color:"#93c5fd", bg:"rgba(147,197,253,0.07)", border:"rgba(147,197,253,0.22)", glow:"rgba(147,197,253,0.12)", icon:"🏮" },
  { id:2, label:"Tier 2", sublabel:"Short",        time:"15-30 min", color:"#67e8f9", bg:"rgba(103,232,249,0.07)", border:"rgba(103,232,249,0.22)", glow:"rgba(103,232,249,0.12)", icon:"⛩" },
  { id:3, label:"Tier 3", sublabel:"Medium",       time:"30-60 min", color:"#a5b4fc", bg:"rgba(165,180,252,0.07)", border:"rgba(165,180,252,0.22)", glow:"rgba(165,180,252,0.12)", icon:"⚖" },
  { id:4, label:"Tier 4", sublabel:"Long / Gated", time:"60 min+",   color:"#c4b5fd", bg:"rgba(196,181,253,0.07)", border:"rgba(196,181,253,0.22)", glow:"rgba(196,181,253,0.12)", icon:"🐉" },
];

const chainTags = {
  story:       { label:"Story Quest",       color:"#06b6d4" },
  hangout:     { label:"Hangout Event",     color:"#ec4899" },
  chasm:       { label:"The Chasm",         color:"#a78bfa" },
  chenyu:      { label:"Chenyu Vale",       color:"#10b981" },
  standalone:  { label:"Standalone",        color:"#64748b" },
};

const quests = [
  // ───────── TIER 1 — VERY FAST (5-15 min) ─────────
  { id:1, tier:1, chain:"standalone", name:"A Little Game", time:"5-10 min", region:"Liyue Harbor — Wanmin Restaurant area", activate:"Talk to the child NPC near Wanmin Restaurant in Liyue Harbor.", prereqs:"Liyue Harbor accessible", notes:"Pure dialogue / hide-and-seek mini-quest with a child NPC in the harbor. Fastest Liyue primogem quest on the list.", rewards:"30 Primogems · Adv EXP · Mora", fandom:"https://genshin-impact.fandom.com/wiki/A_Little_Game" },
  { id:2, tier:1, chain:"standalone", name:"And This Treasure Goes To...", time:"10-15 min", region:"Lingju Pass (north of Liyue Harbor)", activate:"Approach an empty Treasure Hoarder camp at Lingju Pass — quest auto-starts.", prereqs:"Lingju Pass accessible", notes:"Decide which of two squabbling Treasure Hoarders deserves the treasure. Light combat then a quick dialogue choice.", rewards:"40 Primogems · Adv EXP · Mora", fandom:"https://genshin-impact.fandom.com/wiki/And_This_Treasure_Goes_To..." },
  { id:3, tier:1, chain:"standalone", name:"Luhua Landscape", time:"10-15 min", region:"Luhua Pool", activate:"Speak with the painter Vermeer at Luhua Pool.", prereqs:"Luhua Pool accessible", notes:"Vermeer gives you two paintings — retrieve his tools from the scene depicted in each painting. Light puzzle / fetch quest.", rewards:"50 Primogems · Adv EXP · Mora", fandom:"https://genshin-impact.fandom.com/wiki/Luhua_Landscape" },
  { id:4, tier:1, chain:"chenyu", name:"Our Chenyu Vale Trek", time:"10-15 min", region:"Chenyu Vale (multiple sites)", activate:"Triggers progressively as you visit landmarks around Chenyu Vale (Lower + Upper).", prereqs:"Chenyu Vale region unlocked (4.4+)", notes:"Exploration check-list framed as a trek. Stops by all the marquee Chenyu vistas; finishes the 'Chenyu Vale Sights' achievement.", rewards:"30 Primogems · Adv EXP · Mora · Chenyu Vale Sights achievement", game8:"https://game8.co/games/Genshin-Impact/archives/407274" },

  // ───────── TIER 2 — SHORT (15-30 min) ─────────
  { id:5, tier:2, chain:"standalone", name:"Primo Geovishap", time:"15-25 min", region:"Tianqiu Valley (mountain ridge between Stone Forest and Wuwang Hill)", activate:"Reach the Primo Geovishap arena on Tianqiu Valley's ridge. Engage the boss to trigger the world-quest registration.", prereqs:"Liyue accessible · party ready for a boss fight (AR ≥ 35 recommended)", notes:"World-Boss-style arena that also counts as a world quest first time. Drops Juvenile Jade (Xiao / Yelan ascension material) on every clear; the world-quest primogems only land the first time.", rewards:"30 Primogems (first clear) · Adv EXP · Mora · Juvenile Jade · weapon/character ascension drops", fandom:"https://genshin-impact.fandom.com/wiki/Primo_Geovishap" },
  { id:6, tier:2, chain:"standalone", name:"The Tree Who Stands Alone", time:"15-25 min", region:"Qingce Village (northern Liyue)", activate:"Talk to Granny Ruoxin near the lone tree on the hill above Qingce Village.", prereqs:"Qingce Village accessible", notes:"Help an elderly villager recover memories tied to an old tree. Light combat + dialogue.", rewards:"50 Primogems · Adv EXP · Mora", fandom:"https://genshin-impact.fandom.com/wiki/The_Tree_Who_Stands_Alone" },
  { id:7, tier:2, chain:"standalone", name:"Nine Pillars of Peace", time:"20-30 min", region:"Cuijue Slope (south of Liyue Harbor)", activate:"Visit Cuijue Slope after fully leveling up the Liyue Statue of the Seven (the statue gates the pillars puzzle).", prereqs:"Liyue Statue of the Seven fully leveled · party ready for a 3-stage domain", notes:"Place geocullus stones in the nine pillars to open the sealed domain. Boss layout: 1× Ruin Guard, several Geovishap Hatchlings, finishing with a Ruin Hunter.", rewards:"50 Primogems · Adv EXP · Mora · Hero's Wit · Mystic Enhancement Ore", game8:"https://game8.co/games/Genshin-Impact/archives/305610" },
  { id:8, tier:2, chain:"chasm", name:"Chasm Spelunkers", time:"20-30 min", region:"The Chasm — surface camp + mines entrance", activate:"Talk to Muning at the Chasm Surface Adventurer Camp. Part of The Chasm Delvers series.", prereqs:"The Chasm region accessible · The Chasm Charters started", notes:"Help the Chasm survey team start mapping the underground. Required gate quest into the Chasm Delvers chain (which then unlocks Surreptitious Seven-Star Seal Sundering, First Miasmic Contact, and the rest).", rewards:"30 Primogems · 200 AR EXP · 20,000 Mora · 2 Hero's Wit · 1 Lumenstone Ore", game8:"https://game8.co/games/Genshin-Impact/archives/372643" },

  // ───────── TIER 3 — MEDIUM (30-60 min) ─────────
  { id:9, tier:3, chain:"standalone", name:"The Chi of Guyun", time:"30-45 min", region:"Guyun Stone Forest (south Liyue coast)", activate:"Reach Guyun Stone Forest. Investigate the four scattered stone tablets.", prereqs:"Guyun Stone Forest accessible", notes:"Multi-stop puzzle reading four scattered stelae, each guarded. The final stop spawns a small set of waves. Decent payoff for the time.", rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit", fandom:"https://genshin-impact.fandom.com/wiki/The_Chi_of_Guyun" },
  { id:10, tier:3, chain:"standalone", name:"Treasure Lost, Treasure Found", time:"30-45 min", region:"Lingju Pass / Dunyu Ruins", activate:"Talk to the Treasure Hoarder Soraya at Lingju Pass after Mondstadt Chapter completion.", prereqs:"Prologue Chapter completed · Lingju Pass accessible", notes:"Early Liyue intro quest. Three-act mini-chain: investigate Hoarder ledgers, fetch artefacts across the area, then a brief showdown.", rewards:"80 Primogems (highest single Liyue world-quest payout) · Adv EXP · Mora · Hero's Wit", fandom:"https://genshin-impact.fandom.com/wiki/Treasure_Lost,_Treasure_Found" },
  { id:11, tier:3, chain:"story", name:"Zhongli I — Sal Flore", time:"40-50 min", region:"Liyue Harbor → Mt. Tianheng", activate:"Story Quest menu. Spend 1 Story Key. Take Katheryne's Adventurers' Guild commission.", prereqs:"AR 32 + Liyue Archon Quest Act III completed + 1 Story Key", notes:"Historia Antiqua Chapter — Act I. Walk Liyue's funerary customs with Zhongli; mostly dialogue with a few light combat beats.", rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Zhongli ascension materials", game8:"https://game8.co/games/Genshin-Impact/archives/311299" },
  { id:12, tier:3, chain:"story", name:"Zhongli II — No Mere Stone", time:"45-60 min", region:"Liyue Harbor → Jueyun Karst → Dunyu Ruins", activate:"Story Quest menu. Spend 1 Story Key. Take the new Katheryne commission after Act I.", prereqs:"AR 40 + Historia Antiqua Act I (Sal Flore) + AQ Ch I Act IV 'We Will Be Reunited' + 1 Story Key", notes:"Historia Antiqua Chapter — Act II. Investigate missing miners; the trail leads to one of Zhongli's old contracts. Released in 1.5.", rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit", game8:"https://game8.co/games/Genshin-Impact/archives/328779" },
  { id:13, tier:3, chain:"story", name:"Hu Tao — Yet the Butterfly Flutters Away", time:"45-60 min", region:"Liyue Harbor — Wangsheng Funeral Parlor → Wuwang Hill", activate:"Story Quest menu. Spend 1 Story Key. Hu Tao is waiting near Wangsheng Funeral Parlor.", prereqs:"AR 40 + 'Yakshas: The Guardian Adepti' (Xiao Story Quest Act I) + 1 Story Key", notes:"Papilio Charontis Chapter — Act I. The Wangsheng Funeral Parlor on a working day. Quiet horror tones, escort through Wuwang Hill, lots of memorable dialogue.", rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Hu Tao ascension materials", game8:"https://game8.co/games/Genshin-Impact/archives/321338" },
  { id:14, tier:3, chain:"story", name:"Xiao — Butterfly's Dream", time:"45-60 min", region:"Wangshu Inn → Dihua Marsh", activate:"Story Quest menu. Spend 1 Story Key. Find Xiao at Wangshu Inn's top floor.", prereqs:"AR 32 + AQ Ch I Act III + 1 Story Key", notes:"Alatus Chapter — Act I. Yaksha lore, Xiao's old battles, and the Karma that follows him. Heavier combat than most Story Quests.", rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Xiao ascension materials", fandom:"https://genshin-impact.fandom.com/wiki/Alatus_Chapter" },
  { id:15, tier:3, chain:"story", name:"Childe — Father and Son", time:"45-60 min", region:"Liyue Harbor → Mt. Aozang", activate:"Story Quest menu. Spend 1 Story Key. Childe is waiting near Northland Bank in Liyue Harbor.", prereqs:"AR 32 + AQ Ch I Act III + 1 Story Key", notes:"Monoceros Caeli Chapter — Act I. Childe's little brother Teucer visits Liyue. Comedic on the surface, with the inevitable Fatui edge underneath.", rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit", fandom:"https://genshin-impact.fandom.com/wiki/Monoceros_Caeli_Chapter" },
  { id:16, tier:3, chain:"story", name:"Ningguang — Sal Terrae", time:"45-60 min", region:"Liyue Harbor — Jade Chamber", activate:"Story Quest menu. Spend 1 Story Key. Pick up the quest at Northland Bank.", prereqs:"AR 32 + AQ Ch I Act III + 1 Story Key", notes:"Lapis Dei Chapter — Act I. Politics, gossip, and a quiet display of why Ningguang runs Liyue's commerce. Mostly investigation + dialogue.", rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Ningguang ascension materials", fandom:"https://genshin-impact.fandom.com/wiki/Lapis_Dei_Chapter" },
  { id:17, tier:3, chain:"story", name:"Keqing — Driving Thunder", time:"45-60 min", region:"Liyue Harbor → Yujing Terrace", activate:"Story Quest menu. Spend 1 Story Key. Keqing summons you to Yujing Terrace.", prereqs:"AR 40 + AQ Ch I Act III + 1 Story Key", notes:"Trail of Drake and Serpent — Act I. Keqing investigates a smuggling case; her Mondstadt-meets-Liyue worldview gets the spotlight. Reward 4★, but the writing is top-shelf.", rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Keqing ascension materials", fandom:"https://genshin-impact.fandom.com/wiki/Trail_of_Drake_and_Serpent" },

  // ───────── TIER 4 — LONG / GATED (60 min+) ─────────
  { id:18, tier:4, chain:"story", name:"Ganyu — Sea of Clouds, Sea of People", time:"60-90 min", region:"Liyue Harbor → Jueyun Karst", activate:"Story Quest menu. Spend 1 Story Key. Ganyu is at Yujing Terrace.", prereqs:"AR 40 + AQ Ch I Act III + 1 Story Key", notes:"Sinae Unicornis Chapter — Act I. Ganyu introduces you to the older adepti of Jueyun Karst. Long, dialogue-heavy, sets up most of the Adepti lore that pays off in Xianyun's release.", rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Ganyu ascension materials", fandom:"https://genshin-impact.fandom.com/wiki/Sinae_Unicornis_Chapter" },
  { id:19, tier:4, chain:"story", name:"Yelan — Calculated Gambit", time:"60-90 min", region:"Liyue Harbor → Yilong Wharf → Chasm surface", activate:"Story Quest menu. Spend 1 Story Key. Yelan finds you at Yilong Wharf.", prereqs:"AR 40 + Ganyu's 'Sea of Clouds, Sea of People' + AQ Interlude 'Perilous Trail' (2.7) + 1 Story Key", notes:"Umbrabilis Orchis Chapter — Act I. A heist with the Ministry of Civil Affairs' best ghost. Heavily gated by other content — clear the prereq chain first.", rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Yelan ascension materials", game8:"https://game8.co/games/Genshin-Impact/archives/377476" },
  { id:20, tier:4, chain:"hangout", name:"Chongyun — Signs of Evil (Act I)", time:"60-90 min (all 6 endings)", region:"Liyue Harbor — Wangsheng / Bubu Pharmacy area", activate:"Hangout menu. Spend 2 Story Keys per playthrough. Find Chongyun near Bubu Pharmacy.", prereqs:"AR 26 + Prologue Ch III + Story Keys", notes:"First Liyue Hangout released (v1.4). Six endings; multiple playthroughs needed for full primogem haul. Yin/yang gimmick runs through every branch.", rewards:"~90 Primogems total (60 from endings + 30 from achievements) · Special Dish · Adv EXP · Hero's Wit · Chongyun ascension materials", game8:"https://game8.co/games/Genshin-Impact/archives/323219" },
  { id:21, tier:4, chain:"hangout", name:"Yun Jin — A Song That Knows Grace (Act I)", time:"60-90 min (all endings)", region:"Liyue Harbor — Heyu Tea House", activate:"Hangout menu. Spend 2 Story Keys per playthrough. Find Yun Jin at Heyu Tea House.", prereqs:"AR 26 + Prologue Ch III + Story Keys", notes:"Added in v2.3. Liyue opera framing; you help Yun Jin work on the next show. Multiple endings, replays via the menu.", rewards:"~90 Primogems total (endings + achievements) · Special Dish · Adv EXP · Hero's Wit", fandom:"https://genshin-impact.fandom.com/wiki/Hangout_Event/Yun_Jin" },
];

const orderNote = [
  { step:1, text:"Quick wins: A Little Game (5 min, 30 primo) and And This Treasure Goes To... (10 min, 40 primo) are the best primogem-per-minute opens." },
  { step:2, text:"Treasure Lost, Treasure Found is the standout solo world quest — 80 primogems, the largest single-quest payout in Liyue." },
  { step:3, text:"Cuijue Slope side quest stack: do The Tree Who Stands Alone + Nine Pillars of Peace in one Qingce/Cuijue trip." },
  { step:4, text:"Story Quest order (gated): Xiao first → Hu Tao (needs Xiao) → Zhongli I → Zhongli II (needs Zhongli I + AQ Ch I Act IV). Ganyu → Yelan (Yelan needs Ganyu + the 2.7 Interlude AQ 'Perilous Trail')." },
  { step:5, text:"The Chasm chain starts with Chasm Charters → Chasm Spelunkers. Surreptitious Seven-Star Seal Sundering, First Miasmic Contact, and the rest unlock from there — set aside an evening for the full underground delve." },
  { step:6, text:"Hangouts cost 2 Story Keys per playthrough; save them for after the Story Quests so you only spend keys on permanent unlocks first." },
  { step:7, text:"Primo Geovishap counts as a world quest the first time you defeat it — the primogems only land on first clear, after that it's a normal world boss." },
];

const config = {
  title: "Liyue World Quests",
  subtitleLabel: "World Quests · Story Quests · Hangouts — primogem-bearing",
  logoEmoji: "🏮",
  completeEmoji: "🏮✨",
  completeTitle: "ALL LIYUE QUESTS COMPLETE",
  completeMessage: "Rex Lapis carves your contract in stone, Traveler.",
  storageKey: "liyue-quest-tracker-v1",
  tiers, chainTags, quests, orderNote,
  theme: {
    pageBg:           "linear-gradient(160deg,#1a0a02 0%,#2d1a06 40%,#3d2410 100%)",
    headerBg:         "rgba(15,8,2,0.97)",
    pattern1:         "rgba(253,224,71,0.06)",
    pattern2:         "rgba(217,119,6,0.06)",
    cardBg:           "linear-gradient(135deg,rgba(40,22,8,0.92),rgba(28,16,6,0.92))",
    logoBg:           "linear-gradient(135deg,#d97706,#7c2d12)",
    titleGradient:    "linear-gradient(135deg,#fff4d6 0%,#fbbf24 50%,#b45309 100%)",
    progressGradient: "linear-gradient(90deg,#7c2d12,#d97706,#fbbf24)",
    textPrimary:      "#fff4d6",
    textBright:       "#fff4d6",
    textRgb:          [255, 244, 214],
    accent:           "#fbbf24",
    accentRgb:        [251, 191, 36],
  },
};

export default function LiyueQuests() {
  return <RegionQuestTracker config={config} />;
}
