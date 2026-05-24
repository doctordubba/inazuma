import RegionQuestTracker from "./RegionQuestTracker";

/* ============================================================
   SUMERU QUEST DATA
   World Quests + Story Quests + Hangouts that reward primogems.
   Archon Quests intentionally excluded per scope. Sumeru has
   100+ world quests in total; this tracker focuses on the major
   verified chains. Sources: Game8, Fandom Wiki, GameWith.
   ============================================================ */

const tiers = [
  { id:1, label:"Tier 1", sublabel:"Very Fast",    time:"5-15 min",  color:"#93c5fd", bg:"rgba(147,197,253,0.07)", border:"rgba(147,197,253,0.22)", glow:"rgba(147,197,253,0.12)", icon:"🌿" },
  { id:2, label:"Tier 2", sublabel:"Short",        time:"15-30 min", color:"#67e8f9", bg:"rgba(103,232,249,0.07)", border:"rgba(103,232,249,0.22)", glow:"rgba(103,232,249,0.12)", icon:"📜" },
  { id:3, label:"Tier 3", sublabel:"Medium",       time:"30-60 min", color:"#a5b4fc", bg:"rgba(165,180,252,0.07)", border:"rgba(165,180,252,0.22)", glow:"rgba(165,180,252,0.12)", icon:"⚖" },
  { id:4, label:"Tier 4", sublabel:"Long / Gated", time:"60 min+",   color:"#c4b5fd", bg:"rgba(196,181,253,0.07)", border:"rgba(196,181,253,0.22)", glow:"rgba(196,181,253,0.12)", icon:"🌳" },
];

const chainTags = {
  story:      { label:"Story Quest",         color:"#06b6d4" },
  hangout:    { label:"Hangout Event",       color:"#ec4899" },
  aranyaka:   { label:"Aranyaka",            color:"#84cc16" },
  golden:     { label:"Golden Slumber line", color:"#fbbf24" },
  desert:     { label:"Desert (Bilqis)",     color:"#f59e0b" },
  khvarena:   { label:"Khvarena",            color:"#a78bfa" },
  standalone: { label:"Standalone",          color:"#64748b" },
};

