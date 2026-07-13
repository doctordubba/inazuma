import { useState } from "react";

/* ============================================================
   FIELD MANUAL — Wuthering Waves v3.5
   Combat systems, rotations, and progression doctrine.
   Rendered inside WuwaApp's .wuwa-root (almanacStyles already
   injected); this file only adds a tiny scoped style block.
   ============================================================ */

const COMBAT_SECTIONS = [
  {
    id: "concerto-swap-economy",
    title: "Concerto & the Swap Economy",
    blurb:
      "Wuthering Waves is not three separate characters taking turns — it is one damage engine with three cylinders. The Concerto bar is the crankshaft: everything you do on-field charges it, and spending it correctly (full-bar swaps that fire Outro + Intro simultaneously) is what separates a rotation from button-mashing.",
    entries: [
      {
        name: "The Concerto Bar Is Your Real Resource",
        short:
          "Every action builds Concerto; a swap at 100% fires the exiting character's Outro and the incoming character's Intro at the same time.",
        details: [
          "Concerto fills to a fixed cap (displayed as 0–100%) from basic attacks, heavy attacks, Resonance Skills, Echo skills, dodge counters, and especially parries — parries are among the largest single Concerto injections in the game.",
          "The Outro/Intro pair only triggers if you swap while the bar is FULL. Swapping at 95% fires nothing and the incoming character walks in naked — glance at the glowing party icons (they light up when Concerto is ready) before every swap.",
          "During the Outro→Intro handoff you briefly have two characters dealing damage at once: the exiting character's Outro animation keeps playing while the new character is already actionable. This overlap is free DPS — never stand still through it.",
          "All Concerto is consumed on the swap, so any Concerto generated past 100% is wasted. When the bar fills, finish your current attack string and swap — do not keep fishing for one more skill cast.",
        ],
      },
      {
        name: "Outro-Buff Matching: Feed the Right Mouth",
        short:
          "Most Outros carry a typed 'DMG Amplify' (Deepen) buff — it only pays out if the next character actually deals that damage type.",
        details: [
          "Match the amplify to the carry's damage profile: Sanhua's Outro grants 38% Basic Attack DMG Amplify, which is huge for basic-attack carries (Camellya, Zhezhi's Imprint attacks all count as Basic Attack) and nearly worthless for a skill-centric carry.",
          "Learn each buffer's tag: Basic Attack Deepen (Sanhua), Heavy Attack Deepen (Mortefi — feeds Jiyan-style Heavy Attack kits), Resonance Skill Deepen (Zhezhi, Yinlin's Electro Amplify for Electro carries), Liberation Deepen (varies by unit — check the tag), and universal amplifies (Verina, Shorekeeper) that work on anyone. Prydwen's character pages list the exact tag — check before you build a team.",
          "Rule of thumb: Deepen/Amplify Outro buffs apply only to the character who swaps IN, and most of them drop the moment that character leaves the field. This dictates rotation order: buffers first, carry last, carry stays on-field for the buff duration.",
          "The Intro Skill itself is a real attack with its own multiplier and is often the trigger for a carry's kit mechanics (stack generation, stance entry). Landing the Intro ON the boss — not into empty air — is part of the rotation, so face your camera at the target before swapping.",
        ],
      },
      {
        name: "Swap-Cancelling: The Core Skill Expression",
        short:
          "Characters keep executing their current action after you swap off — so pay the animation cost on one character while another one attacks.",
        details: [
          "Any long animation — Resonance Liberations, 4-cost Echo transformations, charged heavy attacks — can usually be swap-cancelled the instant its damage/effect snapshot lands. The off-field character finishes the attack invisibly while your new character starts their own string. This is the single largest free-DPS lever in the game.",
          "The mechanic works because damage and buffs 'snapshot' early in the animation; the long recovery tail is pure wasted time you are allowed to skip. Watch one 'swap cancel every 4-cost echo' video for your carry and copy the timing — cancel points are consistent per-animation, not random.",
          "Swap has a short per-character cooldown (roughly a couple of seconds), so you cannot ping-pong instantly between two characters — plan A→B→C triangles, not A→B→A spam.",
          "Outro buffs you have already applied persist through swap-cancels as long as the buffed character is the one on-field doing damage — swap-cancelling a support's animation under your carry's buff window does not eat the buff.",
        ],
      },
      {
        name: "Hypercarry vs Quick-Swap: Pick Your Tempo",
        short:
          "Two valid grammars — funnel everything into one carry, or rotate two-plus damage dealers with constant swap-cancels.",
        details: [
          "Hypercarry (e.g., classic Jinhsi or Camellya teams): two supports build Concerto fast, dump their Outros into one carry, and the carry stays on-field through a long DPS window. Easier to pilot — you dodge, parry, and combo with one character — and supports need minimal gear investment.",
          "Quick-swap (e.g., Changli + Xiangli Yao, Yinlin + Calcharo lineages): every member deals damage; you swap-cancel each character's biggest hits into the next. Higher APM and higher ceiling, but Deepen-type Outros are wasted here (they drop on swap), so quick-swap teams prefer buffers whose effects persist or characters who don't need external amps.",
          "Diagnostic: if your carry has long, cancellable animations and doesn't rely on staying on-field for a stance/stack mechanic, quick-swap gains are large. If the carry ramps stacks over continuous field time, hypercarry is correct — swapping out mid-window is a DPS loss, not tech.",
          "Whichever style you play, the supports' job description is identical: build 100 Concerto as fast as possible, land the Outro, get out. Sanhua is the community benchmark — her skill-heavy string fills Concerto in one short rotation, which is why she appears in so many teams.",
        ],
      },
    ],
  },
  {
    id: "defense-is-damage",
    title: "Defense Is Damage",
    blurb:
      "WuWa rewards every defensive action with offense: dodge counters hit harder, parries shred the stagger gauge and pour in Concerto, and swaps are invincible repositions. Players who treat dodging as 'not dying' leave a third of their damage on the table.",
    entries: [
      {
        name: "Dodge, Perfect Dodge, Dodge Counter — Three Different Buttons' Worth of Value",
        short:
          "A dodge gives roughly half a second of invulnerability; timing it at the last instant upgrades it, and attacking immediately after converts it into bonus damage.",
        details: [
          "The dodge dash carries about 0.5s of invulnerability — enough to pass through most single hits, not enough to outlast multi-hit flurries. For flurries, dodge THROUGH the enemy or chain a second dodge on the follow-up hit, not on reaction spam.",
          "Perfect Dodge = pressing dodge right as the attack would connect. You get full immunity, a brief slow-motion window, and Concerto energy. Late is better than early: an early dodge whiffs the timing, still costs stamina, and leaves you exposed to the actual hit.",
          "Press Basic Attack immediately after any successful dodge to fire the Dodge Counter — a distinct, higher-damage attack that also deals bonus Vibration Strength (stagger) damage. Dodge Counters classify as Basic Attack DMG, so they scale with Basic Attack Deepen buffs like Sanhua's Outro.",
          "For most characters the basic-attack combo string does not reset when you dodge — you can dodge mid-string, counter, and resume from where you left off. Stop treating dodges as combo-enders.",
        ],
      },
      {
        name: "Parry the Weakness Halo",
        short:
          "When gold rings shrink around an enemy, land a melee hit as they meet — huge Vibration damage, huge Concerto, and the enemy's attack is stopped cold.",
        details: [
          "Parry cue: a glowing outer ring contracts onto an inner ring around the enemy (the 'Weakness Halo'). Time any qualifying attack to land as the rings touch. You must be in melee range — ranged characters generally cannot parry with basic shots, so swap to a melee unit or eat the dodge instead.",
          "A successful parry interrupts the enemy attack, chunks their Vibration Strength gauge, and generates a large burst of Concerto — it is simultaneously your best defense, your fastest stagger tool, and your fastest swap fuel. Community guides put the effective timing window around half a second; it is generous, so commit.",
          "Not every attack in your kit can parry — the hit has to land during the ring-touch moment, so favor fast pokes (early basic string hits) over slow heavies when fishing for the parry.",
          "If you can't make the parry, the halo is still information: it telegraphs exactly when the hit lands, which is your Perfect Dodge metronome.",
        ],
      },
      {
        name: "Break the Vibration Gauge, Then Spend Everything",
        short:
          "Depleting the stagger bar under the boss's HP immobilizes them for several seconds — that window is where your Liberations belong.",
        details: [
          "The Vibration Strength gauge (below boss HP) drops from all damage but disproportionately from parries and Dodge Counters. At zero, the boss is immobilized and takes bonus damage for a few seconds — a guaranteed, dodge-free burst window.",
          "Bank your burst: when the gauge is low, hold Liberations, 4-cost Echo transformations, and stacked Outro buffs until the break lands, then dump the entire sequence into the stationary target. Bursting a boss that is mid-attack-chain wastes half the window on repositioning.",
          "Some fights add break accelerators — e.g., the Hyvatia hologram's Tune Break interrupts her attacks AND cuts Vibration Strength, and destroying certain parts (jetpacks, shields) triggers extended vulnerability states (30% extra Total DMG taken for 30s in that fight). Read the fight-specific gimmick; it is usually a stagger shortcut.",
          "Vibration recovery: after a break ends the gauge refills, and many bosses armor up briefly. Don't waste parry attempts immediately post-break — return to Concerto-building until the next telegraphed halo.",
        ],
      },
      {
        name: "Free Iframes: Intro Skills and Liberations",
        short:
          "Swapping in with a full Concerto bar and casting a Liberation are both invincible actions — use them as dodges you don't have to time.",
        details: [
          "Intro Skill animations are invincible for essentially the whole cast — a full-Concerto swap is a panic button that also deals damage and starts your next rotation. When a big unavoidable hit is coming and Concerto is full, swap INTO it instead of dodging away from it.",
          "Resonance Liberation cast animations grant invincibility. If your dodge is on cooldown-by-stamina and a hit is about to land, an available ult is a legal escape — and the slow cinematic often lets the enemy's attack whiff entirely underneath you.",
          "Corollary for swap-cancelling: if you swap-cancel a Liberation too early, you keep the damage but the NEW character is not invincible — don't cancel into a landing boss attack. Sequence: cast ult through the danger, then swap once the hit has whiffed.",
          "4-cost Echo transformations also carry generous invulnerability/super-armor on many Echoes — an Echo cast can tank you through a hit while still dealing damage.",
        ],
      },
      {
        name: "Stamina Is a Combat Stat",
        short:
          "The shared stamina bar caps at 240 (Data Bank 10); one dodge eats roughly an eighth of it, and an empty bar means no dodge exactly when you need one.",
        details: [
          "Budget: at max Data Bank you have around 8 dodges from full. Panic-rolling three times per telegraph bankrupts you before the actual damage window; one read dodge (or a parry, which costs nothing) does the same job.",
          "Perfect Dodges and parries are your stamina economy — well-timed defensive actions refund the exchange, while whiffed early dodges are pure loss. If you find yourself stamina-starved, your dodge timing is early, not unlucky.",
          "Jump instead of dodging ground-level shockwaves and sweeps — jumps are free and many circular AoEs can simply be hopped, saving stamina for hits that genuinely require iframes.",
          "Swapping is a free defensive tool that costs zero stamina: the outgoing character stops being a target, and positioning resets. When your stamina is empty, a non-Concerto swap (no Outro, but also no death) beats face-tanking.",
        ],
      },
      {
        name: "Position for Parries, Not for Safety",
        short:
          "Stay at the enemy's flank inside melee range — that's where parry attempts, dodge-throughs, and full combo strings all live.",
        details: [
          "Side-dodge THROUGH or past attacks toward the enemy's flank rather than back-dashing away. Back-dashing 'succeeds' defensively but resets your position to zero uptime; a flank dodge keeps you in Dodge Counter and parry range.",
          "Melee lock-on range matters for parries: the parry only connects if your attack physically reaches the enemy during the ring-touch. If you fight at maximum poke distance you will watch halos expire; hug the hitbox.",
          "Against highly mobile or flying bosses (Nameless Explorer-type fights), characters with aerial kits hold uptime that grounded units lose to chasing — positioning includes the vertical axis when picking the team.",
          "Keep the camera, not just the character, pointed at the boss before swapping — Intro Skills fire toward camera-facing, and a whiffed Intro is a wasted 100 Concerto.",
        ],
      },
    ],
  },
  {
    id: "rotation-craft",
    title: "Rotation Craft",
    blurb:
      "A rotation is just the swap economy written down: build Concerto on the characters whose buffs you want active LAST-in, weave Echo casts into dead frames, and never let a bar sit full. The grammar is the same for every team; only the vocabulary changes.",
    entries: [
      {
        name: "The Universal Grammar: Support → Buffer → DPS Window",
        short:
          "Open on the character whose buffs must be up first, chain full-Concerto swaps down the line, and land every Outro on the carry before their burst.",
        details: [
          "Standard shape: Support/healer (e.g., Verina, Shorekeeper) builds Concerto and casts their long-duration team buffs → Outro-swap into the buffer (e.g., Sanhua, Mortefi, Zhezhi) who builds Concerto fast → Outro-swap into the carry, who now has ALL amplifies stacked for their full field window.",
          "Order the first two by buff duration: the character whose buff lasts longest goes first so nothing expires before the carry's window ends. If the healer's amplify is short, put the healer second instead.",
          "Per-character on-field template is nearly universal: Intro → Resonance Skill → basic string / Forte mechanic → Echo skill → Liberation → (Concerto full) Outro-swap. Character guides on Prydwen/Game8 are variations of this line — learn the template once and you can sight-read new characters.",
          "Rotations should loop: by the time the carry's window ends, the supports' cooldowns and Concerto gains should be ready again. If you're standing on a support waiting for a skill cooldown, your carry window was too short or you're over-dodging — tighten the support segments.",
        ],
      },
      {
        name: "Echo-Skill Weaving",
        short:
          "Your main Echo is a fourth skill on its own cooldown — cast it into dead frames and swap-cancel the long ones.",
        details: [
          "Echo skills are off-GCD relative to your kit: weave them between basic strings or immediately after a skill cast rather than as a standalone 'stop and cast' moment. On supports, the Echo cast is often what tops off the Concerto bar for the swap.",
          "Several sonata set bonuses only arm when the Echo skill is actually used (and buff-share sets like Moonlit Clouds arm on Outro) — a rotation that never presses the Echo button silently drops a 2-piece/5-piece worth of stats. Check your set's trigger condition and put the cast in the script.",
          "4-cost Echo transformations (Inferno Rider, Tempest Mephis, etc.) have long animations that are all swap-cancellable after their damage frames — cast the Echo as the LAST action before an Outro-swap so the transformation plays out off-field while your next character fights.",
          "Echo cooldowns are per-Echo and typically long (tens of seconds); a good rotation uses each character's Echo exactly once per loop. If your loop is shorter than the Echo cooldown, move the Echo cast to alternate loops rather than delaying the swap.",
        ],
      },
      {
        name: "Animation Cancels: Skip the Recovery Tail",
        short:
          "Damage snapshots early in an animation; the recovery is cancellable with a dash, jump, Echo, or swap.",
        details: [
          "Hierarchy of cancels, cheapest first: another combo input (many strings chain earlier than the full animation suggests) → jump → dash (costs stamina) → Echo cast → swap. Use the cheapest cancel that gets you actionable.",
          "Dash-cancel the end-lag of basic-attack string finishers: the last hit of most strings has a long recovery pose worth several tenths of a second. One dash after the final damage frame and you're back into the next string sooner.",
          "Jump cancels skip ground-recovery on certain casts and became famous via 'Jinhsi Jump Cancel' (JJC) — jumping at a precise point in her skill sequence to compress the loop. The general lesson: for stack-based carries, look up whether a jump/dash compresses their core loop; the community documents these per character on YouTube within days of release.",
          "Do not cancel before the snapshot: if you cancel a skill or Liberation before its damage/buff frame, you lose the effect entirely. When learning a new cancel, watch the damage number appear, then cancel one beat later; tighten from there.",
        ],
      },
      {
        name: "Never Sit on a Full Bar",
        short:
          "Full Concerto and full Resonance Energy both stop growing — overflow is invisible DPS loss.",
        details: [
          "Concerto past 100% is discarded, so a support who keeps attacking on a full bar is donating damage-time for nothing. The moment the party icons glow, finish the current string (or Echo cast) and swap.",
          "Resonance (Liberation) Energy also caps: fighting with a capped ult means every point of energy your attacks would generate is wasted. Cast Liberations on cooldown-ish inside their correct window rather than hoarding for a perfect moment that costs 20 seconds of overcap.",
          "Exception that proves the rule: DO hold a capped Liberation briefly if a Vibration break is seconds away — the stagger window multiplies its value. 'Briefly' means one telegraph cycle, not half the fight.",
          "Energy Regen on the support/buffer slots is what makes loops seamless: if your second rotation routinely lacks Liberations, the fix is usually ER substats or one more energy-generating skill cast per loop, not playing faster.",
        ],
      },
      {
        name: "Script Your Opener",
        short:
          "The first rotation is the only one without an Intro — plan who eats that loss and pre-position before the fight timer starts.",
        details: [
          "Your opening character gets no Intro Skill damage or Intro-triggered kit mechanics, so open on the character who needs their Intro least — usually the healer/support, almost never the carry whose Forte loop keys off Intro hits.",
          "In timed content (Tower of Adversity), buffs and Echo casts made before engaging can carry into the fight while the clock only starts on aggro — pre-cast where the mode allows it and open the actual fight with the support's Concerto-building string.",
          "Write the opener down as an input script (e.g., 'Verina: skill, string x3, Echo, ult, swap → Sanhua: skill, heavy, Echo, swap → carry window') and drill it in the practice/hologram arena until it is muscle memory — openers are the one part of a fight that is 100% rehearsable.",
          "Against bosses with an opening attack pattern, learn it once: many bosses open with the same 1–2 telegraphs, meaning your opener can pre-plan a parry or Perfect Dodge into massive early Concerto and a first swap that arrives seconds ahead of schedule.",
        ],
      },
    ],
  },
  {
    id: "advanced-tech",
    title: "Advanced Tech",
    blurb:
      "The last 10%: input buffering, aerial tech, and reading boss tempo. None of this is required to clear — all of it is required to clear fast, and each piece is drillable in isolation in the hologram arena.",
    entries: [
      {
        name: "Attack-String Memory and Input Buffering",
        short:
          "The game remembers your combo stage through dodges and accepts inputs slightly before you're actionable — exploit both.",
        details: [
          "Most characters retain their basic-attack string position through a dodge: dodge after hit 3, Dodge Counter, and the string resumes at hit 4. This lets you keep the high-multiplier late-string hits flowing through boss pressure instead of restarting at hit 1 after every roll.",
          "Inputs buffer during animations: pressing your next action during the tail of the current one queues it frame-tight. Practically — hold/press Basic Attack during the dodge dash to get the earliest possible Dodge Counter, and input the skill during a string hit to chain with zero gap.",
          "Buffering interacts with cancels: a buffered swap during a Liberation executes at the earliest legal swap frame, which IS the optimal swap-cancel timing for most ults. If your swap-cancels feel inconsistent, buffer the swap input early instead of trying to time the exact frame.",
          "Forte-gauge mechanics (charged heavies, enhanced strings) often have their own buffer quirks — e.g., holding the attack button through a preceding animation to auto-fire the heavy the moment the gauge condition is met. Test your carry's hold-input behavior in the practice room.",
        ],
      },
      {
        name: "Mid-Air and Plunge Tech",
        short:
          "The vertical axis is a defensive layer and, for some kits, the main damage plane.",
        details: [
          "Jumping dodges for free: ground shockwaves, sweeps, and many ring AoEs can be jumped over with zero stamina cost, and an aerial basic/plunge keeps damage flowing while airborne. Default to jump for low attacks, dodge for everything else.",
          "Aerial-kit characters (Jiyan's dragon stance, Cartethyia, and other air-native kits) maintain full uptime on flying/dashing bosses that grounded melees spend half the fight chasing — this is a teambuilding answer to fights like Nameless Explorer, whose guide-consensus counter is 'bring air-capable attackers'.",
          "Plunge attacks from a jump can serve as a string-reset or gap-closer with a built-in downward hitbox; some characters' plunges are their fastest way to re-enter melee after being knocked away.",
          "Intro Skills fired while a boss is airborne still track — a full-Concerto swap is often your best 'anti-air' since the Intro dash closes vertical gaps that basic strings can't.",
        ],
      },
      {
        name: "Boss Tempo: Fight the Timeline, Not the HP Bar",
        short:
          "Every boss is a repeating schedule of telegraphs, break points, and phase thresholds — burst on the schedule, not on your cooldowns.",
        details: [
          "Map the fight into windows: free-hit windows (post-parry, post-break stagger, post-whiff recovery) and pay-attention windows (combo strings, arena-wide phases). Your Liberations and stacked-Outro carry window belong exclusively in free-hit windows; support/Concerto building belongs in the dangerous ones.",
          "Phase transitions trigger on HP or stagger thresholds (e.g., Hyvatia's hologram enters phase 3 at second stagger OR 25% HP) — if you can burst THROUGH a threshold during a stagger, the transition cinematic fires while the boss is already deep into the next bracket, effectively skipping a chunk of the phase. Know your bosses' thresholds and time the big window to cross them.",
          "Some fights punish slow play structurally: the Nameless Explorer hologram escalates to +60% damage dealt/taken past 3 minutes and +100% with healing disabled past 4 — tempo IS the mechanic. Read each hologram's gimmick (Game8 documents them per boss) before blaming your build.",
          "Bosses recover Vibration Strength and gain brief resistance after a stagger ends — schedule exactly one full burst per break, then consciously downshift into Concerto-building until the next break, rather than dribbling half-cooldowns into an armored target.",
        ],
      },
      {
        name: "Swap-Cancel Every 4-Cost Echo",
        short:
          "All 4-cost Echo transformation animations can be swap-cancelled after the damage frame — turning your slowest cast into off-field damage.",
        details: [
          "The transformation Echoes (Inferno Rider, Tempest Mephis, Crownless, and later 4-costs) lock you into multi-second animations if played raw; every one of them has a documented cancel point after which the full damage still resolves while you fight on another character. Community videos catalogue each Echo's exact cancel timing — learn the two your team actually runs.",
          "Standard weave: build Concerto to full → cast the 4-cost Echo → swap the moment its first damage tick registers → the Outro/Intro fires AND the Echo transformation plays out simultaneously — three damage sources overlapping for a second-plus.",
          "Cancel too early and the Echo does partial or zero damage: verify in the practice room by watching for the Echo's damage numbers after you've swapped. If numbers stop appearing, delay your swap by a beat.",
          "This same logic covers utility Echoes: a heal or shield Echo can be cast and swap-cancelled so the effect lands while your DPS is already back on-field — support field time compresses toward zero as your Echo-cancel timing improves.",
        ],
      },
    ],
  },
];

