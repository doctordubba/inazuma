import React, { useState, useEffect } from "react";
import FontaineQuests from "./FontaineQuests";
import MondstadtQuests from "./MondstadtQuests";
import LiyueQuests from "./LiyueQuests";
import InazumaQuests from "./InazumaQuests";

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
    note: "EM is king. CRIT only matters if she is also doing personal damage.",
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
    note: "NotSU 4pc grants +30% CR at Ascendant Gleam \u2014 count it toward your total.",
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
    note: "Aubade needs Ascendant Gleam to fully proc. Her Burst is sustain, not damage \u2014 ER is low priority.",
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
    note: "Two Hexerei in party boosts A1 by 75 %. Vape/Melt teams want some EM substats.",
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
    note: "Electro DMG goblet does NOT scale Lunar-Charged. ATK% goblet. A4 converts ATK \u2192 EM up to 160.",
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
    note: "Her Lunar-Reaction buffs cap at 35 000 Max HP. Energy-hungry \u2014 burst is everything. Substat priority: ER > CRIT > HP %.",
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
      ],
      synergies: [
        { id: "flins", why: "Flins triggers Electro-Charged on her Hydro; her burst upgrades it to Lunar-Charged with the +0.2%/1000-HP DMG bonus stacked on top." },
        { id: "linnea", why: "Linnea's Geo + Columbina's Hydro = Hydro-Crystallize, upgraded by Columbina's burst into Lunar-Crystallize. Linnea also heals, covering Columbina's lack of survivability." },
        { id: "neuvillette", why: "Hydro resonance for both (+25 % Max HP); Neuvillette stays on-field while she off-field-buffs Lunar reactions when a Dendro / Electro / Geo trigger is added." },
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
  { id: "sumeru",    name: "Sumeru",     archon: "Lesser Lord Kusanali · Dendro",      element: "dendro",  status: "stub", summary: "The rainforest court of knowledge and dream, where the Akasha listens." },
  { id: "fontaine",  name: "Fontaine",   archon: "Focalors (Furina) · Hydro Archon",   element: "hydro",   status: "full", summary: "The Court of Hydraulics — and the Iudex who judges it. Full quest tracker available." },
  { id: "natlan",    name: "Natlan",     archon: "Mavuika · Pyro Archon",              element: "pyro",    status: "stub", summary: "Tribes, dragons, and the fire of the Children of Echoes." },
  { id: "nod-krai",  name: "Nod-Krai",   archon: "Frostmoon · (no Archon)",            element: "cryo",    status: "stub", summary: "Northern reach of moonlit veils and the Frostmoon Scions. Home of Columbina, Jahoda, and Lauma." },
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
];

/* ============================================================
   ROUTING (hash-based, no library)
   ============================================================ */

const ROUTES = {
  characters: "characters",
  reactions:  "reactions",
  regions:    "regions",
  region:     "region",
};

function getRouteFromHash() {
  const raw = (typeof window !== "undefined" ? window.location.hash : "") || "";
  const key = raw.replace(/^#\/?/, "").toLowerCase();
  if (key === "reactions") return { page: ROUTES.reactions };
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
        ) : route.page === ROUTES.regions ? (
          <RegionsPage />
        ) : route.page === ROUTES.region ? (
          <RegionStub regionId={route.region} />
        ) : (
          <>
            <header className="top">
              <div className="top-marks" aria-hidden="true">{"\u2726 \u2726 \u2726"}</div>
              <h1 className="title">Almanac of the Moonbound</h1>
              <p className="subtitle">Ideal build targets \u2014 checked when reached.</p>

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
              <p>Targets compiled from Game8, KQM, Icy-Veins, and GamesGG \u00b7 Version 6.5</p>
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
        <span className="nav-brand-mark" aria-hidden="true">\u2726</span>
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
          how the math works, who from the roster fits.
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

function CharacterCard({ char, checked, onToggle, hydrated, flash, onGoTo }) {
  const theme = ELEMENT_THEME[char.element];
  const done = char.stats.filter((s) => checked[s.id]).length;
  const total = char.stats.length;
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
        <p className="char-role">{char.role} \u00b7 {char.weaponType}</p>
      </header>

      <section className="essentials">
        <div className="ess-row">
          <span className="ess-label">Set</span>
          <span className="ess-val">{char.set}</span>
        </div>
        {char.setAlt && (
          <div className="ess-row faint">
            <span className="ess-label">\u21b3 alt</span>
            <span className="ess-val">{char.setAlt}</span>
          </div>
        )}
        <div className="ess-row">
          <span className="ess-label">Weapon</span>
          <span className="ess-val">{char.weapon}</span>
        </div>
        {char.weaponAlt && (
          <div className="ess-row faint">
            <span className="ess-label">\u21b3 alt</span>
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
          <span className="note-mark">\u203b</span> {char.note}
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
