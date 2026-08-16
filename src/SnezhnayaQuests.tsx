import RegionQuestTracker from "./RegionQuestTracker";

/* ============================================================
   SNEZHNAYA QUEST DATA — Version 7.0 "Everwinter Without Mercy"
   (released 12 August 2026)

   COVERAGE WARNING: this is a launch-window snapshot. Snezhnaya
   opened days ago and community documentation is still filling
   in. Verified here: the Chapter VII Archon acts, the three
   Eye of Graeae fragment chains + finale, and 6 standalone world
   quests. The region certainly holds more than this.

   Unlike the other region trackers, Archon Quests ARE included:
   in Snezhnaya they gate the train, free-roam, and nearly every
   world quest, so omitting them would break the ordering.

   Completion times are marked "(est.)" wherever no source
   documents them — which is currently most of the region.
   Mora / Hero's Wit numbers are only filled in where a source
   actually stated them.
   Sources: Game8, Fandom Wiki, Sportskeeda, GameRant.
   ============================================================ */

const tiers = [
  { id:1, label:"Tier 1", sublabel:"Very Fast",    time:"5-15 min",  color:"#93c5fd", bg:"rgba(147,197,253,0.07)", border:"rgba(147,197,253,0.22)", glow:"rgba(147,197,253,0.12)", icon:"❄" },
  { id:2, label:"Tier 2", sublabel:"Short",        time:"15-30 min", color:"#67e8f9", bg:"rgba(103,232,249,0.07)", border:"rgba(103,232,249,0.22)", glow:"rgba(103,232,249,0.12)", icon:"🚂" },
  { id:3, label:"Tier 3", sublabel:"Medium",       time:"30-60 min", color:"#a5b4fc", bg:"rgba(165,180,252,0.07)", border:"rgba(165,180,252,0.22)", glow:"rgba(165,180,252,0.12)", icon:"⚖" },
  { id:4, label:"Tier 4", sublabel:"Long / Gated", time:"60 min+",   color:"#c4b5fd", bg:"rgba(196,181,253,0.07)", border:"rgba(196,181,253,0.22)", glow:"rgba(196,181,253,0.12)", icon:"👑" },
];

const chainTags = {
  archon:     { label:"Archon Quest",       color:"#fbbf24" },
  dwelling:   { label:"In the Dwelling of Life", color:"#34d399" },
  hesperides: { label:"Hesperides",         color:"#f472b6" },
  palace:     { label:"Palace & Tomb",      color:"#a78bfa" },
  eye:        { label:"Eye of Graeae",      color:"#67e8f9" },
  standalone: { label:"Standalone",         color:"#64748b" },
};

