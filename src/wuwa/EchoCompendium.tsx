import { useState } from "react";

/* ============================================================
   ECHO COMPENDIUM — Wuthering Waves v3.5
   Rendered inside WuwaApp's .wuwa-root, which already injects
   almanacStyles; this file only adds a small scoped style block.
   ============================================================ */

/* ---------- Mechanics ---------- */

const MECHANICS_SECTIONS = [
  {
    id: "cost-system",
    title: "The COST System: 12-Point Budget, 5 Slots",
    bullets: [
      "Every Resonator equips up to 5 Echoes under a shared COST budget of 12 (unlocked progressively via Data Bank levels). Echoes come in three COST classes: 4-cost (Overlord/Calamity bosses), 3-cost (Elite enemies), and 1-cost (Common enemies).",
      "The endgame standard layout is 4-3-3-1-1 (= 12 cost, all 5 slots filled): one boss Echo for Crit main stat + active Echo skill, two 3-costs for Elemental DMG/Energy Regen, two 1-cost fillers.",
      "Common variants: 4-4-1-1-1 (double 4-cost, e.g. double Healing Bonus on healers or niche double-Crit setups), 3-3-3-1-1 (budget/ER-hungry builds before you own good boss Echoes), and 4-3-1-1-1 while your cost cap is still below 12 in early game.",
      "Only the first slot's Echo skill is normally used in combat, so put the Echo whose active skill/outro you want (usually the 4-cost boss) in slot 1.",
      "Set (Sonata) bonuses stack alongside cost choices: as of v3.5 the sets run on 2-piece/5-piece (older) and 3-piece (newer) structures, and v3.5 itself added new Echoes plus three new Sonata effects — check the current set list before committing tuners.",
    ],
  },
  {
    id: "leveling-tuning",
    title: "Leveling and Tuning: The XP + Tuner Economy",
    bullets: [
      "Max level scales with rarity: 2-star to +10, 3-star to +15, 4-star to +20, 5-star (gold) to +25. Leveling uses Echo EXP from Sealed Tubes (each EXP point also costs 0.1 Shell Credit; leveling is credit-hungry).",
      "Every 5 levels unlocks one tuning slot; tuning reveals one random substat. Each tune costs 10 Tuners of the Echo's rarity tier (Medium = 3-star, Advanced = 4-star, Premium = 5-star gold) plus 2,000 Shell Credits. A 5-star Echo fully tuned = 50 Premium Tuners across 5 slots (lv 5/10/15/20/25).",
      "Substats are rolled-and-locked: you cannot reroll or replace an individual line, which is why the level/tune/assess loop matters.",
      "Level and tune in steps of 5: raise to +5, tune, judge the roll, then decide whether to continue to +10, and so on. Never blind-level straight to +25.",
      "Recycling refund: feeding a leveled Echo into another (or releasing it) returns 75% of invested Echo EXP but only 30% of Tuners — EXP mistakes are cheap-ish, Tuner mistakes are not. Tuners are the true bottleneck currency in late game.",
      "The +20 to +25 jump is disproportionately expensive; the common rule is to take all 5 pieces to +20 first and only push +25 once a build is otherwise finished.",
    ],
  },
  {
    id: "substats",
    title: "Substat Pool and Priority",
    bullets: [
      "The substat pool is identical regardless of COST or rarity (13 stats): Flat HP, Flat ATK, Flat DEF, HP%, ATK%, DEF%, Crit Rate, Crit DMG, Energy Regen, Basic Attack DMG Bonus, Heavy Attack DMG Bonus, Resonance Skill DMG Bonus, Resonance Liberation DMG Bonus.",
      "Each substat rolls a random value from a fixed range independent of rarity — e.g. Crit Rate 6.3%-10.5%, Crit DMG 12.6%-21.0%. Most stats have 8 possible roll values; Flat ATK and Flat DEF have only 4.",
      "General DPS priority: Crit Rate = Crit DMG > ATK% (or the character's scaling stat) > the DMG Bonus matching the character's main damage type (Skill/Liberation/Basic/Heavy) > Energy Regen (to hit ER breakpoints) > flat stats.",
      "Flat HP/ATK/DEF and off-type DMG bonuses (e.g. Heavy Attack DMG on a skill-based unit) are the dead rolls — the whole tuning stop-loss game is about detecting them early.",
      "Supports and healers instead weight Energy Regen and their scaling stat (HP%/DEF%) above crit; a 'bad' roll is character-relative.",
    ],
  },
  {
    id: "data-merge",
    title: "Data Merge (Synthesis) and Main-Stat Modifiers",
    bullets: [
      "Data Merge combines 5 unwanted Echoes into at least 1 new random Echo — a recycling lottery: you cannot pick the resulting Sonata or species, so treat it as bonus value from spares, never as a primary farming route.",
      "The output's rarity follows your current Data Bank level drop rates, not the rarity of the inputs; upgraded, equipped, or locked Echoes cannot be merged.",
      "Feeding higher-rarity and higher-COST Echoes into a merge raises the chance of bonus extra Echoes beyond the guaranteed one — so merging gold junk is more efficient than merging greys.",
      "Since overworld Echo pickup is stamina-free, everything you vacuum up while exploring is free Data Merge fuel: merge trash in bulk, keep anything with a usable main stat.",
      "For 5-star Echoes with the right set/species but wrong main stat, the Modifier item (added in the 2.x-3.x cycle) can change a 5-star Echo's main stat — check current availability before discarding otherwise-perfect gold pieces.",
    ],
  },
  {
    id: "farming-loop",
    title: "Tacet Fields and the Farming Loop",
    bullets: [
      "Tacet Fields are the stamina sink for Echo progression: clear the waves, then spend 60 Waveplates to claim set-specific Echoes of that field's Sonata pair, plus Tuners, Sealed Tubes (Echo EXP), and Shell Credits — at 240 Waveplates/day that is 4 claims per day.",
      "Gold (5-star) Echo drops from Tacet Fields and the world unlock at Data Bank level 15, and the gold rate keeps improving at higher Data Bank levels — leveling the Data Bank (by registering new Echo species/rarities) is the single biggest passive drop-rate upgrade.",
      "The efficient weekly loop: spend daily Waveplates on the Tacet Field matching your current target set (it pays out EXP + Tuners + on-set pieces at once), run an overworld boss route for 4-cost pieces (boss Echoes respawn quickly and cost no stamina), and batch Data Merge the leftovers.",
      "Overworld farming is free: 4-cost boss Echoes and any specific 3-cost/1-cost species can be re-farmed indefinitely without Waveplates, so stamina should almost always go to Tacet Fields (for the EXP/Tuner package) rather than being 'saved' for Echoes themselves.",
      "Don't start hardcore Tacet Field farming too early — wait until roughly Union Level 30+/Data Bank 15+ when gold drops are live; before that, farm only functional purple placeholders and hoard Waveplates for character/weapon materials.",
    ],
  },
];

