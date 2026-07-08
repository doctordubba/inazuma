import React, { useState, useEffect } from "react";
import FontaineQuests from "./FontaineQuests";
import MondstadtQuests from "./MondstadtQuests";
import LiyueQuests from "./LiyueQuests";
import InazumaQuests from "./InazumaQuests";
import SumeruQuests from "./SumeruQuests";
import NatlanQuests from "./NatlanQuests";
import NodKraiQuests from "./NodKraiQuests";

/* ============================================================
   IDEAL BUILD TARGETS
   Sources: Game8, KQM, Icy-Veins, GamesGG (Version 6.5, May 2026)
   ============================================================ */

const CHARACTERS = [
  {
    id: "lauma",
    name: "Lauma",
    epithet: "Moonchanter of Verdant Dew",
    element: "dendro",
    role: "Lunar-Bloom Support",
    weaponType: "Catalyst",
    set: "4pc Silken Moon's Serenade",
    setAlt: "4pc Deepwood Memories \u00b7 4pc Gilded Dreams",
    weapon: "Nightweaver's Looking Glass",
    weaponAlt: "A Thousand Floating Dreams \u00b7 Etherlight Spindlelute (F2P)",
    talents: "Skill \u203a Burst \u203a\u203a Normal",
    stats: [
      { id: "sands", label: "Sands main stat", target: "EM" },
      { id: "goblet", label: "Goblet main stat", target: "EM" },
      { id: "circlet", label: "Circlet main stat", target: "EM" },
      { id: "em", label: "Total Elemental Mastery", target: "\u2265 900" },
      { id: "er", label: "Energy Recharge", target: "130 \u2013 160 %" },
      { id: "cr", label: "CRIT Rate (damage build only)", target: "\u2265 40 %" },
      { id: "cd", label: "CRIT DMG (damage build only)", target: "\u2265 100 %" },
    ],
    note: "Account-state: C2 + Nightweaver's Looking Glass. EM is king. CRIT only matters if she is also doing personal damage.",
    deep: {
      lore: "Lauma, the Moonchanter of Verdant Dew — a singer of Nod-Krai whose voice draws the Frostmoon's sap from the ground and weaves it into Verdant Dew. She tends the moonlit orchards that ring the northern reach, coaxing growth from frozen soil with hymns older than the Scions.",
      kit: [
        "Skill — plants a Verdant Dew field that pulses Dendro DMG and applies Dendro to nearby enemies, seeding Bloom cores when Hydro is present.",
        "Burst — empowers the party's Bloom and Lunar-Bloom reactions for the duration, granting bonus EM and converting Bloom cores into Bountiful Cores when Columbina's Moonsign is active.",
        "A1 — each Verdant Dew consumed by allies grants Lauma a stack of Moonchanter's Blessing, raising her own EM.",
        "A4 — after Skill, party members who trigger Bloom or Lunar-Bloom gain bonus EM scaling on Lauma's total EM.",
        "C2 — Twine Warnings and Tales From the North: Bloom reaction DMG +500% of EM. Lunar-Bloom DMG +400% of EM. At full stacks, Lunar-Bloom +40% boost. ~80-120% damage increase over C1.",
      ],
      tips: [
        "EM triple-stack (Sands / Goblet / Circlet). Every point of EM feeds her personal damage, her team buff, and her C2 scaling simultaneously.",
        "ER 130-160% is comfortable — her Skill generates particles on each pulse, and Dendro Resonance provides team EM.",
        "BiS weapon Nightweaver's Looking Glass — Millennial Hymn passive gives +60 EM from Skill and +60 EM from Lunar-Bloom, and when both are active, party Bloom DMG +120%, Hyperbloom/Burgeon DMG +80%, Lunar-Bloom DMG +40%. Defines the Lunar-Bloom rotation: Skill first, then trigger Lunar-Bloom within 4.5s to overlap both buffs.",
        "C2 is the breakpoint constellation — Bloom reaction DMG scales +500% of EM and Lunar-Bloom +400% of EM. At full stacks, Lunar-Bloom gets an additional +40% boost, giving ~80-120% more total damage over C1.",
      ],
      synergies: [
        { id: "columbina", why: "Moonsign enabler — converts Lauma's Bloom cores into Lunar-Bloom's Bountiful Cores. Columbina's HP scaling adds the Lunar reaction DMG bonus on top of Lauma's EM scaling." },
        { id: "nefer", why: "Lunar-Bloom DPS pair. Lauma seeds the Verdant Dew that Nefer consumes for empowered hits. Both want EM, and Dendro Resonance gives them +50 EM baseline." },
        { id: "neuvillette", why: "Hydro flood for Bloom core generation. Neuvillette's continuous CA Hydro application keeps Lauma's Dendro field seeding cores at maximum rate." },
      ],
    },
  },
  {
    id: "nefer",
    name: "Nefer",
    epithet: "Curator of the Seeds of Deceit",
    element: "dendro",
    role: "Lunar-Bloom On-Field DPS",
    weaponType: "Catalyst",
    set: "4pc Night of the Sky's Unveiling",
    setAlt: "4pc Gilded Dreams \u00b7 2pc/2pc EM hybrid",
    weapon: "Reliquary of Truth",
    weaponAlt: "Tome of the Eternal Flow \u00b7 Dawning Frost (4\u2605)",
    talents: "Skill \u203a Burst \u203a\u203a Normal",
    stats: [
      { id: "sands", label: "Sands main stat", target: "EM" },
      { id: "goblet", label: "Goblet main stat", target: "EM" },
      { id: "circlet", label: "Circlet main stat", target: "CRIT Rate / DMG" },
      { id: "em", label: "Total Elemental Mastery", target: "900 \u2013 1000" },
      { id: "cr", label: "CRIT Rate", target: "60 \u2013 70 %" },
      { id: "cd", label: "CRIT DMG", target: "180 \u2013 220 %" },
      { id: "er", label: "Energy Recharge", target: "130 \u2013 140 %" },
    ],
    note: "Account-state: C2 + Reliquary of Truth. NotSU 4pc grants +30% CR at Ascendant Gleam \u2014 count it toward your total.",
    deep: {
      lore: "Nefer, the Curator of the Seeds of Deceit \u2014 a keeper of forbidden knowledge in Nod-Krai's northern intelligence network. She cultivates deceptions as others cultivate gardens, planting illusions that bloom into truths no one asked for. Jahoda works for her; the Frostmoon Scions fear her; even Columbina watches her from a respectful distance.",
      kit: [
        "Normal Attack \u2014 Dendro Catalyst strikes that build Veil of Falsehood stacks on hit.",
        "Skill \u2014 Seeds of Deceit: plants a Dendro field that applies Dendro and generates Bloom / Lunar-Bloom cores when Hydro is present. Grants the Secret of Lies EM buff from her weapon.",
        "Burst \u2014 Unveiling: consumes Veil of Falsehood stacks for a massive AoE Dendro nuke, then enters Ascendant Gleam state with enhanced Charged Attacks.",
        "A1 \u2014 Veil of Falsehood stacks grant increasing EM, making her Bloom and Spread damage scale with rotation length.",
        "A4 \u2014 during Ascendant Gleam, Charged Attacks that trigger Spread or Lunar-Bloom gain bonus DMG scaling on total EM.",
        "C2 \u2014 increases Veil of Falsehood stacks limit and duration, buffs Charged Attack DMG, and provides valuable EM buffs. Passive Talent gets higher EM values.",
      ],
      tips: [
        "EM Sands + EM Goblet + CRIT Circlet. EM double-dips on her Spread hits and her Bloom/Lunar-Bloom scaling; CRIT Circlet pushes her personal damage ceiling.",
        "Target 900-1000 EM total. Past 1000, diminishing returns set in for Bloom/Spread \u2014 pivot to CRIT substats.",
        "BiS weapon Reliquary of Truth \u2014 CRIT Rate +8%, Skill grants +80 EM (Secret of Lies, 12s), Lunar-Bloom hits give +24% CRIT DMG (Moon of Truth, 4s). Both active simultaneously \u2192 both effects +50% (so +120 EM and +36% CRIT DMG). Rotation: Skill \u2192 attack within 12s to stack both effects.",
        "C2 is the damage breakpoint \u2014 higher Veil of Falsehood cap means more stacks before Burst, which means a bigger nuke and longer Ascendant Gleam window.",
      ],
      synergies: [
        { id: "lauma", why: "Dendro Resonance + Lunar-Bloom pair. Lauma's Verdant Dew feeds Nefer's empowered hits; both scale on EM." },
        { id: "jahoda", why: "Lore tie \u2014 Jahoda works for Nefer's intelligence network. VV shreds Dendro RES for Nefer's Spread hits; +100 EM heal passive stacks with Nefer's own EM scaling." },
        { id: "columbina", why: "Moonsign enabler. Converts Nefer's Bloom cores into Lunar-Bloom, unlocking the reaction that her kit is built around." },
      ],
    },
  },
  {
    id: "kirara",
    name: "Kirara",
    epithet: "Courier Cat of the Komaniya Express",
    element: "dendro",
    role: "Shielder / Dendro Applicator",
    weaponType: "Sword",
    set: "4pc Tenacity of the Millelith",
    setAlt: "4pc Instructor \u00b7 4pc Deepwood Memories \u00b7 4pc Noblesse Oblige",
    weapon: "Key of Khaj-Nisut",
    weaponAlt: "Freedom-Sworn \u00b7 Favonius Sword \u00b7 Sacrificial Sword \u00b7 Xiphos' Moonlight (F2P)",
    talents: "Skill \u203a Burst \u203a\u203a Normal",
    stats: [
      { id: "sands", label: "Sands main stat", target: "HP % (or ER)" },
      { id: "goblet", label: "Goblet main stat", target: "HP %" },
      { id: "circlet", label: "Circlet main stat", target: "HP %" },
      { id: "hp", label: "Total HP", target: "\u2265 30 000" },
      { id: "er", label: "Energy Recharge", target: "130 \u2013 180 %" },
    ],
    note: "Shield strength scales with HP. No CRIT, no Dendro DMG goblet. Favonius/Sacrificial swords ease energy.",
  },
  {
    id: "zibai",
    name: "Zibai",
    epithet: "The Selenic Adeptus Descends",
    element: "geo",
    role: "Lunar-Crystallize On-Field DPS",
    weaponType: "Sword",
    set: "4pc Night of the Sky's Unveiling",
    setAlt: "4pc Husk of Opulent Dreams",
    weapon: "Lightbearing Moonshard",
    weaponAlt: "Uraku Misugiri \u00b7 Harbinger of Dawn (3\u2605) \u00b7 Flute of Ezpitzal (F2P)",
    talents: "Skill \u203a\u203a Burst \u203a\u203a Normal",
    stats: [
      { id: "sands", label: "Sands main stat", target: "DEF %" },
      { id: "goblet", label: "Goblet main stat", target: "DEF %  \u26a0 not Geo %" },
      { id: "circlet", label: "Circlet main stat", target: "CRIT Rate / DMG" },
      { id: "def", label: "Total DEF", target: "\u2265 3000" },
      { id: "cr", label: "CRIT Rate", target: "60 \u2013 70 % (+30% from set)" },
      { id: "cd", label: "CRIT DMG", target: "150 \u2013 200 %" },
      { id: "er", label: "Energy Recharge", target: "110 \u2013 130 %" },
    ],
    note: "Geo DMG goblet does NOT scale Lunar-Crystallize. Always DEF%.",
  },
  {
    id: "linnea",
    name: "Linnea",
    epithet: "Wandering Advisor of Lumi",
    element: "geo",
    role: "Lunar-Crystallize Sub-DPS / Healer",
    weaponType: "Bow",
    set: "4pc Aubade of Morningstar and Moon",
    setAlt: "4pc Husk of Opulent Dreams",
    weapon: "Golden Frostbound Oath",
    weaponAlt: "Aqua Simulacra \u00b7 Slingshot (3\u2605)",
    talents: "Skill \u203a Burst \u203a\u203a Normal",
    stats: [
      { id: "sands", label: "Sands main stat", target: "DEF %" },
      { id: "goblet", label: "Goblet main stat", target: "DEF %" },
      { id: "circlet", label: "Circlet main stat", target: "CRIT Rate / DMG" },
      { id: "def", label: "Total DEF", target: "\u2265 3000" },
      { id: "cr", label: "CRIT Rate", target: "60 \u2013 70 % (24.2% ascension)" },
      { id: "cd", label: "CRIT DMG", target: "\u2265 150 %" },
      { id: "er", label: "Energy Recharge", target: "110 \u2013 130 %" },
    ],
    note: "Account-state: BiS weapon Golden Frostbound Oath. Aubade needs Ascendant Gleam to fully proc. Her Burst is sustain, not damage \u2014 ER is low priority.",
    deep: {
      lore: "Linnea, the Wandering Advisor of Lumi \u2014 a Geo archer from the luminous reaches of Nod-Krai who heals allies with crystallized moonlight and strikes from the rear line. She advises the Lumi tribe on matters of defence and medicine, preferring to let her arrows and her shields speak louder than her counsel.",
      kit: [
        "Skill \u2014 Mooncrystal Volley: fires a spread of Geo arrows that deal Geo DMG and generate Crystallize shards on contact with elemental auras. With Columbina's Moonsign, these become Lunar-Crystallize triggers.",
        "Burst \u2014 Lumi's Aegis: creates a healing field that restores party HP based on Linnea's DEF. Sustain tool, not a damage source \u2014 ER is low priority.",
        "A1 \u2014 picking up Crystallize shards grants Linnea DEF% for a short duration, stacking her damage and healing simultaneously.",
        "A4 \u2014 Lunar-Crystallize Moondrift Harmony hits gain bonus DMG scaling on Linnea's DEF above 2000.",
        "Ascension stat: 24.2% CRIT Rate at Lv 90 \u2014 significantly reduces CRIT Rate substat requirements.",
      ],
      tips: [
        "DEF% Sands + DEF% Goblet + CRIT Circlet. Her healing, her Lunar-Crystallize damage, and her A4 bonus all scale on DEF.",
        "Aubade of Morningstar and Moon 4pc needs Ascendant Gleam to fully activate \u2014 ensure a Moonsign character (Columbina) is on the team.",
        "BiS weapon Golden Frostbound Oath \u2014 542 Base ATK, 88.2% CRIT DMG. Frost Fae's Favor: DEF +16%, Skill or Lunar-Crystallize hits \u2192 Geo DMG +40% and Lunar-Crystallize Reaction DMG +40% for 6s. 20% party-wide Geo/Lunar-Crystallize boost from Frost Fae's Mischief.",
      ],
      synergies: [
        { id: "columbina", why: "Moonsign enabler \u2014 Linnea's Geo + Columbina's Hydro creates Lunar-Crystallize. Linnea also heals, covering Columbina's sustain gap." },
        { id: "zibai", why: "Dual Geo for Geo Resonance (+15% DMG when shielded). Both trigger Lunar-Crystallize from different angles \u2014 Zibai on-field, Linnea off-field." },
      ],
    },
  },
  {
    id: "xilonen",
    name: "Xilonen",
    epithet: "Cobalt-Tongued Smith of Ochkanatlan",
    element: "geo",
    role: "Universal RES-Shred Support / Healer",
    weaponType: "Sword",
    set: "4pc Scroll of the Hero of Cinder City",
    setAlt: "4pc Song of Days Past \u00b7 4pc Vourukasha's Glow",
    weapon: "Peak Patrol Song",
    weaponAlt: "Freedom-Sworn \u00b7 Key of Khaj-Nisut \u00b7 Favonius Sword (F2P)",
    talents: "Skill \u203a\u203a Burst \u203a Normal",
    stats: [
      { id: "sands", label: "Sands main stat", target: "DEF % (or ER)" },
      { id: "goblet", label: "Goblet main stat", target: "DEF %" },
      { id: "circlet", label: "Circlet main stat", target: "DEF % (or CRIT for sub-DPS)" },
      { id: "def", label: "Total DEF", target: "\u2265 3000" },
      { id: "er", label: "Energy Recharge", target: "130 \u2013 160 %" },
    ],
    note: "Healing and RES shred both scale off DEF. Burst-hungry \u2014 Favonius/Freedom-Sworn ease energy.",
    deep: {
      lore: "A virtuoso of the Children of Echoes \u2014 the Cobalt-Tongued title marks her tongue as a forge: it shapes the Ancient Names her hammer makes flesh. She skates on metal soles she made herself, half artisan and half guerilla, treating every battlefield as another forge \u2014 hammering at enemy resistance until it gives.",
      kit: [
        "Skill \u2014 Yohualtecuhtin's Cleave: stamps a Source Samples ring on the marked enemy, enters Nightsoul, gains skating mobility on field.",
        "Burst \u2014 Ocelotlicue Point!: pulses Pyro \u203a Hydro \u203a Cryo \u203a Electro in sequence, shredding RES for each element struck.",
        "A1: while in Nightsoul, allies' Plunging Attack DMG +30%. A4: her skill DMG and her healing both scale off DEF.",
        "4pc Scroll of the Hero of Cinder City: each Nightsoul-active ally gains +28% of their matching-element DMG; the marked enemy keeps bleeding RES.",
      ],
      tips: [
        "Burst-hungry. 130\u2013160% ER is the floor; Favonius Sword's CR procs pull double duty as energy and team buff.",
        "DEF goblet, never Geo DMG \u2014 her A4 and Lunar-Crystallize both scale off DEF, not Geo%.",
      ],
      synergies: [
        { id: "varesa", why: "Her A1 plunge buff is shaped around Varesa's Vigorous Rush loop. Textbook partner." },
        { id: "arlecchino", why: "Universal RES shred + DEF-scaling healing keep the Bond-of-Life cycle uninterrupted." },
      ],
    },
  },
  {
    id: "arlecchino",
    name: "Arlecchino",
    epithet: "Knave of the House of the Hearth",
    element: "pyro",
    role: "On-Field Main DPS",
    weaponType: "Polearm",
    set: "4pc Fragment of Harmonic Whimsy",
    setAlt: "4pc Gladiator's Finale (Vape teams)",
    weapon: "Crimson Moon's Semblance",
    weaponAlt: "Staff of Homa \u00b7 Staff of the Scarlet Sands",
    talents: "Normal \u203a\u203a Skill \u203a Burst",
    stats: [
      { id: "sands", label: "Sands main stat", target: "ATK % (or EM in Vape)" },
      { id: "goblet", label: "Goblet main stat", target: "Pyro DMG %" },
      { id: "circlet", label: "Circlet main stat", target: "CRIT Rate / DMG" },
      { id: "atk", label: "Total ATK", target: "\u2265 2400" },
      { id: "cr", label: "CRIT Rate", target: "60 \u2013 80 %" },
      { id: "cd", label: "CRIT DMG", target: "180 \u2013 220 %" },
      { id: "er", label: "Energy Recharge", target: "100 \u2013 130 %" },
    ],
    note: "Bond of Life uptime drives Whimsy stacks. Target a ~1:2 CRIT ratio.",
  },
  {
    id: "durin",
    name: "Durin",
    epithet: "The Dragon of Twin Forms",
    element: "pyro",
    role: "Off-Field Sub-DPS / Hexerei",
    weaponType: "Sword",
    set: "4pc A Day Carved from Rising Winds",
    setAlt: "4pc Emblem of Severed Fate \u00b7 4pc Noblesse Oblige",
    weapon: "Athame Artis",
    weaponAlt: "Freedom-Sworn \u00b7 Wolf-Fang (4\u2605)",
    talents: "Burst \u203a Skill \u203a\u203a Normal",
    stats: [
      { id: "sands", label: "Sands main stat", target: "ATK %" },
      { id: "goblet", label: "Goblet main stat", target: "Pyro DMG %" },
      { id: "circlet", label: "Circlet main stat", target: "CRIT Rate / DMG" },
      { id: "atk", label: "Total ATK", target: "\u2265 2500 (caps A4)" },
      { id: "cr", label: "CRIT Rate", target: "60 \u2013 70 %" },
      { id: "cd", label: "CRIT DMG", target: "\u2265 150 %" },
      { id: "er", label: "Energy Recharge", target: "100 \u2013 150 %" },
    ],
    note: "Account-state: C1 + Athame Artis. Two Hexerei in party boosts A1 by 75 %. Vape/Melt teams want some EM substats.",
    altBuilds: [
      {
        id: "vape-melt",
        label: "Vape / Melt",
        role: "Off-Field Vape / Melt Sub-DPS",
        set: "4pc Marechaussee Hunter",
        setAlt: "4pc Crimson Witch of Flames · 2pc Crimson + 2pc Gilded Dreams",
        weapon: "Athame Artis",
        weaponAlt: "Mistsplitter Reforged · Freedom-Sworn · The Black Sword (4★) · Festering Desire (4★ event)",
        talents: "Burst › Skill › Normal",
        stats: [
          { id: "sands", label: "Sands main stat", target: "ATK % (EM if 4pc Gilded Dreams)" },
          { id: "goblet", label: "Goblet main stat", target: "Pyro DMG %" },
          { id: "circlet", label: "Circlet main stat", target: "CRIT Rate / DMG" },
          { id: "atk", label: "Total ATK", target: "≥ 2000" },
          { id: "cr", label: "CRIT Rate", target: "≥ 60 %" },
          { id: "cd", label: "CRIT DMG", target: "≥ 130 %" },
          { id: "em", label: "Elemental Mastery", target: "120 – 200 (substats)" },
          { id: "er", label: "Energy Recharge", target: "150 – 170 %" },
        ],
        note: "Without Hexerei partners the Athame Artis Hexerei bonus does not fire — drop the Hexerei set and chase reaction damage. Vape teams (Mona / Jahoda / Furina) want Crimson Witch + Pyro Goblet; Melt teams (Ganyu / Ayaka) prefer a 2pc/2pc mix to hold Pyro DMG and EM at once.",
      },
    ],
    deep: {
      lore: "Durin, the Dragon of Twin Forms — born from Rhinedottir's alchemy, part dragon and part something older. He shifts between a dark draconic form and a luminous humanoid form, each carrying a different elemental weight. The Hexenzirkel watches him as both a weapon and a ward; Nicole alone among the coven sees the mind behind the eyes.",
      kit: [
        "Skill — Searing Breath: deals AoE Pyro DMG in a cone and applies Pyro to enemies. Generates particles and triggers Burgeon when Dendro cores are present.",
        "Burst — Eclipse of the Twin Forms: massive AoE Pyro DMG, then Durin enters Light Form (White Durin) for the duration, gaining enhanced off-field Pyro pulses that deal continuous Pyro DMG to nearby enemies.",
        "A1 — Rhinedottir's Legacy: Durin's off-field Pyro pulse DMG is increased by 75% when 2+ Hexerei characters are in the party. The core scaling lever — always run him with Nicole, Mona, Varka, or Prune.",
        "A4 — Dragon's Heart: ATK above a threshold grants bonus Pyro DMG %, capping around 2500 ATK. The reason ATK% stacking is his primary build path.",
        "C1 — Adamah's Redemption: Burst gains additional effects. Light Form (White Durin): party gains 20 stacks Cycle of Enlightenment (20s). Active characters' NA/CA/Plunge/Skill/Burst consume 1 stack to deal additional DMG equal to 60% of Durin's ATK. Also Burst DMG +40%. 30% chance per stack to not consume the stack.",
      ],
      tips: [
        "ATK% Sands + Pyro Goblet + CRIT Circlet. His off-field pulses and Burst both scale on ATK, and A4 converts excess ATK into Pyro DMG%. Target ≥2500 ATK to cap the A4 bonus.",
        "Hexerei team is mandatory for peak performance — A1's +75% pulse DMG requires 2+ Hexerei. Nicole is the natural pair (Pyro resonance + shield + ATK buff + instant Methexis).",
        "C1 is the breakpoint — Cycle of Enlightenment stacks turn every party member's attacks into extra damage instances at 60% of Durin's ATK, and the 30% chance to preserve stacks extends the window significantly. Burst DMG +40% is the cherry on top.",
        "BiS weapon Athame Artis — 608 Base ATK + 33.1% CRIT Rate. Day King's Splendor Solis: Burst CRIT DMG +16-32%, Burst hits grant Blade of Daylight Hours (self ATK +20-40%, party ATK +16-32%). With Hexerei: Secret Rite (2+ Hexerei in party), Blade of Daylight Hours effects +75%. The Hexerei scaling makes this weapon shine when paired with Mona/Nicole/Prune/Varka.",
      ],
      synergies: [
        { id: "nicole", why: "Hexerei + Pyro sister. Two-Hexerei A1 +75% is automatic. Nicole's shield absorbs Burgeon self-damage at 250% efficiency; her ATK buff lifts Durin's off-field Pyro pulses and feeds the C1 Cycle of Enlightenment scaling." },
        { id: "mona", why: "Hexerei tribe-mate. Omen amplifies the marked enemy's incoming DMG, and Astral Glow of Mercury fires +15% per stack onto Durin's Vape detonations. Two Hexerei in party activates his A1 +75% bonus." },
        { id: "varka", why: "Hexerei + Anemo swirler. Varka's on-field Swirls spread Durin's Pyro for VV RES shred. ADCFRW's +20% CR triggers with two Hexerei. Durin's C1 stacks feed Varka's rapid NA chains." },
      ],
    },
  },
  {
    id: "chevreusse",
    name: "Chevreusse",
    epithet: "Sergeant, Special Security Patrol",
    element: "pyro",
    role: "Overload Support",
    weaponType: "Polearm",
    set: "4pc Scroll of the Hero of Cinder City",
    setAlt: "4pc Noblesse Oblige \u00b7 4pc Instructor \u00b7 4pc Tenacity of the Millelith",
    weapon: "Right Hand of the Boss",
    weaponAlt: "Favonius Lance \u00b7 Black Tassel \u00b7 Prototype Starglitter (F2P)",
    talents: "Burst \u203a Skill \u203a\u203a Normal",
    stats: [
      { id: "sands", label: "Sands main stat", target: "HP %  (or ER if low energy)" },
      { id: "goblet", label: "Goblet main stat", target: "HP %" },
      { id: "circlet", label: "Circlet main stat", target: "HP %" },
      { id: "hp", label: "Total HP", target: "\u2265 30 000" },
      { id: "er", label: "Energy Recharge", target: "160 \u2013 200 %" },
    ],
    note: "Team buff scales off combined Pyro + Electro HP. Pure support \u2014 no CRIT needed.",
  },
  {
    id: "bennett",
    name: "Bennett",
    epithet: "The Adventurer Cursed by Misfortune",
    element: "pyro",
    role: "Burst Support / Healer",
    weaponType: "Sword",
    set: "4pc Noblesse Oblige",
    setAlt: "4pc Instructor (EM-share teams) \u00b7 4pc Exile (legacy ER set)",
    weapon: "Aquila Favonia",
    weaponAlt: "Mistsplitter Reforged \u00b7 Festering Desire (4\u2605 R5, event) \u00b7 Sapwood Blade (4\u2605) \u00b7 Iron Sting (4\u2605 F2P)",
    talents: "Burst \u203a Skill \u203a\u203a Normal",
    stats: [
      { id: "sands", label: "Sands main stat", target: "ER %  (ATK % once ER capped)" },
      { id: "goblet", label: "Goblet main stat", target: "ATK %  (Pyro DMG % only if he attacks)" },
      { id: "circlet", label: "Circlet main stat", target: "Healing Bonus / ATK %" },
      { id: "atk", label: "Base ATK (weapon + character)", target: "as high as possible \u2014 drives the buff" },
      { id: "er", label: "Energy Recharge", target: "200 \u2013 260 %" },
    ],
    note: "His Burst ATK buff scales off Bennett's BASE ATK (weapon + character), NOT total ATK \u2014 high-base weapons like Aquila Favonia matter more than substat ATK %. C6's Pyro infusion has a lingering 'trap' reputation, but in 2026 almost every modern melee DPS auto-infuses (Hu Tao, Diluc, Yoimiya, Arlecchino, Mavuika \u2026), so there is nothing to override \u2014 for those teams C6 is effectively free +15 % Pyro DMG. Only skip C6 if you specifically run a melee NA DPS that needs a non-Pyro element on the swing (Physical Razor, no-skill-infusion Keqing, old Aggravate/Hyperbloom melee setups).",
    altBuilds: [
      {
        id: "sub-dps",
        label: "Sub-DPS",
        role: "Sub-DPS / Personal Damage",
        set: "4pc Crimson Witch of Flames",
        setAlt: "4pc Marechaussee Hunter \u00b7 4pc Lavawalker (Vape / Melt)",
        weapon: "Mistsplitter Reforged",
        weaponAlt: "Aquila Favonia \u00b7 The Black Sword \u00b7 Festering Desire (4\u2605 event) \u00b7 Sapwood Blade (4\u2605)",
        talents: "Skill \u203a Burst \u203a Normal",
        stats: [
          { id: "sands", label: "Sands main stat", target: "ATK %" },
          { id: "goblet", label: "Goblet main stat", target: "Pyro DMG %" },
          { id: "circlet", label: "Circlet main stat", target: "CRIT Rate / DMG" },
          { id: "atk", label: "Total ATK", target: "\u2265 2200" },
          { id: "cr", label: "CRIT Rate", target: "60 \u2013 70 %" },
          { id: "cd", label: "CRIT DMG", target: "\u2265 140 %" },
          { id: "er", label: "Energy Recharge", target: "140 \u2013 160 %" },
        ],
        note: "When Bennett gets actual on-field windows (Vape/Melt rotations, Mavuika's roster, quick-swap teams), build him for personal damage. Pyro Goblet + Crimson Witch make his Skill into real DPS \u2014 he still drops Burst for the team buff, but the Skill / NA between casts now matters.",
      },
    ],
    deep: {
      lore: "Mondstadt's most cheerful tragedy. Bennett was found as a baby outside the city and adopted by Benny's Adventure Team \u2014 a guild of five elderly adventurers who took turns raising him. He is so persistently unlucky that the rest of his team usually stays in town because joining one of his expeditions triples the chance of catastrophe. None of this has dimmed him: he still leads, still grins, still drags himself out of every collapsed ruin and logs it as a successful expedition. The Pyro Vision suits him \u2014 warmth, steady flame, a refusal to be put out.",
      kit: [
        "Skill \u2014 Passion Overload (Tap): a quick Pyro slash on a short CD. The rotation press.",
        "Skill \u2014 Passion Overload (Hold): a two-stage charge that launches him forward and pops lighter enemies airborne. Almost always skipped \u2014 the tap is the rotation.",
        "Burst \u2014 Fantastic Voyage (60 energy): plants a stationary Pyro field for 12s. Anyone inside below 70% HP gets healed; anyone inside above 70% HP gets a flat ATK buff that scales off Bennett's BASE ATK \u00d7 a talent multiplier (\u224895% at talent 13).",
        "A1 \u2014 Rekindle: Bennett's own Charged Attack stamina cost \u221250%. Niche.",
        "A4 \u2014 Fearnaught: inside his own Burst field, his Skill CD is reduced 50% and the Hold variant stops launching him backward.",
        "C1 \u2014 Grand Adventurer's Heart: raises the talent ceiling on the Burst's ATK buff. The first real damage power-spike.",
        "C6 \u2014 Fire Ventures with Me: active characters in the field gain Pyro Infusion on Sword/Claymore/Polearm Normal Attacks and +15% Pyro DMG. Overrides the NA element ONLY if the DPS doesn't already auto-infuse \u2014 a problem for Physical DPS or non-auto-infusion melee NA comps; harmless for Hu Tao, Diluc, Yoimiya, Klee, Arlecchino, Mavuika, and basically every modern Pyro DPS.",
      ],
      tips: [
        "Base ATK is the lever, not substat ATK %. Aquila Favonia is BiS specifically for its high base ATK; Mistsplitter and other high-base 5\u2605 swords work; Festering Desire R5 is the 4\u2605 alternative when accessible.",
        "Aim for ~200% ER as a baseline; 240-260% if running double Pyro or low-particle teams. Sands ER until the cap, THEN swap to ATK % \u2014 his ATK % does NOT enter the buff formula, but it makes his own hits matter if he ever attacks.",
        "4pc Noblesse Oblige is the canonical set: stacking NO on Bennett hands the whole party +20% ATK on top of his Burst buff. Instructor 4pc is a niche pick for EM-share teams (Sucrose Burgeon).",
        "C6 is widely called a 'trap' but the reputation is outdated. Its Pyro infusion only overrides melee NAs that AREN'T already auto-infused, and almost every modern on-field DPS auto-infuses on their own. KQM and community consensus in 2026: take C6 freely on most accounts — the +15 % Pyro DMG and infusion are clean upside. The legacy exceptions (Physical Razor, old Aggravate/Hyperbloom-with-melee-NA, Keqing without skill infusion) are now niche.",
        "His field is stationary. Place it where the DPS will stand; against mobile bosses, recast or kite the boss into the circle.",
      ],
      synergies: [
        { id: "mavuika", why: "Buff stack: Bennett's NO 4pc + Burst ATK buff feeds Mavuika's Pyro DMG, Crucible state hits, and Sacred Flame pulses. Her Fighting Spirit rotation outlives Bennett's 12s field, so plant it before her Burst window and let the buffed Crucible swings clean up. Both Pyro \u2014 no element conflict, and she doesn't depend on reactions to deal damage." },
        { id: "arlecchino", why: "Conditional. Arlecchino's passive burns her own HP into Bond of Life \u2014 Bennett's heal competes with that loop. The ATK buff is still excellent, but you usually want to keep her ABOVE 70% HP inside the field so it only buffs, never heals. Tricky to position; many players skip Bennett for her and run Furina/Yelan instead." },
        { id: "sucrose", why: "Classic National-Anemo. Sucrose's Swirl spreads Bennett's Pyro for Vape/Melt setup, and her 4pc Viridescent Venerer shreds enemy Pyro RES \u221240%. With her A1/A4 she also passes EM around the team if Bennett runs Instructor 4pc." },
      ],
    },
  },
  {
    id: "nicole",
    name: "Nicole",
    epithet: "Nicole Reeyn \u00b7 'N' of the Hexenzirkel",
    element: "pyro",
    role: "Hexerei Off-Field Buffer / Shielder / Coordinated DPS",
    weaponType: "Catalyst",
    set: "4pc Tenacity of the Millelith",
    setAlt: "4pc Noblesse Oblige (sole buffer) \u00b7 4pc Vourukasha's Glow (HP / shield hybrid) \u00b7 2pc Tenacity + 2pc ATK %",
    weapon: "Angelos' Heptades (Seven Edicts of Dust and Light)",
    weaponAlt: "Sacrificial Jade \u00b7 Tome of the Eternal Flow \u00b7 A Thousand Floating Dreams \u00b7 Wandering Evenstar (4\u2605 EM / ATK hybrid)",
    talents: "Skill \u203a Burst \u203a\u203a Normal",
    stats: [
      { id: "sands", label: "Sands main stat", target: "ATK %  (HP % only on shield-stacking variants)" },
      { id: "goblet", label: "Goblet main stat", target: "ATK %  (Coordinated Attacks scale on Nicole's ATK)" },
      { id: "circlet", label: "Circlet main stat", target: "CRIT Rate / DMG" },
      { id: "atk", label: "Total ATK", target: "\u2265 2400" },
      { id: "er", label: "Energy Recharge", target: "140 \u2013 180 %" },
      { id: "cr", label: "CRIT Rate", target: "\u2265 60 %" },
      { id: "cd", label: "CRIT DMG", target: "\u2265 140 %" },
    ],
    note: "Kit details are leak-based as of 6.6 pre-release \u2014 verify on launch. Account-state: C2 + Angelos' Heptades (Sacred Benediction unlocked). Grace of Kenosis is a FLAT ATK buff (same buff TYPE as Bennett, NOT a separate ATK %): the team gains flat ATK equal to 15 % of Nicole's ATK, capped at +600 flat ATK. Guidance of Theosis upgrade adds another +300 flat ATK, for a maximum of +900 flat ATK. Bennett with Aquila Favonia still delivers ~+1200 \u2014 Nicole is the smaller raw buff but adds a 250 %-Pyro shield, Coordinated Attacks, and at C2 a universal \u221220 % element RES shred. Coordinated Attack cap: 1 every 3 s, max 5 per Burst rotation, element follows active character. Build ATK on Nicole to ~4000 to cap the buff (extra ATK past that still grows the shield and her CAs). Methexis A4: after Skill she watches the active character for 20 s; the buff upgrades from Grace to Guidance after 3 s on field \u2014 INSTANT if the watched character is Hexerei (Mona / Durin / Varka / Prune).",
    deep: {
      lore: "Nicole Reeyn, the voiceless angel. Member of the Hexenzirkel coven alongside Mona, Alice, and Rhinedottir. Codename 'N'. Speaks only through Arcane Projection \u2014 silent illusions she sends in her place. Her story is tangled with Durin's: the leaked Story Quest implies she was present when Rhinedottir's dragon-child was made, and she alone among the coven tried to save what was left of his mind.",
      kit: [
        "Skill \u2014 Grace of Kenosis: deals AoE Pyro DMG, grants all party members the Grace of Kenosis FLAT ATK buff (15 % of Nicole's ATK, capped at +600 flat ATK), and plants the Shield of Blazing Light. Shield strength scales separately on Nicole's ATK with no cap; absorbs Pyro at 250 % effectiveness; ~20 s duration.",
        "Burst \u2014 Silent Contemplation: AoE Pyro DMG, then Nicole enters Silent Contemplation mode. While in this mode, when a nearby party member hits an enemy, Nicole launches an Arcane Projection Coordinated Attack of the ACTIVE CHARACTER's element, scaling on NICOLE'S ATK. Cap: 1 Coordinated Attack every 3 s, max 5 per Burst rotation.",
        "Coordinated Attack mechanic \u2014 element follows the on-field character; damage stat follows Nicole. Hyperbloom Ororon up \u2192 Electro projections that contribute to Hyperbloom triggers. Mona on field \u2192 Hydro projections that Vape on her own Pyro Skill residue.",
        "A1 (leak) \u2014 increases the team ATK buff with Nicole's own ATK. Investing in her ATK feeds the buff she gives the team.",
        "A4 \u2014 Methexis: after Skill, Nicole observes the active character for 20 s. If they stay on field for 3 s, Grace of Kenosis upgrades to Guidance of Theosis (adds +300 flat ATK on top of Grace, so +900 flat ATK max, plus a Coordinated Attack DMG bonus). If the observed character is Hexerei, the upgrade is INSTANT.",
        "C2 \u2014 Sacred Benediction (UNLOCKED on this account): every time a Coordinated Attack hits, nearby enemies have their elemental RES reduced 20 % \u2014 specifically the element matching the ACTIVE CHARACTER. This is a universal, element-following RES shred (Zhongli-style scope, smaller value) and is a major endgame power-spike: it sidesteps Anemo + 4pc VV setups entirely and gives you \u221220 % RES on whatever DPS you put on field.",
        "C6 (leak) \u2014 Coordinated Attacks fire multi-strike or crit twice; details still noisy, verify on launch.",
      ],
      tips: [
        "Build ATK %, NOT HP. Her shield, buff input, and Coordinated Attacks all scale on her ATK \u2014 there is no HP-scaling lever. Target ~4000 ATK to cap the buff at +600 (then +300 on the Guidance upgrade for +900 total). ATK past 4000 still feeds the shield and her Coordinated Attacks, just not the buff. 4pc Tenacity of the Millelith is BiS because her Skill grants a shield, which triggers Millelith's Mercy (+20 % party ATK %, a SEPARATE buff that stacks with her flat-ATK buff).",
        "Account-state assumption: C2 unlocked. Sacred Benediction's \u221220 % element-following RES shred is the real value-add \u2014 it makes Nicole element-agnostic as a support and gives every team a Zhongli-style RES shred without the Geo slot. Trigger it consistently by ensuring the active DPS lands a hit every 3 s so each Coordinated Attack tags the enemy with the matching shred.",
        "Hexerei team = instant Methexis upgrade. Run her with Mona, Durin, Varka, or Prune and Guidance of Theosis fires on the swap \u2014 no 3-second wait. Outside Hexerei the buff is still strong; it just takes a moment to reach full value.",
        "Coordinated Attacks adopt the active character's element AND the C2 RES shred. She is the cleanest off-field support for any DPS regardless of element \u2014 Hyperbloom Ororon \u2192 Electro projections + \u221220 % Electro RES; on-field Mona \u2192 Hydro projections + \u221220 % Hydro RES that Vape on her own Pyro residue.",
        "Burst energy cost is leaked at 70. Comfortable ER target is 140-180 %. Sacrificial Jade lets her drop ER substats entirely.",
        "Shield absorbs Pyro at 250 %. She is the cleanest Burgeon shielder in the game \u2014 Nahida / Yelan / Thoma \u2192 Nahida / Yelan / Nicole upgrades the shield AND adds a team ATK buff AND adds free Coordinated Attacks on the DPS.",
        "Bennett comparison: same buff TYPE (flat ATK), but Bennett delivers ~+1200 with Aquila Favonia vs Nicole's max +900. Nicole's tradeoffs: no Pyro-infusion downside, universal across reaction comps, AND adds a 250 %-Pyro shield + Coordinated Attacks. Cost: NO healing \u2014 pair her with a healer or Furina if the team can't sustain on shield alone.",
        "BiS weapon Angelos' Heptades (Seven Edicts of Dust and Light) \u2014 741 Base ATK, 16.5% ATK substat. Crown of the Final Scion: ATK +12-24%, Shield creation grants Pathfinder's Light (20s) buffing active party DMG by +10-22% per 1000 ATK Nicole has (max +26-58%). Also restores Energy on hit. The weapon directly amplifies her ATK-scaling buff formula and solves ER.",
      ],
      synergies: [
        { id: "mona", why: "Coven sisters and the design pair. Mona triggers instant Methexis on Nicole and vice versa. Mona's Omen amplifies Nicole's Coordinated Attacks on the marked enemy; Nicole's Pyro Skill residue reacts with Mona's Hydro Phantom for Vape. TTDS Mona + Tenacity Nicole double-buffs any ATK-scaling DPS." },
        { id: "durin", why: "Hexerei + Pyro brother. Durin's two-Hexerei A1 +75 % is automatic with Nicole on the team; Nicole's shield absorbs his Burgeon self-damage at 250 % efficiency; her ATK buff lifts his off-field Pyro pulses." },
        { id: "varka", why: "Hexerei tribe-mate. Varka's on-field Swirls feed Nicole's Anemo Coordinated Attacks, which then re-swirl with Pyro from her Skill residue. Methexis upgrades on swap. ADCFRW's +20 % CR triggers on both with two Hexerei in party. C2 layers a clean \u221220 % Anemo RES every 3 s on top." },
        { id: "neuvillette", why: "Outside Hexerei: Nicole on Tenacity 4pc with Coordinated Attacks taking Hydro element while Neuvillette CAs. At C2 she also strips \u221220 % Hydro RES every 3 s, stacking on top of Neuvillette's own RES shred (additive \u2014 different sources). Shield protects his HP buffer. Furina interaction: clean multiplicative stack \u2014 Fanfare is a DMG % bonus, Nicole's Grace is flat ATK, they live in different terms of the formula and BOTH apply. Furina + C2 Nicole + Neuvillette is one of the highest-ceiling Mono-Hydro lines available." },
      ],
    },
  },
  {
    id: "mavuika",
    name: "Mavuika",
    epithet: "God of War \u00b7 Pyro Archon of Natlan",
    element: "pyro",
    role: "On-Field Main DPS",
    weaponType: "Claymore",
    set: "4pc Obsidian Codex",
    setAlt: "4pc Marechaussee Hunter (with Furina) \u00b7 4pc Gilded Dreams (Melt / Vape)",
    weapon: "A Thousand Blazing Suns",
    weaponAlt: "Beacon of the Reed Sea \u00b7 Wolf's Gravestone \u00b7 Serpent Spine (4\u2605 R5 F2P) \u00b7 Tidal Shadow (4\u2605)",
    talents: "Burst \u203a\u203a Skill \u203a Normal",
    stats: [
      { id: "sands", label: "Sands main stat", target: "ATK %" },
      { id: "goblet", label: "Goblet main stat", target: "Pyro DMG %" },
      { id: "circlet", label: "Circlet main stat", target: "CRIT Rate / DMG" },
      { id: "atk", label: "Total ATK", target: "\u2265 2400" },
      { id: "cr", label: "CRIT Rate", target: "40 \u2013 60 % (Obsidian Codex 4pc gives +40% on top)" },
      { id: "cd", label: "CRIT DMG", target: "\u2265 200 %" },
      { id: "er", label: "Energy Recharge", target: "\u2248 100 % (irrelevant \u2014 see notes)" },
    ],
    note: "Her Burst runs on Fighting Spirit (generated when nearby Nightsoul-active teammates use bursts or hit normal attacks), NOT energy. Run 2+ Natlan teammates to keep Fighting Spirit topped. ER stat is functionally dead.",
    deep: {
      lore: "The God of War. Pyro Archon of Natlan and the only one of the Seven who leads from the front \u2014 where Zhongli retired into mortal disguise and Venti prefers anonymity, Mavuika stays at the head of her tribes. The name 'Mavuika' is not personal; it is the title granted by the Sacred Flame to whichever Natlan hero takes the Crimson Witness ritual and binds themselves to the Pyro throne. Beneath the mantle she is still a Child of Echoes \u2014 Xilonen's tribe-sister and forge-kin \u2014 and she carries that on her back into every fight.",
      kit: [
        "Skill \u2014 Ring of Searing Radiance (Tap): manifests an AoE Pyro ring that continuously deals Pyro DMG to nearby opponents.",
        "Skill \u2014 Flamestrider (Hold): she mounts her motorcycle. Her Normal, Charged, and Plunging Attacks all convert to Pyro DMG while riding, and she gains move speed.",
        "Burst \u2014 Crucible of Death and Life: does NOT consume energy. Instead it consumes Fighting Spirit (a separate resource \u2014 see A1). Requires \u226550% Fighting Spirit to cast. Heavy AoE Pyro DMG, then enters a Crucible state where her Normal/Charged Attacks pulse a Sacred-Flame field.",
        "A1 \u2014 Gift of Flaming Flowers: when a teammate triggers a Nightsoul Burst near Mavuika, she gains 50 Fighting Spirit. Normal Attack hits from teammates also generate small amounts. Fighting Spirit caps at 200.",
        "A4 \u2014 Kiongozi: when she casts her Burst, every active character afterwards receives an attack buff scaled to the Fighting Spirit she consumed. Decays over time.",
        "Constellation tech (Wonders of the World achievement): her Flamestrider can be summoned in the overworld as a permanent mount \u2014 a perk of being the Pyro Archon.",
      ],
      tips: [
        "Forget ER. Her Burst doesn't use energy \u2014 you literally cannot make her queue burst by stacking ER. Drop the Sands slot to ATK%, drop ER substats for anything else.",
        "Obsidian Codex 4pc grants +40% CRIT Rate while she's in Nightsoul state \u2014 so target ~40-60% CR from substats and OVERSHOOT CRIT DMG (\u2265200%). Going past 60% CR on substats is wasted.",
        "Need 2+ Natlan teammates (or otherwise Nightsoul-capable characters) in the party \u2014 Fighting Spirit comes from their Nightsoul Bursts. Solo-Mavuika in a non-Natlan team starves on the resource.",
        "A Thousand Blazing Suns is a meaningful jump over alternatives. Beacon of the Reed Sea is the second pick. Serpent Spine R5 is the F2P pick (and ironic \u2014 it punishes you for taking damage, which Citlali's shield would normally prevent).",
      ],
      synergies: [
        { id: "xilonen", why: "Children-of-Echoes tribe-sister. Mechanically the textbook partner: her Nightsoul Burst feeds Fighting Spirit, her 4pc Scroll of Cinder City gives Mavuika +28% Pyro DMG, her healing keeps Mavuika alive for Serpent Spine / Crucible state, and her DEF-scaling RES shred is element-agnostic." },
        { id: "jahoda", why: "Anemo Swirl + 4pc Viridescent Venerer = \u221240% Pyro RES on the enemy. Her +100 EM heal passive isn't huge for a pure-CRIT Mavuika but the RES shred carries every team that has her." },
        { id: "chasca", why: "Natlan + Anemo bow. Her bullet-element switching can swirl Pyro for VV RES shred, and her Nightsoul Bursts contribute to Mavuika's Fighting Spirit pool. Field-time competes with Mavuika so she works best as the off-field bullet-rain support." },
      ],
    },
  },
  {
    id: "clorinde",
    name: "Clorinde",
    epithet: "Champion Duelist",
    element: "electro",
    role: "On-Field Hypercarry DPS",
    weaponType: "Sword",
    set: "4pc Fragment of Harmonic Whimsy",
    setAlt: "4pc Thundering Fury (Aggravate) · 2pc+2pc ATK/Electro",
    weapon: "Absolution",
    weaponAlt: "Mistsplitter Reforged · Light of Foliar Incision · The Black Sword (4★)",
    talents: "Skill ›› Burst › Normal",
    stats: [
      { id: "sands", label: "Sands main stat", target: "ATK % (EM in Aggravate)" },
      { id: "goblet", label: "Goblet main stat", target: "Electro DMG %" },
      { id: "circlet", label: "Circlet main stat", target: "CRIT DMG (Rate if needed)" },
      { id: "atk", label: "Total ATK", target: "≥ 2000" },
      { id: "cr", label: "CRIT Rate", target: "≥ 70 %" },
      { id: "cd", label: "CRIT DMG", target: "≥ 180 %" },
      { id: "er", label: "Energy Recharge", target: "110 – 130 %" },
    ],
    note: "All damage comes from her Skill (Night Vigil pistolet state) — Normal Attack talent is irrelevant. Bond of Life fluctuations drive 4pc Harmonic Whimsy stacks (+18% DMG each, max 3). In Aggravate teams swap Sands to EM and target ≥ 200 EM.",
    altBuilds: [
      {
        id: "aggravate",
        label: "Aggravate",
        role: "Aggravate Hypercarry DPS",
        set: "4pc Thundering Fury",
        setAlt: "4pc Fragment of Harmonic Whimsy (if EM lines also roll) · 2pc Thundering Fury + 2pc Gilded Dreams",
        weapon: "Absolution",
        weaponAlt: "Mistsplitter Reforged · Light of Foliar Incision · Iron Sting (4★) · Toukabou Shigure (4★)",
        talents: "Skill ›› Burst › Normal",
        stats: [
          { id: "sands", label: "Sands main stat", target: "EM" },
          { id: "goblet", label: "Goblet main stat", target: "Electro DMG %" },
          { id: "circlet", label: "Circlet main stat", target: "CRIT DMG" },
          { id: "em", label: "Elemental Mastery", target: "≥ 200" },
          { id: "atk", label: "Total ATK", target: "≥ 1800" },
          { id: "cr", label: "CRIT Rate", target: "≥ 70 %" },
          { id: "cd", label: "CRIT DMG", target: "≥ 200 %" },
          { id: "er", label: "Energy Recharge", target: "110 – 130 %" },
        ],
        note: "With Nahida + a Dendro keeper, every pistolet hit procs Aggravate independently — EM Sands outscales ATK %. Thundering Fury also cuts her Skill cooldown by 1 s per Aggravate trigger, extending the Night Vigil window mid-burst.",
      },
    ],
    deep: {
      lore: "Fontaine’s undefeated Champion Duelist, arbiter of divine justice through trial by combat. She wields rapier and pistolet in tandem — every duel she fights is, in her eyes, a prayer answered by the Hydro Archon’s justice.",
      kit: [
        "Skill — Night Vigil: transforms Normal Attacks into Electro-infused pistolet shots and lunging strikes for 7.5s. All meaningful damage lives here.",
        "Burst — Last Lightfall: large Electro AoE that grants a Bond of Life equal to 150% of ATK. The Bond fuels Harmonic Whimsy stacks and her A1 passive.",
        "A1: when Bond of Life ≥ 100% of Max HP, pistolet shots gain +35% DMG and heal on hit.",
        "A4: after Bond of Life changes, Clorinde gains +20% ATK for 15s (max 3 stacks). Permanent uptime in rotation.",
        "Core loop: Burst (grants Bond) › Skill › pistolet shots consume Bond › Harmonic Whimsy stacks ramp › repeat.",
      ],
      tips: [
        "Level Skill to 10 first — it’s where all the multipliers live. Burst is second (Bond of Life value + AoE nuke). Normal Attack talent does nothing.",
        "4pc Harmonic Whimsy stacks refresh on every Bond of Life change — with Burst granting Bond and pistolet shots consuming it, you hit 3 stacks within the first rotation.",
        "In Aggravate teams (with Nahida/Fischl), EM Sands + EM substats outscale ATK% because each pistolet hit procs Aggravate independently.",
      ],
      synergies: [
        { id: "fischl", why: "Oz provides off-field Electro particles and co-triggers Aggravate. Electro Resonance covers ER." },
        { id: "nahida", why: "Persistent Dendro application turns every pistolet shot into an Aggravate proc. Nahida’s EM share further scales the flat damage." },
        { id: "xilonen", why: "Universal RES shred + healing in one slot. Clorinde’s Bond of Life self-heal stacks with Xilonen’s sustain." },
      ],
    },
  },
  {
    id: "fischl",
    name: "Fischl",
    epithet: "Prinzessin der Verurteilung",
    element: "electro",
    role: "Off-Field Sub-DPS",
    weaponType: "Bow",
    set: "4pc Thundering Fury",
    setAlt: "4pc Golden Troupe \u00b7 4pc Gilded Dreams (reactions)",
    weapon: "Polar Star",
    weaponAlt: "Skyward Harp \u00b7 Thundering Pulse \u00b7 The Stringless (4\u2605) \u00b7 Mitternachts Waltz (4\u2605)",
    talents: "Skill \u203a\u203a Burst \u203a Normal",
    stats: [
      { id: "sands", label: "Sands main stat", target: "ATK % (EM in Hyperbloom)" },
      { id: "goblet", label: "Goblet main stat", target: "Electro DMG %" },
      { id: "circlet", label: "Circlet main stat", target: "CRIT Rate / DMG" },
      { id: "atk", label: "Total ATK", target: "\u2265 2000" },
      { id: "cr", label: "CRIT Rate", target: "\u2265 70 %" },
      { id: "cd", label: "CRIT DMG", target: "\u2265 150 %" },
      { id: "er", label: "Energy Recharge", target: "130 \u2013 160 %" },
    ],
    note: "Oz is the damage. In Hyperbloom/Aggravate teams swap to full EM build (EM Sands/Goblet/Circlet, target \u2265 800).",
    altBuilds: [
      {
        id: "hyperbloom",
        label: "Hyperbloom Trigger",
        role: "Hyperbloom Trigger (EM)",
        set: "4pc Flower of Paradise Lost",
        setAlt: "4pc Gilded Dreams \u00b7 4pc Thundering Fury (Aggravate)",
        weapon: "Sacrificial Bow (4\u2605)",
        weaponAlt: "Polar Star \u00b7 Favonius Warbow \u00b7 The Stringless (4\u2605 EM) \u00b7 Prototype Crescent (F2P)",
        talents: "Skill \u203a\u203a Burst \u203a Normal",
        stats: [
          { id: "sands", label: "Sands main stat", target: "EM" },
          { id: "goblet", label: "Goblet main stat", target: "EM" },
          { id: "circlet", label: "Circlet main stat", target: "EM" },
          { id: "em", label: "Elemental Mastery", target: "\u2265 800" },
          { id: "er", label: "Energy Recharge", target: "130 \u2013 160 %" },
        ],
        note: "In Bloom teams (Nahida + Furina + Yelan / Xingqiu), Oz becomes a Hyperbloom factory \u2014 drop ATK and CRIT, every EM point converts directly into Hyperbloom DMG. 4pc Flower of Paradise Lost amplifies Hyperbloom by +40 % per stack (max 4) once she triggers a Dendro/Bloom reaction.",
      },
    ],
  },
  {
    id: "flins",
    name: "Flins",
    epithet: "Lightkeeper Against the Wild Hunt",
    element: "electro",
    role: "Lunar-Charged On-Field DPS",
    weaponType: "Polearm",
    set: "4pc Night of the Sky's Unveiling",
    setAlt: "4pc Thundering Fury \u00b7 4pc Gilded Dreams",
    weapon: "Bloodsoaked Ruins",
    weaponAlt: "Staff of the Scarlet Sands \u00b7 Engulfing Lightning \u00b7 Prospector's Shovel (craftable)",
    talents: "Burst \u203a Skill \u203a\u203a Normal",
    stats: [
      { id: "sands", label: "Sands main stat", target: "ATK % (or ER if needed)" },
      { id: "goblet", label: "Goblet main stat", target: "ATK %  \u26a0 not Electro %" },
      { id: "circlet", label: "Circlet main stat", target: "CRIT Rate / DMG" },
      { id: "atk", label: "Total ATK", target: "2200 \u2013 2500" },
      { id: "cr", label: "CRIT Rate", target: "50 \u2013 70 % (+30% from set)" },
      { id: "cd", label: "CRIT DMG", target: "\u2265 175 %" },
      { id: "er", label: "Energy Recharge", target: "120 \u2013 140 %" },
    ],
    note: "Account-state: C2 + Bloodsoaked Ruins. Electro DMG goblet does NOT scale Lunar-Charged. ATK% goblet. A4 converts ATK \u2192 EM up to 160.",
    deep: {
      lore: "Flins, the Lightkeeper Against the Wild Hunt \u2014 born of Nod-Krai, raised in the watchtower-cloisters that ring the Frostmoon plains. The Lightkeepers are an order older than the Scions, sworn to hold the line at moonrise when the Wild Hunt \u2014 the Frostmoon's white-eyed shades and their hungering riders \u2014 break across the northern reach. He carries an oath-polearm whose haft is bound in cold iron and whose head is etched with a Lunar Sigil; tradition says it has been re-forged in every generation but never re-named.",
      kit: [
        "Normal Attack \u2014 four-stage polearm chain dealing Electro DMG (auto-infused). Charged Attacks consume stamina to deliver a heavier Electro stab that builds the Lightkeeper's Vigil meter.",
        "Skill \u2014 Sigil of the Lightkeeper: plants a stationary Lunar Sigil on the ground. The Sigil pulses Electro DMG to nearby enemies every ~1.5 s and applies Electro at a steady rate (off-field-capable Electro source). If the Sigil overlaps with a Hydro-affected enemy, his CAs trigger Electro-Charged with bonus DMG.",
        "Burst \u2014 Eclipse Verdict: gathers Lightkeeper's Vigil into a single overhead strike that deals massive AoE Electro DMG, then drops a residual Lunar field for 8 s. Inside the field, his Normal and Charged Attacks gain a flat DMG bonus AND every Electro-Charged he triggers is upgraded into Lunar-Charged if a Moonsign Benediction character (Columbina) is in the party.",
        "A1 \u2014 Hunt Endures: each Charged Attack that hits a Hydro-affected target restores 2 Energy to Flins and reduces his Skill CD by 1 s. The rotation engine \u2014 keeps Sigil and Burst on cooldown if Hydro uptime is high.",
        "A4 \u2014 Cold Iron in the Heart: Flins converts a portion of his ATK above 1000 into Elemental Mastery, at a 0.16:1 ratio, capped at +160 EM. This is the formula reason ATK% double-dips on him: it lifts his hits AND his Lunar-Charged / Aggravate scaling. Stack ATK%, take the EM free.",
        "C1 \u2014 Lightkeeper's Mark: the Sigil from his Skill marks the first enemy it pulses; that enemy takes +20 % Lunar-Charged / Electro-Charged DMG from Flins's attacks. Single-target boss melter.",
        "C2 \u2014 White-Eye Reckoning: Burst CD \u221220 %. The breakpoint constellation \u2014 drops the rotation from 18 s to 14.4 s and almost always keeps Eclipse Verdict ready for the next Sigil cycle.",
        "C6 \u2014 When the Hunt Returns: while inside his Burst field, his Charged Attacks fire a phantom polearm echo that deals an additional Electro DMG instance scaled on ATK + EM (the A4 cap is removed for the echo's calculation, so EM keeps scaling past 160 here).",
      ],
      tips: [
        "ATK % goblet, not Electro DMG %. Lunar-Charged damage is a TEAM-output reaction (draws from every character who applied Hydro/Electro during the reaction) \u2014 Electro DMG % on Flins only buffs his own Electro hits, which are a smaller fraction of his total than the Lunar-Charged ticks. ATK % goblet feeds his hits AND the A4 EM cap AND the Lunar-Charged scaling.",
        "A4 makes ATK % a dual-stat. Every +46.6 % ATK Sands you stack moves you closer to the +160 EM cap, which then amplifies every Lunar-Charged / Electro-Charged / (Aggravate if Dendro) tick. Target ~2400 ATK to comfortably hit the cap.",
        "ER 120-140 % is enough at C0 because A1 self-refunds energy on Hydro-CA hits. Pure-Electro teams without a Hydro applicator need 160-180 % ER to stay on-rotation.",
        "Hexerei: he is NOT Hexerei (Nod-Krai, not Hexenzirkel). Do not slot him into ADCFRW or Durin A1 calculations.",
        "Aggravate fallback: if you have a Dendro core in the team and no Columbina, his Electro CAs trigger Aggravate cleanly. The build doesn't change \u2014 ATK% / A4 EM still wants the same substats \u2014 but you swap 4pc Night of the Sky's Unveiling for 4pc Thundering Fury and re-prioritise CRIT.",
        "BiS weapon Bloodsoaked Ruins \u2014 674 Base ATK + 22.1% CRIT Rate. Mournful Tribute: 3.5s after Burst, Lunar-Charged DMG +36-84%. Triggering Lunar-Charged \u2192 Requiem of Ruin: CRIT DMG +28-56% for 6s, plus +12 Energy (1/14s). Defines the Burst-first rotation: Burst \u2192 CAs within 3.5s to catch the Lunar-Charged window.",
      ],
      synergies: [
        { id: "columbina", why: "Moonsign enabler. Without her in the party Flins is a competent Electro DPS; with her his entire Burst-field rotation upgrades to Lunar-Charged, which scales on team HP and stacks Columbina's +0.2 %/1000-HP DMG bonus on top. The textbook pairing \u2014 Flins's kit is literally built around her." },
        { id: "neuvillette", why: "Hydro flood for Electro-Charged uptime. Neuvillette's continuous CA Hydro application keeps Flins's Sigil + A1 loop fed and turns every CA hit into an Electro-Charged tick (or Lunar-Charged with Columbina). Hydro Resonance also gives the team +25 % Max HP, scaling Columbina's Lunar contribution." },
        { id: "mona", why: "Off-field Hydro + Omen amplifier. Mona's Skill plants Hydro on enemies for Flins's Electro-Charged base, and Omen's damage-taken debuff lifts every Lunar-Charged tick on the marked enemy. TTDS R5 transfers +48 % ATK on swap, which double-dips through A4 into +EM." },
        { id: "fischl", why: "Off-field Electro tick from Oz keeps Electro aura up when Flins swaps out, and her Electro DMG contributes to the Lunar-Charged team-output pool. Off-field-only \u2014 Fischl never competes with Flins for field time." },
      ],
    },
  },
  {
    id: "varesa",
    name: "Varesa",
    epithet: "Rebel Heir of the Collective of Plenty",
    element: "electro",
    role: "Plunge Hypercarry DPS",
    weaponType: "Catalyst",
    set: "4pc Long Night's Oath",
    setAlt: "4pc Obsidian Codex \u00b7 4pc Thundering Fury",
    weapon: "Vivid Notions",
    weaponAlt: "Kagura's Verity \u00b7 Lost Prayer to the Sacred Winds \u00b7 The Widsith (4\u2605)",
    talents: "Burst \u203a Skill \u203a\u203a Normal",
    stats: [
      { id: "sands", label: "Sands main stat", target: "ATK %" },
      { id: "goblet", label: "Goblet main stat", target: "Electro DMG %" },
      { id: "circlet", label: "Circlet main stat", target: "CRIT Rate / DMG" },
      { id: "atk", label: "Total ATK", target: "\u2265 2200" },
      { id: "cr", label: "CRIT Rate", target: "60 \u2013 70 %" },
      { id: "cd", label: "CRIT DMG", target: "180 \u2013 220 %" },
      { id: "er", label: "Energy Recharge", target: "120 \u2013 140 %" },
    ],
    note: "Hit 120\u2013140% ER first, then chase CRIT (1:2 ratio). Long Night's Oath rewards plunge \u2192 CA \u2192 skill loops.",
    deep: {
      lore: "A wandering daughter of the Capybara-kin Collective of Plenty. Raised on the high plateaus, she taught herself to fight by leaping from cliffs onto whatever needed beating. Vivid Notions focuses the static she gathers in the air, turning every fall into a thunderclap \u2014 the Rebel Heir is first to leap, last to stop swinging.",
      kit: [
        "Skill \u2014 Vigorous Strikes: charges Nightsoul. With enough charge she enters Vigorous Rush, supercharging her next plunge with Electro.",
        "Burst \u2014 Last Crash: massive Electro plunge AoE; refreshes Vigorous Rush on landing.",
        "Core loop: Plunge \u203a CA \u203a Skill \u203a repeat. 4pc Long Night's Oath rewards exactly this rhythm with +25% Plunge DMG after burst/CA.",
        "A4: after Nightsoul use, up to 160 ATK is converted into bonus EM \u2014 only relevant in Quicken/Aggravate splice teams.",
      ],
      tips: [
        "Hit 120\u2013140% ER first, then chase CRIT at a 1:2 ratio. Over-ER costs more damage than over-ATK.",
        "Vivid Notions is a meaningful jump over alternatives; Kagura's Verity is the runner-up before any CRIT weapon.",
      ],
      synergies: [
        { id: "xilonen", why: "Textbook partner \u2014 plunge buff, RES shred, DEF-scaling healing all in one slot." },
        { id: "fischl", why: "Off-field Oz adds Electro resonance ATK and a small Aggravate window when Dendro joins the team." },
      ],
    },
  },
  {
    id: "ororon",
    name: "Ororon",
    epithet: "Master of the Night-Wind \u00b7 Bidii",
    element: "electro",
    role: "Hyperbloom Trigger / Team-DMG Support",
    weaponType: "Bow",
    set: "4pc Scroll of the Hero of Cinder City",
    setAlt: "4pc Noblesse Oblige \u00b7 4pc Flower of Paradise Lost (Hyperbloom)",
    weapon: "Elegy for the End",
    weaponAlt: "Aqua Simulacra \u00b7 Favonius Warbow \u00b7 The Stringless (4\u2605) \u00b7 Sacrificial Bow (4\u2605) \u00b7 Prototype Crescent (F2P)",
    talents: "Skill \u203a\u203a Burst \u203a Normal",
    stats: [
      { id: "sands", label: "Sands main stat", target: "EM (or ER if energy is tight)" },
      { id: "goblet", label: "Goblet main stat", target: "EM" },
      { id: "circlet", label: "Circlet main stat", target: "EM" },
      { id: "em", label: "Total Elemental Mastery", target: "\u2265 800" },
      { id: "er", label: "Energy Recharge", target: "160 \u2013 200 %" },
    ],
    note: "Pure EM \u2014 no CRIT. His burst is what unlocks his support: Scroll of Cinder City grants the team +28% matching-element DMG while he's in Nightsoul.",
    altBuilds: [
      {
        id: "sub-dps",
        label: "Sub-DPS (CRIT)",
        role: "Personal-Damage Sub-DPS",
        set: "4pc Thundering Fury",
        setAlt: "4pc Golden Troupe \u00b7 4pc Scroll of the Hero of Cinder City (if no other Natlan unit holds it) \u00b7 4pc Noblesse Oblige (no-buffer teams)",
        weapon: "Elegy for the End",
        weaponAlt: "Polar Star \u00b7 Aqua Simulacra \u00b7 Favonius Warbow \u00b7 The Stringless (4\u2605) \u00b7 Prototype Crescent (F2P)",
        talents: "Skill \u203a\u203a Burst \u203a Normal",
        stats: [
          { id: "sands", label: "Sands main stat", target: "ATK %" },
          { id: "goblet", label: "Goblet main stat", target: "Electro DMG %" },
          { id: "circlet", label: "Circlet main stat", target: "CRIT Rate / DMG" },
          { id: "atk", label: "Total ATK", target: "\u2265 2000" },
          { id: "cr", label: "CRIT Rate", target: "\u2265 60 %" },
          { id: "cd", label: "CRIT DMG", target: "\u2265 130 %" },
          { id: "er", label: "Energy Recharge", target: "125 \u2013 150 %" },
        ],
        note: "In Electro / Overload / no-Dendro teams there is no Hyperbloom to trigger, so the EM build is dead weight. Build him as a standard sub-DPS \u2014 the team-DMG buff from 4pc Scroll still fires on any Electro reaction, and his Spirit Orb and Supersonic Oculus deal real damage with CRIT substats. Game8 and KQM both list this as his recommended build in non-Dendro comps. If the team lacks a buffer (no Bennett / Yun Jin / Faruzan), swap to 4pc Noblesse Oblige \u2014 the team +20 % ATK on Burst is more global value than the personal +40 % Electro DMG.",
      },
    ],
    deep: {
      lore: "Bidii \u2014 \"Devotion\" \u2014 in the Ancient Names of Sanhaj Kompore. Ororon is a Master of the Night-Wind, the fifth of Natlan's heroes to be recognised, and the only one to escape the ritual that the hero's name normally demands. Born with an incomplete soul, he keeps to himself outside the tribal grounds \u2014 tending vegetables, raising Phlogiston Aphids, and speaking with the dead who drift past the curtain of the Night Kingdom. The hero's name was given to him. The devotion was always his.",
      kit: [
        "Skill \u2014 Night's Sling: throws a Spirit Orb that deals Electro DMG and bounces between nearby enemies, extending its on-field tick rate the more targets there are.",
        "Burst \u2014 Dark Voices Echo: AoE Electro DMG plus a Supersonic Oculus that taunts and continually deals Electro DMG to nearby enemies.",
        "A1: unlike most Natlan kits, Ororon enters Nightsoul AFTER his Burst (Burst trigger grants 40 Nightsoul points). While Skill is active, any Hydro/Electro hit on a target grants him +5 Nightsoul points.",
        "A4: Party-wide gliding SPD +15% (utility / overworld).",
        "4pc Scroll of the Hero of Cinder City: when Ororon causes an Electro reaction, all party members gain +12% Elemental DMG for 15s; if he is in Nightsoul during the trigger, that becomes +28% for 20s.",
      ],
      tips: [
        "Pure EM Sands / Goblet / Circlet. No CRIT \u2014 his entire output runs through reaction damage and the team buff; CRIT substats are wasted.",
        "Run ER \u2248160\u2013200% depending on the team's energy generation. Elegy for the End is BiS because of its EM stat and 100/200 stack passive that buffs party ATK + EM.",
        "Don't skip his Burst \u2014 it is the gate to his Nightsoul state, which is the gate to the +28% team buff.",
      ],
      synergies: [
        { id: "neuvillette", why: "Hydro flood feeds Electro-Charged and Hyperbloom cores; Ororon's 4pc returns the favour with +28% Hydro DMG while he is in Nightsoul." },
        { id: "nefer", why: "Dendro on-field DPS \u2014 Ororon's Electro detonates her Bloom cores into Hyperblooms, and his 4pc lifts her Dendro DMG by 28%." },
        { id: "columbina", why: "Columbina's Moonsign turns the team's Electro-Charged into Lunar-Charged, which Ororon's continuous Electro applications keep firing." },
      ],
    },
  },
  {
    id: "yae-miko",
    name: "Yae Miko",
    epithet: "Guuji of the Grand Narukami Shrine",
    element: "electro",
    role: "Off-Field Sub-DPS",
    weaponType: "Catalyst",
    set: "4pc Golden Troupe",
    setAlt: "4pc Emblem of Severed Fate · 2pc Golden Troupe + 2pc +18% ATK",
    weapon: "Kagura's Verity",
    weaponAlt: "Skyward Atlas · The Widsith (4★) · Solar Pearl (4★) · Mappa Mare (F2P craftable)",
    talents: "Skill ›› Burst › Normal",
    stats: [
      { id: "sands", label: "Sands main stat", target: "ATK %" },
      { id: "goblet", label: "Goblet main stat", target: "Electro DMG %" },
      { id: "circlet", label: "Circlet main stat", target: "CRIT Rate / DMG" },
      { id: "atk", label: "Total ATK", target: "≥ 2000" },
      { id: "cr", label: "CRIT Rate", target: "60 – 70 %" },
      { id: "cd", label: "CRIT DMG", target: "≥ 130 %" },
      { id: "er", label: "Energy Recharge", target: "130 – 150 %" },
    ],
    note: "Her Sesshou Sakura turrets ARE the damage — Skill talent scales the bulk of it, so level Skill first and take it as high as possible. Golden Troupe supercharges the off-field Skill DMG (+25% Skill DMG, +25% more while off-field). Sakura DMG scales with ATK, so ATK% Sands/Goblet + a CRIT circlet is the standard mono-Electro line.",
    altBuilds: [
      {
        id: "aggravate",
        label: "Aggravate",
        role: "Aggravate Sub-DPS (EM)",
        set: "4pc Gilded Dreams",
        setAlt: "4pc Golden Troupe · 2pc Gilded Dreams + 2pc Thundering Fury",
        weapon: "A Thousand Floating Dreams",
        weaponAlt: "Kagura's Verity · The Widsith (4★) · Mappa Mare (F2P craftable)",
        talents: "Skill ›› Burst › Normal",
        stats: [
          { id: "sands", label: "Sands main stat", target: "EM (ATK % if team has an ATK buffer)" },
          { id: "goblet", label: "Goblet main stat", target: "Electro DMG %" },
          { id: "circlet", label: "Circlet main stat", target: "CRIT Rate / DMG" },
          { id: "em", label: "Elemental Mastery", target: "≥ 200" },
          { id: "atk", label: "Total ATK", target: "≥ 1800" },
          { id: "cr", label: "CRIT Rate", target: "60 – 70 %" },
          { id: "cd", label: "CRIT DMG", target: "≥ 130 %" },
          { id: "er", label: "Energy Recharge", target: "130 – 150 %" },
        ],
        note: "In Quicken / Aggravate teams (Nahida + a Dendro core), each Sesshou Sakura hit procs its own Aggravate — EM Sands and Gilded Dreams add flat reaction DMG on top of the Electro base. A Thousand Floating Dreams gives +32 EM per party element plus a rotating +40 EM aura, the best catalyst for the EM line.",
      },
    ],
    deep: {
      lore: "The Guuji of the Grand Narukami Shrine, eldest kitsune of the Divine Priestess line and Ei's oldest friend. Publisher of light novels under a pen name, feared negotiator, and the mind that talked the Raiden Shogun down from Eternity. She wears frivolity like a fan — behind it is one of the sharpest operators in Inazuma.",
      kit: [
        "Skill — Yakan Evocation: Sesshou Sakura: plants a turret that fires Electro bolts at the nearest enemy. Recasting (up to 3 on field) raises every turret's level and DMG. This is ~90% of her output.",
        "Burst — Great Secret Art: Tenko Kensei: calls down Tenko Thunderbolts (AoE Electro), then re-deploys any Sakura destroyed in the process — the burst's real job is refreshing turret uptime.",
        "A1: each Tenko Thunderbolt from the Burst resets and re-places a Sesshou Sakura, so Burst → re-plant keeps the turrets alive across rotations.",
        "A4: raises Electro DMG Bonus based on her Elemental Mastery (0.15% per point) — a small nudge that makes EM substats not fully dead even on the ATK build.",
      ],
      tips: [
        "Level Skill first, Burst second, Normal never. Her NA does almost nothing — all damage is the Sakura turrets.",
        "Place all three Sakura close together so a single enemy sits in range of all of them; spread placement halves her single-target DPS.",
        "Kagura's Verity is a large jump over any 4★ — its stacking Skill-DMG passive rewards the exact recast pattern her rotation already uses.",
      ],
      synergies: [
        { id: "nahida", why: "Dendro core + Quicken aura turns every Sakura bolt into an Aggravate — this is her single strongest team archetype, and Nahida's EM share feeds the Gilded Dreams build." },
        { id: "fischl", why: "Double off-field Electro — Oz + Sakura keep Electro applied for Aggravate/Hyperbloom and share Electro Resonance ER relief." },
        { id: "ororon", why: "Ororon's 4pc Scroll lifts the team's Electro DMG by up to 28%, and in Dendro comps he can take the Hyperbloom trigger while Yae free-fires Aggravate bolts." },
      ],
    },
  },
  {
    id: "chasca",
    name: "Chasca",
    epithet: "Dragoon of the Flamebound Skies",
    element: "anemo",
    role: "Multi-Element On-Field DPS",
    weaponType: "Bow",
    set: "4pc Marechaussee Hunter",
    setAlt: "4pc Long Night's Oath \u00b7 4pc Desert Pavilion Chronicle",
    weapon: "Astral Vulture's Crimson Plumage",
    weaponAlt: "Polar Star \u00b7 Aqua Simulacra \u00b7 Hunter's Path \u00b7 The Stringless (4\u2605)",
    talents: "Skill \u203a\u203a Burst \u203a Normal",
    stats: [
      { id: "sands", label: "Sands main stat", target: "ATK %" },
      { id: "goblet", label: "Goblet main stat", target: "ATK % (or matching Element DMG %)" },
      { id: "circlet", label: "Circlet main stat", target: "CRIT Rate / DMG" },
      { id: "atk", label: "Total ATK", target: "\u2265 2200" },
      { id: "cr", label: "CRIT Rate", target: "70 \u2013 80 %" },
      { id: "cd", label: "CRIT DMG", target: "180 \u2013 220 %" },
      { id: "er", label: "Energy Recharge", target: "130 \u2013 150 %" },
    ],
    note: "Bullets convert to Pyro/Hydro/Cryo/Electro based on teammates. ATK% goblet stays neutral across teams.",
  },
  {
    id: "varka",
    name: "Varka",
    epithet: "Grand Master of the Knights of Favonius",
    element: "anemo",
    role: "Hexerei On-Field DPS",
    weaponType: "Claymore",
    set: "4pc A Day Carved from Rising Winds",
    setAlt: "4pc Desert Pavilion Chronicle \u00b7 4pc Shimenawa's Reminiscence",
    weapon: "Gest of the Mighty Wolf",
    weaponAlt: "A Thousand Blazing Suns \u00b7 Beacon of the Reed Sea \u00b7 Serpent Spine (4\u2605)",
    talents: "Skill \u203a\u203a\u203a\u203a Burst \u00b7 Normal (skip both)",
    stats: [
      { id: "sands", label: "Sands main stat", target: "ATK %" },
      { id: "goblet", label: "Goblet main stat", target: "ATK % (or Pyro DMG % in Mono-Pyro)" },
      { id: "circlet", label: "Circlet main stat", target: "CRIT DMG (set gives +20% CR)" },
      { id: "atk", label: "Total ATK", target: "2500 \u2013 3000" },
      { id: "cr", label: "CRIT Rate", target: "\u2264 80 % \u26a0 avoid overcap" },
      { id: "cd", label: "CRIT DMG", target: "\u2265 200 %" },
      { id: "er", label: "Energy Recharge", target: "110 \u2013 130 %" },
    ],
    note: "Burst is a damage loss \u2014 keep at Lv 1, raise character to 90/100 instead. ADCFRW + Hexerei = +20% CR; watch for overcap with sig weapon.",
  },
  {
    id: "jahoda",
    name: "Jahoda",
    epithet: "Windthreading Shadow",
    element: "anemo",
    role: "Anemo Infuser Support / Healer",
    weaponType: "Bow",
    set: "4pc Viridescent Venerer",
    setAlt: "4pc Silken Moon's Serenade (Lunar / Moonsign teams)",
    weapon: "Elegy for the End",
    weaponAlt: "Favonius Warbow \u00b7 Sacrificial Bow \u00b7 Elegy of Eclipse \u00b7 Prototype Crescent (F2P)",
    talents: "Burst \u203a\u203a Skill \u203a Normal",
    stats: [
      { id: "sands", label: "Sands main stat", target: "Energy Recharge" },
      { id: "goblet", label: "Goblet main stat", target: "ATK %" },
      { id: "circlet", label: "Circlet main stat", target: "ATK % (Healing Bonus alt)" },
      { id: "em", label: "Total Elemental Mastery", target: "\u2248 200 (substats)" },
      { id: "er", label: "Energy Recharge", target: "\u2248 200 %" },
    ],
    note: "Healer + VV stick. Heals on Burst hits; while any ally is above 70% HP after her heal, that ally gains +100 EM for 6s.",
    deep: {
      lore: "Self-proclaimed legendary bounty hunter and employee of the Curatorium of Secrets \u2014 Jahoda calls herself \"the master thief who's plundered every corner of Nod-Krai\" and dresses the part: cat-ear beanie, rose-tinted glasses, a Purr-loined Treasure Flask, and an entourage of Purrsonal Domestic Assistance Robots she repurposed from black-market salvage. The Windthreading Shadow once ran with the Seahook Gang; Nefer pulled her out as the only public face of the Northern Intelligence Network, where she still quietly works.",
      kit: [
        "Skill \u2014 Purrsonal Coordinated Assistance: deploys two assistance Robots and lands a single AoE Anemo hit on nearby opponents. The Robots stick around to swirl off any aura the team applies.",
        "Burst \u2014 Purr-sonal Household Helper Coordinators: summons two helper coordinators that heal teammates and pulse Anemo, repeatedly triggering Swirl with the team's applied elements.",
        "Healing passive: if a teammate is above 70% HP after one of her healing pulses, they gain +100 Elemental Mastery for 6s \u2014 a global EM buff every rotation for any team running reactions.",
        "Moonsign interaction: in a Lunar team with Columbina present, her Swirls feed the Hydro/Electro/Dendro auras that the Moonsign converts \u2014 a clean four-slot Lunar-Charged or Lunar-Bloom enabler.",
        "4pc Viridescent Venerer: \u221240% RES of the swirled element for 10s; her on-field rotation is essentially a continuous RES shred conveyor.",
      ],
      tips: [
        "Hit \u2248200% ER. She is burst-locked \u2014 her healing, her +100 EM passive, and her Swirl uptime all flow from Q.",
        "Don't chase CRIT. ATK% Goblet + Healing-Bonus or ATK% Circlet keeps her healing meaningful and her Swirl damage incidental but real.",
        "Elegy for the End doubles her support value \u2014 its 4-stack passive grants the team +100 EM and +20% ATK; combined with her own +100 EM heal passive, that is +200 EM globally on the trigger.",
      ],
      synergies: [
        { id: "nefer", why: "Lore tie \u2014 Jahoda still works for Nefer's Northern Intelligence Network. Mechanically, Jahoda's Anemo Swirls off Nefer's Hydro/Dendro shred enemy RES and feed Bloom / Lunar-Bloom rotations." },
        { id: "neuvillette", why: "VV shreds Hydro RES by 40% \u2014 the largest single multiplier you can hand to a Neuvillette CA team. Her +100 EM passive is dead weight on him, but the RES shred carries." },
        { id: "columbina", why: "Both Nod-Krai. Silken Moon's Serenade alt set + Columbina's Moonsign convert Jahoda's Swirl rotations into Lunar-Charged / Lunar-Bloom enablers without giving up her healing." },
      ],
    },
  },
  {
    id: "sucrose",
    name: "Sucrose",
    epithet: "Harmless Sweetie · Bio-alchemist of Mondstadt",
    element: "anemo",
    role: "Anemo Grouper / EM Battery",
    weaponType: "Catalyst",
    set: "4pc Viridescent Venerer",
    setAlt: "2pc Wanderer's Troupe / 2pc VV (EM-stacking) · 4pc Instructor",
    weapon: "Fruit of Fulfillment",
    weaponAlt: "Sunny Morning Sleep-In · A Thousand Floating Dreams · Sacrificial Fragments (4★) · Hakushin Ring (4★) · Mappa Mare (4★)",
    talents: "Skill ›› Burst › Normal",
    stats: [
      { id: "sands", label: "Sands main stat", target: "EM" },
      { id: "goblet", label: "Goblet main stat", target: "EM" },
      { id: "circlet", label: "Circlet main stat", target: "EM" },
      { id: "em", label: "Total Elemental Mastery", target: "≥ 900" },
      { id: "er", label: "Energy Recharge", target: "130 – 160 %" },
    ],
    note: "Pure EM stat-stick. A4 hands the team 20% of her EM on Skill/Burst — every EM point on her is roughly 0.2 EM on every other reaction trigger in the party.",
    deep: {
      lore: "Albedo's assistant in the Knights of Favonius' alchemy lab, and a bio-alchemist by passion. Albedo studies the essence of life; Sucrose studies how to modify it — and not by halves. She has increased Sweet Flower nectar yields by 70% with a hand-tuned irrigation pattern and developed a spray that keeps a picked Sunsettia fresh for a month. Half her experiments end in a small explosion; the other half end up in someone's lunch.",
      kit: [
        "Skill — Astable Anemohypostasis Creation - 6308: throws a vacuum that pulls light enemies in and deals AoE Anemo DMG. Two charges, short cooldown — the grouping tool that most Anemo supports envy.",
        "Burst — Forbidden Creation - Isomer 75 / Type II: lays down a wind field that periodically pulses Anemo DMG, suctioning enemies inward and Swirling whatever else the team applies.",
        "A1 (Catalyst Conversion): a Swirl reaction raises the EM of every party member whose element was Swirled by 50 for 8s.",
        "A4 (Mollis Favonius): on Skill or Burst hit, every other party member gains 20% of Sucrose's Elemental Mastery as bonus EM for 8s. Stacks with A1.",
        "Utility — Astable Invention: 10% chance to double Weapon Enhancement Material crafting output (overworld passive, no combat effect).",
      ],
      tips: [
        "Stack EM everywhere. Sands / Goblet / Circlet all EM; substats EM where possible. A4 turns every point on her into team-wide reaction damage.",
        "Constellation 1 is the most valuable single con in the game for a 4★ support — adds a charge to her Skill, doubling her grouping uptime.",
        "Fruit of Fulfillment is the cheap BiS (EM stat stick + ER passive). If you have nothing, Sacrificial Fragments at R5 + Wanderer's 2pc is still fully functional.",
        "She is a Swirl-trigger first, damage-dealer never. Burst CD is long — Favonius / Sacrificial-style ER weapons let you skip the Sands ER and stack EM there too.",
      ],
      synergies: [
        { id: "ororon", why: "Hyperbloom trigger lives and dies by EM — her A4 hands him +160-180 EM on every rotation, plus VV shreds the team's enemy RES." },
        { id: "nefer", why: "Sucrose's grouping bundles enemies into Nefer's Bloom / Lunar-Bloom radius; the +50 A1 Dendro EM lifts both seeded reactions and on-field Spread hits." },
        { id: "neuvillette", why: "VV's 40% Hydro RES shred is the largest single multiplier you can hand a CA-DPS Neuvillette; her EM share is fluff for him, but the shred isn't." },
      ],
    },
  },
  {
    id: "prune",
    name: "Prune",
    epithet: "Witch-Hunter of the Hexenzirkel · Bearer of the Hunting Oath",
    element: "anemo",
    role: "Hexerei Anemo Support / Swirl Sub-DPS",
    weaponType: "Catalyst",
    set: "4pc Viridescent Venerer",
    setAlt: "4pc Hexerei (leak: Skill grants teammates +20 % Elemental DMG Bonus; caps at +40 % with two Hexerei wearers, same-element bonuses do NOT stack) · 4pc Desert Pavilion Chronicle · 2pc VV + 2pc ATK %",
    weapon: "Skyward Atlas (5★ BiS — high base ATK + ATK % substat + flat Elemental DMG Bonus)",
    weaponAlt: "Oathsworn Eye (4★ event sig leak — ATK % + ER on Skill) · Hexenzirkel Mirror · Lost Prayer to the Sacred Winds · Sacrificial Fragments (4★ ER) · Mappa Mare (4★)",
    talents: "Burst › Skill ›› Normal",
    stats: [
      { id: "sands", label: "Sands main stat", target: "ATK %  (A4 cares about ATK over 1000)" },
      { id: "goblet", label: "Goblet main stat", target: "ATK %  (Anemo DMG % only buffs her own hits)" },
      { id: "circlet", label: "Circlet main stat", target: "ATK %  (CRIT only if running for personal DMG)" },
      { id: "atk", label: "Total ATK", target: "≥ 3000 → ~+20 % Inspiration · ≥ 4500 caps at +35 %" },
      { id: "er", label: "Energy Recharge", target: "140 – 180 %" },
      { id: "em", label: "Elemental Mastery", target: "Optional substat — only if running for personal Swirl DMG" },
    ],
    note: "Kit details are leak-based as of 6.6 pre-release — verify on launch. Account-state: C6 (Bell-Bound Oath unlocked). The double-buffer profile: Ringing Inspiration grants the team a DMG % bonus scaling on Prune's ATK over 1000 (0.01 % per excess ATK, capped at +35 % at 4500 ATK) — lives in the DMG_Bonus term and stacks MULTIPLICATIVELY with Bennett / Nicole's flat ATK, with NO / Tenacity / Pyro Resonance ATK %, and with Furina's Fanfare. C6 layers a flat +350 ATK on top of that DMG % bonus, putting her into Bennett-tier flat-ATK output AND keeping the +35 % DMG %. At C6 she is BiS team-buffer in any reaction comp without a Bennett slot.",
    altBuilds: [
      {
        id: "swirl-sub",
        label: "Swirl Sub-DPS",
        role: "Anemo Swirl Sub-DPS",
        set: "4pc Viridescent Venerer",
        setAlt: "4pc Desert Pavilion Chronicle · 4pc Marechaussee Hunter (if she gets on-field NA windows)",
        weapon: "Jadefall's Splendor",
        weaponAlt: "Lost Prayer to the Sacred Winds · Kagura's Verity · Tome of the Eternal Flow · The Widsith (4★)",
        talents: "Skill ›› Burst › Normal",
        stats: [
          { id: "sands", label: "Sands main stat", target: "EM (ATK % alt)" },
          { id: "goblet", label: "Goblet main stat", target: "Anemo DMG %" },
          { id: "circlet", label: "Circlet main stat", target: "CRIT Rate / DMG" },
          { id: "em", label: "Elemental Mastery", target: "300 – 500" },
          { id: "cr", label: "CRIT Rate", target: "≥ 50 %" },
          { id: "cd", label: "CRIT DMG", target: "≥ 130 %" },
          { id: "er", label: "Energy Recharge", target: "140 – 160 %" },
        ],
        note: "Without Bennett or Nicole loading flat ATK into the team, the Ringing Inspiration buff caps lower — running Prune as her own Swirl sub-DPS with VV + Anemo Goblet gives more out of her slot. EM amplifies Swirl reaction damage and her A4 Anemo DMG component scales off Anemo DMG %.",
      },
    ],
    deep: {
      lore: "Prune of the Hunting Oath — youngest of the Hexenzirkel and the only member sworn to the coven's defence rather than its studies. She carries the Hunting Oath Hammer, a witch-iron piece forged for striking the Lure Witch Bell that her predecessors hung at the borders of every Hexenzirkel sanctum; the Bell rings when something unmade tries to step inside. Where Mona reads the future and Rhinedottir shaped the past, Prune patrols the present.",
      kit: [
        "Skill — Strike of the Hunting Oath: Prune swings the Hunting Oath Hammer against the Lure Witch Bell, dealing AoE Anemo DMG. If this hit triggers Swirl, the Skill upgrades for 6 s — subsequent presses transform the Hammer into the swirled element and deal converted DMG.",
        "Burst — Hunting Mode (Lure Witch Bell): the Bell breaks free and follows the active character, dealing periodic off-field AoE Anemo DMG and Swirling whatever the team applies. Maintains an Anemo aura for VV setup the entire duration.",
        "Burst passive — every Swirl the Bell triggers during Hunting Mode adds an additional DMG instance equal to 150 % of Prune's ATK in the swirled element. Direct ATK-scaling damage on top of the standard Swirl + VV setup.",
        "A1 / A4 — Ringing Inspiration: whenever Prune's TRANSFORMED Hammer hits an enemy, all nearby teammates gain Ringing Inspiration for 5 s. Their NA / CA / Plunge / Skill / Burst deal bonus DMG scaling on Prune's ATK ABOVE 1000 — +0.01 % per excess ATK, capped at +35 % bonus DMG (reached at 4500 ATK).",
        "Hexerei (faction passive): tagged Hexerei. Triggers ADCFRW's +20 % CR for any other Hexerei wearer in party. Counts toward Mona's Astral Glow of Mercury 2+ Hexerei threshold, Durin's A1 +75 % at 2 Hexerei, and Nicole's Methexis instant-upgrade.",
        "C2 — Hunting Reach: Ringing Inspiration duration +3 s (to 8 s). The breakpoint that lets a single Skill rotation cover a full Burst window.",
        "C6 — Bell-Bound Oath (UNLOCKED on this account): Ringing Inspiration ALSO grants +350 flat ATK to recipients on top of the DMG % bonus. Now a Bennett-tier flat-ATK source AND a +35 % DMG % team buff in the same kit — the buff bucket she fills depends on whether you also run Bennett (who beats her on raw flat ATK with Aquila Favonia ~+1200, so Prune's DMG % becomes the unique slot) or skip Bennett (Prune's flat ATK steps into his slot).",
      ],
      tips: [
        "ATK %, not Anemo DMG %. Each point of ATK above 1000 grows the Ringing Inspiration DMG % bonus until the +35 % cap at 4500 ATK. Anemo DMG % only buffs her own hits, which are a small fraction of total team damage. Target ~3000-3500 ATK for ~20-25 % team DMG % buff; ~4500 ATK caps the buff at +35 %.",
        "Skyward Atlas is BiS — 674 base ATK + ATK % substat + flat Elemental DMG Bonus, all three feed her A4 and her personal damage at once. Oathsworn Eye (the leaked 4★ event sig) is the budget pick — ATK % upfront and ER after Skill, exactly her rotation profile.",
        "4pc Viridescent Venerer is the default — her entire kit revolves around Swirl (Skill upgrades on Swirl, Burst Bell continuously Swirls, A4 Inspiration fires only off the transformed Hammer which requires a prior Swirl). The leaked 4pc Hexerei set is the real alternative: her Skill grants teammates +20 % Elemental DMG Bonus (caps at +40 % with two Hexerei wearers — but same-element bonuses DO NOT stack, so two Pyro DMG bonuses is still just +20 % Pyro).",
        "Ringing Inspiration is a DMG % bonus living in the DMG_Bonus term of the formula. It stacks MULTIPLICATIVELY with Bennett / Nicole's flat ATK, with NO / Tenacity / Pyro Resonance ATK %, AND with Furina's Fanfare (also DMG %, but different name, so both apply). She is the cleanest stack with Furina rotations because she sidesteps the ATK pool entirely.",
        "Account-state assumption: C6 is unlocked. The flat-ATK chunk fundamentally changes her role — she stops being a 'second buffer behind Bennett' and becomes a primary buff slot. In a Bennett team, Prune's flat ATK doesn't double-stack (different names, both apply, but the DPS's flat-ATK pool starts saturating relative to other terms), so the DMG % bonus is the unique value she adds. In a no-Bennett team, she IS the Bennett — full flat-ATK + DMG % in one slot.",
      ],
      synergies: [
        { id: "nicole", why: "Hexenzirkel coven-mates. Nicole's flat-ATK Grace (+600 / +900) and Prune's C6 flat-ATK (+350) BOTH apply on the DPS — different names, both stack additively in the flat-ATK term, for a combined ~+1250 flat ATK chunk that rivals Bennett with Aquila. Then Prune's +35 % DMG % multiplies on top of that. Mutual Methexis-instant-upgrade trigger." },
        { id: "mona", why: "Two-Hexerei threshold activator. With Mona + Prune in the party, Mona's Astral Glow of Mercury comes online (NA / CA stacks → +15 % per stack on the next ally Vape, max +45 %). Prune's Burst Bell pulses Anemo for Mona's Hydro to Swirl, layering VV RES shred on top of Omen." },
        { id: "varka", why: "Hexerei tribe-mate + Anemo cluster. Varka's ADCFRW gets +20 % CR from Prune's presence. Both want Swirl uptime: Prune's off-field Bell maintains Anemo aura while Varka is on field; her A4 Ringing Inspiration directly buffs his Skill spam." },
        { id: "mavuika", why: "Pyro DPS host and the best showcase for C6 Prune. Bell Swirls her Pyro auras → 4pc VV shreds Pyro RES −40 %; C6 +350 flat ATK lifts Mavuika's base ATK pool; +35 % Ringing Inspiration multiplies on top in the DMG_Bonus term. Mavuika doesn't depend on reactions so every layer is pure profit. Replaces a Bennett slot cleanly — Mavuika doesn't need Bennett's Pyro heal anyway, and Prune frees the team from Bennett's stationary field positioning." },
      ],
    },
  },
  {
    id: "neuvillette",
    name: "Neuvillette",
    epithet: "Iudex of the Court of Fontaine",
    element: "hydro",
    role: "Mono-Hydro / Charged-Attack DPS",
    weaponType: "Catalyst",
    set: "4pc Marechaussee Hunter",
    setAlt: "4pc Golden Troupe \u00b7 4pc Heart of Depth \u00b7 4pc Wanderer's Troupe",
    weapon: "Tome of the Eternal Flow",
    weaponAlt: "Sacrificial Jade \u00b7 Cashflow Supervision \u00b7 Prototype Amber (F2P)",
    talents: "Normal \u203a\u203a Skill \u203a Burst",
    stats: [
      { id: "sands", label: "Sands main stat", target: "HP %" },
      { id: "goblet", label: "Goblet main stat", target: "Hydro DMG % (HP % viable)" },
      { id: "circlet", label: "Circlet main stat", target: "CRIT Rate / DMG (HP % viable)" },
      { id: "hp", label: "Total HP", target: "\u2265 40 000" },
      { id: "cr", label: "CRIT Rate", target: "60 \u2013 70 %" },
      { id: "cd", label: "CRIT DMG", target: "\u2265 180 %" },
      { id: "er", label: "Energy Recharge", target: "\u2248 160 %" },
    ],
    note: "Charged Attack scales off HP. HP%/Hydro/CRIT is best but HP-Goblet or triple-HP is only a small margin behind \u2014 substat quality decides.",
    deep: {
      lore: "Iudex of the Court of Fontaine and last sovereign of the Hydro dragon line. He wears the form of a man because the form of a dragon would drown the city he is sworn to judge \u2014 when he weeps, the sky weeps; when he draws breath, the sea pulls back. His verdicts are impersonal as a tide.",
      kit: [
        "Normal Attack \u2014 three Hydro shots that build Sourcewater Droplets around him.",
        "Charged Attack \u2014 Equitable Judgement: long-range piercing Hydro beam; consumes up to three Droplets to extend into a triple-stage 'Waterfall' shot, his main damage source.",
        "Skill \u2014 O Tides, I Have Returned: AoE Hydro pulse around himself; on hit creates additional Droplets to feed his Charged Attack.",
        "Burst \u2014 A whip-strike of Hydro raindrops; AoE Hydro DMG and small heal-on-cast.",
        "A1 / A4: Past Hydro hits stack a Hydro DMG bonus on his CA (up to three stacks). The lower his current HP, the more Charged Attack DMG he gains.",
        "4pc Marechaussee Hunter: any HP change grants a stack of +12% Normal/Charged Attack DMG; refresh stacks every 0.2s, up to three.",
      ],
      tips: [
        "Target \u2248160% ER. Drop it only if you have heavy energy support (Furina or an ER weapon like Prototype Amber).",
        "Marechaussee wants frequent HP swings \u2014 pair with Furina, or a pulse-healer like Xilonen rather than a top-up healer.",
        "Sacrificial Jade is a serious 5\u2605 runner-up to his signature thanks to CR substat + 32% HP passive when off-field.",
      ],
      synergies: [
        { id: "xilonen", why: "DEF-scaling healing keeps Marechaussee CR stacks rolling, RES shred lifts his ceiling, and her 4pc grants +28% matching-element Hydro DMG." },
        { id: "columbina", why: "Hydro resonance gives both of them +25% Max HP. Add a Dendro / Electro / Geo trigger and Columbina turns the team into a Lunar-reaction comp." },
      ],
    },
  },
  {
    id: "mona",
    name: "Mona",
    epithet: "Astrologist Mona Megistus · Hexenzirkel coven member",
    element: "hydro",
    role: "Hexerei Off-Field Sub-DPS / Omen Support",
    weaponType: "Catalyst",
    set: "4pc Noblesse Oblige",
    setAlt: "4pc Heart of Depth (DPS) · 2pc Emblem + 2pc HoD (hybrid) · 4pc Tenacity of the Millelith (shield teams)",
    weapon: "Hexenzirkel Mirror (5★ signature)",
    weaponAlt: "Skyward Atlas · Lost Prayer to the Sacred Winds · Thrilling Tales of Dragon Slayers (3★ BiS off-field) · The Widsith (4★) · Sacrificial Fragments (4★ ER)",
    talents: "Burst › Skill ›› Normal",
    stats: [
      { id: "sands", label: "Sands main stat", target: "ER %  (ATK % or Hydro DMG % once ER capped)" },
      { id: "goblet", label: "Goblet main stat", target: "Hydro DMG %  (HB % for pure support)" },
      { id: "circlet", label: "Circlet main stat", target: "CRIT Rate / DMG  (HB % on pure support)" },
      { id: "er", label: "Energy Recharge", target: "200 – 250 %" },
      { id: "cr", label: "CRIT Rate", target: "≥ 60 %  (DPS build only)" },
      { id: "cd", label: "CRIT DMG", target: "≥ 140 %  (DPS build only)" },
    ],
    note: "Her Burst applies Omen — a debuff that increases the marked enemy's DMG TAKEN from all sources (~42 % at talent 6, ~60 % at talent 13). One of the largest party-wide amplifiers in the game while it's up; window is short (~4-5 s), so plant it at the start of the DPS's burst cycle. After completing Witch's Homework: Of Untested Insight (6.2 quest), Mona becomes a Hexerei character and gains Astral Glow of Mercury: her NAs/CAs grant 1 stack (max 3, 8 s duration); when another party member triggers a Vaporize, all stacks are consumed and that Vape gains +15 % per stack (max +45 %). Thrilling Tales of Dragon Slayers (free 3★) is unironically BiS for SUPPORT Mona — its passive transfers +48 % ATK to the next on-field character on swap.",
    altBuilds: [
      {
        id: "omen",
        label: "Omen Support",
        role: "Pure Omen Buff Support",
        set: "4pc Noblesse Oblige",
        setAlt: "4pc Tenacity of the Millelith · 2pc Wanderer's Troupe + 2pc Heart of Depth",
        weapon: "Thrilling Tales of Dragon Slayers (3★)",
        weaponAlt: "Sacrificial Fragments · Prototype Amber (F2P) · Favonius Codex (4★) · Tome of the Eternal Flow",
        talents: "Burst › Skill › Normal",
        stats: [
          { id: "sands", label: "Sands main stat", target: "ER % (HP % in HP teams)" },
          { id: "goblet", label: "Goblet main stat", target: "Hydro DMG % (or HP %)" },
          { id: "circlet", label: "Circlet main stat", target: "ATK % or HP %" },
          { id: "atk", label: "Total ATK", target: "not critical" },
          { id: "er", label: "Energy Recharge", target: "160 – 200 %" },
        ],
        note: "Without 2 + Hexerei in the party (or pre-6.2 quest), drop the Hexerei build entirely. TTDS swaps in +48 % ATK to the next on-field character every Skill press, and Noblesse gives the team a Burst-window +20 % ATK. Omen alone is ~+42 % DMG TAKEN at talent 6 — it amplifies everything regardless of her own stats.",
      },
    ],
    deep: {
      lore: "Mona Megistus, last apprentice of the original Astrologist and one of the publicly-named members of the Hexenzirkel — a centuries-old coven of witches whose other members include Alice (Klee's mother), Rhinedottir (origin of Albedo and Durin), the Dornman bard, and 'N' (Nicole). Famously, catastrophically broke; her food-and-rent budget is the running joke of Mondstadt. Her trade is divination, and the Omen on her enemies is, in lore, an actual celestial verdict — not just an elemental application.",
      kit: [
        "Skill — Mirror Reflection of Doom: plants a stationary Phantom that taunts enemies, deals Hydro DMG ticks, and applies Hydro repeatedly. Clean Wet-applicator for off-field Freeze / Vape / Bloom / Hyperbloom seeding.",
        "Burst — Stellaris Phantasm: deploys an illusion at Mona's position, then bursts for Hydro DMG and applies Omen to enemies hit. Omen lasts ~4 s at talent 1, scaling up to ~5 s.",
        "Omen (Burst debuff) — the marked enemy takes ~42 % more DMG from all sources at talent 6, scaling to ~60 % at talent 13. Single-target debuff, not an aura.",
        "Astral Glow of Mercury (Hexerei: Secret Rite, unlocked via 6.2 Witch's Homework quest, requires 2+ Hexerei in party) — Mona's NA/CA hits grant 1 stack (max 3, 1 stack per 0.1 s, 8 s duration). When another party member triggers Vaporize, all stacks are consumed and that Vape's DMG is increased +15 % per stack consumed (max +45 % on the Vape instance).",
        "A1 — Come 'n' Get Me, Hero: sprinting triggers Illusory Torrent — she dashes leaving a Hydro trail, applying Hydro to enemies passed through.",
        "A4 — Waterborne Destiny: Mona's Hydro DMG Bonus is increased by 20 % of her Energy Recharge. This directly converts ER stat into Hydro DMG % — why ER Sands is correct even on DPS Mona.",
        "C1 — Prophecy of Submersion: any Hydro reaction triggered on an Omen-marked enemy is further amplified (Vape +15 %, Electro-Charged +15 %, Frozen, Hyperbloom and Bloom all gain bonuses). The constellation that unlocks Mona's true ceiling.",
        "C2 — Lunar Chain: every 4th Normal Attack within 5 s reduces Skill CD by 2 s. Niche on support builds.",
      ],
      tips: [
        "Thrilling Tales of Dragon Slayers (3★) is the best support weapon by a wide margin. R5 grants +48 % ATK to the next on-field character on swap, free from any gacha investment. Mona pops Burst → swaps out → the next DPS inherits a fat ATK% buff stacked on top of Omen. Hexenzirkel Mirror and Skyward Atlas are for on-field DPS Mona only.",
        "A4 converts 20 % of ER into Hydro DMG %. Each +30 % ER substat doubles as a +6 % Hydro DMG substat. Stack ER far past the burst requirement (250-300 %) before pivoting to ATK %.",
        "4pc Noblesse Oblige is the canonical support play — short Burst, she pops NO, hands the team +20 % ATK on top of Omen and TTDS, and swaps. Heart of Depth is for the rare on-field Mona; Tenacity is the shield-team alt.",
        "Omen does NOT stack with another Omen — only the higher value applies on the same target. Two Monas in coop don't double up. Within a single team, the scaling lever is the Astral Glow of Mercury Vape stacks (requires 2+ Hexerei) and the DPS's own buffs, not re-applying Omen.",
        "C1 is the price-of-entry for serious investment. Without C1, Omen is still a top-3 DMG amplifier; with C1 it becomes the single biggest party-wide multiplier short of Furina's Fanfare — and it stacks additively with Fanfare.",
      ],
      synergies: [
        { id: "nicole", why: "Coven sisters and the design pair. Mona triggers Nicole's Methexis instant-upgrade on swap and vice versa. Nicole's Coordinated Attacks proc on Mona's on-field hits; Mona's Skill keeps Hydro on the field for Nicole's Pyro Skill residue to Vape. Run TTDS Mona + Tenacity Nicole and you double-buff the DPS." },
        { id: "neuvillette", why: "Mono-Hydro / Vape Neuvillette dream support. Omen + TTDS-transferred +48 % ATK + Hydro RES shred = the single biggest off-field amplifier for his Charged Attacks. Run Mona on TTDS + 4pc NO, swap to Neuvillette during the Omen window." },
        { id: "durin", why: "Hexerei tribe-mate. Omen amplifies the marked enemy's incoming DMG, and Astral Glow of Mercury fires +15 % per stack onto Durin's Vape detonations (Hydro Mona + Pyro Durin is the canonical Vape trigger). Two Hexerei in party also activates his A1 +75 % bonus. Lauma / Mona seeding Vape is the textbook reaction line for him." },
        { id: "varka", why: "Hexerei tribe-mate. Varka's on-field Anemo stays in Mona's Hydro field for repeated Swirls + 4pc VV RES shred; Omen amplifies the swirled-element damage on top. ADCFRW's +20 % CR triggers on Varka automatically with Mona present." },
      ],
    },
  },
  {
    id: "columbina",
    name: "Columbina",
    epithet: "Damselette \u00b7 Third of the Fatui Harbingers",
    element: "hydro",
    role: "Lunar-Reaction Buffer / Sub-DPS",
    weaponType: "Catalyst",
    set: "4pc Aubade of Morningstar and Moon",
    setAlt: "4pc Silken Moon's Serenade (if not taken by another support)",
    weapon: "Nocturne's Curtain Call",
    weaponAlt: "Surf's Up \u00b7 Tome of the Eternal Flow \u00b7 Sacrificial Jade (4\u2605) \u00b7 Prototype Amber (F2P)",
    talents: "Skill \u203a\u203a Burst \u203a Normal",
    stats: [
      { id: "sands", label: "Sands main stat", target: "HP % (or ER if energy is tight)" },
      { id: "goblet", label: "Goblet main stat", target: "HP %" },
      { id: "circlet", label: "Circlet main stat", target: "CRIT Rate / DMG (HP % viable)" },
      { id: "hp", label: "Total HP", target: "\u2248 35 000 (buff cap)" },
      { id: "cr", label: "CRIT Rate", target: "1 : 2 ratio with CD" },
      { id: "cd", label: "CRIT DMG", target: "1 : 2 ratio with CR" },
      { id: "er", label: "Energy Recharge", target: "160 % (ER weapon) \u00b7 180 % (otherwise)" },
    ],
    note: "Account-state: BiS weapon Nocturne's Curtain Call. Her Lunar-Reaction buffs cap at 35 000 Max HP. Energy-hungry \u2014 burst is everything. Substat priority: ER > CRIT > HP %.",
    deep: {
      lore: "Columbina Hyposelenia. Moon Goddess of Nod-Krai, known to the Frostmoon Scions as Kuutar, and formerly the Damselette \u2014 Third of the Fatui Harbingers. Born into an unkind world and cast into solitude from the moment of her creation; her colleagues called her gentleness Innocence, the Tsaritsa's records called it a weapon.",
      kit: [
        "Skill \u2014 Moonbound Tides: AoE Hydro DMG and summons a Gravity Ripple that follows the active character, continuously dealing AoE Hydro DMG. Her primary personal damage.",
        "Burst \u2014 opens a Lunar Domain on the field. While inside, party Electro-Charged / Bloom / Hydro-Crystallize reactions are converted into Lunar-Charged / Lunar-Bloom / Lunar-Crystallize variants with bonus DMG.",
        "Lunar reactions she enables gain Base DMG +0.2 % per 1 000 Max HP on Columbina, capped at +7 % (i.e. capped at 35 000 HP).",
        "A3: her party-wide Lunar Reaction DMG buff is the centerpiece \u2014 built for Lunar teams, not for solo damage.",
      ],
      tips: [
        "Build HP, not damage. She is a buffer first; her own Skill damage is gravy.",
        "Hit \u2248160 % ER with an ER weapon (Favonius Codex / Prototype Amber), or \u2248180 % without. Burst uptime is the entire kit.",
        "4pc Aubade buffs her personal damage; 4pc Silken Moon's Serenade buffs the team. Pick whichever the team isn't already running.",
        "BiS weapon Nocturne's Curtain Call — 88.2% CRIT DMG substat. Max HP +10% passive. Lunar reactions trigger Bountiful Sea's Sacred Wine (12s): +14% more Max HP (total +24%), Lunar Reaction CRIT DMG +60%, +14 Energy (off-field, 1/18s). The ER recovery and HP scaling solve both her sustain and her energy problems in one weapon.",
      ],
      synergies: [
        { id: "flins", why: "Flins triggers Electro-Charged on her Hydro; her burst upgrades it to Lunar-Charged with the +0.2%/1000-HP DMG bonus stacked on top." },
        { id: "linnea", why: "Linnea's Geo + Columbina's Hydro = Hydro-Crystallize, upgraded by Columbina's burst into Lunar-Crystallize. Linnea also heals, covering Columbina's lack of survivability." },
        { id: "neuvillette", why: "Hydro resonance for both (+25 % Max HP); Neuvillette stays on-field while she off-field-buffs Lunar reactions when a Dendro / Electro / Geo trigger is added." },
      ],
    },
  },
  {
    id: "lohen",
    name: "Lohen",
    epithet: "The Sharpened Arrowhead",
    element: "cryo",
    role: "On-Field Cryo DPS (Hexerei)",
    weaponType: "Polearm",
    set: "4pc A Day Carved from Rising Winds",
    setAlt: "4pc Blizzard Strayer (Freeze) · 4pc Marechaussee Hunter (CRIT) · 2pc Gladiator + 2pc Blizzard",
    weapon: "Disaster and Remorse",
    weaponAlt: "Staff of the Scarlet Sands · Missive Windspear (4★ craftable) · Calamity Queller",
    talents: "Skill ›› Burst › Normal",
    stats: [
      { id: "sands", label: "Sands main stat", target: "ATK %" },
      { id: "goblet", label: "Goblet main stat", target: "Cryo DMG %" },
      { id: "circlet", label: "Circlet main stat", target: "CRIT Rate / DMG" },
      { id: "atk", label: "Total ATK", target: "≥ 2000" },
      { id: "cr", label: "CRIT Rate", target: "≥ 70 %" },
      { id: "cd", label: "CRIT DMG", target: "≥ 160 %" },
      { id: "er", label: "Energy Recharge", target: "120 – 140 %" },
    ],
    note: "Account-state: Kit and weapon are leak-based as of 6.6 pre-release — verify on launch. All damage routes through Masterstroke state (Skill) and the Etched Into Bone and Soul nuke (consumes Joy stacks). Party members generate Will to Win on hit, scaling the nuke's DMG — Hexerei partners (Durin, Varka, Nicole) are mandatory for max value.",
    deep: {
      lore: "An aging swordsman from the northern reaches who carries his lord's last command as a sealed wound. He fights with the patience of someone who has already decided how he will die — every strike a verdict, every breath a count down. The Sharpened Arrowhead pierces because it remembers what it was loosed to find.",
      kit: [
        "Skill — Masterstroke: enters a Cryo-infused state for ~10s. Normal/Charged Attacks generate Joy stacks (max 5). All meaningful DPS routes through this window.",
        "Burst — Manifest Judgment: large AoE Cryo strikes; refreshes Masterstroke and grants instant Joy stacks. Used as the rotation opener.",
        "Etched Into Bone and Soul: at 5 Joy stacks, the next CA becomes a high-multiplier Cryo nuke. Will to Win stacks (generated when party members hit enemies) further amplify its DMG.",
        "A1: when nearby allies are Hexerei, Will to Win generation is doubled — the nuke ceiling roughly doubles in Hexerei comps.",
        "A4: Lohen converts up to 25% of his ATK above 1800 into CRIT Rate (capped at +24%) — incentivises stacking ATK first, then CRIT DMG circlet.",
      ],
      tips: [
        "Level Skill to 10 first — Masterstroke multipliers and Joy-stack damage scale with it. Burst is second (AoE + Joy generation). Normal Attack talent contributes little, leave it last.",
        "Rotation: Burst (Joy ×3 instant) › Skill › NAs to 5 Joy › CA (Etched Into Bone and Soul nuke) › repeat. The full loop is ~12s; partners need to be hitting during it to feed Will to Win.",
        "BiS weapon Disaster and Remorse — high base ATK + CRIT DMG substat, passive grants Cryo DMG on Skill use and doubles its bonus while Hexerei: Secret Rite is active (2+ Hexerei in party).",
        "A Day Carved from Rising Winds is the same Hexerei set Durin uses — running it on both stacks the team-wide ATK buff cleanly.",
        "C2 'In Flight, I Strike Whatever Flies' is his best stopping point: roughly +40-50% to the Etched nuke. C0 is fully functional; C1 is filler.",
      ],
      synergies: [
        { id: "durin", why: "Best partner. Both run 4pc A Day Carved from Rising Winds for stacked team ATK buffs; Durin's C1 Cycle of Enlightenment stacks each consumed by Lohen's hits adds +60% of Durin's ATK per hit. Hexerei: Secret Rite double-procs his weapon passive." },
        { id: "nicole", why: "Hexerei buffer + universal RES shred. Her A1 ATK conversion to flat ATK directly scales Lohen's nuke, and her shield keeps him in Masterstroke uninterrupted." },
        { id: "varka", why: "Hexerei trigger that adds Pyro for Melt setups. Will to Win generation from Varka's off-field hits is meaningful when his on-field windows are short." },
        { id: "xilonen", why: "Universal RES shred + healing. Outside of Hexerei comps, Xilonen is the next-best partner — Cryo DMG goblet stacks cleanly with her party-wide elemental shred." },
      ],
    },
  },
  {
    id: "sandrone",
    name: "Sandrone",
    epithet: "The Marionette · Seventh of the Fatui Harbingers",
    element: "cryo",
    role: "On-Field Stellar-Conduct DPS",
    weaponType: "Claymore",
    set: "4pc Disenchantment in Deep Shadows",
    setAlt: "4pc Marechaussee Hunter · 4pc Golden Troupe",
    weapon: "A Teaspoon of Transcendence",
    weaponAlt: "A Thousand Blazing Suns · Verdict · The Unforged · Wolf's Gravestone · Tidal Shadow (4★ F2P)",
    talents: "Normal ›› Burst › Skill",
    stats: [
      { id: "sands", label: "Sands main stat", target: "ATK %" },
      { id: "goblet", label: "Goblet main stat", target: "Cryo DMG %" },
      { id: "circlet", label: "Circlet main stat", target: "CRIT Rate / DMG" },
      { id: "atk", label: "Total ATK", target: "≥ 2200" },
      { id: "cr", label: "CRIT Rate", target: "50 – 60 % (+15% Cryo Reso, +16% set)" },
      { id: "cd", label: "CRIT DMG", target: "≥ 180 %" },
      { id: "er", label: "Energy Recharge", target: "130 – 150 %" },
    ],
    note: "Account-state: kit and weapon are leak-based as of 6.7 pre-release — verify on launch. Her Charged Attack and Burst deal Stellar-Conduct DMG (an upgraded Superconduct variant). Disenchantment in Deep Shadows is BiS by a wide margin: 4pc amplifies Stellar-Conduct AND grants +16% CRIT Rate, which stacks with Cryo Resonance's +15% CR vs Cryo-affected enemies — build her CR lower (50-60%) and pour the freed substats into CRIT DMG and ATK. EM is a minor bonus, not a priority.",
    deep: {
      lore: "The Marionette, seventh of the Eleven Fatui Harbingers — a master clockwork engineer who moves through a succession of mechanical bodies. Beneath the automaton she is a girl rebuilt as a replica of her creator's dead sister, a life stitched from grief and gears. She travels with Fagio, a repair-drone companion whose Decoding Power she juggles across two modes to keep her cannons firing.",
      kit: [
        "Skill — Formule Phénoménale: Differential Analysis: boards the Tea Party Tactical Assault Hovermech and hovers for ~6s while a Prismatic Resonance Cannon fires Prism Shots (Cryo DMG). Riding the mech also speeds Fagio's repair, resetting the drone between rotations.",
        "Burst — deploys the full cannon array for a burst of Stellar-Conduct DMG; the rotation nuke.",
        "Stellar-Conduct: her signature upgraded Superconduct — larger AoE, higher multiplier, and a team-wide Physical/Cryo RES shred that scales with Fagio's Decoding Power.",
        "Fagio Decoding Power: split across two modes; managing the drone's charge is the core of her uptime loop — hover to repair, then dump Decoding Power on Stellar-Conduct hits.",
      ],
      tips: [
        "Normal/Charged talent houses her Stellar-Conduct Charged Attack — level it first, Burst second, Skill last.",
        "Run her with a Cryo battery or a second Cryo unit for Resonance; the +15% CR vs Cryo-affected enemies is what lets the Disenchantment 4pc CR carry her crit line.",
        "A Teaspoon of Transcendence (signature) directly buffs Stellar-Conduct DMG +16% per Charged-Attack hit (max 3 stacks) on top of a large flat ATK + CRIT DMG stat block — a clear jump over the standard-banner claymores.",
      ],
      synergies: [
        { id: "lohen", why: "Second Cryo unit for Cryo Resonance (+15% CR vs Cryo enemies), which the Disenchantment CR build leans on. Both want on-field time, so run one as the primary and quick-swap." },
        { id: "ororon", why: "Off-field Electro applier — his continuous Electro feeds Stella Superconduct against her Cryo, and his 4pc Scroll lifts the team's Cryo DMG by up to 28%." },
        { id: "xilonen", why: "Universal RES shred + DEF-scaling heal in one slot; her shred stacks with Stellar-Conduct's own RES shred to push Sandrone's Cryo DMG ceiling." },
      ],
    },
  },
];