const quests = [
  { id:1, tier:1, chain:"standalone", name:"The Coming of the Sabzeruz Festival", time:"10-15 min", region:"Sumeru City — main square", activate:"Auto-triggers shortly after arriving in Sumeru City for the first time. Talk to Nahida-related NPCs in the square.", prereqs:"AQ Chapter III Act I 'Through Mists of Smoke and Forests Dark' accepted", notes:"Short intro chain into Sumeru's first major puzzle: the time-looped festival. Mostly dialogue and a brief Akasha terminal interaction. Gateway to several deeper Sumeru quests.", rewards:"Primogems · Adv EXP · Mora · Akasha Terminal introduction", fandom:"https://genshin-impact.fandom.com/wiki/The_Coming_of_the_Sabzeruz_Festival" },

  { id:2, tier:2, chain:"aranyaka", name:"Aranyaka I — Woodland Encounter", time:"20-30 min", region:"Avidya Forest — Gandharva Ville", activate:"Talk to Rana near Gandharva Ville. She'll lead you to meet an Aranara.", prereqs:"AQ Chapter III Act II accessible · Gandharva Ville unlocked", notes:"Opening chapter of the Aranyaka super-chain. Rhythm puzzle introduction, meets Arama, and unlocks the rest of Vanarana. The whole Aranyaka mega-chain totals ~640 primogems across four parts — start here.", rewards:"Primogems (~150 for Part I alone) · Adv EXP · Mora · Hero's Wit · Garland accessory · gateway to Parts II / III / IV", heroWit: 3, game8:"https://game8.co/games/Genshin-Impact/archives/386471" },
  { id:3, tier:2, chain:"khvarena", name:"Khvarena of Good and Evil — entry chain", time:"20-30 min", region:"Sumeru Desert — Tunigi Hollow", activate:"Investigate the Tunigi Hollow area after Sumeru's 3.6 patch desert expansion is unlocked.", prereqs:"Sumeru Desert expansion (3.6+) accessible", notes:"Opens the Khvarena chain (Light Realm Pilgrimage → Asipattravana Bisects the Plain → A Forerunner Sent from Light). Multi-part chain; this entry is the short hook before things get long.", rewards:"Primogems · Adv EXP · Mora · Hero's Wit · Sorush companion gadget (chain reward)", fandom:"https://genshin-impact.fandom.com/wiki/Khvarena_of_Good_and_Evil" },

  { id:4, tier:3, chain:"story", name:"Tighnari — Through the Mists of Smoke and Forests", time:"30-45 min", region:"Avidya Forest — near Pardis Dhyai", activate:"Story Quest menu. Spend 1 Story Key. Find Tighnari at Pardis Dhyai.", prereqs:"AR 32 + AQ Ch III Act II 'The Morn a Thousand Roses Brings' + 1 Story Key", notes:"Vultur Volans Chapter — Act I. Tighnari investigates a withering tree. Light combat, lots of forest navigation. Released in 3.0.", rewards:"60 Primogems · ~2,025 Adv EXP · ~128,225 Mora · 5 Guide to Admonition · 27 Mystic Enhancement Ore · 12 Hero's Wit · Tighnari ascension materials", mora: 128225, heroWit: 12, fandom:"https://genshin-impact.fandom.com/wiki/Vultur_Volans_Chapter" },
  { id:5, tier:3, chain:"story", name:"Nilou — To the Wise", time:"45-60 min", region:"Sumeru City — Grand Bazaar", activate:"Story Quest menu. Spend 1 Story Key. Find Nilou at Zubayr Theater (Grand Bazaar).", prereqs:"AR 40 + AQ Ch III Act IV + 1 Story Key", notes:"Lotos Somno Chapter — Act I. Help Nilou debate the Akademiya scholars over the cultural value of dance. Heavy on choice-based dialogue (debate answers matter). Released in 3.1.", rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Nilou ascension materials", mora: 26925, heroWit: 3, game8:"https://game8.co/games/Genshin-Impact/archives/390093" },
  { id:6, tier:3, chain:"story", name:"Nahida — Lingering Warmth", time:"45-60 min", region:"Sumeru City → Sumeru Akademiya → Devantaka Mountain", activate:"Story Quest menu. Spend 1 Story Key. Nahida finds you at Sumeru City.", prereqs:"AR 40 + AQ Ch III Act V 'Akasha Pulses, the Kalpa Flame Rises' + 1 Story Key", notes:"Sapientia Oromasdis Chapter — Act I. Nahida pulls you through dreams of Sumeru's late Sage. Heavy lore, several dream-segment puzzles. Released in 3.2.", rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Nahida ascension materials", mora: 26925, heroWit: 3, game8:"https://game8.co/games/Genshin-Impact/archives/394341" },
  { id:7, tier:3, chain:"story", name:"Alhaitham — Illusions of the Mob", time:"45-60 min", region:"Sumeru City — Akademiya", activate:"Story Quest menu. Spend 1 Story Key. Find Alhaitham in the Akademiya plaza.", prereqs:"AR 40 + AQ Ch III Act V + 1 Story Key", notes:"Vultur Volans Chapter — Act II (Alhaitham's standalone Act under the shared chapter banner). Released in 3.4. Investigation + a few combat encounters; trademark Alhaitham deadpan throughout.", rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Alhaitham ascension materials", mora: 26925, heroWit: 3, game8:"https://game8.co/games/Genshin-Impact/archives/401826" },
  { id:8, tier:3, chain:"story", name:"Cyno — Lupus Aureus Chapter Act I", time:"45-60 min", region:"Sumeru City → Aaru Village", activate:"Story Quest menu. Spend 1 Story Key. Find Cyno at Sumeru City; he forwards you to the desert.", prereqs:"AR 40 + AQ Ch III Act IV + 1 Story Key", notes:"Lupus Aureus Chapter — Act I. Cyno investigates a string of desert disappearances. Standard 5★ Story Quest pace; combat-friendly. Released in 3.1.", rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Cyno ascension materials", mora: 26925, heroWit: 3, fandom:"https://genshin-impact.fandom.com/wiki/Lupus_Aureus_Chapter" },
  { id:9, tier:3, chain:"story", name:"Dehya — A Parade of Providence", time:"45-60 min", region:"Sumeru Desert — Aaru Village → Caravan Ribat", activate:"Story Quest menu. Spend 1 Story Key. Find Dehya near Aaru Village.", prereqs:"AR 40 + AQ Ch III Act V + 1 Story Key", notes:"Iudex Iniquitatis Chapter — Act I. Dehya tracks down an Eremite plot. Combat-heavy by Story Quest standards. Released in 3.5.", rewards:"60 Primogems · ~1,750 Adv EXP · ~115,325 Mora · 5 Guide to Praxis · 24 Mystic Enhancement Ore · 13 Hero's Wit · Dehya ascension materials", mora: 115325, heroWit: 13, fandom:"https://genshin-impact.fandom.com/wiki/Iudex_Iniquitatis_Chapter" },
  { id:10, tier:3, chain:"story", name:"Wanderer (Scaramouche) — Inversion of Genesis", time:"45-60 min", region:"Sumeru — across multiple regions (Akademiya, Devantaka, Desert)", activate:"Story Quest menu. Spend 1 Story Key. Find Nahida at Sumeru City; she summons the Wanderer.", prereqs:"AR 40 + Nahida Story Quest (Lingering Warmth) + AQ Ch III Interlude 'Inversion of Genesis' + 1 Story Key", notes:"Homo Castaneum Chapter — Act I (released 3.3). Heavy story-driven; Wanderer's first independent quest as a playable character. Gated by Nahida's Story Quest + the 'Inversion of Genesis' Interlude AQ.", rewards:"60 Primogems · Adv EXP · Mora · Hero's Wit · Wanderer ascension materials", mora: 26925, heroWit: 3, fandom:"https://genshin-impact.fandom.com/wiki/Homo_Castaneum_Chapter" },

  { id:11, tier:4, chain:"aranyaka", name:"Aranyaka — Full Chain (Parts I-IV)", time:"6-10 hours (full series)", region:"Avidya Forest — Gandharva Ville, Vanarana, dream realms", activate:"After completing Aranyaka I (Woodland Encounter), continue with Part II (Dream Nursery), Part III (Nursery of Lost Dreams), Part IV (In the End, the Forest Will Remember).", prereqs:"Aranyaka I done · AR 30+ · Vanarana access", notes:"The biggest single world-quest series in the game. 9 quest chains spread across 40-45 world quests. Stories of You and the Aranara collectible drops along the way. Pace yourself — this is multi-session content.", rewards:"~640 Primogems total · 5,050 Adv EXP · 510,000 Mora · 39 Mystic Enhancement Ore · 39 Hero's Wit · multiple Aranara collectibles · Vasoma Fruit · Garland", mora: 510000, heroWit: 39, game8:"https://game8.co/games/Genshin-Impact/archives/386471" },
  { id:12, tier:4, chain:"golden", name:"Golden Slumber", time:"3-4 hours (full chain)", region:"Sumeru Desert — Great Red Sand → King Deshret's Mausoleum", activate:"Talk to Bonifaz in Aaru Village, then meet his crew at the Great Red Sand mausoleum entrance.", prereqs:"Sumeru Desert accessible (3.1+) · AR 35+ recommended", notes:"The Khaenri'ah-era ruin chain that pulls you through Sumeru Desert's deeper lore. Many puzzles, several boss fights, big payoff. Direct prerequisite for the Dirge of Bilqis chain.", rewards:"~190 Primogems · 170,000 Mora · 16 Hero's Wit · 16 Mystic Enhancement Ore · Sorush-line lore unlocks", mora: 170000, heroWit: 16, game8:"https://game8.co/games/Genshin-Impact/archives/391599" },
  { id:13, tier:4, chain:"golden", name:"Old Notes and New Friends", time:"2-3 hours (full chain)", region:"Sumeru Desert — Great Red Sand, Duat Hall", activate:"Auto-continues after Golden Slumber. Bonifaz's crew has more questions.", prereqs:"Golden Slumber chain completed", notes:"Direct sequel chain to Golden Slumber. Investigates deeper into the Mausoleum's Duat Hall — Dual Evidence puzzle is a known sticking point (use the linked Game8 guide).", rewards:"Primogems · Adv EXP · Mora · Hero's Wit · Mystic Enhancement Ore", game8:"https://game8.co/games/Genshin-Impact/archives/391598" },
  { id:14, tier:4, chain:"desert", name:"The Dirge of Bilqis", time:"3-4 hours (full chain)", region:"Sumeru Desert — Temple of Silence + Wisdom + Tears", activate:"After Golden Slumber + Old Notes and New Friends, the Dirge auto-starts at the desert temples.", prereqs:"Golden Slumber + Old Notes and New Friends + 3.4 patch unlocked", notes:"Six mini-quests: Wisdom Has Built Her House → The Temple Where Sand Flows Like Tears → Dune-Entombed Fecundity I/II/III → The Eternal Dream, Ever Lush. Around 50 primogems each.", rewards:"~250 Primogems total · 225,000 Mora · 17 Hero's Wit · 20 Mystic Enhancement Ore", mora: 225000, heroWit: 17, game8:"https://game8.co/games/Genshin-Impact/archives/401994" },
  { id:15, tier:4, chain:"khvarena", name:"Khvarena of Good and Evil — Full Chain", time:"3-4 hours (full series)", region:"Sumeru Desert (Girdle of the Sands, 3.6 expansion)", activate:"After Tunigi Hollow entry, follow Sorush through the chain (Light Realm Pilgrimage → Asipattravana → A Forerunner Sent from Light → Vanishing in the Sand-Sea → and more).", prereqs:"Khvarena entry chain done + 3.6+ Sumeru Desert expansion", notes:"Marks the Sand-Sea's pivot from puzzles to lore. Multiple sub-chains; the Sorush companion is unlocked here and used throughout.", rewards:"Primogems (chain-total significant) · Adv EXP · Mora · Hero's Wit · Sorush as permanent gadget · 3.6 Wonders of the World achievements", fandom:"https://genshin-impact.fandom.com/wiki/Khvarena_of_Good_and_Evil" },
  { id:16, tier:4, chain:"hangout", name:"Faruzan — A Recipe for Innovation", time:"60-90 min (all endings)", region:"Sumeru City → Pardis Dhyai", activate:"Hangout menu. Spend 2 Story Keys per playthrough. Find Faruzan at the Akademiya.", prereqs:"AR 26 + Prologue Ch III + Story Keys (Faruzan released v3.3)", notes:"Multi-ending; Faruzan's archaeological-research framing with Tighnari and Cyno cameos. Replays via menu.", rewards:"~90 Primogems total (60 endings + 30 achievements) · Special Dish · Adv EXP · Hero's Wit · Faruzan ascension materials", heroWit: 4, fandom:"https://genshin-impact.fandom.com/wiki/Hangout_Event/Faruzan" },
  { id:17, tier:4, chain:"hangout", name:"Layla — Dream of the Lone Star", time:"60-90 min (all 6 endings)", region:"Sumeru City — Akademiya / dorm area", activate:"Hangout menu. Spend 2 Story Keys per playthrough. Find Layla at the Akademiya.", prereqs:"AR 26 + Prologue Ch III + Story Keys (Layla released v3.2)", notes:"Six endings. The two Laylas — sleep-deprived scholar and confident dream-Layla — drive the comedy. Confirmed 90 primo total via the linked sources.", rewards:"~90 Primogems total · Special Dish · Adv EXP · Hero's Wit · Layla ascension materials", heroWit: 4, fandom:"https://genshin-impact.fandom.com/wiki/Hangout_Event/Layla" },
];

const orderNote = [
  { step:1, text:"Sumeru world quests are mostly LONG CHAINS — there are few quick standalone wins compared to other regions. Block out time for the big ones." },
  { step:2, text:"Aranyaka is the single largest world-quest series in the game (~640 primogems). Start with Aranyaka I (Woodland Encounter) and pace yourself across sessions." },
  { step:3, text:"Desert chain order: Golden Slumber → Old Notes and New Friends → The Dirge of Bilqis. Each gates the next; you cannot do them out of order." },
  { step:4, text:"The Khvarena chain (3.6+ desert expansion) is its own self-contained block in the Girdle of the Sands. Sorush gadget unlocks here for permanent use." },
  { step:5, text:"Story Quest gating: Tighnari first (3.0 intro). Then Nahida (3.2) is gated by AQ Ch III Act V. Wanderer needs Nahida + the 'Inversion of Genesis' Interlude AQ." },
  { step:6, text:"Hangouts cost 2 Story Keys each per playthrough × ~4 replays for all endings. Save them for after you've cleared the gated Story Quests above." },
  { step:7, text:"Sumeru has ~112 permanent world quests per BitTopup — this tracker covers only the heavily-verified major chains. The smaller side-quests around Vimara Village, Aaru Village, and the rest of the desert are real but not yet enumerated here." },
];

const config = {
  title: "Sumeru World Quests",
  subtitleLabel: "World Quests · Story Quests · Hangouts — primogem-bearing",
  logoEmoji: "🌳",
  completeEmoji: "🌳✨",
  completeTitle: "ALL SUMERU QUESTS COMPLETE",
  completeMessage: "The Akasha whispers your name through the canopy, Traveler.",
  storageKey: "sumeru-quest-tracker-v1",
  tiers, chainTags, quests, orderNote,
  theme: {
    pageBg:           "linear-gradient(160deg,#040f08 0%,#0a2916 40%,#11432a 100%)",
    headerBg:         "rgba(3,12,7,0.97)",
    pattern1:         "rgba(132,204,22,0.06)",
    pattern2:         "rgba(22,163,74,0.06)",
    cardBg:           "linear-gradient(135deg,rgba(12,28,18,0.92),rgba(6,20,12,0.92))",
    logoBg:           "linear-gradient(135deg,#65a30d,#14532d)",
    titleGradient:    "linear-gradient(135deg,#ecfccb 0%,#bef264 50%,#3f6212 100%)",
    progressGradient: "linear-gradient(90deg,#14532d,#65a30d,#bef264)",
    textPrimary:      "#dcfce7",
    textBright:       "#ecfccb",
    textRgb:          [220, 252, 231],
    accent:           "#bef264",
    accentRgb:        [190, 242, 100],
  },
};

export default function SumeruQuests() {
  return <RegionQuestTracker config={config} />;
}