const MAIN_STATS = [
  { cost: "4-Cost", note: "Overlord / Calamity bosses", stats: ["Crit Rate", "Crit DMG", "Healing Bonus", "HP%", "ATK%", "DEF%"] },
  {
    cost: "3-Cost",
    note: "Elite enemies",
    stats: [
      "Glacio DMG Bonus",
      "Fusion DMG Bonus",
      "Electro DMG Bonus",
      "Aero DMG Bonus",
      "Spectro DMG Bonus",
      "Havoc DMG Bonus",
      "Energy Regen",
      "HP%",
      "ATK%",
      "DEF%",
    ],
  },
  { cost: "1-Cost", note: "Common enemies", stats: ["HP%", "ATK%", "DEF%"] },
];

/* ---------- Sonata sets (newest first) ----------
   Corrections applied over the raw compiled data:
   - dream-of-the-lost.bonus5: added the 0-Resonance-Energy condition,
     dropped the "permanent" framing (Game8 / Fandom).
   - song-of-feathered-trace.bonus5: Xuanling's Feather Heavy Attack DMG
     Bonus corrected from +20% to +35% (Game8 / Fandom).
   - gusts-of-welkin.bonus5: added the extra +15% Aero DMG for the
     triggering Resonator (Fandom / Game8).
   ------------------------------------------------ */