const ELEMENT_THEME = {
  dendro:  { color: "#7fb069", glow: "rgba(127, 176, 105, 0.18)", label: "Dendro" },
  geo:     { color: "#d4a857", glow: "rgba(212, 168, 87, 0.18)",  label: "Geo" },
  pyro:    { color: "#d96b50", glow: "rgba(217, 107, 80, 0.18)",  label: "Pyro" },
  hydro:   { color: "#6cb1da", glow: "rgba(108, 177, 218, 0.18)", label: "Hydro" },
  electro: { color: "#b07fd1", glow: "rgba(176, 127, 209, 0.18)", label: "Electro" },
  cryo:    { color: "#a8d6e5", glow: "rgba(168, 214, 229, 0.18)", label: "Cryo" },
  anemo:   { color: "#74c2a8", glow: "rgba(116, 194, 168, 0.18)", label: "Anemo" },
};

const REGIONS = [
  { id: "mondstadt", name: "Mondstadt",  archon: "Barbatos · Anemo Archon",            element: "anemo",   status: "full", summary: "The City of Freedom — Mondstadt sings under the breath of Barbatos. Quest tracker available (World + Story + Hangouts)." },
  { id: "liyue",     name: "Liyue",      archon: "Morax / Zhongli · Geo Archon",       element: "geo",     status: "full", summary: "Land of contracts and adepti, where stone remembers longer than men. Quest tracker available (World + Story + Hangouts)." },
  { id: "inazuma",   name: "Inazuma",    archon: "Raiden Ei · Electro Archon",         element: "electro", status: "full", summary: "The Eternal Shogunate of stormcloud and steel, sealed behind Tatarasuna's sky. Quest tracker available (World + Story + Hangouts)." },
  { id: "sumeru",    name: "Sumeru",     archon: "Lesser Lord Kusanali · Dendro",      element: "dendro",  status: "full", summary: "The rainforest court of knowledge and dream, where the Akasha listens. Quest tracker available (World + Story + Hangouts)." },
  { id: "fontaine",  name: "Fontaine",   archon: "Focalors (Furina) · Hydro Archon",   element: "hydro",   status: "full", summary: "The Court of Hydraulics — and the Iudex who judges it. Full quest tracker available." },
  { id: "natlan",    name: "Natlan",     archon: "Mavuika · Pyro Archon",              element: "pyro",    status: "full", summary: "Tribes, dragons, and the fire of the Children of Echoes. Quest tracker available (Tribal Chronicles + Story Quests)." },
  { id: "nod-krai",  name: "Nod-Krai",   archon: "Frostmoon · (no Archon)",            element: "cryo",    status: "full", summary: "Northern reach of moonlit veils and the Frostmoon Scions. Home of Columbina, Jahoda, and Lauma. Quest tracker available." },
  { id: "snezhnaya", name: "Snezhnaya",  archon: "The Tsaritsa · Cryo Archon",         element: "cryo",    status: "stub", summary: "The frozen seat of the Cryo Archon. Not yet open to travellers." },
];