const quests = [
  // ───────── TIER 1 ─────────
  { id:1, tier:1, chain:"standalone", name:"Another Horizon of Adventure", time:"5-10 min (est.)", region:"Snezhnograd — Adventurers' Guild", activate:"Auto-appears on reaching Snezhnograd during 'Great Deeds on the Tundra'. Talk to Katheryne at the Adventurers' Guild.", prereqs:"AQ Ch VII Act I progress (Great Deeds on the Tundra)", notes:"Pure dialogue. Unlocks Snezhnaya daily commissions AND installs the Prime Ice Communicator on your train — full Guild functions from the train car, no teleporting back. Do this first.", rewards:"Adv EXP · Mora · unlocks Snezhnaya dailies + Prime Ice Communicator", game8:"https://game8.co/games/Genshin-Impact/archives/615380" },

  // ───────── TIER 2 ─────────
  { id:2, tier:2, chain:"standalone", name:"Ever Beneath the Waves", time:"15-25 min (est.)", region:"Volkodlak Tundra — northeast of Sretomorozsk", activate:"Simply reach the location; it is flanked by two teleport points.", prereqs:"None — no Snezhnaya quest prerequisite, the earliest side quest you can reach", notes:"Help a long-forgotten fae named Chulkaturin. Ends in a Precious Chest.", rewards:"Adv EXP · Mora · Precious Chest", game8:"https://game8.co/games/Genshin-Impact/archives/615222" },
  { id:3, tier:2, chain:"standalone", name:"Small Jack Frost, Big Problems", time:"20-30 min (est.)", region:"Jack Frost Village", activate:"Not documented — triggers in Jack Frost Village.", prereqs:"Free-roam access", notes:"Small favours for snow creatures, then a tower-defence fight against invading Volkodlaks using a snowball launcher (two initial waves), then repair a crooked shop sign.", rewards:"Adv EXP · Mora (amounts not documented)", game8:"https://game8.co/games/Genshin-Impact/archives/615309" },
  { id:4, tier:2, chain:"standalone", name:"Forested Snowfield", time:"20-30 min (est.)", region:"Snowfield around Morepesok", activate:"Not documented — triggers in the snowfield near Morepesok.", prereqs:"Free-roam access", notes:"Detective Donya chases the Izmaylov gang: clear thugs and follow the 'Legendary Thief's Treasure' map.", rewards:"Adv EXP · Mora (amounts not documented)", game8:"https://game8.co/games/Genshin-Impact/archives/615374" },
  { id:5, tier:2, chain:"standalone", name:"A Special Selection", time:"20-30 min (est.)", region:"Snezhnograd — Druzhna HQ", activate:"Teleport to the east-side Snezhnograd waypoint, walk east to Druzhna HQ, approach the NPC group.", prereqs:"AQ Ch VII Act II 'Wraith's Nocturne' COMPLETE", notes:"Locked behind the full Archon chapter — save it for after Act II.", rewards:"Not documented", game8:"https://game8.co/games/Genshin-Impact/archives/615378" },

  // ───────── TIER 3 ─────────
  { id:6, tier:3, chain:"standalone", name:"The Great Heart Bound by a Slender Chain", time:"30-45 min (est.)", region:"Everfrozen Earth — start east of the area", activate:"Approach the start point east of Everfrozen Earth.", prereqs:"Free-roam access", notes:"Four puzzles; break all the chains. A follow-up quest opens the NEXT in-game day, west of Snezhnograd, approaching a giant figure by the sea. ⚠ Weakly sourced — the follow-up quest's name is not documented.", rewards:"Not documented" },
  { id:7, tier:3, chain:"palace", name:"On One Side a Palace, On the Other a Tomb (Chain)", time:"45-60 min (est.)", region:"White Birch Snowgrave — northern Snezhnaya", activate:"Talk to the Eye of Graeae at the Central Station train after gaining train access.", prereqs:"Train boarding (unlocked during 'Great Deeds on the Tundra')", notes:"Two sub-quests: To Gaze Upon the Dreaming Pale Crown → The Stone Beasts, Like Ghouls Seated. Journey past a lethal blizzard to the Tsar's tomb — summon a hidden train, an escape-room potion puzzle, a feed-the-cat door gate, and a Teleport Waypoint at Pale Crown Palace. Ends with the Zver boss (two-headed flier). Yields the FINAL Eye fragment.", rewards:"40 Primogems (sub-quest 1) · Pebble of Crystalline Essence · Eye of Graeae fragment", game8:"https://game8.co/games/Genshin-Impact/archives/615211" },
  { id:8, tier:3, chain:"eye", name:"An Ark That Used to Be a Soul / Her Palace Collapses Into the Blizzard", time:"30-45 min (est.)", region:"Pale Crown Palace → Court of Bliss → Shadow Realm", activate:"Starts AUTOMATICALLY once all three Eye of Graeae fragments are held.", prereqs:"All three fragment chains complete (check your inventory for the three Pebbles)", notes:"The finale. Rebuild the Eye's power, speak to it at the Ruined Hvergelmir, open the Court of Bliss, then chase Aksinya into the Shadow Realm and fight the Primordial Human. ⚠ Sources disagree on which of these two titles is the parent series and which the sub-quest.", rewards:"40 Primogems · 2 Mortal Shells · further rewards not documented", game8:"https://game8.co/games/Genshin-Impact/archives/614999" },

  // ───────── TIER 4 ─────────
  { id:9, tier:4, chain:"archon", name:"Chapter VII Act I — Everwinter Without Mercy", time:"2-3 hours", region:"Sretomorozsk → across Snezhnaya", activate:"Auto-begins after the farewell party on The Flagship arranged by Columbina.", prereqs:"Prior Archon Quest progression", notes:"Four sub-quests: Into the Wind, Into the Frigid North → Gunfire in the Silent Lands (grants the Eye of Graeae, opens most of the map) → Great Deeds on the Tundra (free-roam + train fully operable — the real unlock) → Silence Alone is Disfavored. Awards ALYOSHA free (4★ Electro polearm) and begins the Exaiphanes Blade growth weapon. ~1h55m-2h40m speedrunning.", rewards:"Alyosha (free 4★) · Exaiphanes Blade · achievement 'Everwinter Without Mercy' (+10 Primogems) · up to 560 Primogems across Acts I+II", game8:"https://game8.co/games/Genshin-Impact/archives/613900" },
  { id:10, tier:4, chain:"archon", name:"Chapter VII Act II — Wraith's Nocturne", time:"2-3 hours", region:"Snezhnograd", activate:"Continues after Act I.", prereqs:"Chapter VII Act I complete", notes:"First sub-quest is 'The White Curtain Falls'; the remaining sub-quest list is not yet documented. Cast: Alyosha, Chugunov, Mitya, Odette, Ptashka, Vodyanitsa, Ronova. ~1h30m speedrun, 2h30m-3h25m at normal pace. NOTE: 'Via Seele' circulated pre-release as this act's title — that was a single leak post; the shipped title is Wraith's Nocturne.", rewards:"53,900 Mora · 10 Hero's Wit · 1,225 Adv EXP", mora: 53900, heroWit: 10, game8:"https://game8.co/games/Genshin-Impact/archives/613901" },
  { id:11, tier:4, chain:"dwelling", name:"In the Dwelling of Life (7-part Chain)", time:"2-3 hours (est.)", region:"Flamefeather Valley — southwest of Morepesok", activate:"Teleport to the Flamefeather Valley Statue of the Seven, head south; approaching the Volkodlak gang on the frozen pond triggers it.", prereqs:"Free-roam access ('Great Deeds on the Tundra')", notes:"Seven sub-quests: A Sprout Without a Gardener → Transplanted From 'Yesterday' to 'Tomorrow' → Down in the Dumps → Back on One's Feet → Forbidding Doors of Melancholy → To Rest in a Forgotten Field → Chorus of Solace. Follows Nastya trying to get home; mixes Prime Ice construct puzzles with the new TPS shooting mode. Four bosses: The Anvil's crew, Furiosa (twice), Zhara the Immortal Firebird. ⚠ Sub-quest 1's rewards are reported inconsistently across sources.", rewards:"Pebble of Serpentine Algae · Eye of Graeae fragment · achievement 'Gather for Everlasting Happiness' · gun blueprint", game8:"https://game8.co/games/Genshin-Impact/archives/408301" },
  { id:12, tier:4, chain:"hesperides", name:"Hesperides of Love and Hate (5-part Chain)", time:"2-3 hours (est.)", region:"Fellfrost Peak — southeastern Snezhnaya", activate:"First grab the Invitation to the Ritual — an envelope on a waiting-area seat in the office west of Svetloledovka Station. Then interact at the Fellfrost Peak Statue of the Seven to start 'Through the Gates of Ivory'.", prereqs:"Train access · the Invitation to the Ritual item", notes:"Five sub-quests: Through the Gates of Ivory · Procrustes' Iron Bed · The Sun's Gilded Apple (this is where the fragment drops) · House of the Soulless · Bell Ringing at Dusk (consistently last). Centres on the wedding of Pavlina, Grand Duchess of the Snegurochka. A guide named Ikhor leads you to the House of Hesperides — place the invitation on the statue right of the doors. ⚠ Sources contradict each other on the middle ordering: one calls the three central quests parallel branches, another makes Procrustes depend on the other two.", rewards:"170 Primogems · 40,000 Mora · 10 Hero's Wit · 15 Mystic Enhancement Ore · 500 Adv EXP · Eye of Graeae fragment", mora: 40000, heroWit: 10, game8:"https://game8.co/games/Genshin-Impact/archives/615071" },
];