const SONATA_SETS = [
  {
    id: "song-of-feathered-trace",
    name: "Song of Feathered Trace",
    bonus2: "Energy Regen +10%.",
    bonus5:
      "Inflicting Havoc Bane grants Xuanling's Feather: Crit Rate +20% and Heavy Attack DMG Bonus +35% for 15s. Inflicting Glacio Chafe grants Chongming's Feather: increases all team Resonators' ATK by 0.1% for every 1% of the wearer's Energy Regen, up to 25%, for 10s.",
    bestUsers: ["Yangyang: Xuanling (Havoc side)", "Suisui (Glacio support side)"],
    notes:
      "Dual-mode 3.5 set — selfish Havoc Bane Heavy-Attack buff for Xuanling Yangyang, ER-scaling team ATK for Suisui.",
    released: "3.5 (Jul 10, 2026)",
  },
  {
    id: "heart-of-evils-purge",
    name: "Heart of Evil's Purge",
    bonus2: "Aero DMG +10%.",
    bonus5:
      "Inflicting Tune Strain - Shifting on enemies increases Crit. DMG by 20% and grants 30% Aero DMG Bonus for 15s.",
    bestUsers: ["Qingxiao (upcoming — pre-farm)"],
    notes:
      "Aero Tune Strain - Shifting DPS set added in 3.5 as a pre-farm for upcoming Mengzhou Aero resonators; no fully-matched released user yet.",
    released: "3.5 (Jul 10, 2026)",
  },
  {
    id: "lamp-of-nether-road",
    name: "Lamp of Nether Road",
    bonus2: "Max HP +10%.",
    bonus5:
      "Upon gaining a Shield, gain a 5% increase in Crit. Rate for 5s, stacking up to 4 times (can be triggered once every 0.5s); at max stacks, gain 15% Fusion DMG Bonus.",
    bestUsers: ["Jingran (upcoming — pre-farm)"],
    notes:
      "HP/shield-scaling Fusion set added in 3.5 (natural pairing with the new Rustfire Chassis echo); pre-farm for an upcoming shielded Fusion HP-scaler.",
    released: "3.5 (Jul 10, 2026)",
  },
  {
    id: "shadow-of-shattered-dreams",
    name: "Shadow of Shattered Dreams",
    bonus2:
      "None — unique 1-piece Sonata (the single echo Reminiscence: Nightmare Adam Smasher is the whole set).",
    bonus5:
      "1-piece: Inflicting Hack - Shifting on a target grants 35% Basic Attack DMG Bonus and 35% Heavy Attack DMG Bonus for 15s.",
    bestUsers: ["Lucy", "Rebecca"],
    notes:
      "Cyberpunk: Edgerunners collab set keyed to the Hack - Shifting mechanic; drops from Nightmare: Adam Smasher in Somnoire: Night City.",
    released: "3.4 (Jun 8, 2026)",
  },
  {
    id: "wishes-of-quiet-snowfall",
    name: "Wishes of Quiet Snowfall",
    bonus2: "Glacio DMG +10%.",
    bonus5:
      "Inflicting Glacio Chafe increases Glacio DMG dealt by 10% for 15s and grants the Snowfall effect for 15s (once every 25s). While Snowfall is active: dealing Resonance Liberation DMG removes it and increases Crit Rate by 25% for 6s (Liberation DMG extends this by 4s, once per 0.5s, up to 6 times); casting Outro Skill removes Snowfall and grants the incoming Resonator 25% Glacio DMG Bonus for 15s.",
    bestUsers: ["Hiyuki"],
    notes:
      "Glacio Chafe + Liberation set with a selfish-crit or team-handoff choice; built for Hiyuki.",
    released: "3.3 (Apr 30, 2026)",
  },
  {
    id: "reel-of-spliced-memories",
    name: "Reel of Spliced Memories",
    bonus2: "ATK +10%.",
    bonus5:
      "Inflicting Tune Rupture - Shifting or Tune Strain - Shifting on enemies increases the Tune Break Boost of Resonators in the team by 20 for 30s. Effects of the same name do not stack.",
    bestUsers: ["Denia (Tune Strain resonance mode)"],
    notes: "Element-agnostic team Tune Break Boost enabler for Tune Rupture/Strain teams.",
    released: "3.3 (Apr 30, 2026)",
  },
  {
    id: "trailblazing-star",
    name: "Trailblazing Star",
    bonus2: "Fusion DMG +10%.",
    bonus5:
      "Inflicting Fusion Burst or Tune Rupture - Shifting on enemies increases the Resonator's Crit Rate by 20% and grants 20% Fusion DMG Bonus for 8s.",
    bestUsers: ["Aemaeth"],
    notes: "Fusion Burst / Tune Rupture DPS set tailor-made for Aemaeth.",
    released: "3.1",
  },
  {
    id: "chromatic-foam",
    name: "Chromatic Foam",
    bonus2: "Fusion DMG +10%.",
    bonus5:
      "Inflicting Fusion Burst grants 10% Fusion DMG Bonus for 15s; while this effect is active, casting an Outro Skill grants the incoming Resonator 25% Fusion DMG Bonus for 15s or until they are switched out.",
    bestUsers: ["Denia (Fusion Burst resonance mode)"],
    notes:
      "Fusion-support handoff set for Fusion Burst teams (e.g. around Aemaeth); Denia is its best current home.",
    released: "3.1",
  },
  {
    id: "sound-of-true-name",
    name: "Sound of True Name",
    bonus2: "Aero DMG +10%.",
    bonus5:
      "Dealing Echo Skill DMG to enemies increases the Resonator's Echo Skill Crit Rate by 20% and grants 15% Aero DMG Bonus for 5s.",
    bestUsers: ["Sigrika"],
    notes: "Aero Echo-Skill DPS set tailor-made for Sigrika (3.2 Aero Echo-Skill carry).",
    released: "3.1",
  },
  {
    id: "pact-of-neonlight-leap",
    name: "Pact of Neonlight Leap",
    bonus2: "Spectro DMG +10%.",
    bonus5:
      "Casting Outro Skill increases the ATK of the incoming Resonator by 15%, with each point of Tune Break Boost additionally increasing ATK by 0.3%, up to 15%; lasts 15s or until the Resonator is switched out.",
    bestUsers: ["Lynae (support role)"],
    notes:
      "Tune-era Outro buffer (Moonlit Clouds successor) scaling with the 3.0 Tune Break Boost mechanic; Lynae's BiS.",
    released: "3.0",
  },
  {
    id: "halo-of-starry-radiance",
    name: "Halo of Starry Radiance",
    bonus2: "Healing Bonus +10%.",
    bonus5:
      "When healing a Resonator in the team, every 1% of Off-Tune Buildup Rate grants a 0.2% ATK increase to all Resonators in the team for 4s, up to 25%.",
    bestUsers: ["Mornye"],
    notes:
      "Healing-triggered team ATK set (Rejuvenating Glow successor) keyed to the Off-Tune stat; currently only Mornye fully uses it.",
    released: "3.0",
  },
  {
    id: "rite-of-gilded-revelation",
    name: "Rite of Gilded Revelation",
    bonus2: "Spectro DMG +10%.",
    bonus5:
      "Dealing Basic Attack DMG increases Spectro DMG by 10% for 5s, stacking up to 3 times; with 3 stacks, casting Resonance Liberation grants 40% Basic Attack DMG Bonus.",
    bestUsers: ["Luuk Herssen", "Lynae (DPS build)"],
    notes:
      "Spectro Basic-Attack DPS set from Lahai-Roi; Luuk Herssen's BiS (with Twin Nova: Nebulous Cannon main echo).",
    released: "3.0",
  },
  {
    id: "thread-of-severed-fate",
    name: "Thread of Severed Fate",
    bonus2: "None — 3-piece-only set (pair with a Havoc 2-piece such as Sun-sinking Eclipse).",
    bonus5:
      "3-piece: Inflicting Havoc Bane on enemies increases the Resonator's ATK by 20% and grants 30% Resonance Liberation DMG Bonus for 5s.",
    bestUsers: ["Chisa", "Yangyang: Xuanling (alt)"],
    notes:
      "Havoc Bane + Liberation set introduced with Chisa in 2.8; other Havoc Bane appliers can borrow it.",
    released: "2.8",
  },
  {
    id: "flamewings-shadow",
    name: "Flamewing's Shadow",
    bonus2: "None — 3-piece-only set (typically paired with a Fusion 2-piece, e.g. Molten Rift).",
    bonus5:
      "3-piece: Dealing Echo Skill DMG increases Heavy Attack Crit Rate by 20% for 6s; dealing Heavy Attack DMG increases Echo Skill Crit Rate by 20% for 6s; while both effects are active, gain 16% Fusion DMG Bonus.",
    bestUsers: ["Galbrena"],
    notes: "Heavy-Attack/Echo-Skill crossover Fusion set tailor-made for Galbrena.",
    released: "2.7",
  },
  {
    id: "crown-of-valor",
    name: "Crown of Valor",
    bonus2: "None — 3-piece-only set (pair with a 2-piece such as Void Thunder or Sierra Gale).",
    bonus5:
      "3-piece: Upon gaining a Shield, increase the Resonator's ATK by 6% and Crit. DMG by 4% for 4s; can be triggered once every 0.5s and stacks up to 5 times (up to +30% ATK / +20% Crit. DMG).",
    bestUsers: ["Augusta", "Iuno"],
    notes:
      "Shield-trigger stacking set made for the 2.6 Sun/Moon duo — near-permanent uptime with Iuno's shields.",
    released: "2.6",
  },
  {
    id: "law-of-harmony",
    name: "Law of Harmony",
    bonus2: "None — 3-piece-only set (pair with a 2-piece of your element).",
    bonus5:
      "3-piece: Casting Echo Skill grants 30% Heavy Attack DMG Bonus to the caster for 4s; additionally, all Resonators in the team gain 4% Echo Skill DMG Bonus for 30s, stacking up to 4 times (16% max). Effects of the same name do not stack.",
    bestUsers: ["Qiuyuan", "Cantarella (Echo Skill teams)"],
    notes:
      "Echo-Skill team amp + personal Heavy Attack buff; best on Qiuyuan in Phrolova/Cantarella Echo-Skill comps.",
    released: "2.6",
  },
  {
    id: "dream-of-the-lost",
    name: "Dream of the Lost",
    bonus2:
      "None — this Sonata only has a 3-piece effect (pair it with any 2-piece set, e.g. Sun-sinking Eclipse or Midnight Veil).",
    bonus5:
      "3-piece: Crit. Rate +20% and Echo Skill DMG Bonus +35% while the Resonator has 0 Resonance Energy.",
    bestUsers: ["Phrolova"],
    notes:
      "First 3-piece Sonata; conditional on holding 0 Resonance Energy, which Phrolova's Echo-Skill-scaling kit does naturally — still her BiS.",
    released: "2.5",
  },
  {
    id: "gusts-of-welkin",
    name: "Gusts of Welkin",
    bonus2: "Aero DMG +10%.",
    bonus5:
      "Inflicting Aero Erosion increases Aero DMG for all Resonators in the team by 15%, and by an additional 15% for the Resonator triggering the effect, lasting 20s.",
    bestUsers: ["Jiyan", "Ciaccona", "Cartethyia (team-buff variant)"],
    notes:
      "Team-wide Aero DMG amp keyed to Aero Erosion (2.4 mechanic); Jiyan's modern BiS and standard in Aero teams.",
    released: "2.4",
  },
  {
    id: "windward-pilgrimage",
    name: "Windward Pilgrimage",
    bonus2: "Aero DMG +10%.",
    bonus5:
      "Hitting a target with Aero Erosion increases Crit Rate by 10% and grants 30% Aero DMG Bonus, lasting 10s.",
    bestUsers: ["Cartethyia", "Aero Rover", "Ciaccona (solo/DPS build)"],
    notes: "Selfish Aero Erosion DPS set — Cartethyia's and Aero Rover's BiS.",
    released: "2.4",
  },
  {
    id: "flaming-clawprint",
    name: "Flaming Clawprint",
    bonus2: "Fusion DMG +10%.",
    bonus5:
      "Casting Resonance Liberation increases Fusion DMG for Resonators in the team by 15% and the caster's Resonance Liberation DMG by 20%, lasting 35s.",
    bestUsers: ["Lupa", "Changli", "Encore (alt)"],
    notes: "Liberation-centric Fusion set built for Lupa; doubles as a team Fusion amp.",
    released: "2.4",
  },
  {
    id: "frosty-resolve",
    name: "Frosty Resolve",
    bonus2: "Resonance Skill DMG +12%.",
    bonus5:
      "Casting Resonance Skill grants 22.5% Glacio DMG Bonus for 15s; casting Resonance Liberation increases Resonance Skill DMG by 18% for 5s, stacking up to 2 times.",
    bestUsers: ["Carlotta", "Zhezhi (alt)", "Hiyuki (alt)"],
    notes: "Glacio Resonance-Skill DPS set, designed for Carlotta and still her BiS.",
    released: "2.0",
  },
  {
    id: "eternal-radiance",
    name: "Eternal Radiance",
    bonus2: "Spectro DMG +10%.",
    bonus5:
      "Inflicting Spectro Frazzle on enemies increases Crit Rate by 20% for 15s; attacking enemies with 10+ stacks of Spectro Frazzle grants 15% Spectro DMG Bonus for 15s.",
    bestUsers: ["Phoebe", "Zani", "Spectro Rover (Frazzle build)"],
    notes: "The Spectro Frazzle archetype set; core to Phoebe/Zani Frazzle teams.",
    released: "2.0",
  },
  {
    id: "midnight-veil",
    name: "Midnight Veil",
    bonus2: "Havoc DMG +10%.",
    bonus5:
      "When Outro Skill is triggered, deal an additional 480% Havoc DMG to surrounding enemies (counted as Outro Skill DMG) and grant the incoming Resonator 15% Havoc DMG Bonus for 15s.",
    bestUsers: ["Roccia", "Cantarella (support build)", "Danjin (quickswap support)"],
    notes:
      "Havoc support/enabler set — Outro nuke plus a Havoc DMG handoff for Camellya/Phrolova-style carries.",
    released: "2.0",
  },
  {
    id: "empyrean-anthem",
    name: "Empyrean Anthem",
    bonus2: "Energy Regen +10%.",
    bonus5:
      "Increases the Resonator's Coordinated Attack DMG by 80%; upon a critical hit of a Coordinated Attack, increases the active Resonator's ATK by 20% for 4s.",
    bestUsers: ["Zhezhi", "Yinlin", "Cantarella", "Phrolova (alt)"],
    notes: "The Coordinated-Attack sub-DPS set; standard on off-field turret units.",
    released: "2.0",
  },
  {
    id: "tidebreaking-courage",
    name: "Tidebreaking Courage",
    bonus2: "Energy Regen +10%.",
    bonus5:
      "Increases the Resonator's ATK by 15%; reaching 250% Energy Regen increases all Attribute DMG by 30% for the Resonator.",
    bestUsers: ["Brant"],
    notes:
      "Energy-Regen-stacking set effectively tailor-made for Brant (who converts ER into damage); niche on anyone else.",
    released: "2.0",
  },
  {
    id: "freezing-frost",
    name: "Freezing Frost",
    bonus2: "Glacio DMG +10%.",
    bonus5:
      "Glacio DMG +10% after releasing Basic Attack or Heavy Attack, stacking up to 3 times, each stack lasting 15s.",
    bestUsers: ["Lingyang", "Sanhua (Basic Attack build)", "Youhu"],
    notes:
      "Legacy Glacio Basic/Heavy-Attack DPS set; mostly power-crept by Frosty Resolve and Wishes of Quiet Snowfall.",
    released: "1.0",
  },
  {
    id: "molten-rift",
    name: "Molten Rift",
    bonus2: "Fusion DMG +10%.",
    bonus5: "Fusion DMG +30% for 15s after releasing Resonance Skill.",
    bestUsers: ["Encore", "Chixia", "Mortefi", "Changli (alt)"],
    notes:
      "Generic Fusion skill-cast DPS set; still fine for Encore/Chixia, largely replaced by Flaming Clawprint/Flamewing's Shadow for 2.x+ Fusion units.",
    released: "1.0",
  },
  {
    id: "void-thunder",
    name: "Void Thunder",
    bonus2: "Electro DMG +10%.",
    bonus5:
      "Electro DMG +15% after releasing Heavy Attack or Resonance Skill, stacking up to 2 times, each stack lasting 15s.",
    bestUsers: ["Calcharo", "Yuanwu", "Lumi", "Augusta (as 2pc pair with Crown of Valor)"],
    notes:
      "Electro Heavy/Skill DPS set; its 2pc is the standard Electro filler next to 3pc sets like Crown of Valor.",
    released: "1.0",
  },
  {
    id: "sierra-gale",
    name: "Sierra Gale",
    bonus2: "Aero DMG +10%.",
    bonus5: "Aero DMG +30% for 15s after releasing Intro Skill.",
    bestUsers: ["Jiyan (legacy alt)", "Jianxin", "Aalto"],
    notes:
      "Intro-skill Aero set; superseded for most Aero DPS by Gusts of Welkin / Windward Pilgrimage after Aero Erosion arrived in 2.4.",
    released: "1.0",
  },
  {
    id: "celestial-light",
    name: "Celestial Light",
    bonus2: "Spectro DMG +10%.",
    bonus5: "Spectro DMG +30% for 15s after releasing Intro Skill.",
    bestUsers: ["Jinhsi", "Spectro Rover (legacy)", "Zani (alt)"],
    notes:
      "Intro-skill Spectro set; still Jinhsi's classic BiS, while Frazzle units moved to Eternal Radiance and 3.0 units to the new Spectro sets.",
    released: "1.0",
  },
  {
    id: "sun-sinking-eclipse",
    name: "Sun-sinking Eclipse",
    bonus2: "Havoc DMG +10%.",
    bonus5:
      "Havoc DMG +7.5% after releasing Basic Attack or Heavy Attack, stacking up to 4 times, each stack lasting 15s.",
    bestUsers: ["Camellya", "Havoc Rover", "Danjin (DPS build)"],
    notes:
      "Havoc Basic/Heavy stacker (listed as 'Havoc Eclipse' on the Fandom wiki); still BiS-adjacent for Camellya/Havoc Rover.",
    released: "1.0",
  },
  {
    id: "rejuvenating-glow",
    name: "Rejuvenating Glow",
    bonus2: "Healing Bonus +10%.",
    bonus5: "Increases the ATK of all party members by 15% for 30s upon healing allies.",
    bestUsers: ["Shorekeeper", "Verina", "Baizhi"],
    notes:
      "The classic healer/team-ATK set; 3.0's Halo of Starry Radiance is its Tune-era successor for new healers like Mornye.",
    released: "1.0",
  },
  {
    id: "moonlit-clouds",
    name: "Moonlit Clouds",
    bonus2: "Energy Regen +10%.",
    bonus5: "After using Outro Skill, increases the ATK of the next Resonator by 22.5% for 15s.",
    bestUsers: ["Sanhua", "Mortefi", "Taoqi", "Aalto"],
    notes: "Generic swap-support/buffer set for units whose job is to Outro into the main DPS.",
    released: "1.0",
  },
  {
    id: "lingering-tunes",
    name: "Lingering Tunes",
    bonus2: "ATK +10%.",
    bonus5:
      "While on the field, ATK increases by 5% every 1.5s, up to 4 stacks; Outro Skill DMG +60%.",
    bestUsers: ["Xiangli Yao", "Calcharo (alt)", "Encore (alt)"],
    notes: "Element-agnostic hypercarry/on-fielder set; also the go-to for Outro-skill nukers.",
    released: "1.0",
  },
];