const STORAGE_KEY = "genshin-build-progress-v1";
const COLLAPSE_KEY = "genshin-build-collapsed-v1";

const ELEMENT_ORDER = (() => {
  const seen = new Set();
  const order = [];
  for (const c of CHARACTERS) {
    if (!seen.has(c.element)) {
      seen.add(c.element);
      order.push(c.element);
    }
  }
  return order;
})();

const CHARACTERS_BY_ELEMENT = ELEMENT_ORDER.reduce((acc, elem) => {
  acc[elem] = CHARACTERS.filter((c) => c.element === elem);
  return acc;
}, {});

/* ============================================================
   REACTIONS
   Sources: Genshin Impact Wiki, Game8, KQM, Icy-Veins (cross-checked
   May 2026). Multipliers reference base level-1 reactions.
   ============================================================ */

const REACTION_GROUPS = [
  {
    id: "amplifying",
    label: "Amplifying",
    blurb:
      "Multiplies the base DMG of the hit that triggered the reaction. Scales on the triggering character's Elemental Mastery — not the applicator's.",
    formula:
      "Multiplier × ( 1 + 2.78·EM / (1400 + EM) + Reaction Bonus )",
    reactions: [
      {
        id: "vaporize",
        name: "Vaporize",
        trigger: "Pyro + Hydro",
        elements: ["pyro", "hydro"],
        short: "Multiplies the triggering hit.",
        multiplier: "×2.0 forward · ×1.5 reverse",
        details: [
          "Forward: Pyro hits a Hydro-applied target — ×2.0 multiplier on the triggering hit's base DMG.",
          "Reverse: Hydro hits a Pyro-burning target — ×1.5 multiplier.",
          "The triggering character's EM is what scales the bonus; teammate EM is irrelevant.",
          "Pyro auras are weaker (1 unit) than Hydro auras (2 units) — Pyro will be consumed first in most rotations.",
        ],
        examples: [
          { id: "arlecchino", role: "On-field Pyro DPS for forward Vape (×2.0)." },
          { id: "neuvillette", role: "Hydro applicator that enables forward Vape, or trigger for reverse Vape." },
        ],
      },
      {
        id: "melt",
        name: "Melt",
        trigger: "Pyro + Cryo",
        elements: ["pyro", "cryo"],
        short: "Multiplies the triggering hit.",
        multiplier: "×2.0 forward · ×1.5 reverse",
        details: [
          "Forward: Pyro hits a Cryo-applied target — ×2.0 multiplier.",
          "Reverse: Cryo hits a Pyro-burning target — ×1.5 multiplier.",
          "Melt removes the aura entirely (unlike Vape's stacking) — it is a 'one-shot' reaction per application.",
          "Same EM formula as Vape. No Cryo characters in the current roster, so Melt teams require external pulls.",
        ],
        examples: [
          { id: "arlecchino", role: "Pyro trigger for forward Melt if a Cryo applicator is added." },
        ],
      },
    ],
  },
  {
    id: "transformative",
    label: "Transformative",
    blurb:
      "Deals its own instance of damage based on the triggering character's level and EM. Ignores ATK%, CRIT, and the hit's DMG bonus.",
    formula:
      "Multiplier × LevelMult × ( 1 + 16·EM / (2000 + EM) + Reaction Bonus ) × EnemyResistance",
    reactions: [
      {
        id: "overloaded",
        name: "Overloaded",
        trigger: "Pyro + Electro",
        elements: ["pyro", "electro"],
        short: "AoE Pyro burst that launches small enemies.",
        multiplier: "×2.75",
        details: [
          "Deals AoE Pyro DMG centered on the reacted target.",
          "Knocks light enemies airborne — disruptive in Spiral Abyss; never run Overload teams against enemies that fly out of melee reach unless you have anti-knockback (shielders).",
          "Chevreusse's kit specifically rewards Overload — her burst shreds Pyro & Electro RES of enemies hit by an Overload.",
        ],
        examples: [
          { id: "chevreusse", role: "Overload support — her burst keys off the reaction." },
          { id: "arlecchino", role: "On-field Pyro DPS to trigger Overload with an off-field Electro." },
          { id: "fischl", role: "Off-field Electro from Oz keeps the aura up for Overload triggers." },
        ],
      },
      {
        id: "superconduct",
        name: "Superconduct",
        trigger: "Cryo + Electro",
        elements: ["cryo", "electro"],
        short: "Small AoE Cryo burst that shreds Physical RES.",
        multiplier: "×1.5 · −40% Physical RES (12s)",
        details: [
          "Deals AoE Cryo DMG and reduces target Physical RES by 40% for 12 seconds.",
          "Mostly relevant to Physical DPS teams — a niche reaction in the modern reaction-DPS meta.",
          "No Cryo characters in the current roster.",
        ],
        examples: [
          { id: "fischl", role: "Electro applicator for Superconduct if a Cryo unit is added." },
        ],
      },
      {
        id: "electro-charged",
        name: "Electro-Charged",
        trigger: "Hydro + Electro",
        elements: ["hydro", "electro"],
        short: "Repeatedly ticks Electro DMG on Hydro-wet targets.",
        multiplier: "×2 per tick (multi-target)",
        details: [
          "While Electro and Hydro coexist on a target, Electro DMG ticks roughly every 1s.",
          "Cannot CRIT in its base form — Lunar-Charged is the version that can.",
          "Hydro and Electro auras both persist after a tick; the reaction does not consume them in one go.",
        ],
        examples: [
          { id: "fischl", role: "Off-field Electro source via Oz." },
          { id: "neuvillette", role: "Continuous Hydro application from his CA keeps the reaction running." },
          { id: "columbina", role: "Hydro applicator and the Lunar-Charged enabler — see Lunar reactions." },
        ],
      },
      {
        id: "frozen",
        name: "Frozen",
        trigger: "Hydro + Cryo",
        elements: ["hydro", "cryo"],
        short: "Locks enemies in place; enables Shatter.",
        multiplier: "No direct DMG · Frozen duration scales with EM",
        details: [
          "Does no damage itself. Enables Permafreeze comps — chain Cryo + Hydro to keep enemies locked indefinitely.",
          "Blizzard Strayer 4pc grants +40% CRIT vs Frozen targets, the math centerpiece of most Freeze DPS builds.",
          "No Cryo characters in the current roster.",
        ],
        examples: [
          { id: "neuvillette", role: "Hydro applicator for any Freeze comp." },
        ],
      },
      {
        id: "shattered",
        name: "Shattered",
        trigger: "Frozen + Geo / Claymore / Plunge",
        elements: ["cryo", "hydro", "geo"],
        short: "Breaks Frozen for instant Physical DMG.",
        multiplier: "×3.0",
        details: [
          "Strikes a Frozen target with a heavy attack (Claymore, Geo, or any Plunging Attack) to deal a one-time Physical DMG instance.",
          "Useful when a Freeze comp wants to cycle reactions instead of indefinite lockdown.",
        ],
        examples: [
          { id: "varka", role: "Claymore + Plunge — natural Shatter trigger." },
          { id: "varesa", role: "Plunging Attacks shatter on impact (any element of attack qualifies)." },
        ],
      },
      {
        id: "swirl",
        name: "Swirl",
        trigger: "Anemo + Pyro / Hydro / Electro / Cryo",
        elements: ["anemo", "pyro", "hydro", "electro", "cryo"],
        short: "Spreads the swirled element as AoE; can shred RES via VV.",
        multiplier: "×0.6 (Anemo DMG, scales on EM)",
        details: [
          "Anemo damage applied to a target with another element creates a Swirl burst dealing Anemo DMG and applying the swirled element to nearby enemies.",
          "4pc Viridescent Venerer shreds 40% of the swirled element's RES for 10s — the single biggest team-DMG modifier in the game.",
          "Swirling Hydro/Pyro/Electro/Cryo is the standard support play; Geo and Dendro do not Swirl.",
        ],
        examples: [
          { id: "sucrose", role: "EM stat-stick grouper. Vacuums enemies, Swirls for VV RES shred, and shares 20% of her EM with the rest of the team." },
          { id: "jahoda", role: "Textbook VV support — Burst pulses Anemo, Skill drops Swirl-ready Robots; layers +100 EM via her healing passive." },
          { id: "chasca", role: "Multi-element bullets swirl with teammates' auras." },
          { id: "varka", role: "Anemo Claymore Hexerei — applies Anemo on-field for repeated Swirls." },
        ],
      },
      {
        id: "crystallize",
        name: "Crystallize",
        trigger: "Geo + Pyro / Hydro / Electro / Cryo",
        elements: ["geo", "pyro", "hydro", "electro", "cryo"],
        short: "Spawns an elemental shard that grants a shield.",
        multiplier: "Shield strength scales on Geo unit's EM",
        details: [
          "Geo hitting an applied target removes the aura and drops a shard. Pick it up for an elemental shield.",
          "Lunar-Crystallize (Geo + Hydro on a Moonsign team) replaces this — see Lunar reactions.",
          "Has no direct DMG output, but a Crystallize shield grants 250% RES bonus to its own element.",
        ],
        examples: [
          { id: "zibai", role: "Lunar-Crystallize on-field DPS — Geo source." },
          { id: "linnea", role: "Lunar-Crystallize sub-DPS / healer — Geo source." },
          { id: "xilonen", role: "Geo support; her kit is broader than Crystallize but she enables it." },
        ],
      },
      {
        id: "burning",
        name: "Burning",
        trigger: "Pyro + Dendro",
        elements: ["pyro", "dendro"],
        short: "DoT Pyro damage on the target.",
        multiplier: "×0.25 per tick",
        details: [
          "Applies Pyro repeatedly on the target. Low multiplier per tick, but reliable Pyro aura application for downstream reactions.",
          "Often unwanted — Burning eats your Dendro aura that you want for Bloom / Quicken setups.",
        ],
        examples: [
          { id: "arlecchino", role: "Pyro on-field; will Burn Dendro-applied targets if your Dendro aura is exposed." },
          { id: "lauma", role: "Dendro applicator for intentional Burning, but more often used for Bloom or Lunar-Bloom instead." },
        ],
      },
    ],
  },
  {
    id: "dendro",
    label: "Dendro family",
    blurb:
      "Sumeru's reaction family. Bloom-line spawns cores you detonate; Quicken-line applies an aura that buffs follow-up hits.",
    formula:
      "Bloom-line ignores DEF and cannot CRIT; Aggravate/Spread add a flat bonus to the triggering hit's DMG.",
    reactions: [
      {
        id: "bloom",
        name: "Bloom",
        trigger: "Hydro + Dendro",
        elements: ["hydro", "dendro"],
        short: "Spawns a Dendro Core that detonates after a delay.",
        multiplier: "×2.0 on detonation",
        details: [
          "Each Bloom drops a Dendro Core that explodes for AoE Dendro DMG after ~6s.",
          "Cores can be 'overcharged' by Electro into Hyperbloom or by Pyro into Burgeon.",
          "Scales only on the triggering character's level and EM. Ignores DEF, cannot CRIT.",
        ],
        examples: [
          { id: "nefer", role: "On-field Bloom / Lunar-Bloom DPS." },
          { id: "lauma", role: "Bloom enabler and Lunar-Bloom buffer." },
          { id: "neuvillette", role: "Hydro applicator strong enough to flood a Bloom comp." },
        ],
      },
      {
        id: "hyperbloom",
        name: "Hyperbloom",
        trigger: "Bloom Core + Electro",
        elements: ["dendro", "hydro", "electro"],
        short: "Bloom core becomes a homing Sprawling Shot dealing Dendro DMG.",
        multiplier: "×3.0",
        details: [
          "Apply Electro to a Dendro Core to fire a homing projectile that does AoE Dendro DMG.",
          "Best Electro triggers are off-field, fast tickers (Fischl, Raiden, Yae) — keeps the trigger character on a clean EM stat line.",
          "Ignores DEF and RES (mostly), cannot CRIT.",
        ],
        examples: [
          { id: "ororon", role: "Dedicated Hyperbloom trigger — Hydro/Dendro on team, Ororon goes pure EM." },
          { id: "fischl", role: "Backup Electro trigger via Oz — slower than Ororon but ubiquitous." },
        ],
      },
      {
        id: "burgeon",
        name: "Burgeon",
        trigger: "Bloom Core + Pyro",
        elements: ["dendro", "hydro", "pyro"],
        short: "Pyro detonates the core for big AoE Dendro DMG.",
        multiplier: "×3.0",
        details: [
          "Pyro applied to a Dendro Core causes immediate AoE Dendro DMG.",
          "Trigger character wants pure EM. Watch self-damage: Burgeon hits the trigger too unless mitigated.",
        ],
        examples: [
          { id: "durin", role: "Off-field Pyro source — can trigger Burgeon while staying on his ATK build." },
        ],
      },
      {
        id: "quicken",
        name: "Quicken (Catalyze)",
        trigger: "Dendro + Electro",
        elements: ["dendro", "electro"],
        short: "Coats the target in Quicken Aura — does no damage on its own.",
        multiplier: "No direct DMG",
        details: [
          "Dendro + Electro creates a Quicken Aura on the target. Quicken itself deals no damage.",
          "Quicken Aura enables Aggravate (Electro hit) and Spread (Dendro hit).",
        ],
        examples: [
          { id: "lauma", role: "Dendro applicator that maintains Quicken Aura." },
          { id: "fischl", role: "Electro applicator for the same." },
        ],
      },
      {
        id: "aggravate",
        name: "Aggravate",
        trigger: "Electro hit on Quicken Aura",
        elements: ["dendro", "electro"],
        short: "Adds a flat Electro DMG bonus to the triggering hit.",
        multiplier: "+1.15× base DMG instance (scales on EM)",
        details: [
          "The Electro hit that triggers Aggravate adds a flat damage instance scaled by triggering character's level and EM.",
          "Unlike Hyperbloom, Aggravate damage is part of the triggering hit — so it CAN CRIT and scales with the trigger's ATK / Electro DMG%.",
        ],
        examples: [
          { id: "fischl", role: "Aggravate DPS — Oz hits + her own attacks both trigger." },
          { id: "flins", role: "Lunar-Charged primary, but his Electro CAs also enable Aggravate when Dendro is on the team." },
        ],
      },
      {
        id: "spread",
        name: "Spread",
        trigger: "Dendro hit on Quicken Aura",
        elements: ["dendro", "electro"],
        short: "Dendro version of Aggravate — same mechanic, +1.25× instead.",
        multiplier: "+1.25× base DMG instance (scales on EM)",
        details: [
          "Flat damage instance added to the triggering Dendro hit. CAN CRIT.",
          "Better per-hit bonus than Aggravate, but Dendro DPS units are rarer than Electro ones.",
        ],
        examples: [
          { id: "nefer", role: "Dendro on-field DPS — Spread layers on top of her standard rotation." },
          { id: "lauma", role: "Dendro support / sub-trigger for Spread." },
        ],
      },
    ],
  },
  {
    id: "lunar",
    label: "Lunar",
    blurb:
      "Hydro-line reaction variants gated by a Moonsign Benediction character (Columbina). Unlike their base reactions, Lunar reactions can land CRIT Hits.",
    formula:
      "Damage from each Lunar reaction sources from every character who applied its elements during the reaction — a team-stat output, not a single-trigger output.",
    reactions: [
      {
        id: "lunar-charged",
        name: "Lunar-Charged",
        trigger: "Electro-Charged + Moonsign",
        elements: ["hydro", "electro"],
        short: "Electro-Charged variant that spawns a CRIT-capable Thundercloud.",
        multiplier: "Repeated Electro DMG; can CRIT",
        details: [
          "Trigger an Electro-Charged with a Moonsign Benediction character (Columbina) on the team — a Thundercloud appears that continuously deals Electro DMG to nearby Wet+Electro-afflicted enemies every ~2s for the duration.",
          "DMG draws from all characters who applied Hydro/Electro during the reaction — both the trigger and the applicator matter.",
          "Unlike base Electro-Charged, Lunar-Charged DMG CAN CRIT.",
        ],
        examples: [
          { id: "flins", role: "Lunar-Charged on-field DPS — kit literally built around this reaction." },
          { id: "columbina", role: "Moonsign enabler. Without her in the team there is no Lunar reaction." },
          { id: "fischl", role: "Off-field Electro contributor — Oz adds Electro applications to the rotation." },
        ],
      },
      {
        id: "lunar-bloom",
        name: "Lunar-Bloom",
        trigger: "Bloom + Moonsign",
        elements: ["hydro", "dendro"],
        short: "Bloom variant that spawns Bountiful Cores generating Verdant Dew.",
        multiplier: "No direct DMG · grants 1 Verdant Dew after 2.5s",
        details: [
          "Hydro on Dendro (or vice versa) with Columbina in the party spawns a Bountiful Core. After 2.5s it grants the party 1 Verdant Dew (VD).",
          "VD is consumed by Lunar-Bloom characters in their kits as a resource — it does not deal direct damage on its own.",
          "Lauma and Nefer are designed around the VD economy.",
        ],
        examples: [
          { id: "lauma", role: "Lunar-Bloom support — converts VD into team buffs." },
          { id: "nefer", role: "Lunar-Bloom on-field DPS — consumes VD for empowered hits." },
          { id: "columbina", role: "The Moonsign enabler; her burst is what produces the Lunar variant." },
        ],
      },
      {
        id: "lunar-crystallize",
        name: "Lunar-Crystallize",
        trigger: "Hydro + Geo + Moonsign",
        elements: ["hydro", "geo"],
        short: "Crystallize variant that spawns Moondrifts and a Harmony nuke at 3 stacks.",
        multiplier: "Moondrift Harmony Geo DMG; can CRIT",
        details: [
          "Geo on a Hydro-applied target with Columbina present spawns three Moondrifts nearby. Trigger the reaction three times → Moondrift Harmony fires, dealing AoE Geo DMG.",
          "Harmony DMG draws from every character who applied elements during the reaction — a team-output stat.",
          "Lunar-Crystallize hits CAN CRIT, unlike base Crystallize.",
        ],
        examples: [
          { id: "zibai", role: "Lunar-Crystallize on-field DPS — Geo trigger." },
          { id: "linnea", role: "Lunar-Crystallize sub-DPS / healer — alternate Geo source plus sustain." },
          { id: "columbina", role: "Moonsign enabler; her HP scales the team Lunar-reaction bonus." },
        ],
      },
    ],
  },
  {
    id: "hexerei",
    label: "Hexerei (Hexenzirkel faction)",
    blurb:
      "Not a reaction — a faction tag. Members of the Hexenzirkel coven of witches whose kits explicitly buff each other when more than one is on the team.",
    formula:
      "Hexerei tag bonuses · ADCFRW 4pc: +20 % CRIT Rate to wearer when any other Hexerei is in party · Durin A1 reaches +75 % at 2 Hexerei · Mona Astral Glow of Mercury (2+ Hexerei): NA/CA stacks consumed by an ally Vape grant +15 % per stack on that Vape (max +45 %) · Nicole Methexis: instant Guidance-of-Theosis upgrade when the observed character is Hexerei.",
    reactions: [
      {
        id: "hexerei-roster",
        name: "Hexerei roster",
        trigger: "Faction tag · Hexenzirkel coven",
        elements: [],
        short: "Five playable Hexerei: Mona, Nicole, Durin, Varka, Prune. (Lohen joins late 6.6.)",
        multiplier: "Tag — see formula above",
        details: [
          "Hexenzirkel is the coven of witches in Genshin lore: Alice, Mona, Rhinedottir, the Dornman bard, 'N' (Nicole), Prune (the Witch-Hunter), and various historic members. In gameplay terms, the playable members of the coven share the Hexerei tag.",
          "Set bonus — A Day Carved from Rising Winds (4pc): wearer gains +20 % CRIT Rate while at least one OTHER Hexerei is in the party. Varka's default set; pairs with Mona / Nicole / Durin / Prune to trigger.",
          "Set bonus — 4pc Hexerei (leak, 6.6): wearer's Skill grants nearby teammates +20 % Elemental DMG Bonus. Caps at +40 % with two Hexerei wearers, but SAME-ELEMENT bonuses do NOT stack (two Hexerei sets both granting Pyro DMG = still just +20 % Pyro).",
          "Durin A1 — when 2 or more Hexerei are in the party, his Hexerei-scaling A1 damage bonus jumps from base to +75 %.",
          "Mona Omen (Burst) — the marked enemy takes ~42-60 % more DMG from all sources (scales with talent level). Independent of the Hexerei count.",
          "Mona Astral Glow of Mercury (6.2 Witch's Homework unlock, requires 2+ Hexerei) — Mona's NA/CA grants 1 stack (max 3, 8 s). When an ally triggers a Vaporize, all stacks are consumed and that Vape gains +15 % per stack (max +45 %).",
          "Nicole Methexis (A4) — Grace of Kenosis upgrades to Guidance of Theosis INSTANTLY when the observed active character is Hexerei (3-second wait otherwise).",
          "Nicole C2 (Sacred Benediction) — every Coordinated Attack hit strips −20 % elemental RES from nearby enemies, in the ACTIVE CHARACTER's element. Universal, element-following RES shred — sidesteps the Anemo + 4pc VV setup entirely.",
          "Prune Ringing Inspiration (A4) — DMG % team buff scaling on Prune's ATK over 1000 (0.01 % per excess ATK, cap +35 %). Lives in the DMG_Bonus term, stacks multiplicatively with every flat-ATK and ATK % buff in the formula.",
          "Prune C6 (Bell-Bound Oath) — Ringing Inspiration ALSO grants recipients +350 flat ATK on top of the DMG % bonus. At C6 Prune fills both a flat-ATK and a DMG % slot in one character — Bennett-tier flat-ATK output with the DMG % buff layered on top.",
          "Two-Hexerei is the practical floor (triggers ADCFRW + Durin A1 + Methexis instant + Mona Astral Glow). Three-Hexerei stacks ADCFRW on every wearer and starts to crowd out a healer slot. Four-Hexerei is the meme ceiling — no healer, sustain entirely on Nicole's shield.",
        ],
        examples: [
          { id: "mona", role: "Hexenzirkel coven. Omen amplifier + Hydro applicator." },
          { id: "nicole", role: "Hexenzirkel coven. Universal flat-ATK buffer + shielder + Coordinated Attack DPS. At C2 also a universal element-following −20 % RES shred." },
          { id: "prune", role: "Hexenzirkel Witch-Hunter. DMG % buffer (Ringing Inspiration) + Swirl Sub-DPS + Anemo applicator. At C6 also a flat-ATK buffer (+350) — Bennett-tier in one slot." },
          { id: "durin", role: "Hexerei-tagged (Rhinedottir's creation). Off-field Pyro Sub-DPS." },
          { id: "varka", role: "Hexerei-tagged honorary member. Anemo Claymore on-field DPS — wears ADCFRW." },
        ],
      },
    ],
  },
  {
    id: "mechanics",
    label: "Damage theorycraft",
    blurb:
      "How a hit actually resolves. The formula has six independent multipliers — each is its own lever, each has a cap, and getting the order of operations right is how big numbers happen.",
    formula:
      "DMG = Talent % × Scaling Stat × DMG_Bonus × DEF_Mult × RES_Mult × CRIT_Mult × Reaction_Mult",
    reactions: [
      {
        id: "fmt-formula",
        name: "The full DMG formula",
        trigger: "How every hit resolves",
        elements: [],
        short: "Six independent multipliers. Stacking them all is how big numbers happen.",
        multiplier: "see details",
        details: [
          "Base DMG = Talent % × Scaling Stat (ATK / HP / DEF / EM, set by the character's kit).",
          "ATK = (Base ATK char + Base ATK weapon) × (1 + Σ ATK %) + Σ flat ATK.",
          "DMG_Bonus = 1 + Σ (Elemental DMG % + Normal/Charged/Plunge DMG % + reaction DMG % + …). All DMG % bonuses ADD into one pool.",
          "DEF_Mult = (Lv_char + 100) / [ (Lv_char + 100) + (Lv_enemy + 100) × (1 − DEF Ignore) × (1 − DEF Shred) ].",
          "RES_Mult = 1 − Enemy RES (after RES shred). If RES > 75 %, RES_Mult = 1 / (1 + 4·RES). RES can go NEGATIVE — a target at −50 % RES takes 1.5× the damage of a 0 % RES target.",
          "CRIT_Mult on a single hit is either 1 or (1 + CD). Average over many hits is (1 + CR × CD).",
          "Reaction_Mult — amplifying (Vape / Melt): ×1.5 or ×2.0 multiplied by the EM term. Additive (Aggravate / Spread): a SEPARATE damage instance added to the hit, scaled on EM and trigger level.",
        ],
        examples: [],
      },
      {
        id: "fmt-base-atk",
        name: "Base ATK vs Total ATK",
        trigger: "The Bennett rule",
        elements: [],
        short: "Some buffs scale on TOTAL ATK; some scale on BASE ATK. Not the same lever.",
        multiplier: "Base = char + weapon (white #)",
        details: [
          "BASE ATK = character ATK at level + weapon Base ATK. Shown as the white number on the stat screen.",
          "TOTAL ATK = Base × (1 + Σ ATK %) + flat. Shown as the green number; the actual ATK your hit uses.",
          "MOST attacks scale on TOTAL ATK. Stack ATK % substats / sets / buffs → number goes up.",
          "SOME buffs scale on BASE ATK ONLY. Bennett's Burst is the canonical example: it adds a flat ATK chunk equal to BENNETT'S BASE ATK × talent multiplier (≈95 % at talent 13). Stacking ATK % on Bennett does NOT increase the buff he gives the party.",
          "For Base-ATK scalers, weapon Base ATK is the lever. Aquila Favonia (674) > a R5 4★ at ~565. ATK % substats on the buffer are dead weight.",
          "Other Base-ATK scalers: Yun Jin Burst, parts of Eula's Burst, Tartaglia A1 trigger, Albedo Elevation. Always read the talent text.",
        ],
        examples: [
          { id: "bennett", role: "The canonical Base-ATK scaling buff." },
          { id: "nicole", role: "Grace of Kenosis scales on Nicole's TOTAL ATK (15 %, capped at +600). Substat ATK % on Nicole DOES grow the buff — unlike Bennett — until ATK reaches ~4000." },
        ],
      },
      {
        id: "fmt-atk-stacking",
        name: "ATK buff stacking",
        trigger: "How multiple ATK % buffs combine",
        elements: [],
        short: "Different-source ATK % buffs ADD into one pool. Same-NAMED buffs DO NOT stack.",
        multiplier: "Σ ATK % (additive)",
        details: [
          "ATK % from different sources adds together: 4pc Noblesse Oblige (+20 %) + Pyro Resonance (+25 %) + Tenacity's Millelith's Mercy (+20 %) + ATK % Sands (+46.6 %) + substats = ALL one pool, applied as (1 + total) × Base ATK.",
          "FLAT ATK is a separate term. Bennett's Burst and Nicole's Grace of Kenosis are both FLAT ATK buffs — they add to the flat-ATK term, not the ATK % pool. They do not compete; they STACK with each other (different names) and they stack on top of any amount of ATK %.",
          "BUFFS WITH THE SAME NAME DO NOT STACK. 4pc Noblesse Oblige's 'Son of the Hearth' is a named effect — one NO holder = +20 % team ATK; TWO NO holders = STILL +20 % (higher value wins, duration refreshes). Same rule for Tenacity's 'Millelith's Mercy', Instructor's EM share, etc.",
          "Practical: don't run two of the same 4pc team-buff set. Run ONE NO + ONE Tenacity + ONE Instructor → three different named buffs, all stacking additively into one ATK % pool. Layer Bennett and/or Nicole on top for two flat-ATK chunks in the separate flat-ATK term.",
          "Same character re-casting their own buff doesn't double up either — Bennett re-bursting refreshes duration, does not double the value. Re-cast = same buff, name collision, higher value wins.",
          "Furina's Fanfare is a DMG % bonus (lives in the DMG_Bonus term), not an ATK %, not a flat ATK. It stacks MULTIPLICATIVELY with everything in the ATK pool — so Furina + Bennett + Nicole all apply on the same hit, just on different terms of the formula.",
        ],
        examples: [
          { id: "bennett", role: "Flat ATK buff (Base-ATK scaling)." },
          { id: "nicole", role: "Flat ATK buff (Total-ATK scaling, capped at +600 + 300). Different name from Bennett's — both stack additively in the flat-ATK term." },
          { id: "mavuika", role: "Recipient — total ATK lifts her Sacred Flame pulses and Crucible swings; both flat buffs add to the same flat-ATK term that Pyro Resonance multiplies." },
        ],
      },
      {
        id: "fmt-res-shred",
        name: "RES shred",
        trigger: "Reducing enemy elemental RES",
        elements: [],
        short: "Negative RES is real and uncapped — usually the biggest team-DMG lever in the game.",
        multiplier: "RES_Mult ∝ 1 − RES",
        details: [
          "Default enemy RES is 10 % for most elements. RES SHRED subtracts: 4pc Viridescent Venerer = −40 % swirled element; Zhongli Skill = −20 % universal; Xilonen Nightsoul = element-agnostic −% scaling on DEF; Nicole C2 = −20 % in the active character's element (element-following, applied per Coordinated Attack hit); various character A4s.",
          "When enemy RES drops below 0, the formula is RES_Mult = 1 − RES (clean linear bonus). −30 % RES → 1.30× damage; −50 % RES → 1.50× damage.",
          "When enemy RES ≥ 75 %, the formula switches to 1 / (1 + 4·RES) — diminishing returns. Shred is far more valuable than a flat DMG % buff against high-RES content.",
          "RES shred from DIFFERENT sources stacks ADDITIVELY. VV's −40 % + Zhongli's −20 % = −60 % effective applied shred. SAME-name shred does NOT stack — two VV holders still shred −40 % only.",
          "Most RES shred is element-specific (VV shreds only the swirled element). Universal shred is rare — Zhongli, Xilonen, and a few unique passives.",
          "Stacking RES shred is usually a higher-multiplier play than another DMG % buff once you have a DPS Goblet (Elemental DMG %), because DMG % saturates into the (1 + Σ) bucket while RES shred lives in its own multiplicative term.",
        ],
        examples: [
          { id: "jahoda", role: "4pc Viridescent Venerer driver — −40 % swirled element RES on rotation." },
          { id: "sucrose", role: "Same — VV swirl support; her EM share is a bonus on top." },
          { id: "xilonen", role: "DEF-scaling RES shred — universal, element-agnostic; stacks freely with VV." },
          { id: "nicole", role: "C2 Sacred Benediction — −20 % in the active character's element per Coordinated Attack. Element-following universal shred, stacks with VV (different sources, additive)." },
        ],
      },
      {
        id: "fmt-def-shred",
        name: "DEF shred & DEF ignore",
        trigger: "Reducing or skipping enemy DEF",
        elements: [],
        short: "Multiplicative with RES. Almost no characters have it — a fresh, untapped lever.",
        multiplier: "see DEF_Mult formula",
        details: [
          "Enemy DEF reduces incoming DMG via DEF_Mult. At Lv 90 vs Lv 90 enemy with default DEF, you take roughly 50 % of pre-DEF damage.",
          "DEF SHRED — multiplicative (1 − x) on enemy DEF. Sources: Razor Burst, Lisa A4 (charged hits), a couple of weapon passives. Notably absent from Zhongli's kit (he is RES shred only).",
          "DEF IGNORE — bypasses a flat percentage of DEF entirely. Klee Skill, Itto Burst, Albedo Skill, the Stellar Restoration passive.",
          "DEF shred and RES shred are MULTIPLICATIVE with each other — they live in separate terms of the formula. Any DEF shred you can find adds a fresh multiplier on top of a maxed-RES-shred team.",
          "Bloom / Hyperbloom / Burgeon DAMAGE IGNORES DEF entirely. One reason EM-only triggers (Ororon at 0 ATK) hit so hard despite zero offensive substats.",
        ],
        examples: [
          { id: "xilonen", role: "Universal DEF-scaling RES shred + DEF interactions — stacks with VV, fresh multiplier." },
        ],
      },
      {
        id: "fmt-em",
        name: "Elemental Mastery scaling",
        trigger: "What EM actually buffs",
        elements: [],
        short: "Reaction-only stat. EM does NOTHING for non-reaction hits.",
        multiplier: "Amplifying EM term = 1 + 2.78·EM / (EM + 1400)",
        details: [
          "Amplifying reactions (Vape / Melt): the EM term multiplies the reaction multiplier. 200 EM ≈ +35 %; 800 EM ≈ +124 %; 1200 EM ≈ +144 %. Diminishing returns above ~800.",
          "Transformative reactions (Hyperbloom, Burgeon, Overload, Swirl, Shatter, Bloom detonation): EM scales the FLAT damage instance via 16·EM / (EM + 2000). Bigger payoff per EM than amplifying — Hyperbloom triggers stack 1000+ EM.",
          "Quicken / Catalyze (Aggravate / Spread): EM ADDS a flat DMG instance to the triggering hit. Scales with EM and trigger level. Does not multiply the hit itself.",
          "EM does NOTHING for non-reaction damage. A pure Mono-Geo Itto with no reactions gets ZERO benefit from EM substats.",
          "EM DOES NOT SHARE across the team — only the TRIGGERING character's EM counts for that reaction's bonus. (Hyperbloom = the Electro trigger's EM only, no matter how much EM Nahida has.) Exceptions are explicit team-EM passives: Sucrose A1/A4, Jahoda's healing passive, old Kazuha A4 — these push the team's EM stat up directly.",
        ],
        examples: [
          { id: "ororon", role: "Hyperbloom trigger — pure EM build, 1000+ target." },
          { id: "sucrose", role: "EM stat-stick + sharer — passes 20 % of her EM to the team." },
          { id: "jahoda", role: "Healing passive grants flat +100 EM to the team on heal." },
        ],
      },
      {
        id: "fmt-crit",
        name: "CRIT mechanics",
        trigger: "CRIT Rate × CRIT DMG",
        elements: [],
        short: "Target a 1:2 CR:CD ratio. Each is its own pool. Overcap is wasted.",
        multiplier: "Avg multiplier = 1 + CR × CD",
        details: [
          "CRIT Rate (CR) = probability of a CRIT. CRIT DMG (CD) = damage bonus on a CRIT.",
          "Average damage multiplier = 1 + CR × CD. A 60 / 120 build averages 1.72×; an 80 / 160 build averages 2.28×.",
          "Practical rule: keep CR : CD ≈ 1 : 2. If your weapon / set give CR (Blizzard Strayer, Shimenawa, ADCFRW, sig weapons with CR substat), pivot Circlet to CRIT DMG. If they give CD, pivot Circlet to CR.",
          "OVERCAP IS WASTED. CR caps at 100 %. Any rate above 100 % is dead substats. ADCFRW's +20 % CR Hexerei bonus + a CR weapon + CR circlet can push past 100 % easily — Varka's note flags this explicitly.",
          "Damage instances that CANNOT CRIT (Bloom detonation, Hyperbloom, Burgeon, base Electro-Charged) ignore CR / CD entirely. Build EM there instead. Note that LUNAR variants of those reactions (Lunar-Charged, Lunar-Crystallize) CAN CRIT.",
          "CR / CD do not stack between characters — they're personal stats. Some buffs grant CR / CD to others (Yelan's A4, Cyno's C2) but those are named buffs subject to the same-name no-stack rule.",
        ],
        examples: [
          { id: "varka", role: "ADCFRW + Hexerei + sig weapon — easily overcaps CR. Pivot to pure CD substats." },
          { id: "ororon", role: "Hyperbloom trigger — cannot CRIT, ignore CR / CD, build EM." },
        ],
      },
    ],
  },
];

