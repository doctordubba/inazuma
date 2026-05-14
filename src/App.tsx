import React, { useState, useEffect } from ‘react’;

/* ============================================================
IDEAL BUILD TARGETS
Sources: Game8, KQM, Icy-Veins, GamesGG (Version 6.5, May 2026)
============================================================ */

const CHARACTERS = [
{
id: ‘lauma’,
name: ‘Lauma’,
epithet: ‘Moonchanter of Verdant Dew’,
element: ‘dendro’,
role: ‘Lunar-Bloom Support’,
weaponType: ‘Catalyst’,
set: “4pc Silken Moon’s Serenade”,
setAlt: ‘4pc Deepwood Memories · 4pc Gilded Dreams’,
weapon: “Nightweaver’s Looking Glass”,
weaponAlt: ‘A Thousand Floating Dreams · Etherlight Spindlelute (F2P)’,
talents: ‘Skill › Burst ›› Normal’,
stats: [
{ id: ‘sands’, label: ‘Sands main stat’, target: ‘EM’ },
{ id: ‘goblet’, label: ‘Goblet main stat’, target: ‘EM’ },
{ id: ‘circlet’, label: ‘Circlet main stat’, target: ‘EM’ },
{ id: ‘em’, label: ‘Total Elemental Mastery’, target: ‘≥ 900’ },
{ id: ‘er’, label: ‘Energy Recharge’, target: ‘130 – 160 %’ },
{ id: ‘cr’, label: ‘CRIT Rate (damage build only)’, target: ‘≥ 40 %’ },
{ id: ‘cd’, label: ‘CRIT DMG (damage build only)’, target: ‘≥ 100 %’ },
],
note: ‘EM is king. CRIT only matters if she is also doing personal damage.’,
},
{
id: ‘nefer’,
name: ‘Nefer’,
epithet: ‘Curator of the Seeds of Deceit’,
element: ‘dendro’,
role: ‘Lunar-Bloom On-Field DPS’,
weaponType: ‘Catalyst’,
set: “4pc Night of the Sky’s Unveiling”,
setAlt: ‘4pc Gilded Dreams · 2pc/2pc EM hybrid’,
weapon: ‘Reliquary of Truth’,
weaponAlt: ‘Tome of the Eternal Flow · Dawning Frost (4★)’,
talents: ‘Skill › Burst ›› Normal’,
stats: [
{ id: ‘sands’, label: ‘Sands main stat’, target: ‘EM’ },
{ id: ‘goblet’, label: ‘Goblet main stat’, target: ‘EM’ },
{ id: ‘circlet’, label: ‘Circlet main stat’, target: ‘CRIT Rate / DMG’ },
{ id: ‘em’, label: ‘Total Elemental Mastery’, target: ‘900 – 1000’ },
{ id: ‘cr’, label: ‘CRIT Rate’, target: ‘60 – 70 %’ },
{ id: ‘cd’, label: ‘CRIT DMG’, target: ‘180 – 220 %’ },
{ id: ‘er’, label: ‘Energy Recharge’, target: ‘130 – 140 %’ },
],
note: ‘NotSU 4pc grants +30% CR at Ascendant Gleam — count it toward your total.’,
},
{
id: ‘zibai’,
name: ‘Zibai’,
epithet: ‘The Selenic Adeptus Descends’,
element: ‘geo’,
role: ‘Lunar-Crystallize On-Field DPS’,
weaponType: ‘Sword’,
set: “4pc Night of the Sky’s Unveiling”,
setAlt: ‘4pc Husk of Opulent Dreams’,
weapon: ‘Lightbearing Moonshard’,
weaponAlt: ‘Uraku Misugiri · Harbinger of Dawn (3★) · Flute of Ezpitzal (F2P)’,
talents: ‘Skill ›› Burst ›› Normal’,
stats: [
{ id: ‘sands’, label: ‘Sands main stat’, target: ‘DEF %’ },
{ id: ‘goblet’, label: ‘Goblet main stat’, target: ‘DEF %  ⚠ not Geo %’ },
{ id: ‘circlet’, label: ‘Circlet main stat’, target: ‘CRIT Rate / DMG’ },
{ id: ‘def’, label: ‘Total DEF’, target: ‘≥ 3000’ },
{ id: ‘cr’, label: ‘CRIT Rate’, target: ‘60 – 70 % (+30% from set)’ },
{ id: ‘cd’, label: ‘CRIT DMG’, target: ‘150 – 200 %’ },
{ id: ‘er’, label: ‘Energy Recharge’, target: ‘110 – 130 %’ },
],
note: ‘Geo DMG goblet does NOT scale Lunar-Crystallize. Always DEF%.’,
},
{
id: ‘linnea’,
name: ‘Linnea’,
epithet: ‘Wandering Advisor of Lumi’,
element: ‘geo’,
role: ‘Lunar-Crystallize Sub-DPS / Healer’,
weaponType: ‘Bow’,
set: ‘4pc Aubade of Morningstar and Moon’,
setAlt: ‘4pc Husk of Opulent Dreams’,
weapon: ‘Golden Frostbound Oath’,
weaponAlt: ‘Aqua Simulacra · Slingshot (3★)’,
talents: ‘Skill › Burst ›› Normal’,
stats: [
{ id: ‘sands’, label: ‘Sands main stat’, target: ‘DEF %’ },
{ id: ‘goblet’, label: ‘Goblet main stat’, target: ‘DEF %’ },
{ id: ‘circlet’, label: ‘Circlet main stat’, target: ‘CRIT Rate / DMG’ },
{ id: ‘def’, label: ‘Total DEF’, target: ‘≥ 3000’ },
{ id: ‘cr’, label: ‘CRIT Rate’, target: ‘60 – 70 % (24.2% ascension)’ },
{ id: ‘cd’, label: ‘CRIT DMG’, target: ‘≥ 150 %’ },
{ id: ‘er’, label: ‘Energy Recharge’, target: ‘110 – 130 %’ },
],
note: ‘Aubade needs Ascendant Gleam to fully proc. Her Burst is sustain, not damage — ER is low priority.’,
},
{
id: ‘arlecchino’,
name: ‘Arlecchino’,
epithet: ‘Knave of the House of the Hearth’,
element: ‘pyro’,
role: ‘On-Field Main DPS’,
weaponType: ‘Polearm’,
set: ‘4pc Fragment of Harmonic Whimsy’,
setAlt: “4pc Gladiator’s Finale (Vape teams)”,
weapon: “Crimson Moon’s Semblance”,
weaponAlt: ‘Staff of Homa · Staff of the Scarlet Sands’,
talents: ‘Normal ›› Skill › Burst’,
stats: [
{ id: ‘sands’, label: ‘Sands main stat’, target: ‘ATK % (or EM in Vape)’ },
{ id: ‘goblet’, label: ‘Goblet main stat’, target: ‘Pyro DMG %’ },
{ id: ‘circlet’, label: ‘Circlet main stat’, target: ‘CRIT Rate / DMG’ },
{ id: ‘atk’, label: ‘Total ATK’, target: ‘≥ 2400’ },
{ id: ‘cr’, label: ‘CRIT Rate’, target: ‘60 – 80 %’ },
{ id: ‘cd’, label: ‘CRIT DMG’, target: ‘180 – 220 %’ },
{ id: ‘er’, label: ‘Energy Recharge’, target: ‘100 – 130 %’ },
],
note: ‘Bond of Life uptime drives Whimsy stacks. Target a ~1:2 CRIT ratio.’,
},
{
id: ‘durin’,
name: ‘Durin’,
epithet: ‘The Dragon of Twin Forms’,
element: ‘pyro’,
role: ‘Off-Field Sub-DPS / Hexerei’,
weaponType: ‘Sword’,
set: ‘4pc A Day Carved from Rising Winds’,
setAlt: ‘4pc Emblem of Severed Fate · 4pc Noblesse Oblige’,
weapon: ‘Athame Artis’,
weaponAlt: ‘Freedom-Sworn · Wolf-Fang (4★)’,
talents: ‘Burst › Skill ›› Normal’,
stats: [
{ id: ‘sands’, label: ‘Sands main stat’, target: ‘ATK %’ },
{ id: ‘goblet’, label: ‘Goblet main stat’, target: ‘Pyro DMG %’ },
{ id: ‘circlet’, label: ‘Circlet main stat’, target: ‘CRIT Rate / DMG’ },
{ id: ‘atk’, label: ‘Total ATK’, target: ‘≥ 2500 (caps A4)’ },
{ id: ‘cr’, label: ‘CRIT Rate’, target: ‘60 – 70 %’ },
{ id: ‘cd’, label: ‘CRIT DMG’, target: ‘≥ 150 %’ },
{ id: ‘er’, label: ‘Energy Recharge’, target: ‘100 – 150 %’ },
],
note: ‘Two Hexerei in party boosts A1 by 75 %. Vape/Melt teams want some EM substats.’,
},
{
id: ‘chevreusse’,
name: ‘Chevreusse’,
epithet: ‘Sergeant, Special Security Patrol’,
element: ‘pyro’,
role: ‘Overload Support’,
weaponType: ‘Polearm’,
set: ‘4pc Scroll of the Hero of Cinder City’,
setAlt: ‘4pc Noblesse Oblige · 4pc Instructor · 4pc Tenacity of the Millelith’,
weapon: ‘Right Hand of the Boss’,
weaponAlt: ‘Favonius Lance · Black Tassel · Prototype Starglitter (F2P)’,
talents: ‘Burst › Skill ›› Normal’,
stats: [
{ id: ‘sands’, label: ‘Sands main stat’, target: ‘HP %  (or ER if low energy)’ },
{ id: ‘goblet’, label: ‘Goblet main stat’, target: ‘HP %’ },
{ id: ‘circlet’, label: ‘Circlet main stat’, target: ‘HP %’ },
{ id: ‘hp’, label: ‘Total HP’, target: ‘≥ 30 000’ },
{ id: ‘er’, label: ‘Energy Recharge’, target: ‘160 – 200 %’ },
],
note: “Team buff scales off combined Pyro + Electro HP. Pure support — no CRIT needed.”,
},
{
id: ‘fischl’,
name: ‘Fischl’,
epithet: ‘Prinzessin der Verurteilung’,
element: ‘electro’,
role: ‘Off-Field Sub-DPS’,
weaponType: ‘Bow’,
set: ‘4pc Thundering Fury’,
setAlt: ‘4pc Golden Troupe · 4pc Gilded Dreams (reactions)’,
weapon: ‘Polar Star’,
weaponAlt: ‘Skyward Harp · Thundering Pulse · The Stringless (4★) · Mitternachts Waltz (4★)’,
talents: ‘Skill ›› Burst › Normal’,
stats: [
{ id: ‘sands’, label: ‘Sands main stat’, target: ‘ATK % (EM in Hyperbloom)’ },
{ id: ‘goblet’, label: ‘Goblet main stat’, target: ‘Electro DMG %’ },
{ id: ‘circlet’, label: ‘Circlet main stat’, target: ‘CRIT Rate / DMG’ },
{ id: ‘atk’, label: ‘Total ATK’, target: ‘≥ 2000’ },
{ id: ‘cr’, label: ‘CRIT Rate’, target: ‘≥ 70 %’ },
{ id: ‘cd’, label: ‘CRIT DMG’, target: ‘≥ 150 %’ },
{ id: ‘er’, label: ‘Energy Recharge’, target: ‘130 – 160 %’ },
],
note: ‘Oz is the damage. In Hyperbloom/Aggravate teams swap to full EM build (EM Sands/Goblet/Circlet, target ≥ 800).’,
},
{
id: ‘flins’,
name: ‘Flins’,
epithet: ‘Lightkeeper Against the Wild Hunt’,
element: ‘electro’,
role: ‘Lunar-Charged On-Field DPS’,
weaponType: ‘Polearm’,
set: “4pc Night of the Sky’s Unveiling”,
setAlt: ‘4pc Thundering Fury · 4pc Gilded Dreams’,
weapon: ‘Bloodsoaked Ruins’,
weaponAlt: “Staff of the Scarlet Sands · Engulfing Lightning · Prospector’s Shovel (craftable)”,
talents: ‘Burst › Skill ›› Normal’,
stats: [
{ id: ‘sands’, label: ‘Sands main stat’, target: ‘ATK % (or ER if needed)’ },
{ id: ‘goblet’, label: ‘Goblet main stat’, target: ‘ATK %  ⚠ not Electro %’ },
{ id: ‘circlet’, label: ‘Circlet main stat’, target: ‘CRIT Rate / DMG’ },
{ id: ‘atk’, label: ‘Total ATK’, target: ‘2200 – 2500’ },
{ id: ‘cr’, label: ‘CRIT Rate’, target: ‘50 – 70 % (+30% from set)’ },
{ id: ‘cd’, label: ‘CRIT DMG’, target: ‘≥ 175 %’ },
{ id: ‘er’, label: ‘Energy Recharge’, target: ‘120 – 140 %’ },
],
note: ‘Electro DMG goblet does NOT scale Lunar-Charged. ATK% goblet. A4 converts ATK → EM up to 160.’,
},
{
id: ‘varesa’,
name: ‘Varesa’,
epithet: ‘Rebel Heir of the Collective of Plenty’,
element: ‘electro’,
role: ‘Plunge Hypercarry DPS’,
weaponType: ‘Catalyst’,
set: “4pc Long Night’s Oath”,
setAlt: ‘4pc Obsidian Codex · 4pc Thundering Fury’,
weapon: ‘Vivid Notions’,
weaponAlt: “Kagura’s Verity · Lost Prayer to the Sacred Winds · The Widsith (4★)”,
talents: ‘Burst › Skill ›› Normal’,
stats: [
{ id: ‘sands’, label: ‘Sands main stat’, target: ‘ATK %’ },
{ id: ‘goblet’, label: ‘Goblet main stat’, target: ‘Electro DMG %’ },
{ id: ‘circlet’, label: ‘Circlet main stat’, target: ‘CRIT Rate / DMG’ },
{ id: ‘atk’, label: ‘Total ATK’, target: ‘≥ 2200’ },
{ id: ‘cr’, label: ‘CRIT Rate’, target: ‘60 – 70 %’ },
{ id: ‘cd’, label: ‘CRIT DMG’, target: ‘180 – 220 %’ },
{ id: ‘er’, label: ‘Energy Recharge’, target: ‘120 – 140 %’ },
],
note: “Hit 120–140% ER first, then chase CRIT (1:2 ratio). Long Night’s Oath rewards plunge → CA → skill loops.”,
},
{
id: ‘ororon’,
name: ‘Ororon’,
epithet: ‘Whisperer of the Night Kingdom’,
element: ‘electro’,
role: ‘Hyperbloom / Aggravate Trigger’,
weaponType: ‘Bow’,
set: ‘4pc Flower of Paradise Lost’,
setAlt: ‘4pc Gilded Dreams · 4pc Thundering Fury (Aggravate)’,
weapon: ‘The Stringless (4★)’,
weaponAlt: ‘Elegy for the End · Sacrificial Bow · Favonius Warbow · Prototype Crescent (F2P)’,
talents: ‘Skill › Burst ›› Normal’,
stats: [
{ id: ‘sands’, label: ‘Sands main stat’, target: ‘EM’ },
{ id: ‘goblet’, label: ‘Goblet main stat’, target: ‘EM’ },
{ id: ‘circlet’, label: ‘Circlet main stat’, target: ‘EM’ },
{ id: ‘em’, label: ‘Total Elemental Mastery’, target: ‘≥ 800’ },
{ id: ‘er’, label: ‘Energy Recharge’, target: ‘180 – 220 %’ },
],
note: ‘Pure Hyperbloom trigger — no CRIT. Burst is meaningful, so high ER matters; ER weapons help most.’,
},
{
id: ‘xilonen’,
name: ‘Xilonen’,
epithet: ‘Cobalt-Tongued Smith of Ochkanatlan’,
element: ‘geo’,
role: ‘Universal RES-Shred Support / Healer’,
weaponType: ‘Sword’,
set: ‘4pc Scroll of the Hero of Cinder City’,
setAlt: “4pc Song of Days Past · 4pc Vourukasha’s Glow”,
weapon: ‘Peak Patrol Song’,
weaponAlt: ‘Freedom-Sworn · Key of Khaj-Nisut · Favonius Sword (F2P)’,
talents: ‘Skill ›› Burst › Normal’,
stats: [
{ id: ‘sands’, label: ‘Sands main stat’, target: ‘DEF % (or ER)’ },
{ id: ‘goblet’, label: ‘Goblet main stat’, target: ‘DEF %’ },
{ id: ‘circlet’, label: ‘Circlet main stat’, target: ‘DEF % (or CRIT for sub-DPS)’ },
{ id: ‘def’, label: ‘Total DEF’, target: ‘≥ 3000’ },
{ id: ‘er’, label: ‘Energy Recharge’, target: ‘130 – 160 %’ },
],
note: ‘Healing and RES shred both scale off DEF. Burst-hungry — Favonius/Freedom-Sworn ease energy.’,
},
{
id: ‘chasca’,
name: ‘Chasca’,
epithet: ‘Dragoon of the Flamebound Skies’,
element: ‘anemo’,
role: ‘Multi-Element On-Field DPS’,
weaponType: ‘Bow’,
set: ‘4pc Marechaussee Hunter’,
setAlt: “4pc Long Night’s Oath · 4pc Desert Pavilion Chronicle”,
weapon: “Astral Vulture’s Crimson Plumage”,
weaponAlt: “Polar Star · Aqua Simulacra · Hunter’s Path · The Stringless (4★)”,
talents: ‘Skill ›› Burst › Normal’,
stats: [
{ id: ‘sands’, label: ‘Sands main stat’, target: ‘ATK %’ },
{ id: ‘goblet’, label: ‘Goblet main stat’, target: ‘ATK % (or matching Element DMG %)’ },
{ id: ‘circlet’, label: ‘Circlet main stat’, target: ‘CRIT Rate / DMG’ },
{ id: ‘atk’, label: ‘Total ATK’, target: ‘≥ 2200’ },
{ id: ‘cr’, label: ‘CRIT Rate’, target: ‘70 – 80 %’ },
{ id: ‘cd’, label: ‘CRIT DMG’, target: ‘180 – 220 %’ },
{ id: ‘er’, label: ‘Energy Recharge’, target: ‘130 – 150 %’ },
],
note: ‘Bullets convert to Pyro/Hydro/Cryo/Electro based on teammates. ATK% goblet stays neutral across teams.’,
},
{
id: ‘varka’,
name: ‘Varka’,
epithet: ‘Grand Master of the Knights of Favonius’,
element: ‘anemo’,
role: ‘Hexerei On-Field DPS’,
weaponType: ‘Claymore’,
set: ‘4pc A Day Carved from Rising Winds’,
setAlt: “4pc Desert Pavilion Chronicle · 4pc Shimenawa’s Reminiscence”,
weapon: ‘Gest of the Mighty Wolf’,
weaponAlt: ‘A Thousand Blazing Suns · Beacon of the Reed Sea · Serpent Spine (4★)’,
talents: ‘Skill ›››› Burst · Normal (skip both)’,
stats: [
{ id: ‘sands’, label: ‘Sands main stat’, target: ‘ATK %’ },
{ id: ‘goblet’, label: ‘Goblet main stat’, target: ‘ATK % (or Pyro DMG % in Mono-Pyro)’ },
{ id: ‘circlet’, label: ‘Circlet main stat’, target: ‘CRIT DMG (set gives +20% CR)’ },
{ id: ‘atk’, label: ‘Total ATK’, target: ‘2500 – 3000’ },
{ id: ‘cr’, label: ‘CRIT Rate’, target: ‘≤ 80 % ⚠ avoid overcap’ },
{ id: ‘cd’, label: ‘CRIT DMG’, target: ‘≥ 200 %’ },
{ id: ‘er’, label: ‘Energy Recharge’, target: ‘110 – 130 %’ },
],
note: ‘Burst is a damage loss — keep at Lv 1, raise character to 90/100 instead. ADCFRW + Hexerei = +20% CR; watch for overcap with sig weapon.’,
},
{
id: ‘kirara’,
name: ‘Kirara’,
epithet: ‘Courier Cat of the Komaniya Express’,
element: ‘dendro’,
role: ‘Shielder / Dendro Applicator’,
weaponType: ‘Sword’,
set: ‘4pc Tenacity of the Millelith’,
setAlt: ‘4pc Instructor · 4pc Deepwood Memories · 4pc Noblesse Oblige’,
weapon: ‘Key of Khaj-Nisut’,
weaponAlt: “Freedom-Sworn · Favonius Sword · Sacrificial Sword · Xiphos’ Moonlight (F2P)”,
talents: ‘Skill › Burst ›› Normal’,
stats: [
{ id: ‘sands’, label: ‘Sands main stat’, target: ‘HP % (or ER)’ },
{ id: ‘goblet’, label: ‘Goblet main stat’, target: ‘HP %’ },
{ id: ‘circlet’, label: ‘Circlet main stat’, target: ‘HP %’ },
{ id: ‘hp’, label: ‘Total HP’, target: ‘≥ 30 000’ },
{ id: ‘er’, label: ‘Energy Recharge’, target: ‘130 – 180 %’ },
],
note: ‘Shield strength scales with HP. No CRIT, no Dendro DMG goblet. Favonius/Sacrificial swords ease energy.’,
},
];