/* ---------- Notable main echoes ----------
   Corrections applied over the raw compiled data:
   - reminiscence-threnodian-leviathan.notes: release version corrected
     from 3.1 to 2.7 (introduced with Galbrena; Chisa's BiS from 2.8).
   - reminiscence-fleurdelys.sonatas: added Windward Pilgrimage (listed
     first — Cartethyia's BiS pairing); note reworded to match.
   ------------------------------------------ */

const MAIN_ECHOES = [
  {
    id: "dreamless",
    name: "Dreamless",
    cost: 4,
    skill:
      "Transform into Dreamless for a 6-hit flurry: 5 hits of 54.08% Havoc DMG each plus a 270.40% Havoc DMG finisher. Skill DMG +50% within 5s of Rover: Havoc casting Resonance Liberation.",
    bestFor: ["Rover (Havoc)", "Camellya", "Cantarella"],
    sonatas: ["Sun-sinking Eclipse (Havoc Eclipse)"],
    notes:
      "The original weekly-boss Havoc nuke; still the default Sun-sinking Eclipse main echo for Havoc basic-attack DPS.",
  },
  {
    id: "jue",
    name: "Jué",
    cost: 4,
    skill:
      "Jué soars, striking for 48.64% Spectro DMG plus 5 thunderbolts (19.46% each) and 2 spiral hits (48.64% each). Grants Blessing of Time 15s: +16% Resonance Skill DMG, and Resonance Skill hits tick an extra 16% Spectro DMG per second counted as Resonance Skill DMG.",
    bestFor: ["Jinhsi", "Rover (Spectro)"],
    sonatas: ["Celestial Light"],
    notes:
      "Dropped by the weekly boss Sentinel Jué (no separate 'Sentinel Jué' echo exists); the Resonance Skill buff keeps it Jinhsi's BiS.",
  },
  {
    id: "hecate",
    name: "Hecate",
    cost: 4,
    skill:
      "Summons 3 twirling Crescent Servants dealing 45.59% Havoc DMG with spinning blades; triggering a Counterattack resets their duration. Main slot: Coordinated Attack DMG +40%.",
    bestFor: ["Zhezhi", "Yinlin", "coordinated-attack sub-DPS"],
    sonatas: ["Empyrean Anthem"],
    notes:
      "The go-to Empyrean Anthem 4-cost for coordinated-attack teams; a Crimson Curtain Call mold can re-roll its sonata.",
  },
  {
    id: "nightmare-hecate",
    name: "Nightmare: Hecate",
    cost: 4,
    skill:
      "Transform into Nightmare: Hecate, leap and smash for 3 stages of 152.39% Havoc DMG. Main slot: +12% Havoc DMG Bonus and +20% Echo Skill DMG Bonus.",
    bestFor: ["Phrolova"],
    sonatas: ["Dream of the Lost"],
    notes:
      "Non-negotiable Phrolova main echo — Echo Skill DMG and Havoc DMG are both core to her kit.",
  },
  {
    id: "fallacy-of-no-return",
    name: "Fallacy of No Return",
    cost: 4,
    skill:
      "AoE blast dealing Spectro DMG equal to 15.86% of Max HP (hold for stamina flurry), then grants the caster +10% Energy Regen and the whole team +10% ATK for 20s.",
    bestFor: ["Shorekeeper", "Verina", "healers/supports"],
    sonatas: ["Rejuvenating Glow", "Moonlit Clouds"],
    notes:
      "The classic support main echo — pick it whenever your healer's job is to feed team ATK and energy.",
  },
  {
    id: "lorelei",
    name: "Lorelei",
    cost: 4,
    skill:
      "Transform into Lorelei and unleash an AoE dealing up to 405.00% Havoc DMG (25s CD). Main slot: +12% Havoc DMG Bonus and +12% Basic Attack DMG Bonus.",
    bestFor: ["Cantarella", "Camellya"],
    sonatas: ["Sun-sinking Eclipse (Havoc Eclipse)", "Midnight Veil"],
    notes:
      "Stat-stick alternative to Dreamless for Havoc basic-attack units; Cantarella's best main echo.",
  },
  {
    id: "dragon-of-dirge",
    name: "Dragon of Dirge",
    cost: 4,
    skill:
      "Transform and summon a Grief Rift for 5s that periodically deals 36.81% Fusion DMG in an area. Main slot: +12% Fusion DMG Bonus and +12% Basic Attack DMG Bonus.",
    bestFor: ["Brant"],
    sonatas: ["Tidebreaking Courage"],
    notes:
      "Brant's BiS — pairs the Fusion/Basic Attack bonuses with Tidebreaking Courage's Energy Regen scaling.",
  },
  {
    id: "nightmare-feilian-beringal",
    name: "Nightmare: Feilian Beringal",
    cost: 4,
    skill:
      "Summon to strike for 164.16% Aero DMG, leaving a Whirlwind Beam that hits up to 5 times for 21.89% Aero DMG each. Main slot: +12% Aero DMG Bonus and +12% Heavy Attack DMG Bonus (passive, no summon needed).",
    bestFor: ["Jiyan", "Aero heavy-attack DPS"],
    sonatas: ["Sierra Gale"],
    notes:
      "Slot-and-forget Nightmare upgrade that keeps Jiyan's heavy-attack build ahead of the base Feilian.",
  },
  {
    id: "nightmare-crownless",
    name: "Nightmare: Crownless",
    cost: 4,
    skill:
      "Transform into Nightmare: Crownless and unleash a forward assault dealing up to 264.60% Havoc DMG. Main slot: +12% Havoc DMG Bonus and +12% Basic Attack DMG Bonus (passive).",
    bestFor: ["Camellya", "Rover (Havoc)"],
    sonatas: ["Sun-sinking Eclipse (Havoc Eclipse)"],
    notes:
      "Take it over Dreamless when you want the main-slot buffs without needing to fit the echo skill into your rotation.",
  },
  {
    id: "reminiscence-fleurdelys",
    name: "Reminiscence: Fleurdelys",
    cost: 4,
    skill:
      "Summons the Windcleaver: 8 hits of 27.36% Aero DMG plus one 136.80% Aero DMG strike (20s CD). Main slot: +10% Aero DMG Bonus, doubled to +20% for Rover: Aero or Cartethyia.",
    bestFor: ["Cartethyia", "Rover (Aero)"],
    sonatas: ["Windward Pilgrimage", "Gusts of Welkin"],
    notes:
      "Tailor-made for the Aero Erosion duo — the automatic main echo for Cartethyia in Windward Pilgrimage (the Gusts of Welkin variant is used in team-buff builds).",
  },
  {
    id: "reminiscence-threnodian-leviathan",
    name: "Reminiscence: Threnodian - Leviathan",
    cost: 4,
    skill:
      "Summons a Collapsing Horizon for 2x131.94% Havoc DMG and grants Core of Collapse 15s: 24.57% Havoc DMG procs when the active Resonator deals damage (up to 8 times, every 0.5s; enemies with Havoc Bane take 100% more from it). Main slot: +12% Havoc DMG and +12% Resonance Liberation DMG.",
    bestFor: ["Chisa", "Havoc Bane team DPS"],
    sonatas: ["Thread of Severed Fate", "Flamewing's Shadow"],
    notes:
      "2.7 weekly-boss echo (Threnodian: Leviathan, introduced with Galbrena) built around Havoc Bane; it became Chisa's BiS main echo in 2.8 — her rotation applies Bane constantly.",
  },
  {
    id: "hyvatia",
    name: "Hyvatia",
    cost: 4,
    skill:
      "Summons Hyvatia to fire lasers from mid-air, dealing 27.36% Spectro DMG 10 times (20s CD). Casting Outro Skill within 15s grants the next Resonator (via Intro) +10% All-Attribute DMG Bonus for 15s.",
    bestFor: ["Buling", "concerto supports", "quick-swap buffers"],
    sonatas: ["Rite of Gilded Revelation", "Pact of Neonlight Leap"],
    notes:
      "3.0's Impermanence Heron successor — pick on supports whose job is passing an outro buff to the carry.",
  },
  {
    id: "reminiscence-denia",
    name: "Reminiscence: Denia",
    cost: 4,
    skill:
      "Summons the Trickster to deal 273.60% Fusion DMG; casting Outro Skill within 15s grants the incoming Resonator +12% Fusion DMG Bonus for 15s.",
    bestFor: ["Denia", "Fusion Burst team members"],
    sonatas: ["Chromatic Foam"],
    notes:
      "3.3 flagship for the Fusion Burst archetype — main echo of the Chromatic Foam set on Denia herself.",
  },
  {
    id: "reminiscence-nightmare-adam-smasher",
    name: "Reminiscence - Nightmare: Adam Smasher",
    cost: 4,
    skill:
      "Base: 16 hits of 10.26% ATK Physical DMG. In Lucy's or Rebecca's main slot: +15% Crit Rate and a unique skill — Lucy: 273.60% Spectro AoE (hold to move fast and slow enemies); Rebecca: missile barrage of 16x17.10% Electro DMG.",
    bestFor: ["Lucy", "Rebecca"],
    sonatas: ["Shadow of Shattered Dreams"],
    notes:
      "3.4 Cyberpunk: Edgerunners collab echo; the only echo in its sonata (unique 1-pc bonus) and mandatory for the collab duo's Hack Shifting kit.",
  },
  {
    id: "myriad-snare-rustfire-chassis",
    name: "Myriad Snare: Rustfire Chassis",
    cost: 4,
    skill:
      "Summons the chassis to crush enemies for Fusion DMG equal to 10.20% of Max HP on impact, then up to 19 repeated crushes of 0.37% Max HP each. Main slot: +12% Fusion DMG Bonus and +12% Heavy Attack DMG Bonus.",
    bestFor: ["Jingran"],
    sonatas: ["Lamp of Nether Road"],
    notes:
      "3.5 flagship for HP-scaling Fusion — pairs with Lamp of Nether Road's shield/Crit Rate loop on Jingran.",
  },
  {
    id: "thousand-puppet-pavilion",
    name: "Thousand-Puppet Pavilion",
    cost: 4,
    skill:
      "Deals Havoc DMG and summons Blades of Thousand Memories; when the wearer inflicts Havoc Bane, blades are consumed to strike enemies with additional Havoc DMG. Main slot grants Havoc DMG and Heavy Attack DMG bonuses.",
    bestFor: ["Yangyang: Xuanling", "Havoc Bane heavy-attack DPS"],
    sonatas: ["Song of Feathered Trace"],
    notes:
      "The 3.5 Havoc main echo of Song of Feathered Trace — Xuanling procs its Havoc Bane payoff on nearly every attack.",
  },
];