const PROGRESSION_SECTIONS = [
  {
    id: "team-building",
    title: "Team Building",
    blurb:
      "Wuthering Waves teams are rotation engines, not stat piles. Every comp is built around one question: whose Outro buff lands on your main DPS right before their damage window? Get the swap order right and a free 4-star buffer outperforms a mismatched 5-star.",
    entries: [
      {
        name: "The DPS / Hybrid / Support Triangle",
        short:
          "Default template: one main DPS, one hybrid concerto-filler, one support. Field time roughly 60/25/15.",
        details: [
          "Main DPS takes the majority of field time and all the vertical investment (levels, fortes, weapon, echoes). Everyone else exists to load them up.",
          "The hybrid slot (Sanhua, Mortefi, Zhezhi, Phrolova-style off-field units) is judged on concerto generation speed and Outro buff quality, not personal damage. If a hybrid needs 20 seconds on field to fill concerto, it is the wrong hybrid.",
          "The support slot (Verina, Shorekeeper, Baizhi) provides healing/sustain plus a team-wide damage Deepen and usually carries Rejuvenating Glow (heals grant team-wide ATK). Supports are the most reusable investment in the game — one built Verina or Shorekeeper services every team you will ever make.",
          "Fill slots in this order when gearing a new team: DPS first, support second (reusable), hybrid last (cheapest to build — forte 6 and a 5-piece support set is enough).",
        ],
      },
      {
        name: "Buff Type Beats Element Match",
        short:
          "Match the hybrid's Outro to the DPS's damage type (Basic/Heavy/Skill/Liberation), not their element.",
        details: [
          "Outro amplifications are typed: Sanhua Deepens Basic Attack DMG (38%), Mortefi Deepens Heavy Attack DMG, others Deepen Skill or Liberation damage. A Glacio Sanhua fully buffs a Havoc Basic-Attack carry; a same-element hybrid with the wrong Deepen type buffs almost nothing.",
          "Check where your DPS's damage actually comes from in their forte breakdown, then pick the buffer for that line. Example from the current patch: Yangyang: Xuanling is a Heavy-Attack-centric Havoc carry, so her best partners are Heavy Attack amplifiers (Iuno, Mortefi) regardless of their own element.",
          "Element only becomes the organizing principle in debuff archetypes — Aero Erosion, Spectro Frazzle, Havoc Bane teams — where the DPS scales off stacks that only same-mechanic teammates can apply. In those comps, recruit for the debuff, then still check the Deepen type.",
          "Practical test: if you cannot name what your third slot's Outro does for your DPS, the slot is wrong.",
        ],
      },
      {
        name: "Outro Chains: Swap Order Is the Rotation",
        short:
          "Outro buffs apply to the character swapping IN. Always end the setup chain by swapping into your DPS.",
        details: [
          "Standard chain: support fills concerto and Outros into the hybrid → hybrid fills concerto and Outros into the DPS → DPS burns their full damage window with both buffs active (e.g., Verina's all-type Deepen stacked under Sanhua's 38% Basic Deepen plus Moonlit Clouds' 12% DMG / 22% ATK handoff).",
          "Outro buffs last a fixed duration (typically ~10–14s) or until the buffed character swaps out. Swapping your DPS out early to 'dodge with someone else' deletes the buffs — dodge and parry on the DPS instead.",
          "Front-load the setup: cast support and hybrid abilities during enemy openers and stagger phases so the DPS window lines up with the boss's vulnerability window, not after it.",
          "If your rotation ever goes hybrid → support → DPS, you wasted the hybrid's Outro on the support. Chain order is not cosmetic.",
        ],
      },
      {
        name: "Double-DPS Quick-Swap Comps",
        short:
          "Two carries covering each other's cooldowns and animation locks, sharing one universal support.",
        details: [
          "Quick-swap works when both carries have short, front-loaded burst windows: dump one character's burst, swap-cancel the recovery animation, dump the second character's burst, repeat. You trade one dedicated buffer for a second damage engine and near-zero downtime.",
          "The shared third slot must be a universal buffer whose value is not a typed Outro locked to one carry — Verina and Shorekeeper are the default because healing, ATK, and generic Deepens serve both DPS.",
          "Swap-cancelling is a real damage mechanic: swapping mid-animation lets the attack finish off-field while the incoming character acts. This is where quick-swap comps beat hypercarry comps on paper — and lose to them in practice if you drop the timing.",
          "Use quick-swap for timer-pressure multi-wave content (Whimpering Wastes-style modes) and hypercarry chains for single-boss Tower fights. If you are still learning dodge timings, hypercarry is worth more — quick-swap punishes execution errors twice.",
        ],
      },
      {
        name: "When a Shielder Beats a Healer",
        short:
          "Default to healer-buffers. Switch to a shielder when damage is unavoidable or interruption kills your rotation.",
        details: [
          "Healers win by default because WuWa healers double as offensive supports: Verina and Shorekeeper heal AND Deepen team damage, and Rejuvenating Glow converts every heal into a team ATK buff. Pure survivability is usually free via dodges and parries.",
          "Take a shielder (Jianxin-style, whose full Forte Gauge Heavy Attack shields the team and ticks healing) when: the fight has unavoidable chip or wide AoE damage, the mode's hazard modifier punishes getting hit, or your DPS relies on long Heavy Attack channels that enemy hits interrupt — a shield's poise protection preserves the channel where a heal only refills the bar after the combo already broke.",
          "Shields also keep 'while at full HP / while undamaged' weapon and set conditions active, which healers cannot guarantee during sustained pressure.",
          "Honest fix for most players: if you are dying, the cheaper upgrade is learning the parry windows, not swapping the support. Change the slot only when deaths come from mechanics you provably cannot dodge.",
        ],
      },
    ],
  },
  {
    id: "resource-priorities",
    title: "Resource Priorities",
    blurb:
      "Everything in WuWa competes for the same two currencies: Waveplates and your patience. The winning pattern is deterministic upgrades first (levels, weapon, fortes), lottery upgrades last (echo substats), and one finished team before any second project.",
    entries: [
      {
        name: "Leveling Order: Character → Weapon → Forte → Echoes",
        short:
          "Ascend the character, match the weapon level, push core fortes to 6–8, and only then grind echo RNG.",
        details: [
          "Character ascension is the gate on everything else — it raises base stats and unlocks higher forte caps. A character 10 levels under the enemy is a stat penalty no echo can fix.",
          "Weapon level to parity next: weapon base ATK is the single largest multiplier on every ATK% you own, and a leveled weapon transfers to the next character of that type — it is never wasted investment.",
          "Fortes give the largest per-material damage gains after that. Level only the skills that appear in the character's actual damage breakdown: 8 on the DPS's core two or three talents, 6 across the board for hybrids and supports. The two Inherent Skills are cheap and disproportionately strong — buy them immediately on anyone you field.",
          "Echoes come last because they are the only RNG layer. Deterministic power (levels, weapon, fortes) is guaranteed value per Waveplate; echo substats are a lottery ticket. Never buy lottery tickets while guaranteed value is still on the shelf.",
        ],
      },
      {
        name: "Waveplate Spending by Account Stage",
        short:
          "Early: Forgery + bosses, no serious echo farming. Mid: split bosses/Tacet. Endgame: 70%+ Tacet Fields. Double-drop events override everything.",
        details: [
          "Early (roughly Union 40 and below, Data Bank under 15): spend on Forgery Challenges (weapon/forte materials) and boss ascension materials. Do NOT sink Waveplates into echo farming — your Data Bank level caps echo rarity, so anything you farm now is disposable. Overworld echo routes are free and cover you.",
          "Mid game: bosses until your core team's ascensions are done (60 Waveplates each), then shift roughly half your Waveplates into the highest Tacet Field tier you can clear. A common healthy split is ~60% Tacet Fields / 30% bosses / 10% Simulation Training, adjusted to whatever material actually blocks you this week.",
          "Endgame (Data Bank maxed, teams leveled): Tacet Fields become 70–80% of spending because echo XP and Tuners are the permanent bottleneck. Weekly bosses every reset, always.",
          "Double-drop events (Chord Cleansing-style 2x Tacet Field rewards) are the highest-value Waveplate windows in the game — bank Waveplates and refresh currency for them, and dump everything into Tacet Fields while they run. One team fully finished beats three teams at 70%; do not split spending across projects.",
        ],
      },
      {
        name: "Weapon Banner Value Logic",
        short:
          "No 50/50 — the featured weapon is hard-guaranteed within 80 pulls, making it the cheapest guaranteed power in the gacha. Still pull characters first.",
        details: [
          "The weapon banner has no loss state: worst case is 80 pulls for exactly the weapon you chose. A character's worst case is 160 (lose the 50/50, then hit pity again). That makes weapon worst-case cost literally half of character worst-case cost.",
          "But characters change what your account can do; weapons only scale it. A signature weapon is typically a ~20–30% personal damage gain over a good alternative — real, but smaller than adding a missing archetype or a Shorekeeper-class support to your roster.",
          "Pull a weapon when all three are true: your two or three core teams exist as characters, the weapon serves your main carry (or fits multiple units of that weapon type), and you have no standard 5-star or strong battle-pass weapon already covering the slot.",
          "Never pull weapons while any core team is missing its support or hybrid. A signature on a buffless carry loses to a standard weapon on a properly chained team.",
        ],
      },
      {
        name: "Why 4-Stars Like Sanhua and Yangyang Stay Relevant",
        short:
          "Typed Deepen buffs don't power-creep. Sanhua's 38% Basic Attack Outro has been meta from 1.0 through 3.x.",
        details: [
          "Buff numbers age far slower than damage numbers. Sanhua's 38% Basic Attack Deepen remains one of the largest single amplifications in the game, applies to every Basic-Attack carry Kuro releases, and she needs only ~10 seconds of field time per rotation. Mortefi does the same job for Heavy Attack carries — he still slots into brand-new 3.5 Heavy-Attack teams.",
          "Yangyang's Outro restores Resonance Energy to the incoming character, which quietly fixes Liberation-dependent carries' rotations, and her Aero kit gives her a lane in Aero-debuff teams. Utility slots don't power-creep the way DPS slots do.",
          "4-star sequences arrive free over time from banner spooks and the pity track, so a long-owned 4-star is often at S6 while your 5-stars sit at S0. Sequence-complete 4-star supports routinely match 5-star supports' output.",
          "They cost almost nothing to finish: level 70–80, fortes at 6, a support set with Energy Regen main stat. Build the free buffers before spending a single pull on vertical 5-star investment — they are what make your 5-stars look good.",
        ],
      },
    ],
  },
  {
    id: "echo-economy",
    title: "Echo Economy",
    blurb:
      "Echoes have three separate bottlenecks — the pieces themselves, Echo XP tubes, and Tuners — and Tuners are the scarcest. The whole economy reduces to one discipline: solve the deterministic layer (set + main stat) with cheap farming, and ration the lottery layer (substats) with hard stop-loss rules.",
    entries: [
      {
        name: "Set First, Substats Second",
        short:
          "Until every slot holds an on-set 5-star with the correct main stat, ignore substats entirely.",
        details: [
          "Set bonuses and main stats are deterministic: you can farm on-set pieces from Tacet Fields and overworld routes until the right main stat drops. Substats are pure RNG. Always finish the deterministic layer first — a correct-main-stat, on-set piece at +0 beats an off-set piece with pretty substats once you account for the set bonus and main-stat gap.",
          "Main-stat targets for a standard DPS: 4-cost Crit Rate or Crit DMG, 3-costs with your element's DMG%, 1-costs ATK%. Supports: Energy Regen 3-costs and healing/ER as the kit demands. Reject wrong-main-stat pieces at the drop screen — do not even inventory-hoard them.",
          "Do not start this phase before Data Bank 15 (max echo rarity unlocked). Anything farmed earlier is a placeholder you will replace, so spend zero Tuners on it.",
          "Only after all five slots are on-set with correct main stats do you switch to substat fishing — rerolling pieces slot by slot, worst piece first.",
        ],
      },
      {
        name: "The Tuning Stop-Loss",
        short:
          "Level in +5 steps, reveal one substat at a time, and quit the piece the moment it mathematically can't hit your bar.",
        details: [
          "Substats unlock at +5/+10/+15/+20/+25, and each reveal costs Tuners. Never level straight to +25 — feed XP to exactly the next threshold, tune the one new substat, and re-evaluate before spending another tube.",
          "Concrete gate: after two revealed substats, continue only if at least one is Crit Rate, Crit DMG, or your key stat (ATK% / ER as relevant). After three revealed, you need two hits. No double-crit-potential by +15? Bench the piece.",
          "The expected value logic: each additional threshold costs more XP and Tuners than the last, while the chance of rescuing a bad start shrinks. Chasing a piece that opened ATK-flat/DEF is throwing your scarcest currency at a sunk cost.",
          "Tuners, not echoes, are your real wallet. Every Tuner spent revealing a substat on a piece you'd never equip is a Tuner not available for the piece that opened Crit/Crit.",
        ],
      },
      {
        name: "When NOT to Tune",
        short:
          "No Tuners for: off-set pieces, wrong main stats, sub-5-star echoes past the first weeks, or characters you aren't building this patch.",
        details: [
          "Wrong main stat = zero Tuners, no exceptions. Substats cannot recover a 3-cost with the wrong element DMG% or a 4-cost without Crit — the main-stat deficit is bigger than any substat line.",
          "Off-set pieces are placeholders even when the main stat is right. Tune them only if you will genuinely use the piece for weeks (early account), and cap the loss at the first threshold.",
          "Purple and blue echoes are launch-week scaffolding. Once Data Bank is high, they get zero XP and zero Tuners — they exist to be Data Merge fodder.",
          "Don't pre-farm substats for a character you might pull next patch. Sets and main stats you can stockpile safely; Tuner investment before you know the character's real stat priorities is how hoards die.",
        ],
      },
      {
        name: "XP Stop-Loss and Tube Discipline",
        short:
          "Feed the smallest tubes that reach the next threshold, and reserve +25 pushes for near-perfect pieces only.",
        details: [
          "Use small tubes to land exactly on +5/+10/+15/+20/+25 breakpoints — overshooting a threshold with a big Premium tube wastes XP on a piece you may bench two seconds later after the tune reveals junk.",
          "+15 is the standard parking spot: three substats revealed is enough information and enough stats for most content. Push +20/+25 only on pieces that already showed double crit or crit plus the key stat — the last two thresholds cost a disproportionate share of the piece's total XP.",
          "Recycling bad leveled echoes refunds only part of the XP invested, so the stop-loss is cheaper applied early than recovered later.",
          "Budget rule of thumb: your Echo XP income supports finishing roughly one piece to +25 per several days of Waveplates. If your bench has five half-leveled experiments, you have an XP leak, not bad luck.",
        ],
      },
      {
        name: "Tacet Field Efficiency",
        short:
          "Highest tier only, pick fields covering two sets you need, hoard for double-drop events, and run the free overworld loop first.",
        details: [
          "Tacet Fields are the only repeatable source of all three currencies at once (echoes, XP tubes, Tuners). Always run the highest tier you can clear — higher tiers weight drops toward Advanced tubes and better echo rarity per Waveplate.",
          "Each field drops two sonata sets. Choose the field where BOTH sets serve characters you are building; a field where one set is dead weight is a ~50% efficiency haircut on the echo half of the rewards.",
          "Double-drop windows (Chord Cleansing-type events) literally double Waveplate value — bank Waveplates near cap and any refresh currency you're willing to spend, then dump it all during the event. This is the single largest efficiency lever in the echo economy.",
          "Before spending any Waveplates each day, run your free overworld route: named elites and boss respawns cost nothing, feed the Data Bank, and supply the merge fodder and Sonance crystals that Tacet Fields alone won't.",
        ],
      },
      {
        name: "Drop Pity and Data Merge",
        short:
          "Overworld kills have a hidden guaranteed-drop counter, and Data Merge converts five junk echoes into fresh rolls — but only merge at Data Bank 15+.",
        details: [
          "Echo drops have a hidden pity per enemy class: each kill without a drop counts the pity down, and at the bottom of the counter the next kill of that class is a guaranteed drop. Practical consequence: farming the same elite type in a continuous route is more reliable than it feels — dry streaks are self-correcting, so don't abandon a route mid-string.",
          "Data Merge (Data Bank 8+) consumes five unleveled, unequipped echoes and returns one to three new ones. Output rarity is tied to your Data Bank level, not the rarity of the fodder — which is exactly why you should hold serious merging until Data Bank 15, when outputs can roll max rarity.",
          "Higher-rarity fodder raises the odds of bonus outputs (2–3 echoes instead of 1), so off-set golds are the premium merge material, not sell/scrap material.",
          "Constrain the merge output toward the sonata sets you are actually farming rather than merging blind — merging is a substat reroll machine for sets whose main-stat pieces you already have, not a substitute for Tacet Fields. Feed it every off-set and wrong-main-stat drop; never feed anything you've leveled.",
        ],
      },
    ],
  },
  {
    id: "common-mistakes",
    title: "Common Mistakes",
    blurb:
      "The five highest-impact errors intermediate players make, ranked by how much account power they silently burn. Every one of these has a mechanical fix you can apply today.",
    entries: [
      {
        name: "Tuning Every Gold Echo",
        short:
          "Tuner bankruptcy from revealing substats on pieces that were already dead at the main-stat check.",
        details: [
          "The symptom: zero Tuners, a bag of +10 echoes with one good line each, and no finished pieces. The cause: treating every 5-star drop as a candidate.",
          "The fix is a hard gate before any Tuner is spent: on-set, correct main stat, for a character being built now. Then the threshold rules — one crit/key stat by two reveals, two by three reveals — with no sentiment for near-misses.",
          "Adopt the rule retroactively too: stop finishing the half-tuned pieces in your inventory that already failed the gate. Sunk Tuners are gone; new Tuners are not obligated to follow them.",
        ],
      },
      {
        name: "Building Six Characters at 70%",
        short:
          "Resource spread means no team ever reaches the breakpoint where endgame content actually clears.",
        details: [
          "Endgame modes reward one finished team far more than several half-finished ones — the last 30% of a build (forte 8s, weapon parity, tuned echoes) is where clear times come from.",
          "Fix: pick one team of three, take it to level cap, forte 6–8, leveled weapons, and full on-set echoes before spending anything on team two. Supports finish first — they carry every future team.",
          "The discipline pays compound interest: team two is cheaper because the support and hybrid layers are already done, and your Waveplates stop being split across four material types at once.",
        ],
      },
      {
        name: "Playing the DPS Solo",
        short:
          "Ignoring the Outro chain throws away 40–60% amplification that your buffers exist to provide.",
        details: [
          "The symptom: swapping to teammates only when the DPS 'needs a break,' or in random order. Every rotation that doesn't end with a buffer Outro-ing into the DPS wastes the two cheapest multipliers on the team.",
          "Fix: script one rotation per team — support fills concerto and Outros into hybrid, hybrid Outros into DPS, DPS burns the full buffed window without swapping out — and drill it until it's muscle memory.",
          "Also stop swapping the DPS out to dodge: Outro Deepens die when the buffed character leaves the field. Dodge and parry on the DPS.",
        ],
      },
      {
        name: "Serious Echo Farming Before Data Bank 15",
        short:
          "Every Waveplate and Tuner spent on echoes below max Data Bank buys equipment you are guaranteed to replace.",
        details: [
          "Data Bank level caps the rarity of echo drops and Data Merge outputs. Farming Tacet Fields hard at Data Bank 10 produces a full set of future fodder.",
          "Fix: before Data Bank 15, Waveplates go to Forgery and boss materials; echoes come from the free overworld loop, leveled minimally (+5/+10) as placeholders. Raise Data Bank fast by absorbing every new echo type you encounter while exploring.",
          "At Data Bank 15, flip the spending switch: Tacet Fields become the primary sink and Tuner discipline turns on.",
        ],
      },
      {
        name: "Skipping the Free Buffers to Save for 5-Stars",
        short:
          "Benching Sanhua, Mortefi, and Yangyang while hoarding pulls leaves 30%+ team damage unbuilt for near-zero cost.",
        details: [
          "A hypercarry without its typed Deepen buffer is running at a large fraction of its potential — Sanhua's 38% Basic Deepen or Mortefi's Heavy Deepen costs a week of casual materials to unlock, versus months of Astrites for an equivalent 5-star upgrade.",
          "Fix: build the 4-star buffer that matches your main DPS's damage type to level 70+, forte 6, Moonlit Clouds with Energy Regen — this weekend, not after the next banner.",
          "Their sequences arrive free from pulls you were making anyway, so the earlier they're fielded, the more of that passive value you bank. Every meta DPS since 1.0 has had a 4-star buffer in its best-value team; 3.5's Heavy-Attack teams still run Mortefi.",
        ],
      },
    ],
  },
];