const orderNote = [
  { step:1, text:"COVERAGE: Snezhnaya launched 12 August 2026 and this is a launch-window snapshot — the Archon chapter, the three Eye of Graeae fragment chains, the finale, and 6 verified standalones. The region certainly holds more world quests than are documented yet; this tracker will grow as guides publish." },
  { step:2, text:"Archon Quests are INCLUDED here (unlike other region trackers) because in Snezhnaya they gate everything: the Eye of Graeae, the train, and free-roam all come from Chapter VII Act I." },
  { step:3, text:"The real unlock moment is Act I sub-quest 3, 'Great Deeds on the Tundra' — free-roam opens and the train becomes fully operable. Sub-quest 2, 'Gunfire in the Silent Lands', is what grants the Eye of Graeae itself." },
  { step:4, text:"Do Another Horizon of Adventure immediately after reaching Snezhnograd: it unlocks Snezhnaya dailies and installs the Prime Ice Communicator on your train, so you can claim Guild rewards without teleporting back to the city." },
  { step:5, text:"The region's spine is the Eye of Graeae fragment hunt. Three chains each end in one fragment — In the Dwelling of Life (Flamefeather Valley), Hesperides of Love and Hate (Fellfrost Peak), On One Side a Palace (White Birch Snowgrave). Hold all three and the finale starts automatically." },
  { step:6, text:"Ever Beneath the Waves has NO quest prerequisite — it is the one side quest you can reach the moment you can walk to Volkodlak Tundra. A Special Selection is the opposite: it needs Act II fully cleared." },
  { step:7, text:"Best documented payouts so far: Hesperides of Love and Hate (170 Primogems + 40,000 Mora + 10 Hero's Wit) and Archon Act II (53,900 Mora + 10 Hero's Wit). Most other quests have no published reward figures yet." },
  { step:8, text:"Times marked '(est.)' are our estimates — no source documents completion times for Snezhnaya world quests yet. Only the two Archon acts have community-reported durations." },
];