/* ---------- Farming strategy ---------- */

const FARMING_TIPS = [
  "Tune in increments of 5 and read the rolls: at +5 and +10, if you've hit two dead lines (Flat HP/ATK/DEF or an off-type DMG bonus), abandon the Echo immediately — the common stop-loss rule is 'two flat stats before level 15 = stop'.",
  "Conversely, two of your non-negotiable substats (e.g. any two of Crit Rate/Crit DMG/ATK%) by +10 is a green light to push on.",
  "Exploit the refund asymmetry: recycling a leveled Echo returns 75% of Echo EXP but only 30% of Tuners — leveling speculatively is affordable, tuning speculatively is not. When unsure, level to the next breakpoint but delay the tune.",
  "Take all 5 Echoes to +20 before any +25 push; the final 5 levels are the worst EXP-per-stat value in the game and can stall your whole account if done early.",
  "Set-first, stats-first second: equip a correct main stat on the right Sonata set with mediocre substats before chasing perfect rolls — main stat + set bonus is most of the damage; substats are the long-tail grind.",
  "Feed every reject into Data Merge rather than letting it rot: outputs follow your Data Bank's drop rates, and higher-rarity/COST fodder increases bonus-Echo chances, so gold junk is premium merge fuel.",
];

/* ---------- Helpers ---------- */