function ManualSection({ section, openId, onToggle }) {
  return (
    <section className="rx-group">
      <div className="rx-group-head">
        <h2 className="rx-group-title">{section.title}</h2>
        <p className="rx-group-blurb">{section.blurb}</p>
      </div>

      <div className="rx-list">
        {section.entries.map((entry, i) => {
          const id = `${section.id}-${i}`;
          const isOpen = openId === id;
          return (
            <article key={id} className={`rx-card ${isOpen ? "open" : ""}`}>
              <button
                type="button"
                className="rx-head"
                onClick={() => onToggle(id)}
                aria-expanded={isOpen}
              >
                <div className="rx-head-left">
                  <h3 className="rx-name">{entry.name}</h3>
                  <span className="fm-short">{entry.short}</span>
                </div>
                <span className="rx-caret" aria-hidden="true">
                  <svg viewBox="0 0 10 10" className="caret-svg">
                    <path d="M2 3 L5 7 L8 3" />
                  </svg>
                </span>
              </button>
              {isOpen && (
                <div className="rx-body">
                  <ul className="rx-details">
                    {entry.details.map((d, j) => (
                      <li key={j}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default function FieldManual() {
  const [openId, setOpenId] = useState(null);
  const toggle = (id) => setOpenId((cur) => (cur === id ? null : id));

  return (
    <>
      <style>{manualStyles}</style>

      <header className="top">
        <div className="top-marks" aria-hidden="true">{"✦ ✦ ✦"}</div>
        <h1 className="title">Field Manual</h1>
        <p className="subtitle">
          Fight smarter — combat systems, rotations, and progression doctrine · v3.5
        </p>
      </header>

      <main className="rx-page">
        {COMBAT_SECTIONS.map((section) => (
          <ManualSection
            key={section.id}
            section={section}
            openId={openId}
            onToggle={toggle}
          />
        ))}
        {PROGRESSION_SECTIONS.map((section) => (
          <ManualSection
            key={section.id}
            section={section}
            openId={openId}
            onToggle={toggle}
          />
        ))}
      </main>

      <footer className="bottom">
        <p>
          Doctrine distilled from community guides — Prydwen, Game8, and the
          rotation/tech catalogues of the WuWa community · v3.5 (July 2026)
        </p>
        <p className="bottom-faint">All of it drillable in the hologram arena.</p>
      </footer>
    </>
  );
}

/* ---------- Scoped styles (page-specific bits only) ---------- */

const manualStyles = `
.wuwa-root .fm-short {
  font-size: 12.5px;
  line-height: 1.5;
  color: rgba(232, 228, 214, 0.6);
}
`;