const config = {
  title: "Snezhnaya World Quests",
  subtitleLabel: "Archon Ch VII · Eye of Graeae chains · World Quests — v7.0 launch-window coverage",
  logoEmoji: "❄",
  completeEmoji: "❄👑",
  completeTitle: "ALL DOCUMENTED SNEZHNAYA QUESTS COMPLETE",
  completeMessage: "The Tsaritsa's winter takes note of you, Traveler.",
  storageKey: "snezhnaya-quest-tracker-v1",
  tiers, chainTags, quests, orderNote,
  theme: {
    pageBg:           "linear-gradient(160deg,#050c14 0%,#0d2030 40%,#16394d 100%)",
    headerBg:         "rgba(3,8,16,0.97)",
    pattern1:         "rgba(168,214,229,0.07)",
    pattern2:         "rgba(96,165,250,0.06)",
    cardBg:           "linear-gradient(135deg,rgba(10,22,38,0.92),rgba(6,14,26,0.92))",
    logoBg:           "linear-gradient(135deg,#a8d6e5,#1e3a5f)",
    titleGradient:    "linear-gradient(135deg,#f0f9ff 0%,#a8d6e5 50%,#1e3a5f 100%)",
    progressGradient: "linear-gradient(90deg,#1e3a5f,#60a5fa,#a8d6e5)",
    textPrimary:      "#e8f4f8",
    textBright:       "#f0f9ff",
    textRgb:          [232, 244, 248],
    accent:           "#a8d6e5",
    accentRgb:        [168, 214, 229],
  },
};

export default function SnezhnayaQuests() {
  return <RegionQuestTracker config={config} />;
}