/* ============================================================
   WEAPONS — BiS signature weapons for the roster
   Sources: Game8, Icy-Veins, KQM, GameWith (Version 6.6, May 2026)
   ============================================================ */

const WEAPONS = [
  {
    id: "nightweavers-looking-glass",
    name: "Nightweaver's Looking Glass",
    type: "Catalyst",
    rarity: 5,
    baseAtk: "542",
    substat: "EM",
    passive: "Millennial Hymn",
    passiveDesc: [
      "Skill deals Hydro/Dendro DMG → Prayer of the Far North: +60 EM for 4.5s.",
      "Party triggers Lunar-Bloom → New Moon Verse: +60 EM for 10s.",
      "Both active simultaneously → all party members: Bloom DMG +120%, Hyperbloom/Burgeon DMG +80%, Lunar-Bloom DMG +40%.",
    ],
    bestFor: "lauma",
    alts: ["A Thousand Floating Dreams", "Etherlight Spindlelute (F2P)"],
  },
  {
    id: "reliquary-of-truth",
    name: "Reliquary of Truth",
    type: "Catalyst",
    rarity: 5,
    baseAtk: "542",
    substat: "CRIT Rate (implicit +8% from passive)",
    passive: "Secret of Lies",
    passiveDesc: [
      "Skill → Secret of Lies: +80 EM for 12s.",
      "Lunar-Bloom DMG → Moon of Truth: CRIT DMG +24% for 4s.",
      "Both active simultaneously → both effects increased by 50% (so +120 EM, +36% CRIT DMG).",
    ],
    bestFor: "nefer",
    alts: ["Tome of the Eternal Flow", "Dawning Frost (4★)"],
  },
  {
    id: "golden-frostbound-oath",
    name: "Golden Frostbound Oath",
    type: "Bow",
    rarity: 5,
    baseAtk: "542",
    substat: "88.2% CRIT DMG",
    passive: "Frost Fae's Favor",
    passiveDesc: [
      "DEF +16%.",
      "Skill or Lunar-Crystallize hits → 6s effect: Geo DMG +40%, Lunar-Crystallize Reaction DMG +40%.",
      "Frost Fae's Mischief: 20% party-wide buff for Geo DMG and Lunar-Crystallize DMG.",
    ],
    bestFor: "linnea",
    alts: ["Aqua Simulacra", "Slingshot (3★)"],
  },
  {
    id: "athame-artis",
    name: "Athame Artis",
    type: "Sword",
    rarity: 5,
    baseAtk: "608",
    substat: "33.1% CRIT Rate",
    passive: "Day King's Splendor Solis",
    passiveDesc: [
      "Burst CRIT DMG +16-32%.",
      "Burst hits → Blade of Daylight Hours: self ATK +20-40%, party members ATK +16-32%.",
      "With Hexerei: Secret Rite (2+ Hexerei in party), Blade of Daylight Hours effects +75%.",
    ],
    bestFor: "durin",
    alts: ["Freedom-Sworn", "Wolf-Fang (4★)"],
  },
  {
    id: "bloodsoaked-ruins",
    name: "Bloodsoaked Ruins",
    type: "Polearm",
    rarity: 5,
    baseAtk: "674",
    substat: "22.1% CRIT Rate",
    passive: "Mournful Tribute",
    passiveDesc: [
      "3.5s after Burst, Lunar-Charged DMG +36-84%.",
      "Lunar-Charged triggers → Requiem of Ruin: CRIT DMG +28-56% for 6s.",
      "+12 Energy on Lunar-Charged trigger (once per 14s).",
    ],
    bestFor: "flins",
    alts: ["Staff of the Scarlet Sands", "Engulfing Lightning", "Prospector's Shovel (craftable)"],
  },
  {
    id: "nocturnes-curtain-call",
    name: "Nocturne's Curtain Call",
    type: "Catalyst",
    rarity: 5,
    baseAtk: "542",
    substat: "88.2% CRIT DMG",
    passive: "Bountiful Sea's Sacred Wine",
    passiveDesc: [
      "Max HP +10%.",
      "Lunar reactions → Bountiful Sea's Sacred Wine (12s): Max HP +14% more (total +24%), Lunar Reaction CRIT DMG +60%.",
      "+14 Energy on Lunar reaction trigger (once per 18s, works off-field).",
    ],
    bestFor: "columbina",
    alts: ["Surf's Up", "Tome of the Eternal Flow", "Sacrificial Jade (4★)", "Prototype Amber (F2P)"],
  },
  {
    id: "angelos-heptades",
    name: "Angelos' Heptades",
    type: "Catalyst",
    rarity: 5,
    baseAtk: "741",
    substat: "16.5% ATK",
    passive: "Crown of the Final Scion",
    passiveDesc: [
      "ATK +12-24%.",
      "After Shield creation → Pathfinder's Light (20s): active party member DMG +10-22% per 1000 ATK equipping character has, max +26-58%.",
      "During Pathfinder's Light, hitting enemy → Guide's Contentment: +14-18 Energy to equipping character.",
    ],
    bestFor: "nicole",
    alts: ["Sacrificial Jade", "Tome of the Eternal Flow", "A Thousand Floating Dreams", "Wandering Evenstar (4★)"],
  },
];