function bonusLines(set) {
  // Newer sets are 3-piece (or 1-piece) only; their bonus5 text carries an
  // "N-piece:" prefix and bonus2 explains the pairing. Label accordingly.
  const m = set.bonus5.match(/^(\d)-piece:\s*/);
  if (m) {
    return [
      { tag: `${m[1]}pc`, text: set.bonus5.slice(m[0].length) },
      { tag: "pair", text: set.bonus2 },
    ];
  }
  return [
    { tag: "2pc", text: set.bonus2 },
    { tag: "5pc", text: set.bonus5 },
  ];
}

function Chips({ items }) {
  return (
    <div className="echo-chips">
      {items.map((name) => (
        <span key={name} className="echo-chip">{name}</span>
      ))}
    </div>
  );
}

/* ---------- Page ---------- */

export default function EchoCompendium() {
  const [openId, setOpenId] = useState(null);
  const toggle = (id) => setOpenId((cur) => (cur === id ? null : id));

  return (
    <>
      <style>{echoStyles}</style>

      <header className="top">
        <div className="top-marks" aria-hidden="true">{"✦ ✦ ✦"}</div>
        <h1 className="title">Echo Compendium</h1>
        <p className="subtitle">
          The Echo system in full — cost budgets, tuning economy, every Sonata
          effect, and the boss echoes worth a main slot · Wuthering Waves v3.5
        </p>
      </header>

      <main className="rx-page">
        {/* ---------- How Echoes Work ---------- */}
        <section className="rx-group">
          <div className="rx-group-head">
            <h2 className="rx-group-title">How Echoes Work</h2>
            <p className="rx-group-blurb">
              Five slots, a 12-point cost budget, and three currencies — the
              mechanics every build decision hangs on. Tap a card to expand.
            </p>
          </div>

          <div className="rx-list">
            {MECHANICS_SECTIONS.map((sec) => {
              const isOpen = openId === sec.id;
              return (
                <article key={sec.id} className={`rx-card ${isOpen ? "open" : ""}`}>
                  <button
                    type="button"
                    className="rx-head"
                    onClick={() => toggle(sec.id)}
                    aria-expanded={isOpen}
                  >
                    <div className="rx-head-left">
                      <h3 className="rx-name">{sec.title}</h3>
                    </div>
                    <span className="rx-multiplier">{sec.bullets.length} notes</span>
                    <span className="rx-caret" aria-hidden="true">
                      <svg viewBox="0 0 10 10" className="caret-svg">
                        <path d="M2 3 L5 7 L8 3" />
                      </svg>
                    </span>
                  </button>
                  {isOpen && (
                    <div className="rx-body">
                      <ul className="rx-details">
                        {sec.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              );
            })}

            <article className="rx-card open">
              <div className="echo-mainstat-card">
                <h3 className="rx-name">Main Stats by Slot Cost</h3>
                <p className="rx-short">
                  Main stats are fixed pools per cost class — reject wrong-main-stat
                  pieces at the drop screen.
                </p>
                <div className="echo-mainstats">
                  {MAIN_STATS.map((col) => (
                    <div key={col.cost} className="echo-mainstat-col">
                      <div className="echo-mainstat-head">
                        <span className="echo-mainstat-cost">{col.cost}</span>
                        <span className="echo-mainstat-note">{col.note}</span>
                      </div>
                      <ul className="echo-mainstat-list">
                        {col.stats.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* ---------- Sonata Effects ---------- */}
        <section className="rx-group">
          <div className="rx-group-head">
            <h2 className="rx-group-title">Sonata Effects</h2>
            <p className="rx-group-blurb">
              Every Sonata set as of v3.5, newest first — bonuses, best users,
              and where each set stands in the meta.
            </p>
          </div>

          <div className="rx-list">
            {SONATA_SETS.map((set) => {
              const isOpen = openId === set.id;
              const lines = bonusLines(set);
              const pieceLabel =
                lines[0].tag === "2pc" ? "2pc / 5pc" : `${lines[0].tag} + pair`;
              return (
                <article key={set.id} className={`rx-card ${isOpen ? "open" : ""}`}>
                  <button
                    type="button"
                    className="rx-head"
                    onClick={() => toggle(set.id)}
                    aria-expanded={isOpen}
                  >
                    <div className="rx-head-left">
                      <h3 className="rx-name">{set.name}</h3>
                      <span className="echo-ver">v{set.released}</span>
                    </div>
                    <span className="rx-multiplier">{pieceLabel}</span>
                    <span className="rx-caret" aria-hidden="true">
                      <svg viewBox="0 0 10 10" className="caret-svg">
                        <path d="M2 3 L5 7 L8 3" />
                      </svg>
                    </span>
                  </button>
                  {isOpen && (
                    <div className="rx-body">
                      {lines.map((l) => (
                        <p key={l.tag} className="rx-short">
                          <span className="rx-formula-tag">{l.tag}</span> {l.text}
                        </p>
                      ))}
                      <div className="rx-examples">
                        <div className="rx-examples-head">Best for</div>
                        <Chips items={set.bestUsers} />
                      </div>
                      <p className="rx-short echo-notes">{set.notes}</p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* ---------- Notable Main Echoes ---------- */}
        <section className="rx-group">
          <div className="rx-group-head">
            <h2 className="rx-group-title">Notable Main Echoes</h2>
            <p className="rx-group-blurb">
              The 4-cost boss echoes worth the first slot — skill text, the
              sonatas they roll in, and who should hold them.
            </p>
          </div>

          <div className="rx-list">
            {MAIN_ECHOES.map((echo) => {
              const isOpen = openId === echo.id;
              return (
                <article key={echo.id} className={`rx-card ${isOpen ? "open" : ""}`}>
                  <button
                    type="button"
                    className="rx-head"
                    onClick={() => toggle(echo.id)}
                    aria-expanded={isOpen}
                  >
                    <div className="rx-head-left">
                      <h3 className="rx-name">{echo.name}</h3>
                      <span className="rx-trigger">{echo.cost}-Cost</span>
                    </div>
                    <span className="rx-multiplier">{echo.sonatas[0]}</span>
                    <span className="rx-caret" aria-hidden="true">
                      <svg viewBox="0 0 10 10" className="caret-svg">
                        <path d="M2 3 L5 7 L8 3" />
                      </svg>
                    </span>
                  </button>
                  {isOpen && (
                    <div className="rx-body">
                      <p className="rx-short">{echo.skill}</p>
                      <div className="rx-examples">
                        <div className="rx-examples-head">Rolls in</div>
                        <Chips items={echo.sonatas} />
                      </div>
                      <div className="rx-examples">
                        <div className="rx-examples-head">Best holders</div>
                        <Chips items={echo.bestFor} />
                      </div>
                      <p className="rx-short echo-notes">{echo.notes}</p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* ---------- Farming Strategy ---------- */}
        <section className="rx-group">
          <div className="rx-group-head">
            <h2 className="rx-group-title">Farming Strategy</h2>
            <p className="rx-group-blurb">
              The tuning stop-loss doctrine — six rules that keep Tuners in your
              pocket and dead echoes out of your bag.
            </p>
          </div>

          <div className="rx-list">
            <article className="rx-card open">
              <div className="echo-tips-card">
                <ol className="echo-tips">
                  {FARMING_TIPS.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ol>
              </div>
            </article>
          </div>
        </section>
      </main>

      <footer className="bottom">
        <p>Cross-checked against multiple community sources · v3.5 (July 2026)</p>
      </footer>
    </>
  );
}

/* ---------- Scoped styles (page-specific bits only) ---------- */

const echoStyles = `
.wuwa-root .echo-ver {
  align-self: flex-start;
  font-size: 9px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: #8fd3d8;
  border: 1px solid rgba(143, 211, 216, 0.4);
  border-radius: 999px;
  padding: 2px 9px;
  white-space: nowrap;
}

.wuwa-root .echo-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.wuwa-root .echo-chip {
  font-size: 11.5px;
  letter-spacing: 0.06em;
  padding: 4px 12px;
  border-radius: 999px;
  border: 1px solid rgba(143, 211, 216, 0.35);
  color: #bfe6e9;
  background: rgba(0, 0, 0, 0.22);
}

.wuwa-root .echo-notes {
  color: rgba(232, 228, 214, 0.6);
}

.wuwa-root .echo-mainstat-card,
.wuwa-root .echo-tips-card {
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.wuwa-root .echo-mainstat-card .rx-name { margin: 0; }
.wuwa-root .echo-mainstat-card .rx-short { margin: 0; }

.wuwa-root .echo-mainstats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
@media (max-width: 640px) {
  .wuwa-root .echo-mainstats { grid-template-columns: 1fr; }
}

.wuwa-root .echo-mainstat-col {
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(143, 211, 216, 0.15);
  padding: 12px 14px;
  min-width: 0;
}

.wuwa-root .echo-mainstat-head {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px dashed rgba(143, 211, 216, 0.25);
}

.wuwa-root .echo-mainstat-cost {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 18px;
  color: #8fd3d8;
  line-height: 1;
}

.wuwa-root .echo-mainstat-note {
  font-size: 9px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(232, 228, 214, 0.45);
}

.wuwa-root .echo-mainstat-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 12.5px;
  line-height: 1.4;
  color: rgba(232, 228, 214, 0.82);
}

.wuwa-root .echo-tips {
  margin: 0;
  padding: 0 0 0 26px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 13px;
  line-height: 1.6;
  color: rgba(232, 228, 214, 0.86);
  counter-reset: echo-tip;
  list-style: none;
}
.wuwa-root .echo-tips li {
  counter-increment: echo-tip;
  position: relative;
}
.wuwa-root .echo-tips li::before {
  content: counter(echo-tip);
  position: absolute;
  left: -26px;
  top: 0.1em;
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 15px;
  color: #8fd3d8;
}
`;