const ELEMENT_THEME = {
dendro:  { color: ‘#7fb069’, glow: ‘rgba(127, 176, 105, 0.18)’, label: ‘Dendro’ },
geo:     { color: ‘#d4a857’, glow: ‘rgba(212, 168, 87, 0.18)’,  label: ‘Geo’ },
pyro:    { color: ‘#d96b50’, glow: ‘rgba(217, 107, 80, 0.18)’,  label: ‘Pyro’ },
electro: { color: ‘#b07fd1’, glow: ‘rgba(176, 127, 209, 0.18)’, label: ‘Electro’ },
anemo:   { color: ‘#74c2a8’, glow: ‘rgba(116, 194, 168, 0.18)’, label: ‘Anemo’ },
};

const STORAGE_KEY = ‘genshin-build-progress-v1’;

/* ============================================================
APP
============================================================ */

export default function App() {
const [progress, setProgress] = useState({});
const [hydrated, setHydrated] = useState(false);

// Load saved progress on mount
useEffect(() => {
let cancelled = false;
(async () => {
try {
const result = await window.storage.get(STORAGE_KEY);
if (!cancelled && result?.value) {
setProgress(JSON.parse(result.value));
}
} catch {
// No saved state yet — that’s fine.
} finally {
if (!cancelled) setHydrated(true);
}
})();
return () => { cancelled = true; };
}, []);

const toggle = async (charId, statId) => {
const current = progress?.[charId]?.[statId] || false;
const next = {
…progress,
[charId]: { …(progress[charId] || {}), [statId]: !current },
};
setProgress(next);
try {
await window.storage.set(STORAGE_KEY, JSON.stringify(next));
} catch (e) {
console.error(‘Failed to save progress:’, e);
}
};

const resetAll = async () => {
if (!window.confirm(‘Clear all checked boxes? This cannot be undone.’)) return;
setProgress({});
try {
await window.storage.delete(STORAGE_KEY);
} catch (e) {
console.error(e);
}
};

const totalStats = CHARACTERS.reduce((s, c) => s + c.stats.length, 0);
const doneStats = CHARACTERS.reduce(
(s, c) => s + c.stats.filter(st => progress?.[c.id]?.[st.id]).length,
0
);
const pct = totalStats ? Math.round((doneStats / totalStats) * 100) : 0;

return (
<>
<style>{styles}</style>
<div className="page">
<div className="vignette" aria-hidden="true" />
<div className="stars" aria-hidden="true" />

```
    <header className="top">
      <div className="top-marks" aria-hidden="true">✦ ✦ ✦</div>
      <h1 className="title">Almanac of the Moonbound</h1>
      <p className="subtitle">Ideal build targets — checked when reached.</p>

      <div className="overall">
        <div className="overall-bar">
          <div className="overall-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="overall-meta">
          <span>{doneStats} / {totalStats} stats reached</span>
          <button className="reset" onClick={resetAll} disabled={!doneStats}>
            Reset
          </button>
        </div>
      </div>
    </header>

    <main className="grid">
      {CHARACTERS.map((c) => (
        <CharacterCard
          key={c.id}
          char={c}
          checked={progress[c.id] || {}}
          onToggle={toggle}
          hydrated={hydrated}
        />
      ))}
    </main>

    <footer className="bottom">
      <p>Targets compiled from Game8, KQM, Icy-Veins, and GamesGG · Version 6.5</p>
      <p className="bottom-faint">Progress saved locally.</p>
    </footer>
  </div>
</>
```

);
}

/* ============================================================
CHARACTER CARD
============================================================ */

function CharacterCard({ char, checked, onToggle, hydrated }) {
const theme = ELEMENT_THEME[char.element];
const done = char.stats.filter(s => checked[s.id]).length;
const total = char.stats.length;
const pct = Math.round((done / total) * 100);

return (
<article className=“card” style={{ ‘–accent’: theme.color, ‘–glow’: theme.glow }}>
<div className="card-corner tl" />
<div className="card-corner tr" />
<div className="card-corner bl" />
<div className="card-corner br" />

```
  <header className="card-head">
    <div className="card-head-row">
      <h2 className="char-name">{char.name}</h2>
      <span className="elem-chip">{theme.label}</span>
    </div>
    <p className="char-epithet">{char.epithet}</p>
    <p className="char-role">{char.role} · {char.weaponType}</p>
  </header>

  <section className="essentials">
    <div className="ess-row">
      <span className="ess-label">Set</span>
      <span className="ess-val">{char.set}</span>
    </div>
    {char.setAlt && (
      <div className="ess-row faint">
        <span className="ess-label">↳ alt</span>
        <span className="ess-val">{char.setAlt}</span>
      </div>
    )}
    <div className="ess-row">
      <span className="ess-label">Weapon</span>
      <span className="ess-val">{char.weapon}</span>
    </div>
    {char.weaponAlt && (
      <div className="ess-row faint">
        <span className="ess-label">↳ alt</span>
        <span className="ess-val">{char.weaponAlt}</span>
      </div>
    )}
    <div className="ess-row">
      <span className="ess-label">Talents</span>
      <span className="ess-val">{char.talents}</span>
    </div>
  </section>

  <div className="divider" />

  <section className="stats">
    {char.stats.map((s) => (
      <StatRow
        key={s.id}
        label={s.label}
        target={s.target}
        checked={!!checked[s.id]}
        onClick={() => onToggle(char.id, s.id)}
        disabled={!hydrated}
      />
    ))}
  </section>

  {char.note && (
    <p className="note">
      <span className="note-mark">※</span> {char.note}
    </p>
  )}

  <footer className="card-foot">
    <div className="prog-bar">
      <div className="prog-fill" style={{ width: `${pct}%` }} />
    </div>
    <span className="prog-text">{done} / {total}</span>
  </footer>
</article>
```

);
}

/* ============================================================
STAT ROW (custom checkbox)
============================================================ */

function StatRow({ label, target, checked, onClick, disabled }) {
return (
<button
className={`stat ${checked ? 'on' : ''}`}
onClick={onClick}
disabled={disabled}
aria-pressed={checked}
type=“button”
>
<span className="box" aria-hidden="true">
<svg viewBox="0 0 16 16" className="tick">
<path d="M3 8.5 L6.5 12 L13 4.5" />
</svg>
</span>
<span className="stat-label">{label}</span>
<span className="stat-target">{target}</span>
</button>
);
}

/* ============================================================
STYLES
============================================================ */

const styles = `
@import url(‘https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Manrope:wght@300;400;500;600;700&display=swap’);

- { box-sizing: border-box; }

.page {
min-height: 100vh;
background:
radial-gradient(ellipse at 50% -10%, #1a1b3a 0%, #0a0b1c 45%, #050614 100%);
color: #e8e4d6;
font-family: ‘Manrope’, system-ui, sans-serif;
font-weight: 400;
letter-spacing: 0.01em;
position: relative;
overflow-x: hidden;
padding: 48px 20px 80px;
}

.vignette {
position: fixed; inset: 0; pointer-events: none;
background: radial-gradient(ellipse at 50% 0%, transparent 0%, transparent 50%, rgba(0,0,0,0.6) 100%);
z-index: 0;
}

.stars {
position: fixed; inset: 0; pointer-events: none; z-index: 0;
background-image:
radial-gradient(1px 1px at 12% 18%, rgba(255,255,255,0.4) 0%, transparent 50%),
radial-gradient(1px 1px at 78% 32%, rgba(255,255,255,0.35) 0%, transparent 50%),
radial-gradient(1px 1px at 45% 65%, rgba(255,255,255,0.25) 0%, transparent 50%),
radial-gradient(1px 1px at 88% 78%, rgba(255,255,255,0.3) 0%, transparent 50%),
radial-gradient(1px 1px at 23% 88%, rgba(255,255,255,0.35) 0%, transparent 50%),
radial-gradient(1px 1px at 62% 12%, rgba(255,255,255,0.3) 0%, transparent 50%),
radial-gradient(1.5px 1.5px at 8% 55%, rgba(255,255,255,0.5) 0%, transparent 50%),
radial-gradient(1px 1px at 95% 48%, rgba(255,255,255,0.3) 0%, transparent 50%);
background-size: 100% 100%;
background-attachment: fixed;
}

/* ––––– header ––––– */

.top {
position: relative; z-index: 1;
max-width: 720px;
margin: 0 auto 56px;
text-align: center;
}

.top-marks {
color: #c9a86a;
letter-spacing: 1.2em;
font-size: 11px;
margin-bottom: 18px;
opacity: 0.7;
padding-left: 1.2em;
}

.title {
font-family: ‘Cormorant Garamond’, serif;
font-style: italic;
font-weight: 500;
font-size: clamp(36px, 6vw, 56px);
line-height: 1.1;
margin: 0;
color: #f3ecd6;
background: linear-gradient(180deg, #f3ecd6 0%, #c9a86a 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
}

.subtitle {
font-family: ‘Cormorant Garamond’, serif;
font-style: italic;
color: rgba(232, 228, 214, 0.55);
font-size: 16px;
margin: 8px 0 28px;
letter-spacing: 0.04em;
}

.overall { max-width: 480px; margin: 0 auto; }

.overall-bar {
height: 2px;
background: rgba(201, 168, 106, 0.15);
position: relative;
overflow: hidden;
}

.overall-fill {
height: 100%;
background: linear-gradient(90deg, #c9a86a 0%, #f3ecd6 100%);
transition: width 400ms ease;
box-shadow: 0 0 8px rgba(201, 168, 106, 0.6);
}

.overall-meta {
display: flex;
justify-content: space-between;
align-items: center;
margin-top: 10px;
font-size: 11px;
text-transform: uppercase;
letter-spacing: 0.25em;
color: rgba(232, 228, 214, 0.5);
}

.reset {
background: none;
border: 1px solid rgba(201, 168, 106, 0.3);
color: rgba(201, 168, 106, 0.8);
padding: 4px 12px;
font-size: 10px;
letter-spacing: 0.25em;
text-transform: uppercase;
font-family: inherit;
cursor: pointer;
transition: all 200ms ease;
}
.reset:hover:not(:disabled) {
background: rgba(201, 168, 106, 0.1);
border-color: rgba(201, 168, 106, 0.6);
color: #f3ecd6;
}
.reset:disabled { opacity: 0.3; cursor: not-allowed; }

/* ––––– grid ––––– */

.grid {
position: relative; z-index: 1;
display: grid;
grid-template-columns: 1fr;
gap: 28px;
max-width: 1240px;
margin: 0 auto;
}
@media (min-width: 880px) {
.grid { grid-template-columns: repeat(2, 1fr); }
}

/* ––––– card ––––– */

.card {
position: relative;
background:
linear-gradient(180deg, rgba(20, 22, 48, 0.7) 0%, rgba(12, 14, 32, 0.85) 100%);
border: 1px solid rgba(201, 168, 106, 0.15);
padding: 32px 28px 24px;
backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
box-shadow:
0 1px 0 rgba(255,255,255,0.03) inset,
0 24px 60px -20px rgba(0,0,0,0.7),
0 0 40px -10px var(–glow);
}

.card-corner {
position: absolute;
width: 18px; height: 18px;
border: 1px solid var(–accent);
opacity: 0.55;
pointer-events: none;
}
.card-corner.tl { top: 8px; left: 8px; border-right: none; border-bottom: none; }
.card-corner.tr { top: 8px; right: 8px; border-left: none; border-bottom: none; }
.card-corner.bl { bottom: 8px; left: 8px; border-right: none; border-top: none; }
.card-corner.br { bottom: 8px; right: 8px; border-left: none; border-top: none; }

.card-head { margin-bottom: 18px; }

.card-head-row {
display: flex;
justify-content: space-between;
align-items: baseline;
gap: 12px;
margin-bottom: 4px;
}

.char-name {
font-family: ‘Cormorant Garamond’, serif;
font-weight: 500;
font-style: italic;
font-size: 34px;
line-height: 1;
margin: 0;
color: #f3ecd6;
}

.elem-chip {
font-size: 9px;
letter-spacing: 0.3em;
text-transform: uppercase;
color: var(–accent);
padding: 4px 10px;
border: 1px solid var(–accent);
border-radius: 1px;
opacity: 0.85;
white-space: nowrap;
}

.char-epithet {
font-family: ‘Cormorant Garamond’, serif;
font-style: italic;
font-size: 15px;
color: rgba(232, 228, 214, 0.5);
margin: 0 0 6px;
}

.char-role {
font-size: 11px;
letter-spacing: 0.2em;
text-transform: uppercase;
color: var(–accent);
margin: 0;
opacity: 0.9;
}

.essentials {
display: flex;
flex-direction: column;
gap: 5px;
margin-bottom: 18px;
}

.ess-row {
display: grid;
grid-template-columns: 64px 1fr;
gap: 14px;
font-size: 13px;
line-height: 1.5;
align-items: baseline;
}
.ess-row.faint { opacity: 0.55; font-size: 12px; margin-top: -3px; }

.ess-label {
font-size: 10px;
letter-spacing: 0.25em;
text-transform: uppercase;
color: rgba(232, 228, 214, 0.4);
font-weight: 500;
}

.ess-val { color: #e8e4d6; }

.divider {
height: 1px;
background: linear-gradient(90deg, transparent 0%, rgba(201, 168, 106, 0.25) 50%, transparent 100%);
margin: 4px 0 16px;
}

.stats {
display: flex;
flex-direction: column;
gap: 2px;
margin-bottom: 18px;
}

.stat {
display: grid;
grid-template-columns: 22px 1fr auto;
gap: 12px;
align-items: center;
padding: 10px 8px;
background: none;
border: none;
border-left: 2px solid transparent;
color: inherit;
font-family: inherit;
font-size: 13px;
text-align: left;
cursor: pointer;
transition: all 200ms ease;
width: 100%;
}
.stat:hover:not(:disabled) {
background: rgba(255, 255, 255, 0.02);
border-left-color: rgba(201, 168, 106, 0.3);
}
.stat.on { border-left-color: var(–accent); }
.stat.on .stat-label {
color: rgba(232, 228, 214, 0.55);
text-decoration: line-through;
text-decoration-thickness: 1px;
text-decoration-color: rgba(201, 168, 106, 0.5);
}
.stat.on .stat-target { color: var(–accent); opacity: 0.9; }
.stat:disabled { opacity: 0.4; cursor: wait; }

.box {
width: 18px; height: 18px;
border: 1.5px solid rgba(201, 168, 106, 0.4);
display: inline-flex;
align-items: center;
justify-content: center;
transition: all 200ms ease;
position: relative;
}
.stat:hover:not(:disabled) .box { border-color: rgba(201, 168, 106, 0.7); }
.stat.on .box {
border-color: var(–accent);
background: var(–accent);
box-shadow: 0 0 12px var(–glow);
}

.tick {
width: 12px; height: 12px;
fill: none;
stroke: #0a0b1c;
stroke-width: 2.5;
stroke-linecap: round;
stroke-linejoin: round;
opacity: 0;
transform: scale(0.6);
transition: all 200ms ease;
}
.stat.on .tick { opacity: 1; transform: scale(1); }

.stat-label { color: #e8e4d6; transition: color 200ms ease; }

.stat-target {
font-family: ‘Cormorant Garamond’, serif;
font-style: italic;
font-size: 15px;
color: var(–accent);
white-space: nowrap;
letter-spacing: 0.02em;
}

.note {
font-family: ‘Cormorant Garamond’, serif;
font-style: italic;
font-size: 14px;
color: rgba(232, 228, 214, 0.6);
line-height: 1.5;
margin: 0 0 18px;
padding: 12px 14px;
background: rgba(0, 0, 0, 0.2);
border-left: 2px solid var(–accent);
}

.note-mark { color: var(–accent); font-style: normal; margin-right: 6px; }

.card-foot {
display: flex;
align-items: center;
gap: 12px;
padding-top: 4px;
}

.prog-bar {
flex: 1;
height: 2px;
background: rgba(201, 168, 106, 0.12);
position: relative;
overflow: hidden;
}

.prog-fill {
height: 100%;
background: var(–accent);
transition: width 400ms ease;
box-shadow: 0 0 8px var(–glow);
}

.prog-text {
font-size: 11px;
letter-spacing: 0.15em;
color: rgba(232, 228, 214, 0.5);
font-variant-numeric: tabular-nums;
white-space: nowrap;
}

.bottom {
position: relative; z-index: 1;
max-width: 720px;
margin: 64px auto 0;
text-align: center;
font-size: 11px;
letter-spacing: 0.15em;
color: rgba(232, 228, 214, 0.35);
text-transform: uppercase;
}
.bottom p { margin: 4px 0; }
.bottom-faint { opacity: 0.6; letter-spacing: 0.1em; }

@media (max-width: 480px) {
.page { padding: 32px 16px 60px; }
.card { padding: 28px 20px 20px; }
.char-name { font-size: 28px; }
.stat { font-size: 12px; gap: 10px; grid-template-columns: 20px 1fr auto; }
.stat-target { font-size: 13px; }
.ess-row { grid-template-columns: 56px 1fr; font-size: 12px; }
}
`;