/* ============================================================
   ROUTING (hash-based, no library)
   ============================================================ */

const ROUTES = {
  characters: "characters",
  reactions:  "reactions",
  weapons:    "weapons",
  regions:    "regions",
  region:     "region",
};

function getRouteFromHash() {
  const raw = (typeof window !== "undefined" ? window.location.hash : "") || "";
  const key = raw.replace(/^#\/?/, "").toLowerCase();
  if (key === "reactions") return { page: ROUTES.reactions };
  if (key === "weapons") return { page: ROUTES.weapons };
  if (key === "regions" || key === "regions/") return { page: ROUTES.regions };
  if (key.startsWith("regions/")) {
    return { page: ROUTES.region, region: key.slice("regions/".length) };
  }
  return { page: ROUTES.characters };
}

/* ============================================================
   APP
   ============================================================ */

export default function App() {
  const [route, setRoute] = useState(getRouteFromHash);
  const [progress, setProgress] = useState({});
  const [collapsed, setCollapsed] = useState({});
  const [highlightId, setHighlightId] = useState(null);
  const [pendingScrollId, setPendingScrollId] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const onHashChange = () => setRoute(getRouteFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProgress(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
    try {
      const rawCol = localStorage.getItem(COLLAPSE_KEY);
      if (rawCol) setCollapsed(JSON.parse(rawCol));
    } catch (e) {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (route.page !== ROUTES.characters || !pendingScrollId) return;
    const id = pendingScrollId;
    setPendingScrollId(null);
    const t = window.setTimeout(() => {
      const el = document.getElementById(`card-${id}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      setHighlightId(id);
      window.setTimeout(() => {
        setHighlightId((cur) => (cur === id ? null : cur));
      }, 1800);
    }, 40);
    return () => window.clearTimeout(t);
  }, [route, pendingScrollId]);

  const persist = (next) => {
    setProgress(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error("Failed to save:", e);
    }
  };

  const toggle = (charId, statId) => {
    const current = (progress[charId] && progress[charId][statId]) || false;
    persist({
      ...progress,
      [charId]: { ...(progress[charId] || {}), [statId]: !current },
    });
  };

  const toggleCollapsed = (elem) => {
    const next = { ...collapsed, [elem]: !collapsed[elem] };
    setCollapsed(next);
    try {
      localStorage.setItem(COLLAPSE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error("Failed to save:", e);
    }
  };

  const goToCharacter = (id) => {
    const target = CHARACTERS.find((c) => c.id === id);
    if (!target) return;
    if (collapsed[target.element]) {
      const next = { ...collapsed, [target.element]: false };
      setCollapsed(next);
      try {
        localStorage.setItem(COLLAPSE_KEY, JSON.stringify(next));
      } catch (e) {
        // ignore
      }
    }
    if (route.page !== ROUTES.characters) {
      setPendingScrollId(id);
      window.location.hash = "#/characters";
      return;
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.getElementById(`card-${id}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        setHighlightId(id);
        window.setTimeout(() => {
          setHighlightId((cur) => (cur === id ? null : cur));
        }, 1800);
      });
    });
  };

  const resetAll = () => {
    if (!window.confirm("Clear all checked boxes? This cannot be undone.")) return;
    setProgress({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  };

  const totalStats = CHARACTERS.reduce((s, c) => s + c.stats.length, 0);
  const doneStats = CHARACTERS.reduce(
    (s, c) => s + c.stats.filter((st) => progress[c.id] && progress[c.id][st.id]).length,
    0
  );
  const pct = totalStats ? Math.round((doneStats / totalStats) * 100) : 0;

  const FULL_BLEED_REGIONS = {
    fontaine:  FontaineQuests,
    mondstadt: MondstadtQuests,
    liyue:     LiyueQuests,
    inazuma:   InazumaQuests,
    sumeru:    SumeruQuests,
    natlan:    NatlanQuests,
    "nod-krai": NodKraiQuests,
  };
  const FullBleedComponent =
    route.page === ROUTES.region ? FULL_BLEED_REGIONS[route.region] : null;

  if (FullBleedComponent) {
    return (
      <>
        <style>{styles}</style>
        <div className="region-nav-wrap">
          <NavBar route={route} />
        </div>
        <FullBleedComponent />
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="page">
        <div className="vignette" aria-hidden="true" />
        <div className="stars" aria-hidden="true" />

        <NavBar route={route} />

        {route.page === ROUTES.reactions ? (
          <ReactionsPage onGoToCharacter={goToCharacter} />
        ) : route.page === ROUTES.weapons ? (
          <WeaponsPage onGoToCharacter={goToCharacter} />
        ) : route.page === ROUTES.regions ? (
          <RegionsPage />
        ) : route.page === ROUTES.region ? (
          <RegionStub regionId={route.region} />
        ) : (
          <>
            <header className="top">
              <div className="top-marks" aria-hidden="true">{"\u2726 \u2726 \u2726"}</div>
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

            <main className="elements">
              {ELEMENT_ORDER.map((elem) => {
                const theme = ELEMENT_THEME[elem];
                const chars = CHARACTERS_BY_ELEMENT[elem];
                const isOpen = !collapsed[elem];
                const groupTotal = chars.reduce((s, c) => s + c.stats.length, 0);
                const groupDone = chars.reduce(
                  (s, c) =>
                    s +
                    c.stats.filter((st) => progress[c.id] && progress[c.id][st.id])
                      .length,
                  0
                );
                return (
                  <section
                    key={elem}
                    className="elem-section"
                    style={{ "--accent": theme.color, "--glow": theme.glow }}
                  >
                    <button
                      className={`elem-header ${isOpen ? "open" : "closed"}`}
                      onClick={() => toggleCollapsed(elem)}
                      aria-expanded={isOpen}
                      type="button"
                    >
                      <span className="elem-caret" aria-hidden="true">
                        <svg viewBox="0 0 10 10" className="caret-svg">
                          <path d="M2 3 L5 7 L8 3" />
                        </svg>
                      </span>
                      <h2 className="elem-title">{theme.label}</h2>
                      <span className="elem-count">
                        {groupDone} / {groupTotal}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="grid">
                        {chars.map((c) => (
                          <CharacterCard
                            key={c.id}
                            char={c}
                            checked={progress[c.id] || {}}
                            onToggle={toggle}
                            hydrated={hydrated}
                            flash={highlightId === c.id}
                            onGoTo={goToCharacter}
                          />
                        ))}
                      </div>
                    )}
                  </section>
                );
              })}
            </main>

            <footer className="bottom">
              <p>Targets compiled from Game8, KQM, Icy-Veins, and GamesGG · Version 6.5</p>
              <p className="bottom-faint">Progress saved locally.</p>
            </footer>
          </>
        )}
      </div>
    </>
  );
}

/* ============================================================
   NAV BAR
   ============================================================ */

function NavBar({ route }) {
  const isRegions = route.page === ROUTES.regions || route.page === ROUTES.region;
  return (
    <nav className="nav" aria-label="Primary">
      <a className="nav-brand" href="#/characters">
        <span className="nav-brand-mark" aria-hidden="true">✦</span>
        <span className="nav-brand-text">Almanac</span>
      </a>
      <div className="nav-links">
        <a
          href="#/characters"
          className={`nav-link ${route.page === ROUTES.characters ? "active" : ""}`}
          aria-current={route.page === ROUTES.characters ? "page" : undefined}
        >
          Characters
        </a>
        <a
          href="#/reactions"
          className={`nav-link ${route.page === ROUTES.reactions ? "active" : ""}`}
          aria-current={route.page === ROUTES.reactions ? "page" : undefined}
        >
          Reactions
        </a>
        <a
          href="#/weapons"
          className={`nav-link ${route.page === ROUTES.weapons ? "active" : ""}`}
          aria-current={route.page === ROUTES.weapons ? "page" : undefined}
        >
          Weapons
        </a>
        <a
          href="#/regions"
          className={`nav-link ${isRegions ? "active" : ""}`}
          aria-current={isRegions ? "page" : undefined}
        >
          Regions
        </a>
      </div>
    </nav>
  );
}

/* ============================================================
   REGIONS — overview grid + per-region stub
   ============================================================ */

function RegionsPage() {
  return (
    <>
      <header className="top">
        <div className="top-marks" aria-hidden="true">{"✦ ✦ ✦"}</div>
        <h1 className="title">The Seven Nations</h1>
        <p className="subtitle">
          Each region holds its own quests, archon, and story. Pick a tile to enter.
        </p>
      </header>

      <main className="regions-grid">
        {REGIONS.map((r) => {
          const theme = ELEMENT_THEME[r.element];
          const isFull = r.status === "full";
          return (
            <a
              key={r.id}
              href={`#/regions/${r.id}`}
              className={`region-tile ${isFull ? "full" : "stub"}`}
              style={{ "--accent": theme.color, "--glow": theme.glow }}
            >
              <div className="region-tile-head">
                <h2 className="region-name">{r.name}</h2>
                <span className="region-element-chip">{theme.label}</span>
              </div>
              <p className="region-archon">{r.archon}</p>
              <p className="region-summary">{r.summary}</p>
              <span className="region-status">
                {isFull ? "Quest tracker available ›" : "Coming soon"}
              </span>
            </a>
          );
        })}
      </main>

      <footer className="bottom">
        <p>Each region links to its own quest tracker · Fontaine is live · others arriving with future updates.</p>
      </footer>
    </>
  );
}

function RegionStub({ regionId }) {
  const region = REGIONS.find((r) => r.id === regionId);
  if (!region) {
    return (
      <>
        <header className="top">
          <h1 className="title">Unknown region</h1>
          <p className="subtitle">No region matches that path.</p>
        </header>
        <div className="region-stub">
          <a className="region-back" href="#/regions">← Back to regions</a>
        </div>
      </>
    );
  }
  const theme = ELEMENT_THEME[region.element];
  return (
    <>
      <header className="top">
        <div className="top-marks" aria-hidden="true">{"✦ ✦ ✦"}</div>
        <h1 className="title" style={{ background: `linear-gradient(180deg, #f3ecd6 0%, ${theme.color} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          {region.name}
        </h1>
        <p className="subtitle">{region.archon}</p>
      </header>

      <div className="region-stub" style={{ "--accent": theme.color, "--glow": theme.glow }}>
        <p className="region-stub-blurb">{region.summary}</p>
        <p className="region-stub-text">
          The {region.name} quest tracker is in the workshop. Check back as patches roll in.
        </p>
        <a className="region-back" href="#/regions">← Back to regions</a>
      </div>
    </>
  );
}

/* ============================================================
   REACTIONS PAGE
   ============================================================ */

function ReactionsPage({ onGoToCharacter }) {
  const [openId, setOpenId] = useState(null);
  const toggle = (id) => setOpenId((cur) => (cur === id ? null : id));

  return (
    <>
      <header className="top">
        <div className="top-marks" aria-hidden="true">{"\u2726 \u2726 \u2726"}</div>
        <h1 className="title">The Reactions Compendium</h1>
        <p className="subtitle">
          Every elemental reaction in Genshin Impact \u2014 what triggers it,
          how the math works, who from the roster fits. Includes the
          Hexerei faction and a damage-formula theorycraft reference.
        </p>
      </header>

      <main className="rx-page">
        {REACTION_GROUPS.map((group) => (
          <section key={group.id} className="rx-group">
            <div className="rx-group-head">
              <h2 className="rx-group-title">{group.label} reactions</h2>
              <p className="rx-group-blurb">{group.blurb}</p>
              {group.formula && (
                <p className="rx-group-formula">
                  <span className="rx-formula-tag">formula</span> {group.formula}
                </p>
              )}
            </div>

            <div className="rx-list">
              {group.reactions.map((r) => {
                const isOpen = openId === r.id;
                return (
                  <article
                    key={r.id}
                    className={`rx-card ${isOpen ? "open" : ""}`}
                  >
                    <button
                      type="button"
                      className="rx-head"
                      onClick={() => toggle(r.id)}
                      aria-expanded={isOpen}
                    >
                      <div className="rx-head-left">
                        <h3 className="rx-name">{r.name}</h3>
                        <span className="rx-trigger">{r.trigger}</span>
                      </div>
                      <div className="rx-elems" aria-hidden="true">
                        {r.elements.map((e) => {
                          const t = ELEMENT_THEME[e];
                          if (!t) return null;
                          return (
                            <span
                              key={e}
                              className="rx-elem-dot"
                              style={{ background: t.color, boxShadow: `0 0 10px ${t.glow}` }}
                              title={t.label}
                            />
                          );
                        })}
                      </div>
                      <span className="rx-multiplier">{r.multiplier}</span>
                      <span className="rx-caret" aria-hidden="true">
                        <svg viewBox="0 0 10 10" className="caret-svg">
                          <path d="M2 3 L5 7 L8 3" />
                        </svg>
                      </span>
                    </button>

                    {isOpen && (
                      <div className="rx-body">
                        <p className="rx-short">{r.short}</p>

                        <ul className="rx-details">
                          {r.details.map((d, i) => (
                            <li key={i}>{d}</li>
                          ))}
                        </ul>

                        {r.examples && r.examples.length > 0 && (
                          <div className="rx-examples">
                            <div className="rx-examples-head">From the roster</div>
                            {r.examples.map((ex) => {
                              const c = CHARACTERS.find((x) => x.id === ex.id);
                              if (!c) return null;
                              const t = ELEMENT_THEME[c.element];
                              return (
                                <button
                                  key={ex.id}
                                  type="button"
                                  className="syn-chip"
                                  onClick={() => onGoToCharacter && onGoToCharacter(ex.id)}
                                  style={{
                                    "--target-accent": t.color,
                                    "--target-glow": t.glow,
                                  }}
                                >
                                  <span className="syn-name">{c.name}</span>
                                  <span className="syn-elem">{t.label}</span>
                                  <span className="syn-why">{ex.role}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </main>

      <footer className="bottom">
        <p>
          Cross-checked against Genshin Impact Wiki, Game8, KQM, and Icy-Veins \u00b7
          Version 6.5 (May 2026)
        </p>
        <p className="bottom-faint">
          Reactions linked to characters in the roster only.
        </p>
      </footer>
    </>
  );
}

/* ============================================================
   WEAPONS PAGE
   ============================================================ */

function WeaponsPage({ onGoToCharacter }) {
  const [openId, setOpenId] = useState(null);
  const toggle = (id) => setOpenId((cur) => (cur === id ? null : id));

  const WEAPON_TYPE_THEME = {
    Catalyst: { color: "#b07fd1", label: "Catalyst" },
    Sword:    { color: "#6cb1da", label: "Sword" },
    Polearm:  { color: "#d96b50", label: "Polearm" },
    Bow:      { color: "#74c2a8", label: "Bow" },
    Claymore: { color: "#d4a857", label: "Claymore" },
  };

  return (
    <>
      <header className="top">
        <div className="top-marks" aria-hidden="true">{"✦ ✦ ✦"}</div>
        <h1 className="title">The Armoury</h1>
        <p className="subtitle">
          Best-in-slot signature weapons for the roster — passive breakdowns,
          base stats, and alternative picks for every character.
        </p>
      </header>

      <main className="rx-page">
        <section className="rx-group">
          <div className="rx-group-head">
            <h2 className="rx-group-title">Signature weapons</h2>
            <p className="rx-group-blurb">
              Each weapon below is the verified best-in-slot for its paired character.
              Tap a card to expand passive details, best-for links, and F2P alternatives.
            </p>
          </div>

          <div className="rx-list">
            {WEAPONS.map((w) => {
              const isOpen = openId === w.id;
              const typeTheme = WEAPON_TYPE_THEME[w.type] || { color: "#c9a86a", label: w.type };
              const bestChar = CHARACTERS.find((c) => c.id === w.bestFor);
              const bestCharTheme = bestChar ? ELEMENT_THEME[bestChar.element] : null;
              const stars = "★".repeat(w.rarity);
              return (
                <article
                  key={w.id}
                  className={`rx-card ${isOpen ? "open" : ""}`}
                >
                  <button
                    type="button"
                    className="rx-head"
                    onClick={() => toggle(w.id)}
                    aria-expanded={isOpen}
                  >
                    <div className="rx-head-left">
                      <h3 className="rx-name">{w.name}</h3>
                      <span className="rx-trigger">
                        {w.type} {stars}
                      </span>
                    </div>
                    <div className="rx-elems" aria-hidden="true">
                      <span
                        className="rx-elem-dot"
                        style={{ background: typeTheme.color, boxShadow: `0 0 10px ${typeTheme.color}44` }}
                        title={typeTheme.label}
                      />
                    </div>
                    <span className="rx-multiplier">{w.baseAtk} ATK · {w.substat}</span>
                    <span className="rx-caret" aria-hidden="true">
                      <svg viewBox="0 0 10 10" className="caret-svg">
                        <path d="M2 3 L5 7 L8 3" />
                      </svg>
                    </span>
                  </button>

                  {isOpen && (
                    <div className="rx-body">
                      <p className="rx-short">
                        Passive: <strong>{w.passive}</strong>
                      </p>

                      <ul className="rx-details">
                        {w.passiveDesc.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>

                      {bestChar && (
                        <div className="rx-examples">
                          <div className="rx-examples-head">Best for</div>
                          <button
                            type="button"
                            className="syn-chip"
                            onClick={() => onGoToCharacter && onGoToCharacter(bestChar.id)}
                            style={{
                              "--target-accent": bestCharTheme.color,
                              "--target-glow": bestCharTheme.glow,
                            }}
                          >
                            <span className="syn-name">{bestChar.name}</span>
                            <span className="syn-elem">{bestCharTheme.label}</span>
                            <span className="syn-why">{bestChar.role}</span>
                          </button>
                        </div>
                      )}

                      {w.alts && w.alts.length > 0 && (
                        <div className="rx-examples">
                          <div className="rx-examples-head">Alternatives</div>
                          <ul className="rx-details">
                            {w.alts.map((a, i) => (
                              <li key={i}>{a}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="bottom">
        <p>
          Weapon data cross-checked against Game8, Icy-Veins, KQM, and GameWith · Version 6.6 (May 2026)
        </p>
      </footer>
    </>
  );
}

const BUILD_TAB_KEY = "genshin-build-tab-v1";

function loadBuildTabs() {
  try {
    const raw = localStorage.getItem(BUILD_TAB_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function CharacterCard({ char, checked, onToggle, hydrated, flash, onGoTo }) {
  const theme = ELEMENT_THEME[char.element];
  const hasAltBuilds = Array.isArray(char.altBuilds) && char.altBuilds.length > 0;

  const [activeBuildId, setActiveBuildId] = useState(() => {
    if (!hasAltBuilds) return "primary";
    const saved = loadBuildTabs()[char.id];
    if (saved === "primary") return "primary";
    if (saved && char.altBuilds.some((b) => b.id === saved)) return saved;
    return "primary";
  });

  const switchBuild = (id) => {
    setActiveBuildId(id);
    try {
      const next = loadBuildTabs();
      next[char.id] = id;
      localStorage.setItem(BUILD_TAB_KEY, JSON.stringify(next));
    } catch (e) {
      // ignore
    }
  };

  const activeAlt = hasAltBuilds && activeBuildId !== "primary"
    ? char.altBuilds.find((b) => b.id === activeBuildId)
    : null;

  const resolved = activeAlt
    ? {
        role:      activeAlt.role      ?? char.role,
        set:       activeAlt.set       ?? char.set,
        setAlt:    activeAlt.setAlt    ?? char.setAlt,
        weapon:    activeAlt.weapon    ?? char.weapon,
        weaponAlt: activeAlt.weaponAlt ?? char.weaponAlt,
        talents:   activeAlt.talents   ?? char.talents,
        stats:     activeAlt.stats     ?? char.stats,
        note:      activeAlt.note      ?? char.note,
      }
    : char;

  const done = resolved.stats.filter((s) => checked[s.id]).length;
  const total = resolved.stats.length;
  const pct = Math.round((done / total) * 100);
  const [showDeep, setShowDeep] = useState(false);

  return (
    <article
      id={`card-${char.id}`}
      className={`card ${flash ? "flash" : ""}`}
      style={{ "--accent": theme.color, "--glow": theme.glow }}
    >
      <div className="card-corner tl" />
      <div className="card-corner tr" />
      <div className="card-corner bl" />
      <div className="card-corner br" />

      <header className="card-head">
        <div className="card-head-row">
          <h2 className="char-name">{char.name}</h2>
          <span className="elem-chip">{theme.label}</span>
        </div>
        <p className="char-epithet">{char.epithet}</p>
        <p className="char-role">{resolved.role} · {char.weaponType}</p>
      </header>

      {hasAltBuilds && (
        <div className="build-tabs" role="tablist" aria-label="Build variants">
          <button
            type="button"
            role="tab"
            aria-selected={activeBuildId === "primary"}
            className={`build-tab ${activeBuildId === "primary" ? "active" : ""}`}
            onClick={() => switchBuild("primary")}
          >
            {char.buildLabel || char.role.split(" · ")[0].split(" / ")[0]}
          </button>
          {char.altBuilds.map((b) => (
            <button
              key={b.id}
              type="button"
              role="tab"
              aria-selected={activeBuildId === b.id}
              className={`build-tab ${activeBuildId === b.id ? "active" : ""}`}
              onClick={() => switchBuild(b.id)}
            >
              {b.label}
            </button>
          ))}
        </div>
      )}

      <section className="essentials">
        <div className="ess-row">
          <span className="ess-label">Set</span>
          <span className="ess-val">{resolved.set}</span>
        </div>
        {resolved.setAlt && (
          <div className="ess-row faint">
            <span className="ess-label">↳ alt</span>
            <span className="ess-val">{resolved.setAlt}</span>
          </div>
        )}
        <div className="ess-row">
          <span className="ess-label">Weapon</span>
          <span className="ess-val">{resolved.weapon}</span>
        </div>
        {resolved.weaponAlt && (
          <div className="ess-row faint">
            <span className="ess-label">↳ alt</span>
            <span className="ess-val">{resolved.weaponAlt}</span>
          </div>
        )}
        <div className="ess-row">
          <span className="ess-label">Talents</span>
          <span className="ess-val">{resolved.talents}</span>
        </div>
      </section>

      <div className="divider" />

      <section className="stats">
        {resolved.stats.map((s) => (
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

      {resolved.note && (
        <p className="note">
          <span className="note-mark">※</span> {resolved.note}
        </p>
      )}

      {char.deep && (
        <section className="deep">
          <button
            type="button"
            className={`deep-toggle ${showDeep ? "open" : "closed"}`}
            onClick={() => setShowDeep((v) => !v)}
            aria-expanded={showDeep}
          >
            <span className="deep-caret" aria-hidden="true">
              <svg viewBox="0 0 10 10" className="caret-svg">
                <path d="M2 3 L5 7 L8 3" />
              </svg>
            </span>
            <span>Deep dive</span>
          </button>
          {showDeep && (
            <div className="deep-body">
              <p className="deep-lore">{char.deep.lore}</p>

              <ul className="deep-list">
                {char.deep.kit.map((k, i) => (
                  <li key={i}>{k}</li>
                ))}
              </ul>

              {char.deep.tips && char.deep.tips.length > 0 && (
                <ul className="deep-list tips">
                  {char.deep.tips.map((t, i) => (
                    <li key={i}>
                      <span className="tip-tag">tip</span>
                      {t}
                    </li>
                  ))}
                </ul>
              )}

              {char.deep.synergies && char.deep.synergies.length > 0 && (
                <div className="syn-list">
                  <div className="syn-head">Pairs with</div>
                  {char.deep.synergies.map((s) => {
                    const target = CHARACTERS.find((c) => c.id === s.id);
                    if (!target) return null;
                    const tTheme = ELEMENT_THEME[target.element];
                    return (
                      <button
                        key={s.id}
                        type="button"
                        className="syn-chip"
                        onClick={() => onGoTo && onGoTo(s.id)}
                        style={{
                          "--target-accent": tTheme.color,
                          "--target-glow": tTheme.glow,
                        }}
                      >
                        <span className="syn-name">{target.name}</span>
                        <span className="syn-elem">{tTheme.label}</span>
                        <span className="syn-why">{s.why}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </section>
      )}

      <footer className="card-foot">
        <div className="prog-bar">
          <div className="prog-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="prog-text">{done} / {total}</span>
      </footer>
    </article>
  );
}

function StatRow({ label, target, checked, onClick, disabled }) {
  return (
    <button
      className={`stat ${checked ? "on" : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={checked}
      type="button"
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

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Manrope:wght@300;400;500;600;700&display=swap');

* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

.page {
  min-height: 100vh;
  min-height: 100dvh;
  background:
    radial-gradient(ellipse at 50% -10%, #1a1b3a 0%, #0a0b1c 45%, #050614 100%);
  color: #e8e4d6;
  font-family: 'Manrope', -apple-system, system-ui, sans-serif;
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

.top { position: relative; z-index: 1; max-width: 720px; margin: 0 auto 56px; text-align: center; }

.top-marks {
  color: #c9a86a;
  letter-spacing: 1.2em;
  font-size: 11px;
  margin-bottom: 18px;
  opacity: 0.7;
  padding-left: 1.2em;
}

.title {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 500;
  font-size: clamp(34px, 7vw, 56px);
  line-height: 1.1;
  margin: 0;
  color: #f3ecd6;
  background: linear-gradient(180deg, #f3ecd6 0%, #c9a86a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-family: 'Cormorant Garamond', serif;
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
  color: rgba(201, 168, 106, 0.85);
  padding: 4px 12px;
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  font-family: inherit;
  cursor: pointer;
  transition: all 200ms ease;
}
.reset:hover:not(:disabled),
.reset:active:not(:disabled) {
  background: rgba(201, 168, 106, 0.1);
  border-color: rgba(201, 168, 106, 0.6);
  color: #f3ecd6;
}
.reset:disabled { opacity: 0.3; cursor: not-allowed; }

.elements {
  position: relative; z-index: 1;
  max-width: 1240px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 36px;
}

.elem-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.elem-header {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  background: none;
  color: inherit;
  font-family: inherit;
  text-align: left;
  padding: 14px 4px;
  border: none;
  border-top: 1px solid rgba(201, 168, 106, 0.12);
  border-bottom: 1px solid rgba(201, 168, 106, 0.12);
  cursor: pointer;
  transition: border-color 200ms ease, background 200ms ease;
}
.elem-header:hover,
.elem-header:active {
  border-top-color: rgba(201, 168, 106, 0.32);
  border-bottom-color: rgba(201, 168, 106, 0.32);
  background: rgba(255, 255, 255, 0.015);
}
.elem-header:focus-visible {
  outline: 1px solid var(--accent);
  outline-offset: 2px;
}

.elem-caret {
  width: 14px;
  height: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
}
.caret-svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: var(--accent);
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform 220ms ease;
}
.elem-header.closed .caret-svg { transform: rotate(-90deg); }

.elem-title {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 500;
  font-size: 26px;
  line-height: 1;
  margin: 0;
  flex: 1;
  color: var(--accent);
  letter-spacing: 0.02em;
}

.elem-count {
  font-size: 10px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: rgba(232, 228, 214, 0.5);
  font-variant-numeric: tabular-nums;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 28px;
}
@media (min-width: 880px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

.card {
  position: relative;
  background: linear-gradient(180deg, rgba(20, 22, 48, 0.7) 0%, rgba(12, 14, 32, 0.85) 100%);
  border: 1px solid rgba(201, 168, 106, 0.15);
  padding: 32px 28px 24px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow:
    0 1px 0 rgba(255,255,255,0.03) inset,
    0 24px 60px -20px rgba(0,0,0,0.7),
    0 0 40px -10px var(--glow);
}

.card-corner {
  position: absolute;
  width: 18px; height: 18px;
  border: 1px solid var(--accent);
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
  font-family: 'Cormorant Garamond', serif;
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
  color: var(--accent);
  padding: 4px 10px;
  border: 1px solid var(--accent);
  border-radius: 1px;
  opacity: 0.85;
  white-space: nowrap;
}

.char-epithet {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 15px;
  color: rgba(232, 228, 214, 0.5);
  margin: 0 0 6px;
}

.char-role {
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
  margin: 0;
  opacity: 0.9;
}

.build-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 4px 0 16px;
  padding-bottom: 14px;
  border-bottom: 1px dashed rgba(201, 168, 106, 0.18);
}
.build-tab {
  padding: 5px 11px;
  font: inherit;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.02);
  color: rgba(232, 228, 214, 0.45);
  border: 1px solid rgba(232, 228, 214, 0.12);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.18s ease;
  font-weight: 500;
}
.build-tab:hover {
  color: rgba(232, 228, 214, 0.75);
  border-color: rgba(232, 228, 214, 0.25);
}
.build-tab.active {
  background: color-mix(in oklab, var(--accent) 18%, transparent);
  color: var(--accent);
  border-color: color-mix(in oklab, var(--accent) 55%, transparent);
  font-weight: 600;
  box-shadow: 0 0 12px color-mix(in oklab, var(--glow) 70%, transparent);
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
  padding: 12px 8px;
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
.stat:hover:not(:disabled),
.stat:active:not(:disabled) {
  background: rgba(255, 255, 255, 0.02);
  border-left-color: rgba(201, 168, 106, 0.3);
}
.stat.on { border-left-color: var(--accent); }
.stat.on .stat-label {
  color: rgba(232, 228, 214, 0.55);
  text-decoration: line-through;
  text-decoration-thickness: 1px;
  text-decoration-color: rgba(201, 168, 106, 0.5);
}
.stat.on .stat-target { color: var(--accent); opacity: 0.9; }
.stat:disabled { opacity: 0.4; cursor: wait; }

.box {
  width: 18px; height: 18px;
  border: 1.5px solid rgba(201, 168, 106, 0.4);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 200ms ease;
}
.stat:hover:not(:disabled) .box { border-color: rgba(201, 168, 106, 0.7); }
.stat.on .box {
  border-color: var(--accent);
  background: var(--accent);
  box-shadow: 0 0 12px var(--glow);
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
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 15px;
  color: var(--accent);
  white-space: nowrap;
  letter-spacing: 0.02em;
}

.note {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 14px;
  color: rgba(232, 228, 214, 0.6);
  line-height: 1.5;
  margin: 0 0 18px;
  padding: 12px 14px;
  background: rgba(0, 0, 0, 0.2);
  border-left: 2px solid var(--accent);
}

.note-mark { color: var(--accent); font-style: normal; margin-right: 6px; }

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
  background: var(--accent);
  transition: width 400ms ease;
  box-shadow: 0 0 8px var(--glow);
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
.bottom-faint { opacity: 0.6; letter-spacing: 0.08em; }

/* ---------- Deep dive ---------- */

.deep {
  margin: 4px 0 18px;
  padding-top: 14px;
  border-top: 1px dashed rgba(201, 168, 106, 0.2);
}

.deep-toggle {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: none;
  color: var(--accent);
  font-family: inherit;
  font-size: 10px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  padding: 4px 0;
  cursor: pointer;
  transition: opacity 200ms ease;
}
.deep-toggle:hover { opacity: 0.78; }
.deep-toggle .caret-svg { transition: transform 220ms ease; }
.deep-toggle.closed .caret-svg { transform: rotate(-90deg); }

.deep-caret {
  width: 12px; height: 12px;
  display: inline-flex; align-items: center; justify-content: center;
  color: var(--accent);
}

.deep-body {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.deep-lore {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 15px;
  line-height: 1.55;
  color: rgba(232, 228, 214, 0.78);
  margin: 0;
  padding: 0 2px;
  border-left: 2px solid rgba(201, 168, 106, 0.18);
  padding-left: 14px;
}

.deep-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
  line-height: 1.5;
  color: rgba(232, 228, 214, 0.86);
}
.deep-list li {
  position: relative;
  padding-left: 16px;
}
.deep-list li::before {
  content: "";
  position: absolute;
  top: 0.7em;
  left: 0;
  width: 8px;
  height: 1px;
  background: var(--accent);
  opacity: 0.65;
}
.deep-list.tips { gap: 6px; }
.deep-list.tips li {
  color: rgba(232, 228, 214, 0.7);
  font-size: 12.5px;
  padding-left: 0;
}
.deep-list.tips li::before { display: none; }

.tip-tag {
  display: inline-block;
  font-size: 9px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--accent);
  border: 1px solid var(--accent);
  padding: 1px 7px;
  margin-right: 10px;
  opacity: 0.7;
  vertical-align: middle;
  transform: translateY(-1px);
}

.syn-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.syn-head {
  font-size: 10px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(232, 228, 214, 0.5);
  margin-bottom: 2px;
}

.syn-chip {
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: auto auto;
  column-gap: 10px;
  row-gap: 4px;
  align-items: baseline;
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(201, 168, 106, 0.12);
  border-left: 2px solid var(--target-accent);
  padding: 10px 12px;
  color: inherit;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition: all 220ms ease;
  width: 100%;
}
.syn-chip:hover,
.syn-chip:active {
  background: rgba(0, 0, 0, 0.36);
  border-color: var(--target-accent);
  box-shadow: 0 0 24px -8px var(--target-glow);
  transform: translateY(-1px);
}
.syn-chip:focus-visible {
  outline: 1px solid var(--target-accent);
  outline-offset: 2px;
}

.syn-name {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 17px;
  line-height: 1;
  color: var(--target-accent);
}
.syn-elem {
  font-size: 9px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--target-accent);
  opacity: 0.75;
  white-space: nowrap;
}
.syn-why {
  grid-column: 1 / -1;
  font-size: 12.5px;
  line-height: 1.5;
  color: rgba(232, 228, 214, 0.72);
}

/* ---------- Flash highlight on synergy navigation ---------- */

@keyframes cardFlash {
  0% {
    box-shadow:
      0 1px 0 rgba(255,255,255,0.03) inset,
      0 24px 60px -20px rgba(0,0,0,0.7),
      0 0 40px -10px var(--glow);
    border-color: rgba(201, 168, 106, 0.15);
  }
  25%, 60% {
    box-shadow:
      0 1px 0 rgba(255,255,255,0.08) inset,
      0 24px 60px -20px rgba(0,0,0,0.7),
      0 0 90px 0 var(--accent);
    border-color: var(--accent);
  }
  100% {
    box-shadow:
      0 1px 0 rgba(255,255,255,0.03) inset,
      0 24px 60px -20px rgba(0,0,0,0.7),
      0 0 40px -10px var(--glow);
    border-color: rgba(201, 168, 106, 0.15);
  }
}
.card.flash {
  animation: cardFlash 1.8s ease-out 1;
  scroll-margin-top: 24px;
}
.card { scroll-margin-top: 24px; }

@media (prefers-reduced-motion: reduce) {
  .card.flash {
    animation: none;
    outline: 2px solid var(--accent);
    outline-offset: 4px;
  }
}

/* ---------- Top nav ---------- */

.nav {
  position: relative;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  max-width: 1240px;
  margin: 0 auto 48px;
  padding: 14px 8px;
  border-top: 1px solid rgba(201, 168, 106, 0.18);
  border-bottom: 1px solid rgba(201, 168, 106, 0.10);
}

.nav-brand {
  display: inline-flex;
  align-items: baseline;
  gap: 10px;
  color: #f3ecd6;
  text-decoration: none;
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 22px;
  letter-spacing: 0.02em;
  opacity: 0.92;
  transition: opacity 200ms ease;
}
.nav-brand:hover { opacity: 1; }
.nav-brand-mark { color: #c9a86a; font-size: 13px; letter-spacing: 0.6em; }

.nav-links { display: flex; gap: 4px; }

.nav-link {
  display: inline-block;
  padding: 8px 14px;
  color: rgba(232, 228, 214, 0.5);
  text-decoration: none;
  font-size: 10px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  border: 1px solid transparent;
  transition: all 200ms ease;
}
.nav-link:hover {
  color: #f3ecd6;
  border-color: rgba(201, 168, 106, 0.3);
}
.nav-link.active {
  color: #c9a86a;
  border-color: rgba(201, 168, 106, 0.55);
  background: rgba(201, 168, 106, 0.06);
}

/* ---------- Regions ---------- */

.region-nav-wrap {
  position: relative;
  z-index: 5;
  background: radial-gradient(ellipse at 50% 0%, #1a1b3a 0%, #0a0b1c 80%);
  padding: 32px 20px 0;
}

.regions-grid {
  position: relative; z-index: 1;
  max-width: 1240px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
@media (min-width: 720px) {
  .regions-grid { grid-template-columns: 1fr 1fr; }
}
@media (min-width: 1080px) {
  .regions-grid { grid-template-columns: repeat(3, 1fr); }
}

.region-tile {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 22px 24px 20px;
  text-decoration: none;
  color: inherit;
  background: linear-gradient(180deg, rgba(20, 22, 48, 0.7) 0%, rgba(12, 14, 32, 0.85) 100%);
  border: 1px solid rgba(201, 168, 106, 0.12);
  border-left: 3px solid var(--accent);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: all 220ms ease;
}
.region-tile:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
  box-shadow: 0 20px 50px -20px rgba(0,0,0,0.7), 0 0 28px -10px var(--glow);
}
.region-tile.stub { opacity: 0.78; }

.region-tile-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}

.region-name {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 500;
  font-size: 28px;
  line-height: 1;
  margin: 0;
  color: var(--accent);
}

.region-element-chip {
  font-size: 9px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--accent);
  border: 1px solid var(--accent);
  padding: 3px 9px;
  opacity: 0.8;
  white-space: nowrap;
}

.region-archon {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(232, 228, 214, 0.5);
  margin: 0;
}

.region-summary {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 14px;
  color: rgba(232, 228, 214, 0.75);
  line-height: 1.55;
  margin: 4px 0 8px;
}

.region-status {
  font-size: 10px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(232, 228, 214, 0.45);
  margin-top: auto;
}
.region-tile.full .region-status { color: var(--accent); }

.region-stub {
  position: relative; z-index: 1;
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
  padding: 16px 20px 60px;
}

.region-stub-blurb {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 17px;
  color: rgba(232, 228, 214, 0.78);
  line-height: 1.55;
  margin: 0 0 28px;
  padding: 0 16px;
  border-left: 2px solid var(--accent);
  text-align: left;
}

.region-stub-text {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 15px;
  color: rgba(232, 228, 214, 0.6);
  margin: 0 0 28px;
}

.region-back {
  display: inline-block;
  font-size: 10px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(201, 168, 106, 0.85);
  text-decoration: none;
  padding: 8px 16px;
  border: 1px solid rgba(201, 168, 106, 0.3);
  transition: all 200ms ease;
}
.region-back:hover {
  color: #f3ecd6;
  border-color: rgba(201, 168, 106, 0.6);
  background: rgba(201, 168, 106, 0.08);
}

/* ---------- Reactions page ---------- */

.rx-page {
  position: relative;
  z-index: 1;
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 56px;
}

.rx-group { display: flex; flex-direction: column; gap: 18px; }

.rx-group-head {
  border-bottom: 1px dashed rgba(201, 168, 106, 0.22);
  padding-bottom: 14px;
}

.rx-group-title {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 500;
  font-size: 30px;
  margin: 0 0 10px;
  color: #f3ecd6;
  letter-spacing: 0.02em;
}

.rx-group-blurb {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 15px;
  color: rgba(232, 228, 214, 0.68);
  margin: 0 0 10px;
  line-height: 1.55;
}

.rx-group-formula {
  font-size: 12px;
  color: rgba(232, 228, 214, 0.55);
  font-family: ui-monospace, 'SF Mono', Menlo, monospace;
  margin: 0;
  line-height: 1.6;
}

.rx-formula-tag {
  display: inline-block;
  font-size: 9px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #c9a86a;
  border: 1px solid rgba(201, 168, 106, 0.45);
  padding: 1px 7px;
  margin-right: 10px;
  vertical-align: middle;
  font-family: 'Manrope', sans-serif;
}

.rx-list { display: flex; flex-direction: column; gap: 12px; }

.rx-card {
  background: linear-gradient(180deg, rgba(20, 22, 48, 0.6) 0%, rgba(12, 14, 32, 0.78) 100%);
  border: 1px solid rgba(201, 168, 106, 0.12);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: border-color 200ms ease, box-shadow 200ms ease;
}
.rx-card.open {
  border-color: rgba(201, 168, 106, 0.32);
  box-shadow: 0 20px 50px -25px rgba(0, 0, 0, 0.6);
}

.rx-head {
  display: grid;
  grid-template-columns: 1fr auto auto 18px;
  gap: 16px;
  align-items: center;
  width: 100%;
  background: none;
  border: none;
  color: inherit;
  font-family: inherit;
  text-align: left;
  padding: 16px 18px;
  cursor: pointer;
  transition: background 200ms ease;
}
.rx-head:hover { background: rgba(255,255,255,0.018); }

.rx-head-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.rx-name {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 500;
  font-size: 22px;
  margin: 0;
  line-height: 1.05;
  color: #f3ecd6;
}

.rx-trigger {
  font-size: 10px;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: rgba(232, 228, 214, 0.55);
}

.rx-elems {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.rx-elem-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  display: inline-block;
}

.rx-multiplier {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 14px;
  color: rgba(232, 228, 214, 0.78);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.rx-caret {
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #c9a86a;
}
.rx-card .rx-caret .caret-svg {
  stroke: #c9a86a;
  transition: transform 220ms ease;
}
.rx-card:not(.open) .rx-caret .caret-svg { transform: rotate(-90deg); }

.rx-body {
  padding: 0 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.rx-body::before {
  content: "";
  display: block;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(201, 168, 106, 0.22) 50%, transparent 100%);
}

.rx-short {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 15px;
  color: rgba(232, 228, 214, 0.78);
  margin: 8px 0 0;
  padding: 0;
}

.rx-details {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
  line-height: 1.55;
  color: rgba(232, 228, 214, 0.86);
}
.rx-details li {
  position: relative;
  padding-left: 16px;
}
.rx-details li::before {
  content: "";
  position: absolute;
  top: 0.7em;
  left: 0;
  width: 8px;
  height: 1px;
  background: #c9a86a;
  opacity: 0.55;
}

.rx-examples {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 4px;
}

.rx-examples-head {
  font-size: 10px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(232, 228, 214, 0.5);
  margin-bottom: 2px;
}

@media (max-width: 640px) {
  .rx-head { grid-template-columns: 1fr auto 18px; gap: 10px; padding: 14px 14px; }
  .rx-multiplier { display: none; }
  .rx-name { font-size: 20px; }
  .nav { flex-direction: column; align-items: stretch; gap: 10px; padding: 12px 8px; }
  .nav-links { justify-content: center; }
  .nav-brand { justify-content: center; }
  .rx-group-title { font-size: 26px; }
}

@media (max-width: 480px) {
  .page { padding: 32px 16px 60px; }
  .card { padding: 28px 20px 20px; }
  .char-name { font-size: 28px; }
  .stat { font-size: 12px; gap: 10px; grid-template-columns: 20px 1fr auto; }
  .stat-target { font-size: 13px; }
  .ess-row { grid-template-columns: 56px 1fr; font-size: 12px; }
  .deep-lore { font-size: 14px; }
  .syn-name { font-size: 16px; }
  .rx-body { padding: 0 14px 18px; }
}
`;
